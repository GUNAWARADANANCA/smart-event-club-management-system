import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Button, Tag, Modal, Form, Input, Select, message, Switch, Space } from 'antd';
import { DollarOutlined, ArrowUpOutlined, ArrowDownOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockBudgets } from '../mockData';

const { Title } = Typography;

const FinanceManagement = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [salesActive, setSalesActive] = useState(false);

  const handleSalesToggle = (checked) => {
    setSalesActive(checked);
    if (checked) {
      message.success('Ticket sales are now OPEN for external users.');
    } else {
      message.warning('Ticket sales for external users have been PAUSED.');
    }
  };

  const ticketPurchases = [
    { id: 'TP-001', event: 'Tech Symposium 2026', buyer: 'John Doe', amount: 45000, date: '2026-03-21' },
    { id: 'TP-002', event: 'Annual Sports Meet', buyer: 'Jane Smith', amount: 15000, date: '2026-03-20' },
    { id: 'TP-003', event: 'Cultural Fest', buyer: 'Mike Johnson', amount: 22500, date: '2026-03-19' },
  ];

  const ticketColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { title: 'Buyer', dataIndex: 'buyer', key: 'buyer' },
    { title: 'Amount (Rs.)', dataIndex: 'amount', key: 'amount', render: val => `Rs. ${Number(val).toLocaleString()}` },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Revenue Dashboard</Title>
        <Space size="middle">
          <div style={{ padding: '6px 16px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 24, display: 'flex', alignItems: 'center', gap: 12, marginRight: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '0.5px' }}>External Ticket Sales:</span>
            <Switch 
              checked={salesActive} 
              onChange={handleSalesToggle} 
              checkedChildren="Active" 
              unCheckedChildren="Closed" 
              style={{ background: salesActive ? '#8b5cf6' : '#303030' }}
            />
          </div>
          <Button type="default" onClick={() => navigate('/finance/budget-approval')}>Approvals</Button>
          <Button type="default" onClick={() => navigate('/finance/requests')}>Requests</Button>
          <Button type="default" onClick={() => navigate('/finance/expenses')}>Expenses</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic title="Total Revenue" value={12500} prefix={<DollarOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic title="Total Expenses" value={3200} prefix={<ArrowDownOutlined />} valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic title="Net Profit" value={9300} prefix={<ArrowUpOutlined />} valueStyle={{ color: '#8b5cf6' }} />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Card title="Budget Proposals" bordered={false}>
          <Table 
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id' },
              { title: 'Event', dataIndex: 'event', key: 'event' },
              { title: 'Amount (Rs.)', dataIndex: 'amount', key: 'amount', render: val => `Rs. ${Number(val).toLocaleString()}` },
              { title: 'Status', dataIndex: 'status', key: 'status', render: status => (
                <Tag color={status === 'Approved' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>{status}</Tag>
              ) }
            ]} 
            dataSource={mockBudgets} 
            rowKey="id" 
            pagination={false} 
          />
        </Card>
      </div>

      <Button 
        type="primary" 
        shape="round" 
        icon={<EyeOutlined />} 
        size="large" 
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          zIndex: 1000,
          background: '#8b5cf6',
          borderColor: '#8b5cf6',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
        }}
        onClick={() => setIsModalVisible(true)}
      >
        View Ticket Purchase
      </Button>

      <Modal
        title="View Ticket Purchases"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalVisible(false)} style={{ background: '#8b5cf6', borderColor: '#8b5cf6' }}>
            Close
          </Button>
        ]}
        className="glass-modal"
        styles={{ 
          content: { background: '#141414', border: '1px solid #303030', color: 'white' },
          header: { background: '#141414', borderBottom: '1px solid #303030' },
          title: { color: 'white' },
          closeIcon: { color: 'white' }
        }}
      >
        <Table 
          dataSource={ticketPurchases} 
          columns={ticketColumns} 
          rowKey="id" 
          pagination={false} 
          className="dark-table"
        />
      </Modal>
    </div>
  );
};

export default FinanceManagement;
