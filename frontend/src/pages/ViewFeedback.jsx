import React, { useState } from 'react';
import { Table, Rate, Tag, Card, Typography, Space, Button, Modal, Form, Input, Select, message } from 'antd';
import { MessageSquare, Star, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ViewFeedback = () => {
  const navigate = useNavigate();
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [form] = Form.useForm();
  const [feedbacks, setFeedbacks] = useState([
    { key: '1', user: 'John Doe', rating: 5, category: 'General', subject: 'Excellent Platform', message: 'The event management system is very intuitive and easy to use. Great job!', date: '2026-03-22' },
    { key: '2', user: 'Jane Smith', rating: 4, category: 'Feature Request', subject: 'More Customization', message: 'I would love to see more customization options for the event posters.', date: '2026-03-21' },
    { key: '3', user: 'Robert Brown', rating: 3, category: 'Bug Report', subject: 'Loading issue', message: 'The dashboard takes a bit too long to load on mobile devices.', date: '2026-03-20' },
    { key: '4', user: 'Alice Green', rating: 5, category: 'UI/UX', subject: 'Stunning Design', message: 'The new dark theme is absolutely beautiful. Very premium feel.', date: '2026-03-24' },
  ]);

  const handleSubmitFeedback = (values) => {
    const newEntry = {
      key: Date.now().toString(),
      user: values.name || 'Anonymous',
      rating: values.rating || 0,
      category: values.category,
      subject: values.subject,
      message: values.message,
      date: new Date().toISOString().split('T')[0],
    };
    setFeedbacks(prev => [newEntry, ...prev]);
    message.success('Feedback submitted successfully!');
    form.resetFields();
    setFeedbackModal(false);
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (text) => <Text className="text-white font-bold">{text}</Text>,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} className="text-[#14B8A6] text-xs" />,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        let color = 'cyan';
        if (category === 'Bug Report') color = 'volcano';
        if (category === 'Feature Request') color = 'purple';
        if (category === 'UI/UX') color = 'blue';
        return <Tag color={color} className="rounded-full px-3">{category}</Tag>;
      },
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text) => <Text className="text-gray-300">{text}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <Text className="text-gray-500 text-xs">{text}</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          className="text-[#14B8A6] hover:text-[#0F766E] p-0"
          onClick={() => console.log('View details', record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#14B8A6]/30 rounded-3xl overflow-hidden shadow-2xl relative p-6 md:p-8">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0F766E]/5 to-transparent pointer-events-none z-0"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              icon={<ArrowLeft size={18} />} 
              onClick={() => navigate(-1)}
              className="hover:scale-105 transition-transform bg-white/10 border-white/20 text-slate-800 rounded-xl"
            />
            <Title level={2} className="m-0 !text-slate-800 tracking-tight font-black uppercase tracking-tighter">
              Feedback <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] to-[#14B8A6]">Center</span>
            </Title>
          </div>
          <Button 
            icon={<MessageCircle size={18} />} 
            onClick={() => setFeedbackModal(true)}
            style={{ background: 'linear-gradient(to right, #14B8A6, #0F766E)', border: 'none', color: '#fff', fontWeight: 700, borderRadius: 12 }}
          >
            Your Feedback
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Feedbacks', value: '1,280', icon: <MessageSquare className="text-blue-500" /> },
            { label: 'Average Rating', value: '4.8', icon: <Star className="text-yellow-500" /> },
            { label: 'Response Rate', value: '98%', icon: <MessageSquare className="text-green-500" /> },
          ].map((stat, i) => (
            <Card key={i} className="bg-white border-[#E2E8F0] shadow-sm rounded-3xl overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl">{stat.icon}</div>
                <div>
                  <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest block">{stat.label}</Text>
                  <Title level={3} className="m-0 !text-slate-800 font-black">{stat.value}</Title>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-[#0F172A] border-[#1E293B] shadow-2xl rounded-3xl overflow-hidden">
          <div className="mb-6 flex items-center justify-between">
            <Title level={4} className="m-0 !text-white font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-2">
              Recent Submissions
            </Title>
            <Text className="text-gray-500 text-xs italic">Syncing live data...</Text>
          </div>
          
          <Table 
            columns={columns} 
            dataSource={feedbacks} 
            pagination={{ pageSize: 5 }}
            className="dark-table"
            rowClassName="hover:bg-white/5 cursor-pointer transform transition-all"
          />
        </Card>
      </div>

      <style>{`
          background: transparent !important;
          color: white !important;
        }
        .dark-table .ant-table-thead > tr > th {
          background: rgba(255, 255, 255, 0.05) !important;
          color: rgba(255, 255, 255, 0.5) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          font-weight: 800 !important;
        }
        .dark-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 16px !important;
        }
        .dark-table .ant-pagination-item {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .dark-table .ant-pagination-item a {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .dark-table .ant-pagination-item-active {
          border-color: #14B8A6 !important;
        }
        .dark-table .ant-pagination-item-active a {
          color: #14B8A6 !important;
        }
        .dark-table .ant-pagination-prev .ant-pagination-item-link,
        .dark-table .ant-pagination-next .ant-pagination-item-link {
          background: rgba(255, 255, 255, 0.05) !important;
          color: rgba(255, 255, 255, 0.7) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>

      <Modal
        open={feedbackModal}
        onCancel={() => { setFeedbackModal(false); form.resetFields(); }}
        footer={null}
        centered
        width={520}
        styles={{ content: { background: '#1E293B', borderRadius: 16, padding: 32 }, header: { background: '#1E293B' } }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: 0 }}>Share Your Feedback</h2>
          <p style={{ color: '#94A3B8', marginTop: 4, fontSize: 13 }}>Help us improve your experience.</p>
        </div>
        <Form form={form} layout="vertical" onFinish={handleSubmitFeedback}>
          <Form.Item name="name" label={<span style={{ color: '#94A3B8', fontWeight: 600 }}>Your Name</span>}>
            <Input placeholder="Enter your name" style={{ background: '#0F172A', border: '1px solid #334155', color: '#fff', borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="rating" label={<span style={{ color: '#94A3B8', fontWeight: 600 }}>Rating</span>} rules={[{ required: true, message: 'Please give a rating' }]}>
            <Rate style={{ color: '#14B8A6' }} />
          </Form.Item>
          <Form.Item name="category" label={<span style={{ color: '#94A3B8', fontWeight: 600 }}>Category</span>} rules={[{ required: true, message: 'Please select a category' }]}>
            <Select placeholder="Select category" dropdownStyle={{ background: '#1E293B' }}>
              {['General', 'Bug Report', 'Feature Request', 'UI/UX'].map(c => (
                <Select.Option key={c} value={c}>{c}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="subject" label={<span style={{ color: '#94A3B8', fontWeight: 600 }}>Subject</span>} rules={[{ required: true, message: 'Please enter a subject' }]}>
            <Input placeholder="Briefly describe your feedback" style={{ background: '#0F172A', border: '1px solid #334155', color: '#fff', borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="message" label={<span style={{ color: '#94A3B8', fontWeight: 600 }}>Message</span>} rules={[{ required: true, message: 'Please enter your message' }]}>
            <Input.TextArea rows={4} placeholder="Write your detailed feedback..." style={{ background: '#0F172A', border: '1px solid #334155', color: '#fff', borderRadius: 10 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button htmlType="submit" block style={{ background: 'linear-gradient(to right, #14B8A6, #0F766E)', border: 'none', color: '#fff', fontWeight: 700, borderRadius: 10, height: 44, fontSize: 15 }}>
              Submit Feedback
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewFeedback;
