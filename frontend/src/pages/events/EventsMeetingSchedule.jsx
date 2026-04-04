import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Tag, Row, Col, Modal, Form, Input, Select, DatePicker, message, Space, Timeline, Empty, Tabs } from 'antd';
import { CalendarOutlined, GlobalOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import api from '@/lib/api';

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
      // message.error('Failed to load meetings');
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
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text type="secondary" style={{ fontSize: 16 }}>No upcoming {type} meetings scheduled</Text>
        </div>
      );
    }

    return (
      <Timeline style={{ marginTop: 20 }}>
        {filteredMeetings.map((mtg, index) => (
          <Timeline.Item key={index} color={type === 'event' ? '#14B8A6' : '#F59E0B'}>
            <div style={{ 
              padding: 16, 
              background: '#F8FAFC', 
              border: '1px solid #E2E8F0', 
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <Title level={5} style={{ color: '#0F172A', margin: 0, marginBottom: 4 }}>{mtg.title}</Title>
                <Space style={{ marginBottom: 8 }}>
                  <Tag icon={<GlobalOutlined />} color="cyan">{mtg.platform}</Tag>
                  <Tag icon={type === 'event' ? <CalendarOutlined /> : <TeamOutlined />} color={type === 'event' ? 'blue' : 'purple'}>
                    {mtg.relatedEntity}
                  </Tag>
                </Space>
                <div>
                  <Text style={{ color: '#475569', fontWeight: '600' }}>{mtg.date}</Text>
                </div>
              </div>
              
              <Button 
                type="primary" 
                shape="round"
                href={mtg.link}
                target="_blank"
                style={{ background: '#14B8A6', borderColor: '#14B8A6' }}
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
    <div className="p-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#000000' }}>Events & Clubs Meeting Schedule</Title>
          <Text style={{ fontSize: 16, color: '#475569' }}>Coordinate and manage all planning meetings for upcoming university events and clubs.</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large" 
          style={{ background: '#14B8A6', borderColor: '#0F766E' }}
          onClick={() => setIsModalVisible(true)}
        >
          Schedule Meeting
        </Button>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card 
            bordered={false} 
            className="shadow-md"
            style={{ background: '#FFFFFF', borderRadius: 16 }}
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
            title={<span style={{ color: '#000000' }}>Meeting Logistics Guidelines</span>}
            bordered={false} 
            className="shadow-md"
            style={{ background: '#FFFFFF', borderRadius: 16 }}
          >
            <Paragraph style={{ color: '#475569' }}>
              1. <strong style={{color:'#0F172A'}}>Target Audience:</strong> These meetings are strictly for event coordinators, club presidents, and admin staff to plan future operations.
            </Paragraph>
            <Paragraph style={{ color: '#475569' }}>
              2. <strong style={{color:'#0F172A'}}>Categorization:</strong> Ensure you select the correct meeting type (Event vs Club) so it appears in the proper schedule view.
            </Paragraph>
            <Paragraph style={{ color: '#475569' }}>
              3. <strong style={{color:'#0F172A'}}>Agendas:</strong> Please maintain meeting minutes and upload them to the shared university drive after the sync concludes.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Modal
        title={<span style={{ color: '#000000' }}>Schedule Coordination Meeting</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="glass-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleScheduleSubmit}>
          <Form.Item name="title" label={<span style={{ color: '#000000', fontWeight: '500' }}>Meeting Topic</span>} rules={[{ required: true }]}>
            <Input placeholder="e.g. Venue Decor Planning" size="large" className="bg-[#F9FAFB]" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="platform" label={<span style={{ color: '#000000', fontWeight: '500' }}>Platform</span>} rules={[{ required: true }]}>
                <Select placeholder="Select Platform" size="large" className="green-select" popupClassName="green-dropdown">
                  <Option value="Zoom">Zoom Meeting</Option>
                  <Option value="Microsoft Teams">Microsoft Teams</Option>
                  <Option value="Google Meet">Google Meet</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label={<span style={{ color: '#000000', fontWeight: '500' }}>Date & Time</span>} rules={[{ required: true }]}>
                <DatePicker showTime style={{ width: '100%' }} size="large" className="bg-[#F9FAFB]" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label={<span style={{ color: '#000000', fontWeight: '500' }}>Meeting Type</span>} rules={[{ required: true }]}>
                <Select placeholder="Event or Club" size="large" className="green-select" popupClassName="green-dropdown">
                  <Option value="event">Event Coordination</Option>
                  <Option value="club">Club Operations</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="relatedEntity" label={<span style={{ color: '#000000', fontWeight: '500' }}>Related Event/Club</span>} rules={[{ required: true }]}>
                <Input placeholder="e.g. Tech Symposium" size="large" className="bg-[#F9FAFB]" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#14B8A6', borderColor: '#0F766E', color: 'black', fontWeight: 'bold' }} loading={loading}>
              Schedule Meeting
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .glass-modal .ant-modal-content {
          background: #FFFFFF !important;
          border-radius: 16px;
          border: 1px solid #E2E8F0 !important;
        }
        .glass-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid #F0F0F0 !important;
        }
        .glass-modal .ant-modal-title {
          color: #000000 !important;
        }
        .glass-modal .ant-modal-close {
          color: #000000 !important;
        }
        .ant-tabs-nav::before {
          border-bottom: 1px solid #E2E8F0 !important;
        }
        .ant-tabs-tab {
          color: #64748B !important;
        }
        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #14B8A6 !important;
        }
        .ant-tabs-ink-bar {
          background: #14B8A6 !important;
        }
      `}</style>
    </div>
  );
};

export default EventsMeetingSchedule;
