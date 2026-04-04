import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Button, Tag, Modal, Form, Input, Select, message, Switch, Space } from 'antd';
import { DollarOutlined, ArrowUpOutlined, ArrowDownOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockBudgets } from '@/data/mockData';

const { Title } = Typography;

const FinanceManagement = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [salesActive, setSalesActive] = useState(false);

  const handleSalesToggle = (checked) => {
    setSalesActive(checked);
    if (checked) {
      message.success('Ticket sales are now OPEN for external users.');
      navigate('/ticket-sales');
    } else {
      message.warning('Ticket sales for external users have been PAUSED.');
    }
  };

  const staticPurchases = [
    { id: 'TP-001', event: 'Tech Symposium 2026', buyer: 'John Doe', amount: 45000, date: '2026-03-21' },
    { id: 'TP-002', event: 'Annual Sports Meet', buyer: 'Jane Smith', amount: 15000, date: '2026-03-20' },
    { id: 'TP-003', event: 'Cultural Fest', buyer: 'Mike Johnson', amount: 22500, date: '2026-03-19' },
  ];

  const livePurchases = JSON.parse(localStorage.getItem('ticketPurchases') || '[]');
  const ticketPurchases = [...livePurchases, ...staticPurchases];

  const totalRevenue = ticketPurchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalExpenses = JSON.parse(localStorage.getItem('expenses') || '[]').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const balance = totalRevenue - totalExpenses;

  const ticketColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { title: 'Buyer', dataIndex: 'buyer', key: 'buyer' },
    { title: 'Email', dataIndex: 'email', key: 'email', render: v => v || '—' },
    { title: 'Pass', dataIndex: 'pass', key: 'pass', render: v => v || 'Standard' },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity', render: v => v || 1 },
    { title: 'Amount (Rs.)', dataIndex: 'amount', key: 'amount', render: val => `Rs. ${Number(val).toLocaleString()}` },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '24px', background: '#FAFAFA' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0, color: '#1F2937' }}>Revenue Dashboard</Title>
        <Space size="middle">
          <div style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, display: 'flex', alignItems: 'center', gap: 12, marginRight: 8 }}>
            <span style={{ color: '#6B7280', letterSpacing: '0.5px' }}>External Ticket Sales:</span>
            <Switch 
              checked={salesActive} 
              onChange={handleSalesToggle} 
              checkedChildren="Active" 
              unCheckedChildren="Closed" 
              style={{ background: salesActive ? '#4CAF50' : '#C8E6C9' }}
            />
          </div>
          <Button className="btn-teal-secondary" onClick={() => navigate('/finance/budget-approval')}>Approvals</Button>
          <Button className="btn-teal-secondary" onClick={() => navigate('/finance/requests')}>Requests</Button>
          <Button className="btn-teal-secondary" onClick={() => navigate('/finance/expenses')}>Expenses</Button>
          <Button className="btn-teal-secondary" onClick={() => navigate('/finance/secure-meetings')}>Secure Meetings</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ background: 'linear-gradient(135deg, #FFFFFF, #E8F5E9)', border: '1px solid #C8E6C9', borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ background: '#22c55e22', borderRadius: 12, padding: '10px 12px' }}>
                <DollarOutlined style={{ fontSize: 24, color: '#22c55e' }} />
              </div>
              <div>
                <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 2 }}>Money Collected</div>
                <div style={{ color: '#22c55e', fontSize: 26, fontWeight: 700 }}>Rs. {totalRevenue.toLocaleString()}</div>
                <div style={{ color: '#64748B', fontSize: 12 }}>Total ticket & event revenue</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ background: 'linear-gradient(135deg, #FFFFFF, #FEF2F2)', border: '1px solid #FECACA', borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ background: '#f8717122', borderRadius: 12, padding: '10px 12px' }}>
                <ArrowDownOutlined style={{ fontSize: 24, color: '#f87171' }} />
              </div>
              <div>
                <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 2 }}>Amount Spent</div>
                <div style={{ color: '#f87171', fontSize: 26, fontWeight: 700 }}>Rs. {totalExpenses.toLocaleString()}</div>
                <div style={{ color: '#64748B', fontSize: 12 }}>Approved expenses so far</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ background: 'linear-gradient(135deg, #FFFFFF, #E8F5E9)', border: '1px solid #A5D6A7', borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ background: '#4CAF5022', borderRadius: 12, padding: '10px 12px' }}>
                <ArrowUpOutlined style={{ fontSize: 24, color: '#4CAF50' }} />
              </div>
              <div>
                <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 2 }}>Balance Remaining</div>
                <div style={{ color: '#2E7D32', fontSize: 26, fontWeight: 700 }}>Rs. {balance.toLocaleString()}</div>
                <div style={{ color: '#64748B', fontSize: 12 }}>Available after all expenses</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Card title={<span style={{ color: '#1F2937' }}>Budget Proposals</span>} bordered={false} style={{ background: '#FFFFFF', border: '1px solid #C8E6C9' }}>
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
        className="btn-teal-primary"
        shape="round" 
        icon={<EyeOutlined />} 
        size="large" 
        style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 1000 }}
        onClick={() => setIsModalVisible(true)}
      >
        View Ticket Purchase
      </Button>

      <Modal
        title={<span style={{ color: '#1F2937', fontSize: 18, fontWeight: 'bold' }}>Ticket Purchases</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalVisible(false)} style={{ background: '#4CAF50', borderColor: '#43A047' }}>
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
          scroll={{ x: true }}
        />
      </Modal>
    </div>
  );
};

export default FinanceManagement;
