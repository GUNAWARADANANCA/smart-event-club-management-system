import React from 'react';
import { Form, Radio, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const { Title } = Typography;

const QuizAttempt = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Assuming quiz ID 1 for demonstration
      const res = await api.post('/quiz/1/attempt', values);
      message.success('Quiz Submitted via API!');
      navigate('/quizzes/result', { state: { score: res.data.score } });
    } catch (err) {
      message.error('Failed to submit quiz attempt.');
    }
  };

  return (
    <div>
      <Title level={2}>Attempting: Tech Symposium Basics</Title>
      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        <Form layout="vertical" onFinish={onFinish}>
          
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>1. What is the primary purpose of the Tech Symposium?</Title>
            <Form.Item name="q1" rules={[{ required: true, message: 'Please select an answer' }]}>
              <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Radio value="a">A) Entertainment</Radio>
                <Radio value="b">B) Technological Innovation and Networking</Radio>
                <Radio value="c">C) Sports Event</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>2. Which block is the event held in?</Title>
            <Form.Item name="q2" rules={[{ required: true, message: 'Please select an answer' }]}>
              <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Radio value="a">A) Main Block</Radio>
                <Radio value="b">B) Library</Radio>
                <Radio value="c">C) Engineering Block</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">Submit Quiz</Button>
            <Button style={{ marginLeft: 8 }} size="large" onClick={() => navigate('/quizzes')}>Cancel</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default QuizAttempt;
