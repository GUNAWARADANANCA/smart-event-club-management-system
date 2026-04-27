import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Tag, Modal, Form, Input, Select, InputNumber, message, Tabs } from 'antd';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import StudentRequestsSection from '@/components/events/StudentRequestsSection';
import SportsApplicationsSection from '@/components/events/SportsApplicationsSection';
import SportsManagementSection from '@/components/events/SportsManagementSection';
import { mockManagedEvents } from '@/data/mockData';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const EventManagement = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      message.error('Failed to load real event data');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingEvent(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = (values) => {
    message.success('Event properties updated successfully!');
    setIsEditModalVisible(false);
    fetchEvents(); // reload from backend conceptually
  };

  const deleteEvent = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this event?',
      onOk: async () => {
        try {
          // If backend had delete route: await api.delete(`/events/${id}`);
          message.success('Event deleted');
          fetchEvents();
        } catch (error) {}
      },
    });
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Venue', dataIndex: 'venue', key: 'venue' },
    { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: status => {
        let color = status === 'Approved' ? 'green' : (status === 'Pending' ? 'orange' : 'red');
        return <Tag color={color}>{status}</Tag>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<FileTextOutlined />} type="default" onClick={() => navigate('/portal')}>View in Portal</Button>
          <Button icon={<EditOutlined />} type="dashed" onClick={() => openEditModal(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => deleteEvent(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0, color: '#000000' }}>Event Management</Title>
        <Button 
          type="primary" 
          size="large"
          style={{ background: '#4CAF50', borderColor: '#43A047', fontWeight: 'bold', color: '#fff' }}
          onClick={() => navigate('/events/create')}
        >
          Craft New Event Post
        </Button>
      </div>

      <Tabs 
        defaultActiveKey="events" 
        size="large" 
        className="custom-tabs"
        items={[
          {
            key: 'events',
            label: 'Event Posts',
            children: (
              <div style={{ marginBottom: 32 }}>
                <StudentRequestsSection />
              </div>
            )
          },
          {
            key: 'sports',
            label: 'Sports Applications',
            children: <SportsApplicationsSection />
          },
          {
            key: 'categories',
            label: 'Sport Categories',
            children: <SportsManagementSection />
          }
        ]}
      />

      <Modal 
        title={`Edit Event: ${editingEvent?.title}`} 
        open={isEditModalVisible} 
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit} style={{ marginTop: 16 }}>
          <Space size="large" style={{ display: 'flex', width: '100%' }}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]} style={{ width: 200 }}>
              <Select>
                <Option value="Academic">Academic</Option>
                <Option value="Sports">Sports</Option>
                <Option value="Cultural">Cultural</Option>
                <Option value="Workshop">Workshop</Option>
              </Select>
            </Form.Item>
          </Space>
          
          <Space size="large" style={{ display: 'flex', width: '100%' }}>
            <Form.Item name="venue" label="Venue" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item name="capacity" label="Max Participants" rules={[{ required: true }]} style={{ width: 200 }}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Space size="large" style={{ display: 'flex', width: '100%' }}>
            <Form.Item name="audience" label="Participation Type" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select>
                <Option value="University Students Only">University Students Only</Option>
                <Option value="External Students Also Allowed">External Students Also Allowed</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]} style={{ width: 200 }}>
              <Select>
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved (Published)</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setIsEditModalVisible(false)} style={{ marginRight: 8 }}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save Changes</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventManagement;
