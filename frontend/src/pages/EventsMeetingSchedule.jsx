import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Tag, Row, Col, Modal, Form, Input, Select, DatePicker, message, Space, Timeline, Empty, Tabs } from 'antd';
import { CalendarOutlined, GlobalOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import api from '../api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const EventsMeetingSchedule = () => {
  const [meetings, setMeetings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await api.get('/meetings');
      setMeetings(response.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load meetings');
    }
  };

  const handleScheduleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        type: values.type,
        platform: values.platform,
        date: values.date.format('YYYY-MM-DD hh:mm A'),
        relatedEntity: values.relatedEntity
      };
      await api.post('/meetings', payload);
      message.success(`${values.type === 'event' ? 'Event' : 'Club'} coordination meeting scheduled successfully!`);
      setIsModalVisible(false);
      form.resetFields();
      fetchMeetings();
    } catch (error) {
      console.error(error);
      message.error('Failed to schedule meeting.');
    } finally {
      setLoading(false);
    }
  };

  const renderTimeline = (type) => {
    const filteredMeetings = meetings.filter(m => m.type === type);
    
    if (filteredMeetings.length === 0) {
      return <Empty description={`No upcoming ${type} meetings scheduled`} />;
    }

    return (
      <Timeline style={{ marginTop: 20 }}>
        {filteredMeetings.map((mtg, index) => (
          <Timeline.Item key={index} color={type === 'event' ? 'blue' : 'purple'}>
            <div style={{ 
              padding: 16, 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid #303030', 
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <Title level={5} style={{ color: '#fff', margin: 0, marginBottom: 4 }}>{mtg.title}</Title>
                <Space style={{ marginBottom: 8 }}>
                  <Tag icon={<GlobalOutlined />} color="cyan">{mtg.platform}</Tag>
                  <Tag icon={type === 'event' ? <CalendarOutlined /> : <TeamOutlined />} color={type === 'event' ? 'blue' : 'purple'}>
                    {mtg.relatedEntity}
                  </Tag>
                </Space>
                <div>
                  <Text type="secondary" strong>{mtg.date}</Text>
                </div>
              </div>
              
              <Button 
                type="primary" 
                shape="round"
                href={mtg.link}
                target="_blank"
                style={{ background: '#3b82f6', borderColor: '#3b82f6' }}
              >
                Join Meeting
              </Button>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Events & Clubs Meeting Schedule</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Coordinate and manage all planning meetings for upcoming university events and clubs.</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large" 
          style={{ background: '#8b5cf6', borderColor: '#8b5cf6' }}
          onClick={() => setIsModalVisible(true)}
        >
          Schedule Meeting
        </Button>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card 
            bordered={false} 
            style={{ background: '#141414', borderColor: '#303030', borderRadius: 16 }}
            bodyStyle={{ padding: '0 24px 24px 24px' }}
          >
            <Tabs defaultActiveKey="events" size="large">
              <Tabs.TabPane tab={<span><CalendarOutlined /> Event Meetings</span>} key="events">
                {renderTimeline('event')}
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span><TeamOutlined /> Club Meetings</span>} key="clubs">
                {renderTimeline('club')}
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Meeting Logistics Guidelines" 
            bordered={false} 
            style={{ background: '#141414', borderColor: '#303030', borderRadius: 16 }}
          >
            <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>
              1. <strong style={{color:'white'}}>Target Audience:</strong> These meetings are strictly for event coordinators, club presidents, and admin staff to plan future operations.
            </Paragraph>
            <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>
              2. <strong style={{color:'white'}}>Categorization:</strong> Ensure you select the correct meeting type (Event vs Club) so it appears in the proper schedule view.
            </Paragraph>
            <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>
              3. <strong style={{color:'white'}}>Agendas:</strong> Please maintain meeting minutes and upload them to the shared university drive after the sync concludes.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Schedule Coordination Meeting"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="glass-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleScheduleSubmit}>
          <Form.Item name="title" label="Meeting Topic" rules={[{ required: true }]}>
            <Input placeholder="e.g. Venue Decor Planning" size="large" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
                <Select placeholder="Select Platform" size="large">
                  <Option value="Zoom">Zoom Meeting</Option>
                  <Option value="Microsoft Teams">Microsoft Teams</Option>
                  <Option value="Google Meet">Google Meet</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="Date & Time" rules={[{ required: true }]}>
                <DatePicker showTime style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Meeting Type" rules={[{ required: true }]}>
                <Select placeholder="Event or Club" size="large">
                  <Option value="event">Event Coordination</Option>
                  <Option value="club">Club Operations</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="relatedEntity" label="Related Event/Club" rules={[{ required: true }]}>
                <Input placeholder="e.g. Tech Symposium" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#8b5cf6', borderColor: '#8b5cf6' }} loading={loading}>
              Schedule Meeting
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .glass-modal .ant-modal-content {
          background: rgba(20, 20, 20, 0.9) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(139, 92, 246, 0.4) !important;
          border-radius: 16px;
        }
        .glass-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        .glass-modal .ant-modal-title {
          color: white !important;
        }
        .glass-modal .ant-modal-close {
          color: white !important;
        }
        .ant-tabs-nav::before {
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        .ant-tabs-tab {
          color: rgba(255,255,255,0.6) !important;
        }
        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #a78bfa !important;
          text-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
        }
        .ant-tabs-ink-bar {
          background: #a78bfa !important;
          box-shadow: 0 0 8px #a78bfa;
        }
      `}</style>
    </div>
  );
};

export default EventsMeetingSchedule;
