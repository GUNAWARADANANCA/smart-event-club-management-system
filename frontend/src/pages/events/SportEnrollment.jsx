import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Form, Input, Select, Tabs, Tag, Table, Space, message, Badge } from 'antd';
import { TrophyOutlined, ScheduleOutlined, FileSearchOutlined, CheckCircleOutlined, ClockCircleOutlined, FilterOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const SportEnrollment = () => {
  const [registrations, setRegistrations] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('register');
  const [filterStatus, setFilterStatus] = useState('All');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMyRegistrations();
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await api.get('/api/university-sports');
      setSports(response.data);
    } catch (error) {
      console.error('Failed to fetch sports:', error);
    }
  };

  const fetchMyRegistrations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/university-sports/my-registrations');
      setRegistrations(response.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load your registrations');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      await api.post('/api/university-sports/register', {
        sport: values.sport,
        fullName: values.fullName,
        email: values.email
      });
      message.success(`Sent enrollment request for ${values.sport}!`);
      form.resetFields();
      fetchMyRegistrations();
      setActiveTab('status');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to submit registration';
      message.error(errorMsg);
    }
  };

  const filteredData = registrations.filter(reg => {
    if (filterStatus === 'All') return true;
    return reg.status === filterStatus;
  });

  const columns = [
    {
      title: 'Sport',
      dataIndex: 'sport',
      key: 'sport',
      render: (sport) => (
        <Tag color="blue" icon={<TrophyOutlined />} style={{ borderRadius: 6, fontWeight: 600 }}>
          {sport}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'gold';
        if (status === 'Approved') color = 'green';
        if (status === 'Rejected') color = 'red';
        return <Tag color={color} style={{ borderRadius: 6, fontWeight: 700 }}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Physical Trial Details',
      key: 'details',
      render: (_, record) => {
        if (record.status === 'Approved' && record.scheduledDate) {
          return (
            <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ color: '#166534', fontWeight: 700, fontSize: 13 }}>
                <ScheduleOutlined style={{ marginRight: 6 }} /> 
                Scheduled Trial
              </div>
              <div style={{ color: '#15803D', fontSize: 12 }}>
                {record.scheduledDate} at {record.scheduledTime}
              </div>
            </div>
          );
        }
        if (record.status === 'Pending') {
          return <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>Pending administrator review...</Text>;
        }
        if (record.status === 'Rejected') {
           return <Text type="danger" style={{ fontSize: 12 }}>Application not accepted at this time.</Text>;
        }
        return <Text type="secondary">—</Text>;
      }
    },
    {
      title: 'Applied Date',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  return (
    <div style={{ padding: '0 20px' }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ color: '#1F2937', marginBottom: 8 }}>Sport Enrollment Portal</Title>
        <Paragraph style={{ color: '#64748B', fontSize: 16 }}>
          Register for university sports and track your application status for upcoming physical trials.
        </Paragraph>
      </div>

      <Card 
        variant="borderless" 
        style={{ 
          borderRadius: 20, 
          boxShadow: '0 10px 25px rgba(46, 125, 50, 0.05)',
          overflow: 'hidden'
        }}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          size="large"
          tabBarStyle={{ marginBottom: 24, padding: '0 24px' }}
        >
          <TabPane 
           tab={<span><CheckCircleOutlined /> Enrollment Form</span>} 
           key="register"
          >
            <div style={{ padding: '0 24px 24px', maxWidth: 600 }}>
              <Title level={4} style={{ marginBottom: 20 }}>Submit New Application</Title>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item 
                  name="sport" 
                  label="Select Sport Category" 
                  rules={[{ required: true, message: 'Please select a sport' }]}
                >
                  <Select size="large" placeholder="Pick a sport you wish to join">
                    {sports.map((s) => (
                      <Option key={s._id} value={s.name}>{s.name}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item 
                      name="fullName" 
                      label="Full Name" 
                      rules={[{ required: true, message: 'Enter your name' }]}
                    >
                      <Input size="large" placeholder="As per ID" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item 
                      name="email" 
                      label="University Email" 
                      rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}
                    >
                      <Input size="large" placeholder="student@my.sliit.lk" />
                    </Form.Item>
                  </Col>
                </Row>

                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  block 
                  style={{ 
                    height: 50, 
                    fontWeight: 700, 
                    marginTop: 10,
                    background: 'linear-gradient(to right, #4CAF50, #43A047)',
                    borderColor: '#4CAF50'
                  }}
                >
                  Confirm Registration →
                </Button>
              </Form>
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <Badge count={registrations.length} offset={[10, 0]} size="small">
                  <FileSearchOutlined /> My Status
                </Badge>
              </span>
            } 
            key="status"
          >
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Title level={4} style={{ margin: 0 }}>Enrollment History</Title>
                <Space>
                  <Text type="secondary" style={{ fontSize: 13 }}><FilterOutlined /> Filter By Status:</Text>
                  <Select 
                    defaultValue="All" 
                    style={{ width: 120 }} 
                    onChange={setFilterStatus}
                    variant="filled"
                  >
                    <Option value="All">All Applications</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Approved">Approved</Option>
                    <Option value="Rejected">Rejected</Option>
                  </Select>
                </Space>
              </div>

              <Table 
                columns={columns} 
                dataSource={filteredData} 
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 6 }}
                locale={{
                  emptyText: (
                    <div style={{ padding: '40px 0' }}>
                      <ClockCircleOutlined style={{ fontSize: 32, color: '#CBD5E1', marginBottom: 12 }} />
                      <p style={{ color: '#64748B' }}>No registrations found for this filter.</p>
                    </div>
                  )
                }}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SportEnrollment;
