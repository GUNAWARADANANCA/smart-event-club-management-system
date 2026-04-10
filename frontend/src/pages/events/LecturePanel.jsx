import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Row, Col } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined, ReadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const lectures = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    lecturer: 'Dr. Sarah Johnson',
    lecturerInitials: 'SJ',
    lecturerTitle: 'Senior Lecturer · Computer Science',
    department: 'Computer Science',
    date: '2026-04-10',
    time: '10:00 AM – 12:00 PM',
    venue: 'Lecture Hall A',
    seats: 80,
    registered: 45,
    description: 'A comprehensive introduction to ML concepts, algorithms, and real-world applications. Covers supervised, unsupervised learning, neural networks, and model evaluation.',
    tags: ['AI', 'CS', 'Beginner'],
    color: '#6366F1',
    avatarBg: 'linear-gradient(135deg, #6366F1, #4F46E5)',
  },
  {
    id: 2,
    title: 'Advanced Data Structures',
    lecturer: 'Prof. Alan Turing',
    lecturerInitials: 'AT',
    lecturerTitle: 'Professor · Software Engineering',
    department: 'Software Engineering',
    date: '2026-04-14',
    time: '02:00 PM – 04:00 PM',
    venue: 'Room 302',
    seats: 50,
    registered: 50,
    description: 'Deep dive into trees, graphs, heaps, and their algorithmic applications. Includes complexity analysis and real-world problem solving.',
    tags: ['DSA', 'SE', 'Advanced'],
    color: '#EC4899',
    avatarBg: 'linear-gradient(135deg, #EC4899, #BE185D)',
  },
  {
    id: 3,
    title: 'Cloud Architecture & DevOps',
    lecturer: 'Dr. Priya Nair',
    lecturerInitials: 'PN',
    lecturerTitle: 'Associate Professor · IT',
    department: 'Information Technology',
    date: '2026-04-18',
    time: '09:00 AM – 11:00 AM',
    venue: 'IT Lab 1',
    seats: 40,
    registered: 22,
    description: 'Explore cloud-native design patterns, CI/CD pipelines, and container orchestration using Docker and Kubernetes.',
    tags: ['Cloud', 'DevOps', 'IT'],
    color: '#4CAF50',
    avatarBg: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    lecturer: 'Ms. Kavya Sharma',
    lecturerInitials: 'KS',
    lecturerTitle: 'Lecturer · Design & Media',
    department: 'Design & Media',
    date: '2026-04-22',
    time: '01:00 PM – 03:00 PM',
    venue: 'Design Studio B',
    seats: 35,
    registered: 18,
    description: 'Learn the fundamentals of user-centered design, wireframing, prototyping, and usability testing with Figma.',
    tags: ['Design', 'UX', 'Creative'],
    color: '#F59E0B',
    avatarBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
  },
  {
    id: 5,
    title: 'Cybersecurity Fundamentals',
    lecturer: 'Dr. Rajan Mehta',
    lecturerInitials: 'RM',
    lecturerTitle: 'Senior Lecturer · Computer Science',
    department: 'Computer Science',
    date: '2026-04-25',
    time: '10:00 AM – 12:00 PM',
    venue: 'Security Lab',
    seats: 45,
    registered: 30,
    description: 'Introduction to ethical hacking, network security, threat analysis, and best practices for securing modern systems.',
    tags: ['Security', 'CS', 'Intermediate'],
    color: '#22C55E',
    avatarBg: 'linear-gradient(135deg, #22C55E, #15803D)',
  },
  {
    id: 6,
    title: 'Entrepreneurship & Startups',
    lecturer: 'Prof. Dilshan Perera',
    lecturerInitials: 'DP',
    lecturerTitle: 'Professor · Business School',
    department: 'Business School',
    date: '2026-04-28',
    time: '03:00 PM – 05:00 PM',
    venue: 'Auditorium C',
    seats: 100,
    registered: 67,
    description: 'From idea to MVP — learn how to build, pitch, and scale a startup. Covers lean methodology, funding, and go-to-market strategy.',
    tags: ['Business', 'Startup', 'All Years'],
    color: '#F97316',
    avatarBg: 'linear-gradient(135deg, #F97316, #C2410C)',
  },
];

const LecturePanel = () => {
  const navigate = useNavigate();
  const [lectureData, setLectureData] = useState(lectures);
  const [selected, setSelected] = useState(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [becomeLecturerOpen, setBecomeLecturerOpen] = useState(false);
  const [lecturerForm] = Form.useForm();
  const [form] = Form.useForm();

  const handleRegister = (lecture) => {
    setSelected(lecture);
    form.resetFields();
    setViewOpen(false);
    setRegisterOpen(true);
  };

  const handleView = (lecture) => {
    setSelected(lecture);
    setViewOpen(true);
  };

  const onFinish = () => {
    setLectureData(prev =>
      prev.map(l => l.id === selected.id ? { ...l, registered: l.registered + 1 } : l)
    );
    message.success(`Registered for "${selected.title}" successfully!`);
    setRegisterOpen(false);
  };

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh', padding: '0' }}>

      {/* Top Nav */}
      <nav style={{ background: '#FAFAFA', border: '1px solid rgba(200, 230, 201, 0.9)', borderRadius: 24, padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px', position: 'sticky', top: 16, zIndex: 50 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, background: 'linear-gradient(to right, #2E7D32, #4CAF50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
          Lecture Panel
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748B' }}>
          {['News', 'Meetings', 'Gallery', 'Ticket Sales'].map(item => (
            <span key={item}
              onClick={() => navigate(`/${item.toLowerCase().replace(' ', '-')}`)}
              style={{ cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.color = '#2E7D32'}
              onMouseLeave={e => e.target.style.color = '#64748B'}
            >{item}</span>
          ))}
          <span style={{ color: '#6366F1', borderBottom: '2px solid #6366F1', paddingBottom: 2 }}>Users</span>
          <button
            onClick={() => setBecomeLecturerOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              border: 'none', borderRadius: 10,
              padding: '9px 18px', color: '#FFFFFF',
              fontWeight: 700, fontSize: 12, cursor: 'pointer',
              letterSpacing: '0.5px', textTransform: 'none',
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)'; }}
          >
            🎓 Become a Lecturer
          </button>
        </div>
      </nav>

      <div style={{ padding: '0 32px 48px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', margin: '40px 0 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#6366F122', border: '1px solid #6366F144', borderRadius: 999, padding: '4px 16px', color: '#6366F1', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>
            <ReadOutlined /> Academic Sessions
          </div>
          <h2 style={{ color: '#1F2937', fontSize: 48, fontWeight: 900, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '-1px' }}>
            University <span style={{ background: 'linear-gradient(to right, #6366F1, #4CAF50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lectures</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: 16, margin: 0 }}>
            Browse and register for upcoming academic sessions hosted by faculty.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Lectures', value: lectureData.length, color: '#6366F1' },
            { label: 'Open Seats', value: lectureData.reduce((a, l) => a + (l.seats - l.registered), 0), color: '#22C55E' },
            { label: 'Departments', value: [...new Set(lectureData.map(l => l.department))].length, color: '#4CAF50' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#FFFFFF', border: '1px solid rgba(200, 230, 201, 0.85)', borderRadius: 16, padding: '16px 32px', textAlign: 'center' }}>
              <div style={{ color, fontSize: 28, fontWeight: 900 }}>{value}</div>
              <div style={{ color: '#64748B', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <Row gutter={[24, 24]}>
          {lectureData.map(lecture => {
            const isFull = lecture.registered >= lecture.seats;
            const fillPct = Math.round((lecture.registered / lecture.seats) * 100);
            const seatsLeft = lecture.seats - lecture.registered;

            return (
              <Col xs={24} md={12} lg={8} key={lecture.id}>
                <div style={{
                  background: '#FFFFFF', border: '1px solid rgba(200, 230, 201, 0.85)',
                  borderRadius: 24, overflow: 'hidden', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${lecture.color}33`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ height: 4, background: `linear-gradient(to right, ${lecture.color}, #FAFAFA)` }} />

                  <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                    {/* Status + dept */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ background: isFull ? '#EF444422' : '#22C55E22', color: isFull ? '#EF4444' : '#22C55E', borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>
                        {isFull ? 'Fully Booked' : 'Open'}
                      </span>
                      <span style={{ background: `${lecture.color}22`, color: lecture.color, borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>
                        {lecture.department}
                      </span>
                    </div>

                    {/* Lecturer photo + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 14px', background: '#F7FCF7', borderRadius: 14, border: '1px solid #C8E6C9' }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: lecture.avatarBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 900, color: '#FFFFFF',
                        flexShrink: 0, boxShadow: `0 0 0 3px ${lecture.color}33`,
                      }}>
                        {lecture.lecturerInitials}
                      </div>
                      <div>
                        <div style={{ color: '#1F2937', fontWeight: 700, fontSize: 14 }}>{lecture.lecturer}</div>
                        <div style={{ color: '#64748B', fontSize: 11, marginTop: 2 }}>{lecture.lecturerTitle}</div>
                      </div>
                    </div>

                    {/* Title */}
                    <div style={{ color: '#1F2937', fontWeight: 800, fontSize: 16, lineHeight: 1.3, marginBottom: 10 }}>
                      {lecture.title}
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                      {lecture.tags.map(tag => (
                        <span key={tag} style={{ background: `${lecture.color}18`, color: lecture.color, borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                      <span style={{ color: '#4B5563', fontSize: 13 }}><CalendarOutlined style={{ color: '#6366F1', marginRight: 7 }} />{lecture.date} · {lecture.time}</span>
                      <span style={{ color: '#4B5563', fontSize: 13 }}><EnvironmentOutlined style={{ color: '#4CAF50', marginRight: 7 }} />{lecture.venue}</span>
                    </div>

                    {/* Seat progress */}
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ color: '#64748B', fontSize: 11 }}>🪑 {isFull ? 'No seats available' : `${seatsLeft} seats left`}</span>
                        <span style={{ color: '#64748B', fontSize: 11 }}>{fillPct}% filled</span>
                      </div>
                      <div style={{ background: '#E8F5E9', borderRadius: 999, height: 5 }}>
                        <div style={{ width: `${fillPct}%`, height: '100%', borderRadius: 999, background: fillPct >= 90 ? '#EF4444' : lecture.color, transition: 'width 0.4s' }} />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ marginTop: 'auto' }}>
                      <button
                        onClick={() => handleView(lecture)}
                        style={{ width: '100%', padding: '11px 0', borderRadius: 12, border: `1px solid ${lecture.color}55`, background: 'transparent', color: lecture.color, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                      >
                        View Lecture
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* View Lecture Modal */}
      {selected && (
        <Modal
          open={viewOpen}
          onCancel={() => setViewOpen(false)}
          footer={null}
          width={620}
          className="dark-modal"
          title={null}
        >
          {/* Accent bar */}
          <div style={{ height: 4, background: `linear-gradient(to right, ${selected.color}, #FAFAFA)`, margin: '-20px -24px 24px', borderRadius: '8px 8px 0 0' }} />

          {/* Lecturer profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '16px', background: '#F7FCF7', borderRadius: 16, border: '1px solid #C8E6C9' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: selected.avatarBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 900, color: '#FFFFFF', flexShrink: 0,
              boxShadow: `0 0 0 4px ${selected.color}33`,
            }}>
              {selected.lecturerInitials}
            </div>
            <div>
              <div style={{ color: '#1F2937', fontWeight: 800, fontSize: 18 }}>{selected.lecturer}</div>
              <div style={{ color: '#64748B', fontSize: 13, marginTop: 3 }}>{selected.lecturerTitle}</div>
              <span style={{ background: `${selected.color}22`, color: selected.color, borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 700, display: 'inline-block', marginTop: 6 }}>
                {selected.department}
              </span>
            </div>
          </div>

          {/* Title */}
          <div style={{ color: '#1F2937', fontWeight: 900, fontSize: 22, marginBottom: 10 }}>{selected.title}</div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {selected.tags.map(tag => (
              <span key={tag} style={{ background: `${selected.color}18`, color: selected.color, borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>{tag}</span>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: '#F7FCF7', borderRadius: 12, padding: '14px 16px', marginBottom: 20, border: '1px solid #C8E6C9' }}>
            <div style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.7 }}>{selected.description}</div>
          </div>

          {/* Details grid */}
          <Row gutter={[12, 12]} style={{ marginBottom: 8 }}>
            {[
              { icon: <CalendarOutlined />, label: 'Date & Time', value: `${selected.date} · ${selected.time}`, color: '#6366F1' },
              { icon: <EnvironmentOutlined />, label: 'Venue', value: selected.venue, color: '#4CAF50' },
              { icon: <TeamOutlined />, label: 'Seats Left', value: `${selected.seats - selected.registered} / ${selected.seats}`, color: '#F59E0B' },
            ].map(({ icon, label, value, color }) => (
              <Col span={8} key={label}>
                <div style={{ background: '#F7FCF7', borderRadius: 12, padding: '12px 14px', border: '1px solid #C8E6C9', textAlign: 'center' }}>
                  <div style={{ color, fontSize: 18, marginBottom: 4 }}>{icon}</div>
                  <div style={{ color: '#64748B', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                  <div style={{ color: '#1F2937', fontSize: 13, fontWeight: 600 }}>{value}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Modal>
      )}

      {/* Registration Modal */}
      <Modal
        title={<span style={{ color: '#1F2937' }}>Register — {selected?.title}</span>}
        open={registerOpen}
        onCancel={() => setRegisterOpen(false)}
        footer={null}
        className="dark-modal"
      >
        <div style={{ background: '#E8F5E9', borderRadius: 10, padding: '10px 14px', marginBottom: 20, color: '#2E7D32', fontSize: 13, border: '1px solid #C8E6C9' }}>
          🔒 Restricted to university students. A valid university email is required.
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="fullName" label={<span style={{ color: '#4B5563' }}>Full Name</span>}
            rules={[{ required: true }, { pattern: /^[A-Za-z\s]+$/, message: 'Letters only' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="email" label={<span style={{ color: '#4B5563' }}>University Email</span>}
            rules={[{ required: true }, { type: 'email' }, {
              validator: (_, value) =>
                value && !value.endsWith('@my.sliit.lk') && !value.endsWith('@sliit.lk')
                  ? Promise.reject('Use your university email (@my.sliit.lk or @sliit.lk)')
                  : Promise.resolve()
            }]}>
            <Input size="large" placeholder="student@my.sliit.lk" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 20 }}>
            <Button type="primary" htmlType="submit" size="large" block
              style={{ background: '#6366F1', borderColor: '#6366F1', height: 48, fontWeight: 700 }}>
              Confirm Registration →
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Become a Lecturer Modal */}
      <Modal
        title={<span style={{ color: '#1F2937', fontSize: 18, fontWeight: 800 }}>🎓 Become a Lecturer</span>}
        open={becomeLecturerOpen}
        onCancel={() => { setBecomeLecturerOpen(false); lecturerForm.resetFields(); }}
        footer={null}
        width={560}
        className="dark-modal"
      >
        <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>
          Share your expertise with students. Fill in the form and our academic team will review your application.
        </p>
        <Form form={lecturerForm} layout="vertical" onFinish={async (values) => {
          try {
            const response = await fetch('/api/lecturer-requests', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            });

            if (response.ok) {
              message.success('Application submitted! We\'ll be in touch soon.');
              setBecomeLecturerOpen(false);
              lecturerForm.resetFields();
            } else {
              const errorData = await response.json();
              message.error(errorData.error || 'Failed to submit application');
            }
          } catch (error) {
            console.error('Error submitting lecturer request:', error);
            message.error('Failed to submit application. Please try again.');
          }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="fullName" label={<span style={{ color: '#4B5563' }}>Full Name</span>}
              rules={[{ required: true }]}>
              <Input size="large" placeholder="Dr. John Smith" />
            </Form.Item>
            <Form.Item name="email" label={<span style={{ color: '#4B5563' }}>University Email</span>}
              rules={[{ required: true }, { type: 'email' }]}>
              <Input size="large" placeholder="lecturer@sliit.lk" />
            </Form.Item>
            <Form.Item name="department" label={<span style={{ color: '#4B5563' }}>Department</span>}
              rules={[{ required: true }]}>
              <Input size="large" placeholder="e.g. Computer Science" />
            </Form.Item>
            <Form.Item name="subject" label={<span style={{ color: '#4B5563' }}>Subject / Topic</span>}
              rules={[{ required: true }]}>
              <Input size="large" placeholder="e.g. Machine Learning" />
            </Form.Item>
          </div>
          <Form.Item name="bio" label={<span style={{ color: '#4B5563' }}>Short Bio</span>}
            rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Tell us about your academic background and expertise..." style={{ background: '#FFFFFF', borderColor: '#C8E6C9', color: '#1F2937', borderRadius: 10, resize: 'none' }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Button type="primary" htmlType="submit" size="large" block
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', borderColor: '#6366F1', height: 48, fontWeight: 700, fontSize: 15 }}>
              Submit Application →
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default LecturePanel;
