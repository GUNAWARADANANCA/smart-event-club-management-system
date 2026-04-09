import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Typography, Form, Input, InputNumber, Modal, Select, message, Spin } from 'antd';
import api from '@/lib/api';

const { Title } = Typography;
const { Option } = Select;

const ExpenseManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const { data: list } = await api.get('/api/expenses');
      setData(Array.isArray(list) ? list : []);
    } catch {
      message.error('Could not load expenses from the server.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        await api.post('/api/expenses', {
          ...values,
          date: new Date().toISOString().split('T')[0],
        });
        message.success('Expense logged successfully');
        setIsModalVisible(false);
        form.resetFields();
        await fetchExpenses();
      } catch {
        message.error('Could not save expense.');
      }
    });
  };

  const columns = [
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { title: 'Item/Description', dataIndex: 'item', key: 'item' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Amount (RS)',
      dataIndex: 'amount',
      key: 'amount',
      render: (val) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          RS -{Number(val || 0).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2} style={{ color: '#000000' }}>
          Expense Management
        </Title>
        <Button className="btn-teal-primary" onClick={() => setIsModalVisible(true)}>
          Log New Expense
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={data} rowKey={(row) => row._id} />
      </Spin>

      <Modal
        title="Log Expense"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{ className: 'btn-teal-primary' }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="event" label="Associated Event" rules={[{ required: true }]}>
            <Select className="green-select" popupClassName="green-dropdown">
              <Option value="Tech Symposium">Tech Symposium</Option>
              <Option value="Art Workshop">Art Workshop</Option>
            </Select>
          </Form.Item>
          <Form.Item name="item" label="Description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount (RS)" rules={[{ required: true, type: 'number', min: 1 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpenseManagement;
