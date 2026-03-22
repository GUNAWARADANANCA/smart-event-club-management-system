import React from 'react';
import { Form, Input, Button, Card, Typography, Select, message, ConfigProvider } from 'antd';
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
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px', backgroundColor: '#14B8A6', minHeight: '100vh', borderRadius: '16px' }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Title level={2} style={{ color: '#000000' }}>Request for Uni Events and Club Management</Title>
        <Text style={{ color: '#000000', fontSize: '16px' }}>Submit your proposals for new university events or club activities here.</Text>
      </div>
      
      <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#14B8A6', border: '1px solid #14B8A6', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1)' }}>
        <ConfigProvider
          theme={{
            components: {
              Select: {
                colorBgContainer: '#14B8A6',
                colorText: '#000000',
                colorTextPlaceholder: '#000000',
                colorBorder: '#0F766E',
                colorIcon: '#000000',
                controlItemBgActive: '#0F766E',
                controlItemBgHover: '#2DD4BF',
                controlItemBgActiveDisabled: '#0F766E',
                colorBgElevated: '#14B8A6',
                colorIconHover: '#000000'
              },
            },
          }}
        >
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={onFinish} 
            onFinishFailed={onFinishFailed}
            size="large"
          >
            <Form.Item
              name="fullName"
              label={<span style={{ color: '#000000', fontWeight: '500' }}>Full Name</span>}
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input placeholder="John Doe" style={{ background: '#F9FAFB', borderColor: '#D1FAE5', color: '#000000' }} />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span style={{ color: '#000000', fontWeight: '500' }}>University Email</span>}
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
              <Input placeholder="example@my.sliit.lk" style={{ background: '#F9FAFB', borderColor: '#D1FAE5', color: '#000000' }} />
            </Form.Item>

            <Form.Item
              name="academicYear"
              label={<span style={{ color: '#000000', fontWeight: '500' }}>Academic Year</span>}
              rules={[{ required: true, message: 'Please select your Academic Year' }]}
            >
              <Select placeholder="Select Academic Year">
                <Option value="Year 1" style={{ color: '#000000' }}>Year 1</Option>
                <Option value="Year 2" style={{ color: '#000000' }}>Year 2</Option>
                <Option value="Year 3" style={{ color: '#000000' }}>Year 3</Option>
                <Option value="Year 4" style={{ color: '#000000' }}>Year 4</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="requestType"
              label={<span style={{ color: '#000000', fontWeight: '500' }}>Request Type</span>}
              rules={[{ required: true, message: 'Please select a Request Type' }]}
            >
              <Select placeholder="Select Request Type">
                <Option value="University Event Request" style={{ color: '#000000' }}>University Event Request</Option>
                <Option value="Club Management Request" style={{ color: '#000000' }}>Club Management Request</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label={<span style={{ color: '#000000', fontWeight: '500' }}>Request Description</span>}
              rules={[{ required: true, message: 'Please provide a description of your request' }]}
            >
              <TextArea rows={6} placeholder="Describe the event or club management request in detail..." style={{ background: '#F9FAFB', borderColor: '#D1FAE5', color: '#000000' }} />
            </Form.Item>

            <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" style={{ width: '100%', height: 50, background: '#10B981', borderColor: '#059669', color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)' }}>
                Submit Request
              </Button>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </Card>
    </div>
  );
};

export default RequestManagement;
