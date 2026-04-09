import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    message.success('Password reset link sent to your email.');
    navigate('/login');
  };

  return (
    <div className="page-auth">
      <Card style={{ width: '100%', maxWidth: 400, boxShadow: '0 12px 40px rgba(46, 125, 50, 0.1)', borderRadius: 16, border: '1px solid #C8E6C9' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ color: '#1F2937' }}>Forgot Password</Title>
          <Text type="secondary" style={{ color: '#4B5563' }}>Enter your email to receive a reset link</Text>
        </div>
        <Form name="forgot" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} size="large">
              Send Reset Link
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <span style={{ cursor: 'pointer', color: '#2E7D32', fontWeight: 600 }} onClick={() => navigate('/login')}>Back to Log in</span>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
