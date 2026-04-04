import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', values);
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-auth">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Card
          bordered={false}
          style={{
            background: '#FFFFFF',
            border: '1px solid #C8E6C9',
            boxShadow: '0 12px 40px rgba(46, 125, 50, 0.1)',
            borderRadius: 24,
            width: '100%',
            maxWidth: 450,
            padding: '28px 24px 20px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={2} style={{ color: '#1F2937', marginBottom: 8, fontWeight: 700 }}>
              Create an Account
            </Title>
            <Text style={{ color: '#2E7D32', fontSize: 16, letterSpacing: '0.02em' }}>
              Join the University Club System
            </Text>
          </div>
          <Form name="register" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your Name!' }]}
            >
              <Input 
                className="glass-input"
                prefix={<UserOutlined style={{ color: '#6B7280', marginRight: 8 }} />} 
                placeholder="Full Name" 
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                className="glass-input"
                prefix={<MailOutlined style={{ color: '#6B7280', marginRight: 8 }} />} 
                placeholder="Email Address" 
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password 
                className="glass-input"
                prefix={<LockOutlined style={{ color: '#6B7280', marginRight: 8 }} />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                className="glass-input"
                prefix={<LockOutlined style={{ color: '#6B7280', marginRight: 8 }} />}
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: '16px', marginTop: '8px' }}>
              <Button type="primary" htmlType="submit" block className="glass-btn" loading={loading}>
                Register
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text style={{ color: '#6B7280' }}>Already have an account? </Text>
              <span
                className="link-text"
                style={{ cursor: 'pointer', fontWeight: 700 }}
                onClick={() => navigate('/login')}
              >
                Log in
              </span>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
