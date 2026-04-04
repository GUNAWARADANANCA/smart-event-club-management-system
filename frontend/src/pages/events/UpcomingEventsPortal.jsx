import React, { useState } from 'react';
import { Row, Col, Typography, Button, Modal, Form, Input, Tag, message, Space, Select, Empty } from 'antd';
import { CalendarOutlined, TeamOutlined, EnvironmentOutlined, SearchOutlined, ClockCircleOutlined, UserOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockEvents, mockMyEvents } from '@/data/mockData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const UpcomingEventsPortal = () => {
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState(mockEvents);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAudience, setFilterAudience] = useState('All');
  const [filterMode, setFilterMode] = useState('All');
  const [sortBy, setSortBy] = useState('Date');

  const getEventStatus = (event) => {
    const isFull = event.registeredCount >= event.capacity;
    const isPastDL = new Date(event.deadline) < new Date('2026-03-21');
    if (isFull) return { label: 'Event Full', color: '#EF4444', bg: '#EF444422' };
    if (isPastDL) return { label: 'Registration Closed', color: '#64748B', bg: '#64748B22' };
    return { label: 'Registration Open', color: '#22c55e', bg: '#22c55e22' };
  };

  const publishedEvents = eventsData.filter(e => e.status === 'Approved');
  const featuredEvents = publishedEvents.filter(e => e.featured);

  let filteredEvents = publishedEvents.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (e.organizer && e.organizer.toLowerCase().includes(searchText.toLowerCase())) ||
      (e.description && e.description.toLowerCase().includes(searchText.toLowerCase()));
    const matchCat = filterCategory === 'All' || e.category === filterCategory;
    const matchAud = filterAudience === 'All' || e.audience === filterAudience || (filterAudience === 'University Students Only' && e.audience?.includes('University'));
    const matchMode = filterMode === 'All' || e.mode === filterMode;
    return matchSearch && matchCat && matchAud && matchMode && !e.featured;
  });

  if (sortBy === 'Date') filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (sortBy === 'Popularity') filteredEvents.sort((a, b) => b.registeredCount - a.registeredCount);
  else if (sortBy === 'Closing Soon') filteredEvents.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const handleRegisterClick = (event) => { setSelectedEvent(event); form.resetFields(); setIsModalVisible(true); };
  const handleViewDetails = (event) => { setSelectedEvent(event); setIsDetailsVisible(true); };

  const onFinishRegistration = (values) => {
    const eventIndex = eventsData.findIndex(e => e.id === selectedEvent.id);
    if (eventIndex > -1) {
      const updatedEvents = [...eventsData];
      updatedEvents[eventIndex].registeredCount += 1;
      setEventsData(updatedEvents);
      mockMyEvents.push({ ...updatedEvents[eventIndex], registrationDate: '2026-03-21' });
    }
    const generatedTicketId = Math.floor(100000 + Math.random() * 900000).toString();
    message.success(`Successfully registered for ${selectedEvent.title}!`);
    setIsModalVisible(false);
    setIsDetailsVisible(false);
    navigate('/finance/ticket', {
      state: {
        ticket: {
          eventName: selectedEvent.title,
          passType: selectedEvent.audience?.includes('University') ? 'Student Pass' : 'General Admission Pass',
          attendeeName: values.fullName,
          date: selectedEvent.date,
          venue: selectedEvent.venue,
          ticketId: generatedTicketId
        }
      }
    });
  };

  const categoryColors = { Academic: '#6366f1', Sports: '#f59e0b', Cultural: '#ec4899', Workshop: '#4CAF50', default: '#6B7280' };

  const renderEventCard = (event, isFeatured = false) => {
    const status = getEventStatus(event);
    const seatsLeft = event.capacity - event.registeredCount;
    const isDisabled = status.label !== 'Registration Open';
    const catColor = categoryColors[event.category] || categoryColors.default;
    const fillPct = Math.round((event.registeredCount / event.capacity) * 100);

    return (
      <Col xs={24} sm={isFeatured ? 24 : 12} lg={isFeatured ? 12 : 8} key={event.id}>
        <div style={{
          background: '#FFFFFF',
          border: `1px solid ${isFeatured ? '#F9731633' : 'rgba(200, 230, 201, 0.9)'}`,
          borderRadius: 20,
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {/* Top accent bar */}
          <div style={{ height: 4, background: `linear-gradient(to right, ${catColor}, #4CAF50)` }} />

          <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Status + category row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ background: status.bg, color: status.color, borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>
                {status.label}
              </span>
              <span style={{ background: `${catColor}22`, color: catColor, borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>
                {event.category}
              </span>
            </div>

            {/* Title */}
            <div style={{ color: '#1F2937', fontWeight: 800, fontSize: isFeatured ? 20 : 16, lineHeight: 1.3, marginBottom: 8 }}>
              {event.title}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              <span style={{ background: '#43A04722', color: '#4CAF50', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
                {event.audience?.includes('University') ? '🎓 University Only' : '🌐 Open to All'}
              </span>
              <span style={{ background: '#F9731622', color: '#F97316', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
                {event.mode}
              </span>
            </div>

            {/* Description */}
            <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {event.description}
            </p>

            {/* Info rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              <span style={{ color: '#CBD5E1', fontSize: 13 }}><CalendarOutlined style={{ color: '#4CAF50', marginRight: 6 }} />{event.date} · {event.time}</span>
              <span style={{ color: '#CBD5E1', fontSize: 13 }}><EnvironmentOutlined style={{ color: '#4CAF50', marginRight: 6 }} />{event.venue}</span>
              <span style={{ color: '#CBD5E1', fontSize: 13 }}><TeamOutlined style={{ color: '#F97316', marginRight: 6 }} />{event.organizer}</span>
              <span style={{ color: '#CBD5E1', fontSize: 13 }}><ClockCircleOutlined style={{ color: '#f59e0b', marginRight: 6 }} />Deadline: {event.deadline}</span>
            </div>

            {/* Seat progress */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#64748B', fontSize: 11 }}>🪑 {seatsLeft > 0 ? `${seatsLeft} seats left` : 'No seats available'}</span>
                <span style={{ color: '#64748B', fontSize: 11 }}>{fillPct}% filled</span>
              </div>
              <div style={{ background: '#FAFAFA', borderRadius: 999, height: 5 }}>
                <div style={{ width: `${fillPct}%`, height: '100%', borderRadius: 999, background: fillPct >= 90 ? '#EF4444' : '#4CAF50', transition: 'width 0.4s' }} />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
              <button onClick={() => handleViewDetails(event)}
                style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: '1px solid #C8E6C9', background: 'transparent', color: '#6B7280', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                View Details
              </button>
              <button onClick={() => !isDisabled && handleRegisterClick(event)}
                style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: isDisabled ? '#EEEEEE' : 'linear-gradient(to right, #4CAF50, #43A047)', color: isDisabled ? '#9E9E9E' : '#FFFFFF', fontWeight: 700, fontSize: 13, cursor: isDisabled ? 'not-allowed' : 'pointer', border: isDisabled ? '1px solid #C8E6C9' : 'none' }}>
                {isDisabled ? status.label : 'Register →'}
              </button>
            </div>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh', padding: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-block', background: '#4CAF5022', border: '1px solid #4CAF5044', borderRadius: 999, padding: '4px 16px', color: '#4CAF50', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
          Live Now
        </div>
        <Title level={2} style={{ color: '#1F2937', margin: 0, marginBottom: 8 }}>Upcoming Events Portal</Title>
        <Text style={{ color: '#64748B', fontSize: 15 }}>Discover, explore, and instantly register for the latest university events.</Text>
      </div>

      {/* Featured */}
      {featuredEvents.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <StarOutlined style={{ color: '#f59e0b', fontSize: 18 }} />
            <span style={{ color: '#1F2937', fontWeight: 700, fontSize: 16 }}>Featured Events</span>
          </div>
          <Row gutter={[20, 20]}>
            {featuredEvents.map(event => renderEventCard(event, true))}
          </Row>
        </div>
      )}

      {/* Filters */}
      <div style={{ background: '#FFFFFF', border: '1px solid rgba(200, 230, 201, 0.9)', borderRadius: 16, padding: '16px 20px', marginBottom: 32 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={8}>
            <div style={{ position: 'relative' }}>
              <SearchOutlined style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9E9E9E', zIndex: 1 }} />
              <input
                placeholder="Search events, organizers..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: '100%', background: '#FAFAFA', border: '1px solid #C8E6C9', borderRadius: 10, padding: '10px 12px 10px 36px', color: '#1F2937', fontSize: 14, outline: 'none' }}
              />
            </div>
          </Col>
          {[
            { value: filterCategory, setter: setFilterCategory, options: ['All Categories', 'Academic', 'Sports', 'Cultural', 'Workshop'], map: v => v === 'All Categories' ? 'All' : v },
            { value: filterAudience, setter: setFilterAudience, options: ['All Audience', 'University Students Only', 'Open to All'], map: v => v === 'All Audience' ? 'All' : v },
            { value: filterMode, setter: setFilterMode, options: ['All Modes', 'Physical', 'Online', 'Hybrid'], map: v => v === 'All Modes' ? 'All' : v },
            { value: sortBy, setter: setSortBy, options: ['Sort by Date', 'Sort by Popularity', 'Sort by Closing Soon'], map: v => v.replace('Sort by ', '') },
          ].map((f, i) => (
            <Col xs={12} md={4} key={i}>
              <select
                value={f.options.find(o => f.map(o) === f.value) || f.options[0]}
                onChange={e => f.setter(f.map(e.target.value))}
                style={{ width: '100%', background: '#FAFAFA', border: '1px solid #C8E6C9', borderRadius: 10, padding: '10px 12px', color: '#1F2937', fontSize: 13, outline: 'none', cursor: 'pointer' }}
              >
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Col>
          ))}
        </Row>
      </div>

      {/* All Events */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <CalendarOutlined style={{ color: '#4CAF50', fontSize: 18 }} />
        <span style={{ color: '#1F2937', fontWeight: 700, fontSize: 16 }}>All Events</span>
        <span style={{ background: '#4CAF5022', color: '#4CAF50', borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{filteredEvents.length}</span>
      </div>

      {filteredEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9E9E9E', border: '2px dashed #C8E6C9', borderRadius: 16, background: '#FFFFFF' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No events found matching your criteria.</div>
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          {filteredEvents.map(event => renderEventCard(event, false))}
        </Row>
      )}

      {/* Details Modal */}
      <Modal
        title={<span style={{ color: '#1F2937', fontSize: 18, fontWeight: 800 }}>{selectedEvent?.title}</span>}
        open={isDetailsVisible}
        onCancel={() => setIsDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailsVisible(false)} style={{ borderColor: '#C8E6C9', color: '#6B7280' }}>Close</Button>,
          <Button key="register" type="primary" disabled={selectedEvent && getEventStatus(selectedEvent).label !== 'Registration Open'}
            onClick={() => { setIsDetailsVisible(false); handleRegisterClick(selectedEvent); }}
            style={{ background: '#4CAF50', borderColor: '#4CAF50' }}>
            {selectedEvent ? (getEventStatus(selectedEvent).label !== 'Registration Open' ? getEventStatus(selectedEvent).label : 'Register Now') : 'Register'}
          </Button>
        ]}
        width={700}
        className="dark-modal"
      >
        {selectedEvent && (
          <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              <span style={{ background: '#4CAF5022', color: '#4CAF50', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>{selectedEvent.audience}</span>
              <span style={{ background: '#F9731622', color: '#F97316', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>{selectedEvent.mode}</span>
              <span style={{ background: '#6366f122', color: '#6366f1', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>{selectedEvent.category}</span>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p style={{ color: '#6B7280', margin: '0 0 12px' }}><CalendarOutlined style={{ color: '#4CAF50', marginRight: 6 }} /><strong style={{ color: '#1F2937' }}>Date & Time</strong><br /><span style={{ paddingLeft: 20 }}>{selectedEvent.date} @ {selectedEvent.time}</span></p>
                <p style={{ color: '#6B7280', margin: '0 0 12px' }}><EnvironmentOutlined style={{ color: '#4CAF50', marginRight: 6 }} /><strong style={{ color: '#1F2937' }}>Venue</strong><br /><span style={{ paddingLeft: 20 }}>{selectedEvent.venue}</span></p>
                <p style={{ color: '#6B7280', margin: 0 }}><TeamOutlined style={{ color: '#F97316', marginRight: 6 }} /><strong style={{ color: '#1F2937' }}>Organizer</strong><br /><span style={{ paddingLeft: 20 }}>{selectedEvent.organizer}</span></p>
              </Col>
              <Col span={12}>
                <p style={{ color: '#6B7280', margin: '0 0 12px' }}><ClockCircleOutlined style={{ color: '#f59e0b', marginRight: 6 }} /><strong style={{ color: '#1F2937' }}>Registration Deadline</strong><br /><span style={{ paddingLeft: 20 }}>{selectedEvent.deadline}</span></p>
                <p style={{ color: '#6B7280', margin: '0 0 12px' }}><strong style={{ color: '#1F2937' }}>🪑 Seats Available</strong><br /><span style={{ paddingLeft: 20 }}>{selectedEvent.capacity - selectedEvent.registeredCount} / {selectedEvent.capacity}</span></p>
              </Col>
            </Row>
            <div style={{ marginTop: 20, padding: 16, background: '#F7FCF7', borderRadius: 12, border: '1px solid #C8E6C9' }}>
              <div style={{ color: '#1F2937', fontWeight: 700, marginBottom: 8 }}>About This Event</div>
              <p style={{ color: '#6B7280', margin: 0, lineHeight: 1.7 }}>{selectedEvent.description}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Registration Modal */}
      <Modal
        title={<span style={{ color: '#1F2937' }}>Register for {selectedEvent?.title}</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="dark-modal"
      >
        <div style={{ background: '#FAFAFA', borderRadius: 10, padding: '10px 14px', marginBottom: 20, color: '#6B7280', fontSize: 13 }}>
          {selectedEvent?.audience?.includes('University')
            ? '🔒 Restricted to university students. A valid student email is required.'
            : '🌐 This event is open to all. Everyone is welcome!'}
        </div>
        <Form form={form} layout="vertical" onFinish={onFinishRegistration}>
          <Form.Item name="fullName" label={<span style={{ color: '#6B7280' }}>Full Name</span>}
            rules={[{ required: true }, { pattern: /^[A-Za-z\s]+$/, message: 'Letters only' }, { pattern: /^[A-Z]/, message: 'Must start with a capital letter' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="email" label={<span style={{ color: '#6B7280' }}>Email Address</span>}
            rules={[{ required: true }, { type: 'email' }, {
              validator: (_, value) => {
                if (value && selectedEvent?.audience?.includes('University')) {
                  if (!value.endsWith('@my.sliit.lk') && !value.endsWith('@sliit.lk'))
                    return Promise.reject('Restricted! Use @my.sliit.lk or @sliit.lk');
                }
                return Promise.resolve();
              }
            }]}>
            <Input size="large" placeholder={selectedEvent?.audience?.includes('University') ? 'student@my.sliit.lk' : 'example@gmail.com'} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 20 }}>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#4CAF50', borderColor: '#4CAF50', height: 48, fontWeight: 700 }}>
              Confirm Registration →
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default UpcomingEventsPortal;
