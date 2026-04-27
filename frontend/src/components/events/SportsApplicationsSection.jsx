// Version: 1.0.1 - Fixed icon imports
import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Typography, Card, message, Select, Modal, Form, DatePicker, TimePicker } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, TrophyOutlined, MailOutlined, CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const { Text, Title } = Typography;
const { Option } = Select;

const SportsApplicationsSection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/university-sports/all');
      setData(response.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load sport applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (record) => {
    setSelectedReg(record);
    setIsApproveModalVisible(true);
  };

  const submitApproval = async (values) => {
    try {
      const payload = { 
        status: 'Approved',
        scheduledDate: values.date.format('YYYY-MM-DD'),
        scheduledTime: values.time.format('hh:mm A')
      };
      console.log('Sending approval payload:', payload);
      await api.put(`/api/university-sports/${selectedReg._id}/status`, payload);
      message.success(`Application approved and trial scheduled for ${selectedReg.fullName}`);
      setIsApproveModalVisible(false);
      form.resetFields();
      fetchApplications();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to approve application';
      message.error(errorMsg);
    }
  };

  const handleCancelApplication = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to cancel this application?',
      content: 'The student will see this as "Rejected/Cancelled".',
      okText: 'Yes, Cancel',
      okType: 'danger',
      onOk: async () => {
        try {
          await api.put(`/api/university-sports/${id}/status`, { status: 'Rejected' });
          message.success('Application cancelled successfully');
          fetchApplications();
        } catch (error) {
          const errorMsg = error.response?.data?.error || error.message || 'Failed to cancel application';
          message.error(errorMsg);
        }
      }
    });
  };

  const columns = [
    {
      title: 'Applicant',
      key: 'applicant',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1F2937' }}>{record.fullName}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}><MailOutlined style={{ marginRight: 4 }} />{record.email}</div>
        </div>
      )
    },
    {
      title: 'Sport',
      dataIndex: 'sport',
      key: 'sport',
      render: (sport) => (
        <Tag color="cyan" icon={<TrophyOutlined />} style={{ borderRadius: 6, padding: '2px 8px' }}>
          {sport}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        let color = 'gold';
        if (status === 'Approved') color = 'green';
        if (status === 'Rejected') color = 'red';
        return (
          <Space direction="vertical" size={0}>
            <Tag color={color} style={{ borderRadius: 6, fontWeight: 700 }}>
              {status === 'Rejected' ? 'CANCELLED' : status.toUpperCase()}
            </Tag>
            {status === 'Approved' && record.scheduledDate && (
              <div style={{ fontSize: 10, color: '#059669', fontWeight: 600, marginTop: 4 }}>
                📅 {record.scheduledDate} @ {record.scheduledTime}
              </div>
            )}
          </Space>
        );
      }
    },
    {
      title: 'Applied On',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'Pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                style={{ background: '#10B981', borderColor: '#059669' }}
                onClick={() => handleApprove(record)}
              >
                Approve & Schedule
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleCancelApplication(record._id)}
              >
                Cancel Application
              </Button>
            </>
          )}
          {record.status !== 'Pending' && (
             <Button size="small" onClick={() => api.put(`/api/sports/${record._id}/status`, { status: 'Pending' }).then(fetchApplications)}>Reset</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#111827' }}>Sports Enrollment Applications</Title>
          <Text style={{ color: '#64748B' }}>
            Currently managing <strong style={{ color: '#10B981' }}>{data.length}</strong> real-time student registrations.
          </Text>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchApplications} 
          loading={loading}
          style={{ borderRadius: 8 }}
        >
          Refresh Data
        </Button>
      </div>

      <Card
        variant="borderless"
        style={{
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          borderColor: '#C8E6C9',
          boxShadow: '0 4px 14px rgba(46, 125, 50, 0.08)',
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircleOutlined style={{ color: '#10B981' }} />
            <span>Approve Application & Schedule Trial</span>
          </div>
        }
        open={isApproveModalVisible}
        onCancel={() => setIsApproveModalVisible(false)}
        footer={null}
        width={400}
      >
        <div style={{ marginBottom: 20, color: '#64748B', fontSize: 13 }}>
          Set a date and time for <strong>{selectedReg?.fullName}</strong> to participate physically in the <strong>{selectedReg?.sport}</strong> trials.
        </div>
        <Form form={form} layout="vertical" onFinish={submitApproval}>
          <Form.Item name="date" label="Physical Participation Date" rules={[{ required: true }]}>
             <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="time" label="Session Time" rules={[{ required: true }]}>
             <TimePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block style={{ background: '#10B981', borderColor: '#059669', height: 44, fontWeight: 700 }}>
              Confirm & Approve
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SportsApplicationsSection;
