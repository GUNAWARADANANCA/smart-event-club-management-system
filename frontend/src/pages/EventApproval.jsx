import React, { useState } from 'react';
import { Table, Button, Space, Typography, message } from 'antd';
import { mockEvents } from '../mockData';

const { Title } = Typography;

const EventApproval = () => {
  const [data, setData] = useState(mockEvents.filter(e => e.status === 'Pending'));

  const approveEvent = (id) => {
    setData(data.filter(e => e.id !== id));
    message.success('Event approved successfully.');
  };

  const rejectEvent = (id) => {
    setData(data.filter(e => e.id !== id));
    message.success('Event request rejected.');
  };

  const columns = [
    { title: 'Event Title', dataIndex: 'title', key: 'title' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Venue', dataIndex: 'venue', key: 'venue' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }} onClick={() => approveEvent(record.id)}>Approve</Button>
          <Button type="primary" danger onClick={() => rejectEvent(record.id)}>Reject</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Event Approvals (Admin)</Title>
      <p>Review and approve pending event requests from clubs.</p>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default EventApproval;
