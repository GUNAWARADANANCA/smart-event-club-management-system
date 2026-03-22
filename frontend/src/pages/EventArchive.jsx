import React from 'react';
import { List, Typography, Card, Tag } from 'antd';

const { Title, Text } = Typography;

const EventArchive = () => {
  const pastEvents = [
    { id: 101, title: 'Orientation 2025', date: '2025-09-01', attendees: 1200, status: 'Archived' },
    { id: 102, title: 'Winter Hackathon', date: '2025-12-15', attendees: 340, status: 'Archived' },
  ];

  return (
    <div>
      <Title level={2}>Archived Events</Title>
      <p>Historical data for past events and club activities.</p>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={pastEvents}
        renderItem={item => (
          <List.Item>
            <Card title={item.title} extra={<Tag>{item.status}</Tag>}>
              <p><Text strong>Date:</Text> {item.date}</p>
              <p><Text strong>Attendees:</Text> {item.attendees}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default EventArchive;
