import React, { useState } from 'react';
import { Typography, Table, Tag, Empty, Button, message, Popconfirm } from 'antd';
import { Trash2 } from 'lucide-react';
import { mockMyEvents } from '../mockData';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const MyEvents = () => {
  const navigate = useNavigate();
  const [myEventsState, setMyEventsState] = useState(mockMyEvents);

  const handleDelete = (id) => {
    setMyEventsState(myEventsState.filter(event => event.id !== id));
    message.success('Booking cancelled successfully');
  };

  const columns = [
    { title: 'Event Title', dataIndex: 'title', key: 'title', render: text => <strong style={{ color: '#a78bfa' }}>{text}</strong> },
    { title: 'Date Registered', dataIndex: 'registrationDate', key: 'registrationDate' },
    { title: 'Event Date', dataIndex: 'date', key: 'date' },
    { title: 'Mode', dataIndex: 'mode', key: 'mode', render: mode => <Tag color="cyan">{mode}</Tag> },
    { title: 'Venue', dataIndex: 'venue', key: 'venue' },
    { title: 'Organizer', dataIndex: 'organizer', key: 'organizer' },
    { 
      title: 'Action', 
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Cancel Booking"
          description="Are you sure you want to cancel this event booking?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="text" icon={<Trash2 size={16} />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2}>My Registered Events</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>Manage and view all the university events you have successfully booked.</Text>
      </div>

      {myEventsState.length === 0 ? (
        <Empty 
          description={<span style={{ color: 'gray' }}>You haven't registered for any events yet.</span>} 
          style={{ margin: '60px 0', padding: 40, background: '#141414', borderRadius: 12, border: '1px solid #303030' }} 
        >
          <Button type="primary" onClick={() => navigate('/portal')} style={{ background: '#8b5cf6', borderColor: 'transparent', marginTop: 16 }}>Browse Upcoming Events</Button>
        </Empty>
      ) : (
        <Table 
          columns={columns} 
          dataSource={myEventsState} 
          rowKey="id" 
          pagination={false}
          style={{ overflow: 'hidden' }}
        />
      )}
    </div>
  );
};

export default MyEvents;
