import React, { useState } from 'react';
import { Table, Button, Space, Typography, Form, Input, InputNumber, Modal, Select, message } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const ExpenseManagement = () => {
  const [data, setData] = useState([
    { id: 1, event: 'Tech Symposium', item: 'Marketing Flyers', amount: 45000, date: '2026-03-10' },
    { id: 2, event: 'Art Workshop', item: 'Paints & Canvas', amount: 90000, date: '2026-03-12' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(values => {
      const newExpense = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...values };
      setData([...data, newExpense]);
      message.success('Expense logged successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const columns = [
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { title: 'Item/Description', dataIndex: 'item', key: 'item' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount (RS)', dataIndex: 'amount', key: 'amount', render: val => <span style={{ color: '#f5222d', fontWeight: 'bold' }}>RS -{val.toLocaleString()}</span> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2} style={{ color: '#000000' }}>Expense Management</Title>
        <Button className="btn-teal-primary" onClick={() => setIsModalVisible(true)}>Log New Expense</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal title="Log Expense" open={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)} okButtonProps={{ className: 'btn-teal-primary' }}>
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
