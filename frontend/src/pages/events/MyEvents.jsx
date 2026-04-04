import React, { useState } from 'react';
import { Typography, Table, Tag, Empty, Button, message, Popconfirm } from 'antd';
import { Trash2 } from 'lucide-react';
import { mockMyEvents } from '@/data/mockData';
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
    { title: 'Event Title', dataIndex: 'title', key: 'title', render: text => <strong style={{ color: '#FFFFFF' }}>{text}</strong> },
    { title: 'Date Registered', dataIndex: 'registrationDate', key: 'registrationDate' },
    { title: 'Event Date', dataIndex: 'date', key: 'date' },
    { title: 'Mode', dataIndex: 'mode', key: 'mode', render: mode => <Tag className="tag-teal-pill active">{mode}</Tag> },
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
        <Title level={2} style={{ color: '#000000' }}>My Registered Events</Title>
        <Text style={{ fontSize: 16, color: '#334155' }}>Manage and view all the university events you have successfully booked.</Text>
      </div>

      {myEventsState.length === 0 ? (
        <Empty 
          description={<span style={{ color: '#94A3B8' }}>You haven't registered for any events yet.</span>} 
          style={{ margin: '60px 0', padding: 40, background: '#111827', borderRadius: 12, border: '1px solid #1E293B' }} 
        >
          <Button className="btn-teal-primary" onClick={() => navigate('/portal')} style={{ marginTop: 16 }}>Browse Upcoming Events</Button>
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
