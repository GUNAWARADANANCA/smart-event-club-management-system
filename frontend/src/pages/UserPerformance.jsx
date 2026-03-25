import React from 'react';
import { Table, Typography, Card, Statistic, Row, Col } from 'antd';

const { Title } = Typography;

const UserPerformance = () => {
  const data = [
    { id: 1, title: 'Tech Symposium Basics', score: 100, date: '2026-03-19', status: 'Passed' },
    { id: 2, title: 'Art Workshop Recap', score: 40, date: '2026-03-15', status: 'Failed' },
  ];

  const columns = [
    { title: 'Quiz Title', dataIndex: 'title', key: 'title' },
    { title: 'Score (%)', dataIndex: 'score', key: 'score' },
    { title: 'Date Attempted', dataIndex: 'date', key: 'date' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: status => <span style={{ color: status === 'Passed' ? 'green' : 'red', fontWeight: 'bold' }}>{status}</span>
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24, color: '#000000' }}>My Performance Details</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
            <Card hoverable>
              <Statistic title="Total Quizzes Taken" value={2} />
            </Card>
        </Col>
        <Col span={8}>
            <Card hoverable>
              <Statistic title="Average Score" value="70%" valueStyle={{ color: 'var(--teal-primary)' }} />
            </Card>
        </Col>
        <Col span={8}>
            <Card hoverable>
              <Statistic title="Certificates Earned" value={1} valueStyle={{ color: '#d4af37' }} />
            </Card>
        </Col>
      </Row>

      <Card title={<span style={{ color: '#FFFFFF' }}>Detailed Quiz History</span>} bordered={false} style={{ background: '#111827', border: '1px solid #1E293B' }}>
          <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </div>
  );
};

export default UserPerformance;
