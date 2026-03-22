import React from 'react';
import { Table, Button, Space, Typography, Tag } from 'antd';

const { Title } = Typography;

const mockClubs = [
  { id: 1, name: 'Tech Society', members: 120, status: 'Active' },
  { id: 2, name: 'Art Club', members: 45, status: 'Active' },
  { id: 3, name: 'Robotics Team', members: 30, status: 'Inactive' },
  { id: 4, name: 'OOP Enthusiasts', members: 85, status: 'Active' },
  { id: 5, name: 'Swimming Club', members: 60, status: 'Active' },
  { id: 6, name: 'Chess Masters', members: 40, status: 'Active' },
];

const ClubManagement = () => {
  const columns = [
    { title: 'Club Name', dataIndex: 'name', key: 'name' },
    { title: 'Members', dataIndex: 'members', key: 'members' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: status => <Tag color={status === 'Active' ? 'blue' : 'default'}>{status}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link">View Details</Button>
          <Button type="link">Edit</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Club Management</Title>
        <Button type="primary">Register New Club</Button>
      </div>
      <Table columns={columns} dataSource={mockClubs} rowKey="id" />
    </div>
  );
};

export default ClubManagement;
