import React, { useState } from 'react';
import { Row, Col, Card, Typography, Button, Modal, Form, Input, Tag, message, Space, Select, Empty, Badge } from 'antd';
import { CalendarOutlined, TeamOutlined, EnvironmentOutlined, SearchOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockEvents, mockMyEvents } from '../mockData';

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
    if (isFull) return { label: 'Event Full', color: 'red' };
    if (isPastDL) return { label: 'Registration Closed', color: 'gray' };
    return { label: 'Registration Open', color: 'green' };
  };

  const publishedEvents = eventsData.filter(e => e.status === 'Approved');
  const featuredEvents = publishedEvents.filter(e => e.featured);

  let filteredEvents = publishedEvents.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchText.toLowerCase()) || 
                        (e.organizer && e.organizer.toLowerCase().includes(searchText.toLowerCase())) ||
                        (e.description && e.description.toLowerCase().includes(searchText.toLowerCase()));
    const matchCat = filterCategory === 'All' ? true : e.category === filterCategory;
    const matchAud = filterAudience === 'All' ? true : e.audience === filterAudience || (filterAudience === 'University Students Only' && e.audience?.includes('University'));
    const matchMode = filterMode === 'All' ? true : e.mode === filterMode;
    return matchSearch && matchCat && matchAud && matchMode && !e.featured; 
  });

  if (sortBy === 'Date') {
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === 'Popularity') {
    filteredEvents.sort((a, b) => b.registeredCount - a.registeredCount);
  } else if (sortBy === 'Closing Soon') {
    filteredEvents.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailsVisible(true);
  };

  const onFinishRegistration = (values) => {
    const eventIndex = eventsData.findIndex(e => e.id === selectedEvent.id);
    if (eventIndex > -1) {
      const updatedEvents = [...eventsData];
      updatedEvents[eventIndex].registeredCount += 1;
      setEventsData(updatedEvents);
      mockMyEvents.push({ ...updatedEvents[eventIndex], registrationDate: '2026-03-21' });
    }
    
    // Generate a random ticket ID
    const generatedTicketId = Math.floor(100000 + Math.random() * 900000).toString();
    
    message.success(`Successfully registered for ${selectedEvent.title}!`);
    setIsModalVisible(false);
    setIsDetailsVisible(false);
    
    // Redirect to the ticket page
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

  const renderEventCard = (event, isFeatured = false) => {
    const status = getEventStatus(event);
    const seatsLeft = event.capacity - event.registeredCount;
    const isRegisterDisabled = status.label === 'Event Full' || status.label === 'Registration Closed';
    
    return (
      <Col xs={24} sm={isFeatured ? 24 : 12} lg={isFeatured ? 12 : 8} key={event.id}>
        <Badge.Ribbon text={status.label} color={status.color === 'gray' ? '#475569' : status.color}>
          <Card 
            hoverable 
            style={{ height: '100%', flexDirection: 'column', backgroundColor: '#FFFFFF', borderColor: isFeatured ? '#F97316' : '#E2E8F0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, marginTop: 12 }}>
              <Title level={isFeatured ? 3 : 4} style={{ color: '#0F766E', margin: 0 }}>{event.title}</Title>
            </div>
            
            <Space style={{ marginBottom: 16 }}>
              <Tag color={event.audience?.includes('University') ? '#0F766E' : '#14B8A6'}>{event.audience?.includes('University') ? 'University Only' : 'Open to All'}</Tag>
              <Tag color="#F97316">{event.mode}</Tag>
              <Tag color="gold">{event.category}</Tag>
            </Space>
            
            <div style={{ flex: 1, marginBottom: 16 }}>
              <Paragraph type="secondary" ellipsis={{ rows: isFeatured ? 3 : 2 }} style={{ minHeight: isFeatured ? 66 : 44, color: '#000000' }}>
                  {event.description}
              </Paragraph>
              
              <Space direction="vertical" style={{ width: '100%', marginTop: 1 }}>
                <Text style={{ color: '#000000' }}><CalendarOutlined style={{ color: '#14B8A6' }} /> <strong style={{ color: '#000000' }}>Date:</strong> {event.date} | <ClockCircleOutlined /> {event.time}</Text>
                <Text style={{ color: '#000000' }}><UserOutlined style={{ color: '#F97316' }} /> <strong style={{ color: '#000000' }}>Deadline:</strong> {event.deadline}</Text>
                <Text style={{ color: '#000000' }}><EnvironmentOutlined style={{ color: '#0F766E' }} /> <strong style={{ color: '#000000' }}>Venue:</strong> {event.venue}</Text>
                <Text style={{ color: '#000000' }}><TeamOutlined style={{ color: '#F97316' }} /> <strong style={{ color: '#000000' }}>Organizer:</strong> {event.organizer}</Text>
                <Text style={{ color: seatsLeft <= 10 && seatsLeft > 0 ? 'red' : '#475569' }}>🪑 {seatsLeft > 0 ? `${seatsLeft} seats left` : 'No seats available'}</Text>
              </Space>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Button block onClick={() => handleViewDetails(event)} style={{ borderColor: '#0F766E', color: '#0F766E', height: 40, fontSize: 16 }} ghost>
                View Details
              </Button>
              <Button 
                type="primary" block disabled={isRegisterDisabled} onClick={() => handleRegisterClick(event)}
                style={{ background: isRegisterDisabled ? '#E2E8F0' : '#0F766E', borderColor: 'transparent', height: 40, fontSize: 16, color: isRegisterDisabled ? '#475569' : '#FFFFFF' }}
              >
                {isRegisterDisabled ? status.label : 'Register'}
              </Button>
            </div>
          </Card>
        </Badge.Ribbon>
      </Col>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 32, textAlign: 'center'}}>
        <Title level={2} style={{ color: '#14B8A6' }}>Upcoming Events Portal</Title>
        <Text type="secondary" style={{ fontSize: 16, color: '#000000' }}>
          Discover, explore, and instantly register for the latest university events.
        </Text>
      </div>

      {featuredEvents.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <Title level={3} style={{ color: '#0F172A' }}>⭐ Featured Events</Title>
          <Row gutter={[24, 24]}>
            {featuredEvents.map(event => renderEventCard(event, true))}
          </Row>
        </div>
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 32, background: '#FFFFFF', borderColor: '#E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input placeholder="Search by title, organizer, or keywords..." prefix={<SearchOutlined />} size="large" value={searchText} onChange={e => setSearchText(e.target.value)} style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select value={filterCategory} onChange={setFilterCategory} size="large" style={{ width: '100%' }} className="green-select" popupClassName="green-dropdown">
              <Option value="All">All Categories</Option>
              <Option value="Academic">Academic</Option>
              <Option value="Sports">Sports</Option>
              <Option value="Cultural">Cultural</Option>
              <Option value="Workshop">Workshop</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select value={filterAudience} onChange={setFilterAudience} size="large" style={{ width: '100%' }} className="green-select" popupClassName="green-dropdown">
              <Option value="All">All Audience</Option>
              <Option value="University Students Only">University Only</Option>
              <Option value="Open to All">Open to All</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select value={filterMode} onChange={setFilterMode} size="large" style={{ width: '100%' }} className="green-select" popupClassName="green-dropdown">
              <Option value="All">All Modes</Option>
              <Option value="Physical">Physical</Option>
              <Option value="Online">Online</Option>
              <Option value="Hybrid">Hybrid</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select value={sortBy} onChange={setSortBy} size="large" style={{ width: '100%' }} className="green-select" popupClassName="green-dropdown">
              <Option value="Date">Sort by Date</Option>
              <Option value="Popularity">Sort by Popularity</Option>
              <Option value="Closing Soon">Sort by Closing Soon</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Title level={3} style={{ color: '#0F172A' }}>📅 All Events</Title>
      {filteredEvents.length === 0 ? (
        <Empty description={<span style={{ color: '#475569' }}>No events found matching your criteria.</span>} style={{ margin: '60px 0' }} />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredEvents.map(event => renderEventCard(event, false))}
        </Row>
      )}

      {/* Full Details Modal */}
      <Modal
        title={<Title level={3} style={{ margin: 0, color: '#0F766E' }}>{selectedEvent?.title}</Title>}
        open={isDetailsVisible}
        onCancel={() => setIsDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailsVisible(false)}>Close</Button>,
          <Button key="register" type="primary" disabled={selectedEvent && (getEventStatus(selectedEvent).label !== 'Registration Open')} onClick={() => {
            setIsDetailsVisible(false);
            handleRegisterClick(selectedEvent);
          }} style={{ background: selectedEvent && getEventStatus(selectedEvent).label !== 'Registration Open' ? '#E2E8F0' : '#0F766E', borderColor: 'transparent', color: selectedEvent && getEventStatus(selectedEvent).label !== 'Registration Open' ? '#475569' : '#FFFFFF' }}>
            {selectedEvent ? (getEventStatus(selectedEvent).label !== 'Registration Open' ? getEventStatus(selectedEvent).label : 'Register Now') : 'Register'}
          </Button>
        ]}
        width={800}
      >
        {selectedEvent && (
          <div style={{ fontSize: 16 }}>
            <Space style={{ marginBottom: 16, marginTop: 8 }}>
              <Tag color={selectedEvent.audience.includes('University') ? '#0F766E' : '#14B8A6'}>{selectedEvent.audience}</Tag>
              <Tag color="#F97316">{selectedEvent.mode}</Tag>
              <Tag color="gold">{selectedEvent.category}</Tag>
              <Tag color={getEventStatus(selectedEvent).color}>{getEventStatus(selectedEvent).label}</Tag>
            </Space>

            <Row gutter={[24, 24]}>
              <Col span={12}>
                <p><strong><CalendarOutlined /> Date & Time:</strong><br />{selectedEvent.date} @ {selectedEvent.time}</p>
                <p><strong><EnvironmentOutlined /> Location/Link:</strong><br />{selectedEvent.venue}</p>
                <p><strong><TeamOutlined /> Organizer:</strong><br />{selectedEvent.organizer}</p>
              </Col>
              <Col span={12}>
                <p><strong><ClockCircleOutlined /> Deadline to Register:</strong><br />{selectedEvent.deadline}</p>
                <p><strong>🪑 Seating Availability:</strong><br />{selectedEvent.capacity - selectedEvent.registeredCount} out of {selectedEvent.capacity} seats left</p>
                <p><strong>📞 Contact Details:</strong><br />support@{selectedEvent.organizer.toLowerCase().replace(' ', '')}.edu</p>
              </Col>
            </Row>

            <div style={{ marginTop: 24, padding: 16, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <Title level={4} style={{ color: '#0F172A' }}>About This Event</Title>
              <Paragraph style={{ fontSize: 16, color: '#475569' }}>{selectedEvent.description}</Paragraph>
            </div>
          </div>
        )}
      </Modal>

      {/* Registration Modal */}
      <Modal
        title={`Register for ${selectedEvent?.title}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div style={{ marginBottom: 24 }}>
          <Text type="secondary" style={{ fontSize: 14 }}>
            {selectedEvent?.audience?.includes('University') 
              ? '🔒 This event is heavily restricted to university students. A valid student email is firmly required to proceed.' 
              : '🌐 This event is fully open to external students as well! All are welcome.'}
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinishRegistration}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input size="large" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
              {
                validator: (_, value) => {
                  if (value && selectedEvent?.audience?.includes('University')) {
                    if (!value.endsWith('@my.sliit.lk') && !value.endsWith('@sliit.lk')) {
                      return Promise.reject(new Error('Restricted Event! Email must end in @my.sliit.lk or @sliit.lk'));
                    }
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input size="large" placeholder={selectedEvent?.audience?.includes('University') ? 'student@my.sliit.lk' : 'example@gmail.com'} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#0F766E', borderColor: '#0F766E', color: 'white', height: 48, fontSize: 16 }}>
              Confirm Registration
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpcomingEventsPortal;
