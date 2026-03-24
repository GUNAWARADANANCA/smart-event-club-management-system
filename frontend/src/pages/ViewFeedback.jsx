import React, { useState } from 'react';
import { Table, Rate, Tag, Card, Typography, Space, Button } from 'antd';
import { MessageSquare, Star, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ViewFeedback = () => {
  const navigate = useNavigate();

  // Mock feedback data
  const mockFeedbacks = [
    {
      key: '1',
      user: 'John Doe',
      rating: 5,
      category: 'General',
      subject: 'Excellent Platform',
      message: 'The event management system is very intuitive and easy to use. Great job!',
      date: '2026-03-22',
    },
    {
      key: '2',
      user: 'Jane Smith',
      rating: 4,
      category: 'Feature Request',
      subject: 'More Customization',
      message: 'I would love to see more customization options for the event posters.',
      date: '2026-03-21',
    },
    {
      key: '3',
      user: 'Robert Brown',
      rating: 3,
      category: 'Bug Report',
      subject: 'Loading issue',
      message: 'The dashboard takes a bit too long to load on mobile devices.',
      date: '2026-03-20',
    },
    {
      key: '4',
      user: 'Alice Green',
      rating: 5,
      category: 'UI/UX',
      subject: 'Stunning Design',
      message: 'The new dark theme is absolutely beautiful. Very premium feel.',
      date: '2026-03-24',
    },
  ];

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
            icon={<Filter size={18} />} 
            className="rounded-xl border-[#E2E8F0] font-bold text-slate-600 hover:text-[#14B8A6] hover:border-[#14B8A6]"
          >
            Filter
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
            dataSource={mockFeedbacks} 
            pagination={{ pageSize: 5 }}
            className="dark-table"
            rowClassName="hover:bg-white/5 cursor-pointer transform transition-all"
          />
        </Card>
      </div>

      <style>{`
        .dark-table .ant-table {
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
    </div>
  );
};

export default ViewFeedback;
