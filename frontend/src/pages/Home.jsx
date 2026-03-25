import React, { useState } from 'react';
import { Button, Typography, Row, Col, Card, Image, Modal, Input, message } from 'antd';
import { CalendarOutlined, SafetyCertificateOutlined, DollarOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockEvents } from '../mockData';
import FeaturedEvents from '../components/FeaturedEvents';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [uniId, setUniId] = useState('');

  const handleJoinClick = (event) => {
    if (event.audience === 'University Students' || event.audience === 'Both') {
      setSelectedEvent(event);
      setUniId('');
      setIsJoinModalVisible(true);
    } else {
      message.info('Redirecting to login for external registration.');
      navigate('/login');
    }
  };

  const handleConfirmJoin = () => {
    if (!uniId.trim()) {
      message.error('University ID is required to join this event!');
      return;
    }
    message.success(`University ID verified! Proceeding to join ${selectedEvent.title}.`);
    setIsJoinModalVisible(false);
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Mock */}
      <div style={{ padding: '16px 48px', background: '#141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #303030' }}>
        <Title level={4} style={{ margin: 0, color: '#a78bfa' }}>UniEvents</Title>
        <div>
          <Button type="text" onClick={() => navigate('/login')} style={{ marginRight: 16 }}>Log in</Button>
          <Button type="primary" onClick={() => navigate('/register')}>Sign Up</Button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ padding: '80px 24px', textAlign: 'center', background: '#f0f9ff', color: '#111' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 24, lineHeight: 1.15, letterSpacing: '-1px' }}>
          <span style={{ color: '#0f172a' }}>Manage University </span>
          <span style={{ background: 'linear-gradient(90deg, #0F766E 0%, #14B8A6 40%, #f59e0b 80%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Events</span>
          <span style={{ color: '#0f172a' }}> with Ease</span>
        </h1>
        <Paragraph style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto 40px auto' }}>
          An all-in-one platform for students, clubs, and administrators. Handle event approvals, ticket sales, budgets, and certifications from a single dashboard.
        </Paragraph>
        <Button type="primary" size="large" onClick={() => navigate('/register')} style={{ height: 50, padding: '0 32px', fontSize: 18, background: '#0F766E', borderColor: '#0F766E' }}>
          Get Started Now <ArrowRightOutlined />
        </Button>
      </div>

      {/* Featured Events Section (Tailwind Component) */}
      <FeaturedEvents />

      {/* Features Section */}
      <div style={{ padding: '60px 48px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Title level={2}>Core Modules</Title>
          <Text type="secondary">Everything you need to run successful campus events.</Text>
        </div>
        
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card hoverable style={{ height: '100%', textAlign: 'center', borderRadius: 12 }}>
              <CalendarOutlined style={{ fontSize: 48, color: '#a78bfa', marginBottom: 16 }} />
              <Title level={4}>Event & Club</Title>
              <Paragraph type="secondary">Create events, manage conflicting venues, and automate club approvals instantly.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable style={{ height: '100%', textAlign: 'center', borderRadius: 12 }}>
              <DollarOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
              <Title level={4}>Finance & Access</Title>
              <Paragraph type="secondary">Process mock payments, generate QR-coded tickets, and track club budgets.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable style={{ height: '100%', textAlign: 'center', borderRadius: 12 }}>
              <SafetyCertificateOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
              <Title level={4}>Quiz & Certification</Title>
              <Paragraph type="secondary">Assess event knowledge with auto-graded quizzes and reward dynamic certificates.</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px', textAlign: 'center', background: '#141414', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid #303030' }}>
        University Club & Event Management System ©2026 Designed for Presentation
      </div>

      {/* Join Event Validation Modal */}
      <Modal
        title={`Join ${selectedEvent?.title}`}
        open={isJoinModalVisible}
        onOk={handleConfirmJoin}
        onCancel={() => setIsJoinModalVisible(false)}
        okText="Verify ID & Join"
        okButtonProps={{ style: { background: '#8b5cf6', borderColor: '#8b5cf6' } }}
      >
        <div style={{ margin: '20px 0' }}>
          <p style={{ marginBottom: 16 }}>This event requires a valid <strong>University ID</strong> for registration.</p>
          <Input 
            placeholder="Enter your University ID (e.g. IT12345678)" 
            value={uniId}
            onChange={(e) => setUniId(e.target.value)}
            size="large"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Home;
