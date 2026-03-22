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
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0, color: '#0F172A' }}>Revenue Dashboard</Title>
        <Space size="middle">
          <div style={{ padding: '6px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, display: 'flex', alignItems: 'center', gap: 12, marginRight: 8 }}>
            <span style={{ color: '#0F172A', letterSpacing: '0.5px' }}>External Ticket Sales:</span>
            <Switch 
              checked={salesActive} 
              onChange={handleSalesToggle} 
              checkedChildren="Active" 
              unCheckedChildren="Closed" 
              style={{ background: salesActive ? '#14B8A6' : '#E2E8F0' }}
            />
          </div>
          <Button type="default" onClick={() => navigate('/finance/budget-approval')}>Approvals</Button>
          <Button type="default" onClick={() => navigate('/finance/requests')}>Requests</Button>
          <Button type="default" onClick={() => navigate('/finance/expenses')}>Expenses</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ border: '1px solid #E2E8F0' }}>
            <Statistic title="Total Revenue" value={12500} prefix={<DollarOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ border: '1px solid #E2E8F0' }}>
            <Statistic title="Total Expenses" value={3200} prefix={<ArrowDownOutlined />} valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ border: '1px solid #E2E8F0' }}>
            <Statistic title="Net Profit" value={9300} prefix={<ArrowUpOutlined />} valueStyle={{ color: '#14B8A6' }} />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Card title="Budget Proposals" bordered={false} style={{ border: '1px solid #E2E8F0' }}>
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
          background: 'linear-gradient(to right, #0F766E, #14B8A6)',
          borderColor: 'transparent',
          boxShadow: '0 4px 12px rgba(20, 184, 166, 0.4)'
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
          <Button key="close" type="primary" onClick={() => setIsModalVisible(false)} style={{ background: '#14B8A6', borderColor: '#14B8A6' }}>
            Close
          </Button>
        ]}
        className="glass-modal"
      >
        <Table 
          dataSource={ticketPurchases} 
          columns={ticketColumns} 
          rowKey="id" 
          pagination={false} 
        />
      </Modal>
    </div>
  );
};

export default FinanceManagement;
