import React from 'react';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import { mockRequests } from '../mockData';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RequestManagement = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const newRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      fullName: values.fullName,
      email: values.email,
      academicYear: values.academicYear,
      requestType: values.requestType,
      description: values.description,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    mockRequests.unshift(newRequest);
    message.success('Your request has been submitted and saved successfully!');
    form.resetFields();
  };

  const onFinishFailed = () => {
    message.error('Please fill out all required fields correctly.');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Request for Uni Events and Club Management</Title>
        <Text type="secondary">Submit your proposals for new university events or club activities here.</Text>
      </div>
      
      <Card bordered={false} style={{ borderRadius: 12, backgroundColor: '#141414', borderColor: '#303030' }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish} 
          onFinishFailed={onFinishFailed}
          size="large"
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="John Doe" style={{ background: '#000', borderColor: '#303030', color: 'white' }} />
          </Form.Item>

          <Form.Item
            name="email"
            label="University Email"
            rules={[
              { required: true, message: 'Please enter your University Email' },
              { type: 'email', message: 'Please enter a valid email address' },
              {
                validator: (_, value) => {
                  if (value && !value.endsWith('@my.sliit.lk')) {
                    return Promise.reject(new Error('Email must be a valid SLIIT student email ending with @my.sliit.lk'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input placeholder="example@my.sliit.lk" style={{ background: '#000', borderColor: '#303030', color: 'white' }} />
          </Form.Item>

          <Form.Item
            name="academicYear"
            label="Academic Year"
            rules={[{ required: true, message: 'Please select your Academic Year' }]}
          >
            <Select placeholder="Select Academic Year" popupClassName="dark-select-dropdown">
              <Option value="Year 1">Year 1</Option>
              <Option value="Year 2">Year 2</Option>
              <Option value="Year 3">Year 3</Option>
              <Option value="Year 4">Year 4</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="requestType"
            label="Request Type"
            rules={[{ required: true, message: 'Please select a Request Type' }]}
          >
            <Select placeholder="Select Request Type" popupClassName="dark-select-dropdown">
              <Option value="University Event Request">University Event Request</Option>
              <Option value="Club Management Request">Club Management Request</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Request Description"
            rules={[{ required: true, message: 'Please provide a description of your request' }]}
          >
            <TextArea rows={6} placeholder="Describe the event or club management request in detail..." style={{ background: '#000', borderColor: '#303030', color: 'white' }} />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%', height: 48, background: '#8b5cf6', borderColor: '#8b5cf6', fontSize: 16 }}>
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RequestManagement;
