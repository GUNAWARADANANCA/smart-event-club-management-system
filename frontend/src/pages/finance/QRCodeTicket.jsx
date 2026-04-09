import React from 'react';
import { Card, Typography, Button, QRCode } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const QRCodeTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const ticketData = location.state?.ticket || {
    eventName: 'Tech Symposium',
    passType: 'VIP Pass',
    attendeeName: 'Admin User',
    date: 'April 10, 2026',
    venue: 'Main Hall',
    ticketId: '990184'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Title level={2}>Your E-Ticket</Title>
      <Card 
        style={{ width: 350, textAlign: 'center', borderRadius: 16, border: '2px dashed #8b5cf6' }}
        cover={<div style={{ background: '#8b5cf6', padding: '24px 0', color: 'white', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
            <Title level={3} style={{ color: 'white', margin: 0 }}>{ticketData.eventName}</Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{ticketData.passType}</Text>
        </div>}
      >
        <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'center' }}>
          <QRCode value={`TICKET_${ticketData.ticketId}`} size={180} />
        </div>
        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          <p><Text strong>Name:</Text> {ticketData.attendeeName}</p>
          <p><Text strong>Date:</Text> {ticketData.date}</p>
          <p><Text strong>Venue:</Text> {ticketData.venue}</p>
          <p><Text strong>Ticket ID:</Text> #{ticketData.ticketId}</p>
        </div>
        
        <Button type="primary" icon={<DownloadOutlined />} block size="large">
          Download PDF
        </Button>
      </Card>
      <div style={{ marginTop: 24 }}>
         <Button type="link" onClick={() => navigate('/portal')}>Back to Events Portal</Button>
      </div>
    </div>
  );
};

export default QRCodeTicket;
