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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000' }}>
      <Card style={{ width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', borderRadius: 12, borderColor: '#303030' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Forgot Password</Title>
          <Text type="secondary">Enter your email to receive a reset link</Text>
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
            <span style={{ cursor: 'pointer', color: '#a78bfa' }} onClick={() => navigate('/login')}>Back to Log in</span>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
