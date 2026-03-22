import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, message } from 'antd';
import api from '../api';
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
    try {
      const res = await api.get('/quiz');
      setQuizzes(res.data.quizzes || []);
    } catch(err) {
      message.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Quiz & Certification</Title>
        <div>
          <Button type="default" onClick={() => navigate('/quizzes/performance')} style={{ marginRight: 8 }}>My Performance</Button>
          <Button type="primary">Create New Quiz</Button>
        </div>
      </div>
      <Table columns={columns} dataSource={quizzes} rowKey="id" loading={loading} />
    </div>
  );
};

export default QuizManagement;
