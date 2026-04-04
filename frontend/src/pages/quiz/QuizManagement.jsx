import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, message } from 'antd';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const QuizManagement = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    // Mock data for UI demonstration
    setQuizzes([
      { id: 'Q-001', title: 'Web Development Basics', questions: 10 },
      { id: 'Q-002', title: 'Advanced React patterns', questions: 15 },
      { id: 'Q-003', title: 'Database Security Sync', questions: 8 },
      { id: 'Q-004', title: 'Agile Methodology Fundamentals', questions: 12 },
    ]);
    setLoading(false);
  };

  const columns = [
    { title: 'Quiz ID', dataIndex: 'id', key: 'id' },
    { title: 'Quiz Title', dataIndex: 'title', key: 'title' },
    { title: 'Total Questions', dataIndex: 'questions', key: 'questions' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => navigate('/quizzes/attempt')}>Attempt Quiz</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', borderRadius: 16, background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>Quiz & Certification</Title>
        <div>
          <Button type="default" onClick={() => navigate('/quizzes/performance')} style={{ marginRight: 8, background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: '#E2E8F0' }}>My Performance</Button>
          <Button type="primary" onClick={() => navigate('/quizzes/create')} style={{ background: '#14B8A6', borderColor: '#0F766E', color: '#ffffff', fontWeight: 'bold' }}>Create New Quiz</Button>
        </div>
      </div>
      <Table columns={columns} dataSource={quizzes} rowKey="id" loading={loading} />
    </div>
  );
};

export default QuizManagement;
