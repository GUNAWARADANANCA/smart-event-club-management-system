import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', values);
      message.success('Login successful!');
      
      const extractedName = values.email.split('@')[0];
      const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      localStorage.setItem('userName', formattedName);
      localStorage.setItem('userRole', 'General Context');
      
      navigate('/'); // Assuming '/' is the dashboard or home
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Login failed.');
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
            maxWidth: '400px',
            padding: '12px 12px 0px 12px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ color: '#fff', marginBottom: '8px', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Welcome Back
            </Title>
            <Text style={{ color: '#a78bfa', fontSize: '16px', letterSpacing: '0.5px' }}>
              Login to your account
            </Text>
          </div>
          <Form name="login" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                className="glass-input"
                prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.6)', marginRight: '8px' }} />} 
                placeholder="Email Address" 
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password 
                className="glass-input"
                prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.6)', marginRight: '8px' }} />} 
                placeholder="Password" 
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: '16px', marginTop: '8px' }}>
              <Button type="primary" htmlType="submit" block className="glass-btn" loading={loading}>
                Log In
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Don't have an account? </Text>
              <span 
                className="link-text"
                style={{ cursor: 'pointer', fontWeight: 'bold' }} 
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