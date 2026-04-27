import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Modal, Form, Input, message, Card, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const { Title, Text } = Typography;

const SportsManagementSection = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/university-sports');
      setSports(response.data);
    } catch (error) {
      console.error('Failed to fetch sports', error);
      message.error('Failed to load sports');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSport = async (values) => {
    try {
      await api.post('/api/university-sports', values);
      message.success('Sport added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchSports();
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to add sport');
    }
  };

  const handleDeleteSport = async (id) => {
    try {
      await api.delete(`/api/university-sports/${id}`);
      message.success('Sport deleted');
      fetchSports();
    } catch (error) {
      message.error('Failed to delete sport');
    }
  };

  const columns = [
    {
      title: 'Sport Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Space>
          <TrophyOutlined style={{ color: '#F59E0B' }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Delete this sport?"
          description="This category will be removed from the enrollment portal."
          onConfirm={() => handleDeleteSport(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<DeleteOutlined />} danger type="text">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card variant="borderless" style={{ background: '#F8FAFC', borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Manage Sport Categories</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
          style={{ background: '#4CAF50', borderColor: '#4CAF50' }}
        >
          Add New Sport
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={sports} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Add New Sport Category"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddSport}>
          <Form.Item name="name" label="Sport Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Tennis, Archery" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Brief description of the sport club..." />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#4CAF50', borderColor: '#4CAF50' }}>Add Sport</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SportsManagementSection;
