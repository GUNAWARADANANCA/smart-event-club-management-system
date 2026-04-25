import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, App as AntdApp } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  loginWithPassword,
  persistAuthSession,
  apiErrorMessage,
  ROLES,
} from '@/lib/auth';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const prefilledEmail = location.state?.email || '';
  const [loading, setLoading] = useState(false);
  const { message } = AntdApp.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await loginWithPassword(values.email, values.password);
      message.success(data.message || 'Login successful!');
      const authRole = data.user?.role || ROLES.STUDENT;
      persistAuthSession({
        token: data.token,
        email: data.user?.email || values.email,
        authRole,
      });
      navigate(from);
    } catch (error) {
      console.error(error);
      message.error(apiErrorMessage(error, 'Login failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-auth">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Card
          variant={false}
          style={{
            background: '#FFFFFF',
            border: '1px solid #C8E6C9',
            boxShadow: '0 12px 40px rgba(46, 125, 50, 0.1)',
            borderRadius: 24,
            width: '100%',
            maxWidth: 420,
            padding: '28px 24px 20px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={2} style={{ color: '#1F2937', marginBottom: 8, fontWeight: 700 }}>
              Welcome Back
            </Title>
            <Text style={{ color: '#2E7D32', fontSize: 16, letterSpacing: '0.02em' }}>
              Login to your account
            </Text>
          </div>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            initialValues={prefilledEmail ? { email: prefilledEmail } : undefined}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                className="glass-input"
                prefix={<UserOutlined style={{ color: '#6B7280', marginRight: 8 }} />}
                placeholder="Email Address"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password
                className="glass-input"
                prefix={<LockOutlined style={{ color: '#6B7280', marginRight: 8 }} />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 16, marginTop: 8 }}>
              <Button type="primary" htmlType="submit" block className="glass-btn" loading={loading}>
                Log In
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text style={{ color: '#6B7280' }}>Don't have an account? </Text>
              <span
                className="link-text"
                style={{ cursor: 'pointer', fontWeight: 700 }}
                onClick={() => navigate('/register')}
              >
                Sign up
              </span>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
