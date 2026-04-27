import React, { useEffect, useMemo, useState } from 'react';
import { Card, Typography, Row, Col, Progress, List, Tag, Spin, Empty, Statistic, Segmented, Button, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

const { Title, Text } = Typography;

const LOCAL_QUIZZES_KEY = 'localQuizzes';
const LOCAL_RESULTS_KEY = 'localQuizResults';
const PASS_SCORE = 50;

// Removed fallbackQuizzes to ensure only real data is shown

const readLocalQuizzes = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_QUIZZES_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readLocalResults = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_RESULTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeQuiz = (quiz) => ({
  id: String(quiz?._id || quiz?.id || quiz?.quizId || ''),
  title: String(quiz?.title || quiz?.quizTitle || 'Untitled Quiz'),
  closeDate: quiz?.closeDate || null,
});

const normalizeResult = (result) => ({
  quizId: String(result?.quizId || ''),
  quizTitle: String(result?.quizTitle || 'Untitled Quiz'),
  score: Number(result?.score || 0),
  createdAt: result?.createdAt || result?.date || null,
});

const mapLatestResultByQuiz = (results) => {
  const map = new Map();

  results.forEach((result) => {
    const key = result.quizId || result.quizTitle.toLowerCase().trim();
    const existing = map.get(key);
    const currentTime = new Date(result.createdAt || 0).getTime();
    const existingTime = new Date(existing?.createdAt || 0).getTime();

    if (!existing || currentTime >= existingTime) {
      map.set(key, result);
    }
  });

  return map;
};

const QuizOverallProgress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [listFilter, setListFilter] = useState('all');

  const userId = localStorage.getItem('userId');
  const fallbackName = localStorage.getItem('userName') || 'Learner';
  const fallbackEmail = localStorage.getItem('userEmail') || 'No email provided';

  const goToAvailableQuiz = (quiz) => {
    navigate('/quizzes', {
      state: {
        statusFilter: 'open',
        focusQuizId: quiz.id,
      },
    });
  };

  const goToCertificate = (quiz) => {
    navigate('/quizzes/certificate', {
      state: {
        fullName: fallbackName,
        email: fallbackEmail,
        quizTitle: quiz.title,
        score: quiz.score,
        issuedDate: quiz.completedAt,
      },
    });
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [quizRes, resultRes] = await Promise.all([
          api.get('/api/quiz').catch(() => ({ data: [] })),
          userId ? api.get(`/api/quiz/results/${userId}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);

        const serverQuizzes = Array.isArray(quizRes.data) ? quizRes.data : [];
        const merged = [...serverQuizzes, ...readLocalQuizzes()]
          .map(normalizeQuiz)
          .filter((quiz) => quiz.id || quiz.title)
          .reduce((acc, quiz) => {
            const key = quiz.id || quiz.title.toLowerCase().trim();
            if (!acc.some((item) => (item.id || item.title.toLowerCase().trim()) === key)) {
              acc.push(quiz);
            }
            return acc;
          }, []);

        setQuizzes(merged);
        const backendResults = Array.isArray(resultRes.data) ? resultRes.data : [];
        const mergedResults = [...backendResults, ...readLocalResults()].map(normalizeResult);
        setResults(mergedResults);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const {
    totalQuizzes,
    completedQuizzes,
    availableQuizzes,
    completedPercentage,
    certificateCount,
    avgScore,
    quizStatusRows,
  } = useMemo(() => {
    const rows = quizzes.map((quiz) => {
      const attempts = results.filter((result) => {
        const idMatch = quiz.id && result.quizId && String(result.quizId) === String(quiz.id);
        const titleMatch = String(result.quizTitle || '').toLowerCase().trim() === String(quiz.title || '').toLowerCase().trim();
        return idMatch || titleMatch;
      });

      const latest = mapLatestResultByQuiz(attempts).values().next().value || null;
      const hasPassed = attempts.some((attempt) => Number(attempt.score || 0) >= PASS_SCORE);
      const bestScore = attempts.length > 0
        ? attempts.reduce((max, attempt) => Math.max(max, Number(attempt.score || 0)), 0)
        : 0;
      const latestScore = Number(latest?.score || 0);
      const displayScore = hasPassed ? bestScore : latestScore;
      const completedAttempt = hasPassed
        ? attempts
          .filter((attempt) => Number(attempt.score || 0) >= PASS_SCORE)
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0]
        : null;

      return {
        ...quiz,
        latest,
        attempts,
        score: displayScore,
        latestScore,
        createdAt: latest?.createdAt || null,
        completedAt: completedAttempt?.createdAt || null,
        isCompleted: hasPassed,
        status: hasPassed ? 'completed' : 'available',
      };
    });

    const completed = rows.filter((row) => row.isCompleted);
    const available = rows.filter((row) => !row.isCompleted);

    const total = quizzes.length;
    const completedCount = completed.length;
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    const certCount = completed.length;
    const average = completedCount > 0
      ? (completed.reduce((sum, quiz) => sum + Number(quiz.score || 0), 0) / completedCount).toFixed(1)
      : '0.0';

    return {
      totalQuizzes: total,
      completedQuizzes: completed,
      availableQuizzes: available,
      completedPercentage: percent,
      certificateCount: certCount,
      avgScore: average,
      quizStatusRows: rows,
    };
  }, [quizzes, results]);

  const filteredStatusRows = useMemo(() => {
    if (listFilter === 'completed') {
      return quizStatusRows.filter((row) => row.status === 'completed');
    }
    if (listFilter === 'available') {
      return quizStatusRows.filter((row) => row.status === 'available');
    }
    return quizStatusRows;
  }, [listFilter, quizStatusRows]);

  if (loading) {
    return (
      <div style={{ minHeight: 360, display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Card
        style={{ borderRadius: 20, border: '1px solid #E8F5E9', boxShadow: '0 12px 30px rgba(76, 175, 80, 0.08)' }}
      >
        <Title level={2} style={{ marginBottom: 4 }}>Overall Quiz Progress</Title>
        <Text type="secondary">Track completed quizzes, pending quizzes, and certificate readiness.</Text>

        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col xs={24} md={8}>
            <Card variant="borderless" style={{ background: '#F6FFED', borderRadius: 14 }}>
              <Statistic title="Total Quizzes" value={totalQuizzes} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card variant="borderless" style={{ background: '#E6F7FF', borderRadius: 14 }}>
              <Statistic title="Average Score" value={avgScore} suffix="%" />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card variant="borderless" style={{ background: '#FFF7E6', borderRadius: 14 }}>
              <Statistic title="Certificates Earned" value={certificateCount} prefix={<TrophyOutlined />} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
          <Col xs={24} lg={10}>
            <Card variant="borderless" style={{ borderRadius: 14, background: '#FAFAFA' }}>
              <Title level={4} style={{ marginTop: 0 }}>Completion Chart</Title>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <Progress
                  type="circle"
                  percent={completedPercentage}
                  strokeColor="#4CAF50"
                  format={(percent) => `${percent}%`}
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <Text style={{ display: 'block' }}>Completed: {completedQuizzes.length}</Text>
                <Text type="secondary" style={{ display: 'block' }}>Available: {availableQuizzes.length}</Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            <Card variant="borderless" style={{ borderRadius: 14, background: '#FAFAFA' }}>
              <Title level={4} style={{ marginTop: 0 }}>Progress Breakdown</Title>
              <Progress
                percent={completedPercentage}
                success={{ percent: completedPercentage, strokeColor: '#4CAF50' }}
                showInfo={false}
              />
              <Text type="secondary">{completedQuizzes.length} completed out of {totalQuizzes} quizzes</Text>
            </Card>
          </Col>
        </Row>

        <Card variant="borderless" style={{ marginTop: 16, borderRadius: 14, background: '#FAFAFA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Title level={4} style={{ margin: 0 }}>Quiz Status Filter</Title>
            <Segmented
              options={[
                { label: 'All', value: 'all' },
                { label: 'Completed', value: 'completed' },
                { label: 'Available', value: 'available' },
              ]}
              value={listFilter}
              onChange={setListFilter}
            />
          </div>

          <List
            style={{ marginTop: 14 }}
            dataSource={filteredStatusRows}
            locale={{ emptyText: 'No quizzes match this filter.' }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={
                    item.isCompleted
                      ? `Completed successfully with ${item.score}%`
                      : item.latest
                        ? `Latest score ${item.latestScore}% - available to retry`
                        : 'Not attempted yet - available to complete'
                  }
                />
                {item.isCompleted ? (
                  <Space>
                    <Tag color="green" icon={<CheckCircleOutlined />}>Completed</Tag>
                    <Button size="small" onClick={() => goToCertificate(item)}>
                      View Certificate
                    </Button>
                  </Space>
                ) : (
                  <Space>
                    <Tag color="blue" icon={<ClockCircleOutlined />}>Available</Tag>
                    <Button size="small" type="primary" ghost onClick={() => goToAvailableQuiz(item)}>
                      Go to Quiz
                    </Button>
                  </Space>
                )}
              </List.Item>
            )}
          />
        </Card>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Completed Quizzes" style={{ borderRadius: 16 }}>
            {completedQuizzes.length === 0 ? (
              <Empty description="No completed quizzes yet." />
            ) : (
              <List
                dataSource={completedQuizzes}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={
                        <div>
                          <Text>Score: {item.score}%</Text>
                          <br />
                          <Text type="secondary">
                            Completed: {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'N/A'}
                          </Text>
                        </div>
                      }
                    />
                    <Space>
                      <Tag color={Number(item.score) >= PASS_SCORE ? 'green' : 'orange'} icon={<CheckCircleOutlined />}>
                        {Number(item.score) >= PASS_SCORE ? 'Certificate Ready' : 'Needs Improvement'}
                      </Tag>
                      <Button size="small" onClick={() => goToCertificate(item)}>Open</Button>
                    </Space>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Available Quizzes" style={{ borderRadius: 16 }}>
            {availableQuizzes.length === 0 ? (
              <Empty description="No available quizzes. You completed all quizzes successfully." />
            ) : (
              <List
                dataSource={availableQuizzes}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={
                        item.latest
                          ? `Latest score ${item.latestScore}% - retry to mark as completed`
                          : item.closeDate
                            ? `Closes on ${item.closeDate}`
                            : 'No close date available'
                      }
                    />
                    <Space>
                      <Tag color="blue" icon={<ClockCircleOutlined />}>Available</Tag>
                      <Button size="small" type="primary" ghost onClick={() => goToAvailableQuiz(item)}>
                        Start from Quiz Branch
                      </Button>
                    </Space>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default QuizOverallProgress;
