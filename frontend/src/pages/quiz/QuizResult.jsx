import React, { useState } from 'react';
import {
  Card, Typography, Button, Result, Progress, Row, Col, Tag,
  Descriptions, Collapse, Space, message, Divider,
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined,
  ShareAltOutlined, TrophyOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const QuizResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract state with fallbacks
  const {
    score = 0,
    fullName = 'Learner',
    email = '',
    quizTitle = 'Quiz',
    totalQuestions = 0,
    userAnswers = [],
    correctAnswers = [],
    questions = [],
    passingPercent = 50,
  } = location.state || {};

  const passed = score >= passingPercent;
  const percentage = score; // score is already out of 100
  const remainingPercent = 100 - percentage;
  
  // Calculate if we have detailed question data
  const hasDetails = questions.length > 0 && userAnswers.length > 0;
  
  // Build answer summary for each question
  const answerSummary = hasDetails
    ? questions.map((q, idx) => ({
        question: q.questionText || q.text || `Question ${idx + 1}`,
        userAnswer: userAnswers[idx] || 'Not answered',
        correctAnswer: correctAnswers[idx] || q.correctAnswer,
        isCorrect: userAnswers[idx] === correctAnswers[idx],
      }))
    : [];

  const correctCount = answerSummary.filter(a => a.isCorrect).length;
  const incorrectCount = answerSummary.length - correctCount;

  // Handlers
  const handleRetry = () => navigate('/quizzes/attempt');
  const handleBackToQuizzes = () => navigate('/quizzes');
  const handleViewCertificate = () => {
    navigate('/quizzes/certificate', {
      state: { fullName, email, quizTitle, score },
    });
  };
  
  const handleShare = () => {
    // Web Share API fallback
    if (navigator.share) {
      navigator.share({
        title: `My ${quizTitle} Result`,
        text: `I scored ${score}% on ${quizTitle}!`,
        url: window.location.href,
      }).catch(() => message.info('Share cancelled'));
    } else {
      message.success('Score copied to clipboard!');
      navigator.clipboard.writeText(`I scored ${score}% on ${quizTitle}`);
    }
  };

  const handleDownloadReport = () => {
    // Mock report generation – could be expanded to PDF
    const reportData = {
      user: fullName,
      email,
      quiz: quizTitle,
      score: `${score}%`,
      passed,
      date: new Date().toLocaleString(),
      details: answerSummary,
    };
    const dataStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizTitle}_result_${fullName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('Report downloaded');
  };

  // Recommendation message
  const getRecommendation = () => {
    if (passed) {
      if (score >= 90) return 'Excellent! You have mastered the topic.';
      if (score >= 75) return 'Good job! Review a few areas to become an expert.';
      return 'Nice work! Focus on the incorrect answers to improve further.';
    }
    return 'Don’t give up! Review the material and try again. Pay attention to the topics you missed.';
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <Card variant="borderless" style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        {/* Header with Icon */}
        <Result
          status={passed ? 'success' : 'error'}
          title={passed ? 'Congratulations! You Passed!' : 'Failed. Try Again.'}
          subTitle={
            <Space orientation="vertical" size="middle">
              <Text strong style={{ fontSize: 18 }}>
                Your Score: {score}% ({score} out of 100)
              </Text>
              <Progress
                percent={percentage}
                status={passed ? 'success' : 'exception'}
                strokeColor={passed ? '#52c41a' : '#ff4d4f'}
                format={() => `${score}%`}
                style={{ width: '80%', margin: '0 auto' }}
              />
              <Text type="secondary">
                Passing mark: {passingPercent}% &nbsp;|&nbsp;
                {passed ? '🎉 Well done!' : '😢 Keep learning!'}
              </Text>
            </Space>
          }
          extra={[
            passed && (
              <Button type="primary" key="cert" icon={<TrophyOutlined />} onClick={handleViewCertificate}>
                View Certificate
              </Button>
            ),
            !passed && (
              <Button type="primary" key="retry" icon={<ReloadOutlined />} onClick={handleRetry}>
                Retry Quiz
              </Button>
            ),
            <Button key="home" onClick={handleBackToQuizzes}>
              Back to Quizzes
            </Button>,
            <Button key="share" icon={<ShareAltOutlined />} onClick={handleShare}>
              Share Score
            </Button>,
            <Button key="download" icon={<DownloadOutlined />} onClick={handleDownloadReport}>
              Download Report
            </Button>,
          ]}
        />

        <Divider />

        {/* Performance Summary */}
        <Row gutter={[16, 24]}>
          <Col xs={24} md={12}>
            <Card size="small" title="Quick Stats" variant="borderless">
              <Descriptions column={1}>
                <Descriptions.Item label="Learner">{fullName}</Descriptions.Item>
                <Descriptions.Item label="Quiz">{quizTitle}</Descriptions.Item>
                <Descriptions.Item label="Score">{score}%</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={passed ? 'green' : 'red'}>
                    {passed ? 'Passed' : 'Failed'}
                  </Tag>
                </Descriptions.Item>
                {hasDetails && (
                  <>
                    <Descriptions.Item label="Correct Answers">
                      <CheckCircleOutlined style={{ color: '#52c41a' }} /> {correctCount}
                    </Descriptions.Item>
                    <Descriptions.Item label="Incorrect Answers">
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> {incorrectCount}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card size="small" title="Recommendation" variant="borderless">
              <Paragraph>{getRecommendation()}</Paragraph>
              {!passed && (
                <Button type="link" onClick={handleRetry} style={{ paddingLeft: 0 }}>
                  Start a new attempt →
                </Button>
              )}
            </Card>
          </Col>
        </Row>

        {/* Detailed Answer Breakdown (if available) */}
        {hasDetails && answerSummary.length > 0 && (
          <>
            <Divider orientation="left">Detailed Answers</Divider>
            <Collapse accordion>
              {answerSummary.map((item, idx) => (
                <Panel
                  header={
                    <Space>
                      {item.isCorrect ? (
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      ) : (
                        <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                      )}
                      <Text strong>Question {idx + 1}:</Text>
                      <Text ellipsis style={{ maxWidth: 300 }}>
                        {item.question}
                      </Text>
                      <Tag color={item.isCorrect ? 'green' : 'red'}>
                        {item.isCorrect ? 'Correct' : 'Incorrect'}
                      </Tag>
                    </Space>
                  }
                  key={idx}
                >
                  <p>
                    <Text type="secondary">Your answer: </Text>
                    <Text code>{item.userAnswer || '—'}</Text>
                  </p>
                  <p>
                    <Text type="secondary">Correct answer: </Text>
                    <Text code strong>
                      {item.correctAnswer}
                    </Text>
                  </p>
                  {!item.isCorrect && (
                    <Button
                      size="small"
                      onClick={() => message.info('Feature: Show explanation here')}
                    >
                      Need help?
                    </Button>
                  )}
                </Panel>
              ))}
            </Collapse>
          </>
        )}

        {/* If no details, show a helpful message */}
        {!hasDetails && (
          <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 24 }}>
            ⚡ Detailed answer review is not available for this quiz.
            <br />
            Please contact the administrator for more feedback.
          </Paragraph>
        )}
      </Card>
    </div>
  );
};

export default QuizResult;