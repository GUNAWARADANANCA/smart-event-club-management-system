import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Typography, Table, Button, Tag, Modal, message, Switch, Space, Spin } from 'antd';
import { DollarOutlined, ArrowUpOutlined, ArrowDownOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockBudgets } from '@/data/mockData';
import { getAuthRole, ROLES } from '@/lib/auth';
import api from '@/lib/api';

const { Title } = Typography;

const mapTicketToRow = (t) => ({
  id: t.bookingId || t._id,
  _id: t._id,
  event: t.event,
  buyer: t.fullName,
  email: t.email,
  pass: t.passType,
  quantity: t.quantity,
  amount: t.totalAmount,
  date: t.createdAt
    ? new Date(t.createdAt).toISOString().split('T')[0]
    : '—',
});

const FinanceManagement = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [salesActive, setSalesActive] = useState(false);
  const [sponsorshipOpen, setSponsorshipOpen] = useState(false);
  const [ticketRows, setTicketRows] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const isFinanceUser = getAuthRole() === ROLES.FINANCE_ADMIN;

  const fetchDashboard = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const [ticketsRes, expensesRes] = await Promise.all([
        api.get('/api/tickets'),
        api.get('/api/expenses'),
      ]);
      const tList = Array.isArray(ticketsRes.data) ? ticketsRes.data : [];
      const eList = Array.isArray(expensesRes.data) ? expensesRes.data : [];
      setTicketRows(tList.map(mapTicketToRow));
      setExpenses(eList);
    } catch {
      message.error('Could not load finance data from the server.');
      setTicketRows([]);
      setExpenses([]);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (isModalVisible) fetchDashboard();
  }, [isModalVisible, fetchDashboard]);

  const handleSalesToggle = (checked) => {
    setSalesActive(checked);
    if (checked) {
      message.success('Ticket sales are now OPEN for external users.');
      navigate('/ticket-sales');
    } else {
      message.warning('Ticket sales for external users have been PAUSED.');
    }
  };

  const handleSponsorshipToggle = (checked) => {
    if (!isFinanceUser) return;
    setSponsorshipOpen(checked);
    if (checked) {
      message.success('Call for sponsorships is now OPEN.');
      navigate('/sponsorships');
    } else {
      message.warning('Call for sponsorships is now CLOSED.');
    }
  };

  const ticketRevenue = ticketRows.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalRevenue = ticketRevenue;
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
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
          <div
            style={{
              padding: '6px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginRight: 8,
            }}
          >
            <span style={{ color: '#6B7280', letterSpacing: '0.5px' }}>External Ticket Sales:</span>
            <Switch
              checked={salesActive}
              onChange={handleSalesToggle}
              checkedChildren="Active"
              unCheckedChildren="Closed"
              style={{ background: salesActive ? '#4CAF50' : '#C8E6C9' }}
            />
          </div>
          <div
            style={{
              padding: '6px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginRight: 8,
              opacity: isFinanceUser ? 1 : 0.55,
            }}
          >
            <span style={{ color: '#6B7280', letterSpacing: '0.5px' }}>Call for Sponsorships:</span>
            <Switch
              checked={sponsorshipOpen}
              onChange={handleSponsorshipToggle}
              checkedChildren="Open"
              unCheckedChildren="Closed"
              disabled={!isFinanceUser}
              style={{
                background: sponsorshipOpen ? '#4CAF50' : '#9CA3AF',
              }}
            />
          </div>
          <Button className="btn-teal-secondary" onClick={() => navigate('/finance/budget-approval')}>Approvals</Button>
          <Button className="btn-teal-secondary" onClick={() => navigate('/finance/requests')}>Requests</Button>
          <Button className="btn-teal-secondary" onClick={() => navigate('/finance/expenses')}>Expenses</Button>
          <Button className="btn-teal-secondary" onClick={() => navigate('/finance/secure-meetings')}>Secure Meetings</Button>
        </Space>
      </div>

      <Spin spinning={dashboardLoading}>
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
                  <div
                    style={{
                      color: balance < 0 ? '#b91c1c' : '#2E7D32',
                      fontSize: 26,
                      fontWeight: 700,
                    }}
                  >
                    Rs. {balance.toLocaleString()}
                  </div>
                  <div style={{ color: '#64748B', fontSize: 12 }}>Available after all expenses</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>

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
        <Spin spinning={dashboardLoading}>
          <Table
            dataSource={ticketRows}
            columns={ticketColumns}
            rowKey={(row) => row._id || row.id}
            pagination={false}
            scroll={{ x: true }}
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default FinanceManagement;
