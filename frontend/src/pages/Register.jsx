import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col } from 'antd';
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/gallery/hackathon.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      padding: '20px'
    }}>
      <style>{`
        .glass-input.ant-input-affix-wrapper, .glass-input.ant-input {
          background: rgba(0, 0, 0, 0.4) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
        }
        .glass-input.ant-input-affix-wrapper-focused, .glass-input.ant-input-focused, .glass-input.ant-input-affix-wrapper:hover, .glass-input.ant-input:hover {
          border-color: #a78bfa !important;
          background: rgba(0, 0, 0, 0.6) !important;
        }
        .glass-input input {
          color: white !important;
          background: transparent !important;
        }
        .glass-input input::placeholder {
          color: rgba(255,255,255,0.5) !important;
        }
        .glass-input .ant-input-password-icon {
          color: rgba(255,255,255,0.6) !important;
        }
        .glass-input .ant-input-password-icon:hover {
          color: white !important;
        }
        .glass-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%) !important;
          border: none !important;
          height: 50px !important;
          font-size: 18px !important;
          border-radius: 12px !important;
          font-weight: bold !important;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4) !important;
          transition: all 0.3s ease !important;
        }
        .glass-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6) !important;
        }
        .link-text {
          color: #a78bfa;
          transition: color 0.3s;
        }
        .link-text:hover {
          color: #c4b5fd;
        }
      `}</style>
      
      {/* Dark overlay for better contrast */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(18,18,18,0.4) 100%)',
        zIndex: 1
      }} />

      <div style={{ zIndex: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Card 
          bordered={false}
          style={{
            background: 'rgba(20, 20, 20, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '450px',
            padding: '12px 12px 0px 12px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ color: '#fff', marginBottom: '8px', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Create an Account
            </Title>
            <Text style={{ color: '#a78bfa', fontSize: '16px', letterSpacing: '0.5px' }}>
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
                prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.6)', marginRight: '8px' }} />} 
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
                prefix={<MailOutlined style={{ color: 'rgba(255,255,255,0.6)', marginRight: '8px' }} />} 
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
                prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.6)', marginRight: '8px' }} />} 
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
                prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.6)', marginRight: '8px' }} />} 
                placeholder="Confirm Password" 
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: '16px', marginTop: '8px' }}>
              <Button type="primary" htmlType="submit" block className="glass-btn" loading={loading}>
                Register
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Already have an account? </Text>
              <span 
                className="link-text"
                style={{ cursor: 'pointer', fontWeight: 'bold' }} 
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
