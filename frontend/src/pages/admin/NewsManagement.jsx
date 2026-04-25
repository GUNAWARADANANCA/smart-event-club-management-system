import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Card,
  Row,
  Col,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [form] = Form.useForm();

  const categories = ['Sports', 'Academic', 'Winning'];

  const colorMap = {
    'from-[#2980b9] to-[#154360]': '#2980b9',
    'from-[#4CAF50] to-[#2E7D32]': '#4CAF50',
    'from-[#4ade80] to-[#1b5e20]': '#4ade80',
    'from-[#f59e0b] to-[#7e5109]': '#f59e0b',
    'from-[#f39c12]/60 to-[#7e5109]/90': '#f39c12',
    'from-[#e74c3c]/60 to-[#78281f]/90': '#e74c3c',
  };

  const colors = [
    { label: 'Blue (Sports)', value: { color: 'from-[#2980b9] to-[#154360]', accent: '#2980b9' } },
    { label: 'Green (Academic)', value: { color: 'from-[#4CAF50] to-[#2E7D32]', accent: '#4CAF50' } },
    { label: 'Light Green (Sports)', value: { color: 'from-[#4ade80] to-[#1b5e20]', accent: '#4ade80' } },
    { label: 'Amber (Academic)', value: { color: 'from-[#f59e0b] to-[#7e5109]', accent: '#f59e0b' } },
    { label: 'Orange (Winning)', value: { color: 'from-[#f39c12]/60 to-[#7e5109]/90', accent: '#f39c12' } },
    { label: 'Red (Cultural)', value: { color: 'from-[#e74c3c]/60 to-[#78281f]/90', accent: '#e74c3c' } },
  ];

  // Fetch all news
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/news/admin/all');
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
  try {
    const payload = {
      ...values,
      color: values.colorScheme,
      accent: colorMap[values.colorScheme] ?? '#4CAF50', // ← derive accent from color
    };
    delete payload.colorScheme;

    if (editingNews) {
      await api.put(`/api/news/${editingNews._id}`, payload);
      message.success('News updated successfully');
    } else {
      await api.post('/api/news', payload);
      message.success('News created successfully');
    }
    form.resetFields();
    setModalOpen(false);
    setEditingNews(null);
    fetchNews();
  } catch (error) {
    console.error(error);
    message.error(error?.response?.data?.error || 'Failed to save news');
  }
};


  // Open modal for editing
  const handleEdit = (record) => {
    setEditingNews(record);
    form.setFieldsValue({
      category: record.category,
      tag: record.tag,
      title: record.title,
      summary: record.summary,
      author: record.author,
      colorScheme: record.color,
      isPublished: record.isPublished,
    });
    setModalOpen(true);
  };

  // Delete news
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete News',
      content: 'Are you sure you want to delete this news?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await api.delete(`/api/news/${id}`);
          message.success('News deleted successfully');
          fetchNews();
        } catch (error) {
          console.error(error);
          message.error('Failed to delete news');
        }
      },
    });
  };

  // Close modal
  const handleCancel = () => {
    setModalOpen(false);
    setEditingNews(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={category === 'Sports' ? 'blue' : category === 'Academic' ? 'green' : 'orange'}>
          {category}
        </Tag>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Published',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished) => (
        <Tag color={isPublished ? 'green' : 'red'}>
          {isPublished ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>News Management</h1>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              Add News
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={news}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingNews ? 'Edit News' : 'Add News'}
        open={modalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
          autoComplete="off"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="Enter news title" />
          </Form.Item>

          <Form.Item
            label="Summary"
            name="summary"
            rules={[{ required: true, message: 'Please enter summary' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter news summary"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {categories.map((cat) => (
                    <Select.Option key={cat} value={cat}>
                      {cat}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tag"
                name="tag"
                rules={[{ required: true, message: 'Please enter tag' }]}
              >
                <Input placeholder="e.g., 🏆 Achievement" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Author"
            name="author"
            rules={[{ required: true, message: 'Please enter author' }]}
          >
            <Input placeholder="Enter author name" />
          </Form.Item>

          <Form.Item
            label="Color Scheme"
            name="colorScheme"
            rules={[{ required: true, message: 'Please select color scheme' }]}
          >
            <Select placeholder="Select color scheme">
              {colors.map((colorOption) => (
                <Select.Option key={colorOption.label} value={colorOption.value.color}>
                  {colorOption.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Published"
            name="isPublished"
            valuePropName="checked"
            initialValue={true}
          >
            <Select>
              <Select.Option value={true}>Published</Select.Option>
              <Select.Option value={false}>Draft</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsManagement;
