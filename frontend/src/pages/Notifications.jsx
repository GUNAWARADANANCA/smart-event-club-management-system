import React from 'react';
import { List, Typography, Avatar } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Notifications = () => {
  const data = [
    { title: 'New Event Pending Approval', description: 'Tech Symposium needs your approval by admin.', time: '2 mins ago' },
    { title: 'Budget Update', description: 'Your budget for Art Workshop has been approved.', time: '1 hour ago' },
    { title: 'System Maintenance', description: 'Scheduled maintenance this Sunday at 2 AM.', time: '1 day ago' },
  ];

  return (
    <div>
      <Title level={2}>Notifications</Title>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<NotificationOutlined />} style={{ backgroundColor: '#8b5cf6' }} />}
              title={<a href="#">{item.title}</a>}
              description={item.description}
            />
            <div style={{ color: 'gray', fontSize: 12 }}>{item.time}</div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notifications;
