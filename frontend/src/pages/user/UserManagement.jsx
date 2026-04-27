import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Select, message, Modal, Tag } from 'antd';
import { mockRequests } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, Trophy } from 'lucide-react';
import { TrophyOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api from '@/lib/api';

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
  {
    icon: Trophy,
    title: 'Sports Section',
    desc: 'Browse and register for various university sports teams and upcoming trials.',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    glow: 'rgba(16,185,129,0.3)',
    tag: 'Sports',
    route: '/sports',
  },
];

const mockSports = [
  { id: 1, name: 'Cricket', season: 'Annual', registrationOpen: true },
  { id: 2, name: 'Football', season: 'Summer', registrationOpen: true },
  { id: 3, name: 'Tennis', season: 'Winter', registrationOpen: false },
  { id: 4, name: 'Swimming', season: 'Annual', registrationOpen: true },
  { id: 5, name: 'Badminton', season: 'All-Year', registrationOpen: true },
];

const clubLeaders = [
  {
    name: 'Nethmi Perera',
    role: 'President, Computing Society',
    email: 'nethmi@my.sliit.lk',
  },
  {
    name: 'Kasun Fernando',
    role: 'Secretary, Media & Arts Society',
    email: 'kasun@my.sliit.lk',
  },
];

const sisHighlights = [
  {
    label: 'Student ID',
    value: 'IT2026001',
  },
  {
    label: 'Current Semester',
    value: 'Year 2 - Semester 1',
  },
  {
    label: 'Academic Status',
    value: 'Good Standing',
  },
  {
    label: 'Next Registration Window',
    value: '2026-05-15',
  },
];

const sisPanelMembers = [
  {
    name: 'Dr. Nimal Perera',
    role: 'SIS Coordinator',
  },
  {
    name: 'Ms. Ayesha Silva',
    role: 'Academic Records Officer',
  },
  {
    name: 'Mr. Kavindu Fernando',
    role: 'Student Registration Officer',
  },
];

const RequestManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [leadersOpen, setLeadersOpen] = useState(false);
  const [sisOpen, setSisOpen] = useState(false);
  const [sportsOpen, setSportsOpen] = useState(false);
  const [userSports, setUserSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(false);

  useEffect(() => {
    if (sportsOpen) {
      fetchUserSports();
    }
  }, [sportsOpen]);

  const fetchUserSports = async () => {
    setLoadingSports(true);
    try {
      const { data } = await api.get('/api/sports/my-registrations');
      setUserSports(data);
    } catch (error) {
      console.error(error);
      // message.error('Failed to load sports registrations');
    } finally {
      setLoadingSports(false);
    }
  };

  const handleSportRegister = async (sportName) => {
    try {
      const fullName = localStorage.getItem('userName') || 'Student';
      const email = localStorage.getItem('userEmail') || '';
      
      await api.post('/api/sports/register', { 
        sport: sportName,
        fullName,
        email
      });
      message.success(`Application for ${sportName} submitted successfully and is now pending.`);
      fetchUserSports();
    } catch (error) {
      const msg = error.response?.data?.error || `Failed to register for ${sportName}`;
      message.error(msg);
    }
  };

  const getSportStatus = (sportName) => {
    const reg = userSports.find(s => s.sport === sportName);
    return reg ? reg.status : null;
  };

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
              <div
                key={title}
                onClick={() => {
                  if (route === '/club-leaders') {
                    setLeadersOpen(true);
                    return;
                  }
                  if (route === '/sis') {
                    setSisOpen(true);
                    return;
                  }
                  if (route === '/sports') {
                    setSportsOpen(true);
                    return;
                  }
                  navigate(route);
                }}
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

      <Modal
        title="Club & Society Leaders"
        open={leadersOpen}
        onCancel={() => setLeadersOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setLeadersOpen(false)} style={{ background: '#4CAF50', borderColor: '#43A047' }}>
            Close
          </Button>,
        ]}
      >
        <div style={{ display: 'grid', gap: 14 }}>
          {clubLeaders.map((leader) => (
            <div
              key={leader.email}
              style={{
                border: '1px solid #C8E6C9',
                borderRadius: 16,
                padding: '16px 18px',
                background: '#F7FCF7',
              }}
            >
              <div style={{ color: '#1F2937', fontWeight: 700, fontSize: 16 }}>{leader.name}</div>
              <div style={{ color: '#2E7D32', fontWeight: 600, marginTop: 4 }}>{leader.role}</div>
              <div style={{ color: '#64748B', marginTop: 6 }}>{leader.email}</div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        title="Student Information System"
        open={sisOpen}
        onCancel={() => setSisOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSisOpen(false)} style={{ background: '#F59E0B', borderColor: '#D97706' }}>
            Close
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16, color: '#64748B', lineHeight: 1.7 }}>
          Access important academic details including records, semester progress, and registration updates from the SIS portal.
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {sisHighlights.map((item) => (
            <div
              key={item.label}
              style={{
                border: '1px solid #FCD34D',
                borderRadius: 16,
                padding: '16px 18px',
                background: '#FFF7ED',
              }}
            >
              <div style={{ color: '#92400E', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {item.label}
              </div>
              <div style={{ color: '#1F2937', fontWeight: 700, fontSize: 16, marginTop: 6 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ color: '#92400E', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            SIS Panel Members
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {sisPanelMembers.map((member) => (
              <div
                key={member.name}
                style={{
                  border: '1px solid #FCD34D',
                  borderRadius: 16,
                  padding: '14px 18px',
                  background: '#FFFFFF',
                }}
              >
                <div style={{ color: '#1F2937', fontWeight: 700, fontSize: 15 }}>
                  {member.name}
                </div>
                <div style={{ color: '#92400E', marginTop: 4, fontWeight: 600 }}>
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrophyOutlined style={{ color: '#10B981' }} />
            <span>Sports Registration Portal</span>
          </span>
        }
        open={sportsOpen}
        onCancel={() => setSportsOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSportsOpen(false)} style={{ background: '#10B981', borderColor: '#059669' }}>
            Close
          </Button>,
        ]}
        width={600}
      >
        <div style={{ marginBottom: 20, color: '#64748B', fontSize: 13, background: '#ECFDF5', padding: '10px 14px', borderRadius: 10, border: '1px solid #D1FAE5' }}>
          🏅 Select a sport from the list below and click the registration button to join the team or trial sessions.
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {mockSports.map((sport) => {
            const sportReg = userSports.find(s => s.sport === sport.name);
            const status = sportReg ? sportReg.status : null;
            return (
              <div
                key={sport.id}
                style={{
                  border: '1px solid #D1FAE5',
                  borderRadius: 16,
                  padding: '16px 20px',
                  background: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.05)'
                }}
              >
                <div>
                  <div style={{ color: '#1F2937', fontWeight: 700, fontSize: 16 }}>{sport.name}</div>
                  <div style={{ color: '#059669', fontSize: 12, fontWeight: 600, marginTop: 2 }}>{sport.season} Season</div>
                </div>
                
                {status ? (
                  <div style={{ textAlign: 'right' }}>
                    <Tag 
                      icon={status === 'Approved' ? <CheckCircleOutlined /> : status === 'Pending' ? <ClockCircleOutlined /> : <CloseCircleOutlined />} 
                      color={status === 'Approved' ? 'success' : status === 'Pending' ? 'processing' : 'error'}
                      style={{ borderRadius: 6, padding: '4px 8px', fontWeight: 600 }}
                    >
                      {status === 'Rejected' ? 'CANCELLED' : status.toUpperCase()}
                    </Tag>
                    {status === 'Approved' && sportReg.scheduledDate && (
                      <div style={{ marginTop: 8, fontSize: 11, color: '#059669', fontWeight: 700, background: '#F0FDF4', padding: '4px 8px', borderRadius: 6, border: '1px solid #DCFCE7' }}>
                        📅 Trial: {sportReg.scheduledDate} @ {sportReg.scheduledTime}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    type="primary"
                    disabled={!sport.registrationOpen}
                    onClick={() => handleSportRegister(sport.name)}
                    style={{
                      background: sport.registrationOpen ? '#10B981' : '#E5E7EB',
                      borderColor: sport.registrationOpen ? '#10B981' : '#E5E7EB',
                      borderRadius: 8,
                      fontWeight: 600
                    }}
                  >
                    {sport.registrationOpen ? 'Register Now' : 'Closed'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Modal>

    </div>
  );
};

export default RequestManagement;
