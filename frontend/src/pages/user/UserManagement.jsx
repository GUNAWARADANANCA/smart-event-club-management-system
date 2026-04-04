import React from 'react';
import { Form, Input, Button, Card, Typography, Select, message, ConfigProvider } from 'antd';
import { mockRequests } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, GraduationCap } from 'lucide-react';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const hubCards = [
  {
    icon: BookOpen,
    title: 'Lecture Panel',
    desc: 'Browse and register for upcoming university lectures and academic sessions.',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)',
    glow: 'rgba(99,102,241,0.3)',
    tag: 'Academic',
    route: '/events/lecture-panel',
  },
  {
    icon: Users,
    title: 'Club & Society Leaders',
    desc: 'Meet the elected leaders of all university clubs and societies.',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50, #43A047)',
    glow: 'rgba(76,175,80,0.25)',
    tag: 'Community',
    route: '/club-leaders',
  },
  {
    icon: GraduationCap,
    title: 'SIS',
    desc: 'Access the Student Information System for academic records and schedules.',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    glow: 'rgba(245,158,11,0.3)',
    tag: 'Student Portal',
    route: '/sis',
  },
];

const RequestManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

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
    <div style={{ minHeight: '100vh', background: '#FAFAFA', padding: '32px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* User Hub Cards */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: '#6366F122', border: '1px solid #6366F144', borderRadius: 999, padding: '4px 14px', color: '#6366F1', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
            User Portals
          </div>
          <Title level={3} style={{ color: '#1F2937', margin: '0 0 20px' }}>Quick Access</Title>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {hubCards.map(({ icon: Icon, title, desc, color, gradient, glow, tag, route }) => (
              <div key={title} onClick={() => navigate(route)}
                style={{ flex: '1 1 220px', background: '#FFFFFF', border: '1px solid #C8E6C9', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 14px rgba(46, 125, 50, 0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${glow}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ height: 3, background: gradient }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <span style={{ background: `${color}22`, color, borderRadius: 999, padding: '2px 10px', fontSize: 10, fontWeight: 700, display: 'inline-block', marginBottom: 8 }}>{tag}</span>
                  <div style={{ color: '#1F2937', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{title}</div>
                  <div style={{ color: '#64748B', fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>{desc}</div>
                  <button style={{ width: '100%', padding: '8px 0', borderRadius: 10, background: gradient, border: 'none', color: '#FFFFFF', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    Open →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-block', background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: 999, padding: '4px 14px', color: '#2E7D32', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
            Request Management
          </div>
          <Title level={2} style={{ color: '#1F2937', margin: 0, marginBottom: 6 }}>Submit a New Request</Title>
          <Text style={{ color: '#64748B', fontSize: 15 }}>Propose new university events or club activities for review.</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          size="large"
          autoComplete="off"
        >
          <div style={{ background: '#FFFFFF', border: '1px solid #C8E6C9', borderRadius: 24, padding: '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 28px rgba(46, 125, 50, 0.08)' }}>
            {/* Decorative glow */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: '#E8F5E9', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div style={{ marginBottom: 28 }}>
              <div style={{ color: '#1F2937', fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Request for Uni Events and Club Management</div>
              <div style={{ color: '#64748B', fontSize: 14 }}>Fill in the details below. All fields marked with * are required.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <Form.Item
                name="fullName"
                label={<span style={{ color: '#4B5563', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name *</span>}
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input placeholder="John Doe"
                  style={{ background: '#FFFFFF', borderColor: '#C8E6C9', color: '#1F2937', borderRadius: 12, height: 44 }} />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span style={{ color: '#4B5563', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>University Email *</span>}
                rules={[
                  { required: true, message: 'Please enter your university email' },
                  { type: 'email', message: 'Please enter a valid email address' },
                  { validator: (_, value) => value && !value.endsWith('@my.sliit.lk') ? Promise.reject('Must end with @my.sliit.lk') : Promise.resolve() }
                ]}
              >
                <Input placeholder="example@my.sliit.lk"
                  style={{ background: '#FFFFFF', borderColor: '#C8E6C9', color: '#1F2937', borderRadius: 12, height: 44 }} />
              </Form.Item>

              <Form.Item
                name="academicYear"
                label={<span style={{ color: '#4B5563', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Academic Year *</span>}
                rules={[{ required: true, message: 'Please select your academic year' }]}
              >
                <Select placeholder="Select Academic Year" className="dark-select" popupClassName="dark-dropdown">
                  <Option value="Year 1">Year 1</Option>
                  <Option value="Year 2">Year 2</Option>
                  <Option value="Year 3">Year 3</Option>
                  <Option value="Year 4">Year 4</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="requestType"
                label={<span style={{ color: '#4B5563', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Request Type *</span>}
                rules={[{ required: true, message: 'Please select a request type' }]}
              >
                <Select placeholder="Select Request Type" className="dark-select" popupClassName="dark-dropdown">
                  <Option value="University Event Request">🎓 University Event Request</Option>
                  <Option value="Club Management Request">🏛️ Club Management Request</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="description"
              label={<span style={{ color: '#4B5563', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Request Description *</span>}
              rules={[{ required: true, message: 'Please provide a description' }]}
            >
              <TextArea rows={5} placeholder="Describe the event or club management request in detail..."
                style={{ background: '#FFFFFF', borderColor: '#C8E6C9', color: '#1F2937', borderRadius: 12, resize: 'none' }} />
            </Form.Item>

            {/* Info hint */}
            <div style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: 12, padding: '12px 16px', marginBottom: 24, color: '#2E7D32', fontSize: 13 }}>
              💡 Your request will be reviewed by the event management team. You'll be notified once a decision is made.
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" size="large" block
                style={{ height: 52, background: 'linear-gradient(to right, #43A047, #4CAF50)', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 15, letterSpacing: '0.5px' }}>
                Submit Request →
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

    </div>
  );
};

export default RequestManagement;
