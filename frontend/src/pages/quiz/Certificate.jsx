import React from 'react';
import { Card, Typography, Button, Divider } from 'antd';
import { DownloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Certificate = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Title level={2}>Your Certificate</Title>
      
      <Card 
        style={{ 
          width: 700, 
          textAlign: 'center', 
          border: '8px solid #d4af37', 
          borderRadius: 2, 
          background: '#fffcf2',
          padding: 40 
        }}
      >
        <SafetyCertificateOutlined style={{ fontSize: 48, color: '#d4af37', marginBottom: 16 }} />
        <Title level={1} style={{ color: '#d4af37', fontFamily: 'serif', marginTop: 0 }}>Certificate of Achievement</Title>
        <Text style={{ fontSize: 18, fontStyle: 'italic' }}>This is proudly presented to</Text>
        <Title level={2} style={{ margin: '16px 0', textDecoration: 'underline' }}>Admin User</Title>
        <Text style={{ fontSize: 16 }}>
          For successfully completing the quiz for<br/>
          <strong style={{ fontSize: 20 }}>Tech Symposium Basics</strong>
        </Text>
        
        <Divider style={{ borderColor: '#d4af37', margin: '32px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid black', width: 120, marginBottom: 8 }}></div>
            <Text>Date: March 19, 2026</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
             <div style={{ borderBottom: '1px solid black', width: 120, marginBottom: 8 }}></div>
             <Text>Event Organizer</Text>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
        <Button type="primary" icon={<DownloadOutlined />} size="large">Download PDF</Button>
        <Button size="large" onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
      </div>
    </div>
  );
};

export default Certificate;
