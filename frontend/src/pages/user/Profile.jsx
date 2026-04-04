import React from 'react';
import { Card, Avatar, Typography, Descriptions, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Profile = () => {
  const displayName =
    localStorage.getItem('registeredDisplayName') ||
    localStorage.getItem('userName') ||
    'User';
  const email = localStorage.getItem('userEmail') || '—';
  const role = localStorage.getItem('userRole') || '—';

  return (
    <div>
      <Title level={2}>My Profile</Title>
      <Card style={{ maxWidth: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>{displayName}</Title>
            <p style={{ color: 'gray' }}>Role: {role}</p>
          </div>
        </div>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Email">{email}</Descriptions.Item>
          <Descriptions.Item label="Join Date">October 15, 2025</Descriptions.Item>
          <Descriptions.Item label="Associated Club">Tech Society</Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16 }}>
          <Button type="primary">Edit Profile</Button> 
          <Button style={{ marginLeft: 8 }}>Change Password</Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
