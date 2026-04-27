import React, { useState, useEffect } from 'react';
import { Modal, Card, Statistic, Row, Col, List, Tag, Empty, Spin } from 'antd';
import { TrophyOutlined, BarChartOutlined, FileDoneOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const ProgressModal = ({ visible, onClose, userId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (visible && userId) {
      fetchResults();
    }
  }, [visible, userId]);

  const handleDownload = (item) => {
    onClose();
    navigate('/quizzes/certificate', {
      state: {
        fullName: localStorage.getItem('userName') || 'Learner',
        email: localStorage.getItem('userEmail') || '',
        quizTitle: item.quizTitle,
        score: item.score
      }
    });
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/quiz/results/${userId}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalQuizzes = results.length;
  const avgScore = totalQuizzes > 0 ? (results.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes).toFixed(1) : 0;
  const certificates = results.filter(r => r.score >= 50).length;

  return (
    <Modal
      title={<span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2E7D32' }}><BarChartOutlined /> My Learning Progress</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      styles={{ body: { padding: '24px' } }}
      style={{ borderRadius: '20px', overflow: 'hidden' }}
    >
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card variant="borderless" style={{ background: '#f6ffed', textAlign: 'center' }}>
              <Statistic title="Quizzes Taken" value={totalQuizzes} prefix={<FileDoneOutlined />} valueStyle={{ color: '#52c41a' }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card variant="borderless" style={{ background: '#e6f7ff', textAlign: 'center' }}>
              <Statistic title="Avg. Score" value={avgScore} suffix="%" valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card variant="borderless" style={{ background: '#fff7e6', textAlign: 'center' }}>
              <Statistic title="Certificates" value={certificates} prefix={<TrophyOutlined />} valueStyle={{ color: '#fa8c16' }} />
            </Card>
          </Col>
        </Row>
      </div>

      <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '8px', marginBottom: '16px' }}>Quiz History</h3>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>
      ) : results.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={results}
          renderItem={item => (
            <List.Item
              actions={[
                item.score >= 50 && (
                  <Tag 
                    color="gold" 
                    style={{ cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                    onClick={() => handleDownload(item)}
                  >
                    <DownloadOutlined /> Certificate
                  </Tag>
                )
              ]}
            >
              <List.Item.Meta
                avatar={<div style={{ fontSize: '24px' }}>{item.score >= 50 ? '🏆' : '📝'}</div>}
                title={<span style={{ fontWeight: 'bold' }}>{item.quizTitle}</span>}
                description={new Date(item.date).toLocaleDateString()}
              />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: item.score >= 50 ? '#52c41a' : '#ff4d4f' }}>
                  {item.score}%
                </div>
                <Tag color={item.score >= 50 ? 'green' : 'red'}>{item.score >= 50 ? 'Passed' : 'Failed'}</Tag>
              </div>
            </List.Item>
          )}
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        />
      ) : (
        <Empty description="No quizzes attempted yet." />
      )}
    </Modal>
  );
};

export default ProgressModal;
