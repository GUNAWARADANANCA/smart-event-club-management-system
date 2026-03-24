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
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#14B8A6]/30 rounded-3xl overflow-hidden shadow-2xl relative p-6 md:p-8">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0F766E]/5 to-transparent pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Title level={4} className="m-0 !text-slate-800 tracking-tight font-extrabold uppercase tracking-widest text-xs border-b border-[#14B8A6]/30 pb-2">Request Management</Title>
        </div>
        
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish} 
          onFinishFailed={onFinishFailed}
          size="large"
          autoComplete="off"
        >
          <Card className="bg-[#0F172A] border-[#1E293B] shadow-2xl rounded-3xl mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6]/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#14B8A6]/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="mb-8">
              <Title level={4} className="!text-white mb-2 relative z-10 font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-2">
                Request for Uni Events and Club Management
              </Title>
              <Text className="text-gray-400 text-sm block mt-2">
                Submit your proposals for new university events or club activities here.
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Form.Item
                name="fullName"
                label={<Text className="text-gray-300 font-semibold tracking-wide uppercase text-xs tracking-widest">Full Name</Text>}
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input placeholder="John Doe" className="bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl h-10" />
              </Form.Item>

              <Form.Item
                name="email"
                label={<Text className="text-gray-300 font-semibold tracking-wide uppercase text-xs tracking-widest">University Email</Text>}
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
                <Input placeholder="example@my.sliit.lk" className="bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl h-10" />
              </Form.Item>

              <Form.Item
                name="academicYear"
                label={<Text className="text-gray-300 font-semibold tracking-wide uppercase text-xs tracking-widest">Academic Year</Text>}
                rules={[{ required: true, message: 'Please select your Academic Year' }]}
              >
                <Select 
                  placeholder="Select Academic Year"
                  className="dark-select"
                  popupClassName="dark-dropdown"
                >
                  <Option value="Year 1">Year 1</Option>
                  <Option value="Year 2">Year 2</Option>
                  <Option value="Year 3">Year 3</Option>
                  <Option value="Year 4">Year 4</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="requestType"
                label={<Text className="text-gray-300 font-semibold tracking-wide uppercase text-xs tracking-widest">Request Type</Text>}
                rules={[{ required: true, message: 'Please select a Request Type' }]}
              >
                <Select 
                  placeholder="Select Request Type"
                  className="dark-select"
                  popupClassName="dark-dropdown"
                >
                  <Option value="University Event Request">University Event Request</Option>
                  <Option value="Club Management Request">Club Management Request</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="description"
              label={<Text className="text-gray-300 font-semibold tracking-wide uppercase text-xs tracking-widest mt-4 block">Request Description</Text>}
              rules={[{ required: true, message: 'Please provide a description of your request' }]}
            >
              <TextArea rows={5} placeholder="Describe the event or club management request in detail..." className="bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl resize-none" />
            </Form.Item>

            <Form.Item className="mt-8 mb-0">
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                className="h-14 bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:from-[#0F766E] hover:to-[#0d9488] border-0 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl transition-all text-white"
              >
                Submit Request
              </Button>
            </Form.Item>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default RequestManagement;
