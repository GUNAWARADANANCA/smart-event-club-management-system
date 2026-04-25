import React, { useState, useMemo } from 'react';
import {
  Card, Typography, Button, Result, Progress, Row, Col, Tag,
  Descriptions, Collapse, Space, message, Divider, Modal, Statistic,
  Timeline, Badge, Table, Tooltip, Alert, Avatar, Radio, Tabs,
  List, Spin, Dropdown, MenuProps,
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined,
  ShareAltOutlined, TrophyOutlined, ReloadOutlined,
  FileTextOutlined, QuestionCircleOutlined, ClockCircleOutlined,
  UserOutlined, PieChartOutlined, StarOutlined, FireOutlined,
  CopyOutlined, PrinterOutlined, MailOutlined, WhatsAppOutlined,
  LinkedinOutlined, CrownOutlined, ThunderboltOutlined,
  BookOutlined, CheckOutlined, ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle
);

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

interface AnswerSummaryItem {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
  points?: number;
  timeSpent?: number;
  category?: string;
}

interface QuizResultState {
  score: number;
  fullName: string;
  email: string;
  quizTitle: string;
  totalQuestions: number;
  userAnswers: string[];
  correctAnswers: string[];
  questions: Array<{
    questionText: string;
    text?: string;
    correctAnswer: string;
    explanation?: string;
    points?: number;
    category?: string;
    options?: string[];
  }>;
  passingPercent: number;
  timeTaken?: number;
  totalTimeAllowed?: number;
  attemptedDate?: string;
}

const QuizResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<AnswerSummaryItem | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  // Extract state with enhanced fallbacks
  const {
    score = 0,
    fullName = 'Learner',
    email = 'learner@example.com',
    quizTitle = 'Knowledge Assessment',
    totalQuestions = 0,
    userAnswers = [],
    correctAnswers = [],
    questions = [],
    passingPercent = 70,
    timeTaken = 0,
    totalTimeAllowed = 0,
    attemptedDate = new Date().toISOString(),
  } = (location.state as QuizResultState) || {};

  const passed = score >= passingPercent;
  const percentage = Math.min(100, Math.max(0, score));
  
  // Calculate performance metrics
  const hasDetails = questions.length > 0 && userAnswers.length > 0;
  
  const answerSummary: AnswerSummaryItem[] = useMemo(() => {
    if (!hasDetails) return [];
    return questions.map((q, idx) => ({
      question: q.questionText || q.text || `Question ${idx + 1}`,
      userAnswer: userAnswers[idx] || 'Not answered',
      correctAnswer: correctAnswers[idx] || q.correctAnswer,
      isCorrect: userAnswers[idx] === correctAnswers[idx],
      explanation: q.explanation,
      points: q.points || 1,
      category: q.category || 'General',
    }));
  }, [questions, userAnswers, correctAnswers, hasDetails]);

  const correctCount = answerSummary.filter(a => a.isCorrect).length;
  const incorrectCount = answerSummary.length - correctCount;
  const accuracy = answerSummary.length > 0 ? (correctCount / answerSummary.length) * 100 : 0;
  const scorePercentage = (correctCount / totalQuestions) * 100;
  
  // Category-wise performance
  const categoryPerformance = useMemo(() => {
    const categories: Record<string, { correct: number; total: number }> = {};
    answerSummary.forEach(item => {
      const cat = item.category || 'General';
      if (!categories[cat]) categories[cat] = { correct: 0, total: 0 };
      categories[cat].total++;
      if (item.isCorrect) categories[cat].correct++;
    });
    return categories;
  }, [answerSummary]);

  // Chart data for pie chart
  const pieChartData = {
    labels: ['Correct Answers', 'Incorrect Answers'],
    datasets: [
      {
        data: [correctCount, incorrectCount],
        backgroundColor: ['#52c41a', '#ff4d4f'],
        borderWidth: 0,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Bar chart data for category performance
  const barChartData = {
    labels: Object.keys(categoryPerformance),
    datasets: [
      {
        label: 'Performance (%)',
        data: Object.values(categoryPerformance).map(cat => (cat.correct / cat.total) * 100),
        backgroundColor: '#1890ff',
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Get grade based on score
  const getGrade = (score: number) => {
    if (score >= 90) return { letter: 'A+', text: 'Excellent', color: '#52c41a', icon: <CrownOutlined /> };
    if (score >= 80) return { letter: 'A', text: 'Very Good', color: '#73d13d', icon: <TrophyOutlined /> };
    if (score >= 70) return { letter: 'B', text: 'Good', color: '#1890ff', icon: <StarOutlined /> };
    if (score >= 60) return { letter: 'C', text: 'Satisfactory', color: '#faad14', icon: <CheckOutlined /> };
    if (score >= 50) return { letter: 'D', text: 'Needs Improvement', color: '#ff7a45', icon: <ThunderboltOutlined /> };
    return { letter: 'F', text: 'Failed', color: '#ff4d4f', icon: <CloseCircleOutlined /> };
  };

  const grade = getGrade(score);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handlers
  const handleRetry = () => navigate('/quizzes/attempt');
  const handleBackToQuizzes = () => navigate('/quizzes');
  const handleViewCertificate = () => {
    navigate('/quizzes/certificate', {
      state: { fullName, email, quizTitle, score: scorePercentage },
    });
  };
  
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleShareScore = async (platform: string) => {
    const shareText = `🎉 I scored ${scorePercentage.toFixed(1)}% on "${quizTitle}"! ${passed ? 'I passed! 🎯' : 'I\'ll try again! 💪'} Can you beat my score?`;
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareText);
      message.success('Score copied to clipboard!');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'mail') {
      window.location.href = `mailto:?subject=My Quiz Result&body=${encodeURIComponent(shareText)}`;
    } else if (navigator.share) {
      await navigator.share({
        title: `${quizTitle} Result`,
        text: shareText,
        url: window.location.href,
      });
    }
    setIsShareModalOpen(false);
  };

  const handleDownloadReport = () => {
    const reportData = {
      user: { name: fullName, email },
      quiz: { title: quizTitle, date: new Date(attemptedDate).toLocaleString() },
      score: { percentage: scorePercentage, passed, grade: grade.letter },
      performance: {
        totalQuestions,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        accuracy: `${accuracy.toFixed(1)}%`,
        timeTaken: formatTime(timeTaken),
      },
      categoryPerformance,
      answers: answerSummary,
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizTitle.replace(/\s/g, '_')}_result_${fullName.replace(/\s/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('Report downloaded successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShowExplanation = (item: AnswerSummaryItem) => {
    setSelectedQuestion(item);
    setIsExplanationModalOpen(true);
  };

  // Share modal
  const shareModalContent = (
    <div>
      <Text style={{ display: 'block', marginBottom: 16, textAlign: 'center' }}>
        Share your achievement with friends!
      </Text>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Button block icon={<CopyOutlined />} onClick={() => handleShareScore('copy')}>
          Copy to Clipboard
        </Button>
        <Button block icon={<WhatsAppOutlined />} onClick={() => handleShareScore('whatsapp')}>
          Share on WhatsApp
        </Button>
        <Button block icon={<LinkedinOutlined />} onClick={() => handleShareScore('linkedin')}>
          Share on LinkedIn
        </Button>
        <Button block icon={<MailOutlined />} onClick={() => handleShareScore('mail')}>
          Share via Email
        </Button>
      </Space>
    </div>
  );

  // Get recommendation based on performance
  const getRecommendations = () => {
    const recommendations = [];
    if (passed) {
      if (score >= 90) {
        recommendations.push('🎯 Mastery achieved! Consider becoming a mentor or taking advanced quizzes.');
        recommendations.push('📚 Share your knowledge with peers to reinforce learning.');
        recommendations.push('🏆 You\'re ready for the next level challenge!');
      } else if (score >= 75) {
        recommendations.push('📖 Review the questions you missed to fill knowledge gaps.');
        recommendations.push('🔄 Take additional practice quizzes to reach mastery level.');
      } else {
        recommendations.push('💪 Focus on understanding concepts rather than memorization.');
        recommendations.push('📝 Create flashcards for the topics you found challenging.');
      }
    } else {
      recommendations.push('📚 Start with foundational materials before attempting advanced topics.');
      recommendations.push('🤝 Study with peers or join discussion forums for better understanding.');
      recommendations.push('⏰ Set a regular study schedule and take notes while learning.');
      recommendations.push('🎯 Break down complex topics into smaller, manageable sections.');
    }
    return recommendations;
  };

  // Table columns for answers
  const answerColumns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Your Answer',
      dataIndex: 'userAnswer',
      key: 'userAnswer',
      width: 150,
      render: (answer: string) => <Text code>{answer || '—'}</Text>,
    },
    {
      title: 'Correct Answer',
      dataIndex: 'correctAnswer',
      key: 'correctAnswer',
      width: 150,
      render: (answer: string) => <Text code strong>{answer}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'isCorrect',
      key: 'isCorrect',
      width: 100,
      render: (isCorrect: boolean) => (
        <Tag color={isCorrect ? 'green' : 'red'} icon={isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </Tag>
      ),
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      width: 80,
      render: (points: number, record: AnswerSummaryItem) => (
        <Text strong style={{ color: record.isCorrect ? '#52c41a' : '#ff4d4f' }}>
          {record.isCorrect ? points : 0}/{points}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_: any, record: AnswerSummaryItem) => (
        record.explanation && (
          <Button type="link" size="small" onClick={() => handleShowExplanation(record)}>
            Explanation
          </Button>
        )
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header with back button */}
      <div style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          type="text"
        >
          Back
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Avatar
            icon={passed ? <TrophyOutlined /> : <CloseCircleOutlined />}
            style={{
              backgroundColor: passed ? '#52c41a' : '#ff4d4f',
              width: 64,
              height: 64,
              marginBottom: 16,
            }}
          />
          <Title level={2} style={{ marginBottom: 8 }}>
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            {passed 
              ? `You've successfully completed ${quizTitle} with flying colors!` 
              : `Don't give up! Every attempt brings you closer to mastery.`}
          </Text>
        </div>

        {/* Score Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Your Score"
                value={scorePercentage}
                precision={1}
                suffix="%"
                prefix={grade.icon}
                valueStyle={{ color: grade.color, fontSize: 36 }}
              />
              <div style={{ marginTop: 12 }}>
                <Progress
                  percent={scorePercentage}
                  strokeColor={grade.color}
                  showInfo={false}
                  size="small"
                />
                <Tag color={passed ? 'green' : 'red'} style={{ marginTop: 8 }}>
                  {passed ? 'PASSED' : 'FAILED'} (Passing: {passingPercent}%)
                </Tag>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Grade"
                value={grade.letter}
                valueStyle={{ fontSize: 48, fontWeight: 'bold', color: grade.color }}
                prefix={grade.icon}
              />
              <Text type="secondary">{grade.text}</Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Accuracy"
                value={accuracy}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  {correctCount} correct • {incorrectCount} incorrect
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row gutter={[12, 12]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={12} md={6}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={handleRetry}
              block
              size="large"
            >
              Retake Quiz
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleDownloadReport}
              block
              size="large"
            >
              Download Report
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              icon={<ShareAltOutlined />} 
              onClick={handleShare}
              block
              size="large"
            >
              Share Result
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              icon={<PrinterOutlined />} 
              onClick={handlePrint}
              block
              size="large"
            >
              Print Result
            </Button>
          </Col>
        </Row>

        {/* Tabs Section */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Performance Summary" key="summary">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Score Breakdown" bordered={false}>
                  <div style={{ maxWidth: 300, margin: '0 auto' }}>
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Category Performance" bordered={false}>
                  {Object.keys(categoryPerformance).length > 0 ? (
                    <div style={{ height: 300 }}>
                      <Bar data={barChartData} options={barChartOptions} />
                    </div>
                  ) : (
                    <Text type="secondary">No category data available</Text>
                  )}
                </Card>
              </Col>
              <Col xs={24}>
                <Card title="Detailed Statistics" bordered={false}>
                  <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
                    <Descriptions.Item label="Full Name">
                      <UserOutlined /> {fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Quiz Title">
                      <BookOutlined /> {quizTitle}
                    </Descriptions.Item>
                    <Descriptions.Item label="Date Taken">
                      {new Date(attemptedDate).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Time Taken">
                      <ClockCircleOutlined /> {formatTime(timeTaken)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Questions">
                      <QuestionCircleOutlined /> {totalQuestions}
                    </Descriptions.Item>
                    <Descriptions.Item label="Correct Answers">
                      <CheckCircleOutlined style={{ color: '#52c41a' }} /> {correctCount}
                    </Descriptions.Item>
                    <Descriptions.Item label="Incorrect Answers">
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> {incorrectCount}
                    </Descriptions.Item>
                    <Descriptions.Item label="Passing Mark">
                      {passingPercent}%
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={`Detailed Answers (${hasDetails ? answerSummary.length : 0})`} key="answers" disabled={!hasDetails}>
            {hasDetails && (
              <Table
                dataSource={answerSummary}
                columns={answerColumns}
                rowKey={(_, index) => `answer-${index}`}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
              />
            )}
          </TabPane>

          <TabPane tab="Recommendations & Insights" key="insights">
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <Alert
                  message={passed ? "🎉 Excellent Work!" : "💡 Growth Opportunity"}
                  description={getRecommendations()[0]}
                  type={passed ? "success" : "info"}
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              </Col>
              <Col xs={24}>
                <Card title="Personalized Recommendations" bordered={false}>
                  <Timeline>
                    {getRecommendations().map((rec, idx) => (
                      <Timeline.Item key={idx} color={passed ? 'green' : 'blue'}>
                        {rec}
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Strengths" bordered={false}>
                  <List
                    dataSource={Object.entries(categoryPerformance)
                      .filter(([_, data]) => (data.correct / data.total) >= 0.7)
                      .map(([category]) => category)}
                    renderItem={(item) => (
                      <List.Item>
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          {item}
                        </Tag>
                      </List.Item>
                    )}
                    locale={{ emptyText: 'No specific strengths identified yet' }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Areas for Improvement" bordered={false}>
                  <List
                    dataSource={Object.entries(categoryPerformance)
                      .filter(([_, data]) => (data.correct / data.total) < 0.6)
                      .map(([category]) => category)}
                    renderItem={(item) => (
                      <List.Item>
                        <Tag color="orange" icon={<FireOutlined />}>
                          {item}
                        </Tag>
                      </List.Item>
                    )}
                    locale={{ emptyText: 'Great job! No major areas for improvement!' }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        {/* Certificate Button for Passed Users */}
        {passed && (
          <>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                icon={<TrophyOutlined />}
                onClick={handleViewCertificate}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                Claim Your Certificate
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* Share Modal */}
      <Modal
        title="Share Your Result"
        open={isShareModalOpen}
        onCancel={() => setIsShareModalOpen(false)}
        footer={null}
        width={400}
      >
        {shareModalContent}
      </Modal>

      {/* Explanation Modal */}
      <Modal
        title="Answer Explanation"
        open={isExplanationModalOpen}
        onCancel={() => setIsExplanationModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsExplanationModalOpen(false)}>
            Close
          </Button>
        ]}
      >
        {selectedQuestion && (
          <div>
            <Paragraph>
              <Text strong>Question:</Text>
              <br />
              {selectedQuestion.question}
            </Paragraph>
            <Paragraph>
              <Text strong>Your Answer:</Text>
              <br />
              <Tag color={selectedQuestion.isCorrect ? 'green' : 'red'}>
                {selectedQuestion.userAnswer || 'Not answered'}
              </Tag>
            </Paragraph>
            <Paragraph>
              <Text strong>Correct Answer:</Text>
              <br />
              <Tag color="blue">{selectedQuestion.correctAnswer}</Tag>
            </Paragraph>
            <Divider />
            <Paragraph>
              <Text strong>Explanation:</Text>
              <br />
              {selectedQuestion.explanation}
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuizResult;