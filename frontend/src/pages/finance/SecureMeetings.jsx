import React, { useState } from 'react';
import { Card, Button, Typography, Tag, Row, Col, Modal, Form, Input, Select, DatePicker, message, Space, Timeline } from 'antd';
import { VideoCameraOutlined, LockOutlined, GlobalOutlined, PlusOutlined, LinkOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const mockMeetings = [
  {
    id: 'MTG-001',
    title: 'University Core Committee Sync',
    platform: 'Microsoft Teams',
    date: '2026-03-22 10:00 AM',
    accessType: 'Restricted',
    status: 'Upcoming',
    link: 'https://teams.microsoft.com/l/meetup-join/meeting_join_link',
  },
  {
    id: 'MTG-002',
    title: 'Robotics Club Architecture Review',
    platform: 'Zoom',
    date: '2026-03-23 02:00 PM',
    accessType: 'University Students Only',
    status: 'Upcoming',
    link: 'https://zoom.us/j/123456789',
  }
];

const SecureMeetings = () => {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleScheduleSubmit = (values) => {
    const newMeeting = {
      id: `MTG-00${meetings.length + 1}`,
      title: values.title,
      platform: values.platform,
      date: values.date.format('YYYY-MM-DD hh:mm A'),
      accessType: values.accessType,
      status: 'Upcoming',
      link: values.link,
    };
    setMeetings([...meetings, newMeeting]);
    message.success('Secure meeting scheduled successfully!');
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleJoinClick = (meeting) => {
    message.loading('Validating credentials...', 1).then(() => {
      message.success('Access Granted. Redirecting...');
      window.open(meeting.link, '_blank');
    });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px', background: '#0F172A' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>Secure Meeting Schedule</Title>
          <Text style={{ fontSize: 16, color: '#94A3B8' }}>Manage unified access and schedule restricted meetings for clubs and events.</Text>
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
            title={<><VideoCameraOutlined style={{ color: '#14B8A6', marginRight: 8 }}/><span style={{ color: '#FFFFFF' }}>Upcoming Secure Meetings</span></>}
            bordered={false}
            style={{ background: '#1E293B', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Timeline style={{ marginTop: 20 }}>
              {meetings.map((mtg, index) => (
                <Timeline.Item key={index} color="#14B8A6">
                  <div style={{
                    padding: 16,
                    background: '#0F172A',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <Title level={5} style={{ color: '#FFFFFF', margin: 0, marginBottom: 4 }}>{mtg.title}</Title>
                      <Space style={{ marginBottom: 8 }}>
                        <Tag icon={<GlobalOutlined />} color="cyan">{mtg.platform}</Tag>
                        <Tag icon={<LockOutlined />} color="processing">{mtg.accessType}</Tag>
                      </Space>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <Text style={{ color: '#94A3B8', fontWeight: '600' }}>{mtg.date}</Text>
                        <Text style={{ color: '#334155' }}>·</Text>
                        <a href={mtg.link} target="_blank" rel="noreferrer"
                          style={{ color: '#14B8A6', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <LinkOutlined /> {mtg.link}
                        </a>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      shape="round"
                      onClick={() => handleJoinClick(mtg)}
                      style={{ background: '#14B8A6', borderColor: '#14B8A6', flexShrink: 0, marginLeft: 16 }}
                    >
                      Join Securely
                    </Button>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ color: '#FFFFFF' }}>Access Security Rules</span>}
            bordered={false}
            style={{ background: '#1E293B', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Paragraph style={{ color: '#94A3B8' }}>
              1. <strong style={{ color: '#E2E8F0' }}>University Students Only:</strong> End-users must be logged in with a certified `.edu` or `.lk` domain. Access is automatically filtered.
            </Paragraph>
            <Paragraph style={{ color: '#94A3B8' }}>
              2. <strong style={{ color: '#E2E8F0' }}>Restricted Access:</strong> Only authorised members with valid credentials can join restricted meetings.
            </Paragraph>
            <Paragraph style={{ color: '#94A3B8' }}>
              3. <strong style={{ color: '#E2E8F0' }}>E2E Encryption:</strong> All meeting handshakes are strictly encrypted via the central gateway server to prevent link sniffing.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Schedule Modal */}
      <Modal
        title={<span style={{ color: '#FFFFFF' }}>Schedule Secure Meeting</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="dark-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleScheduleSubmit}>
          <Form.Item name="title" label={<span style={{ color: '#94A3B8' }}>Meeting Topic</span>} rules={[{ required: true }]}>
            <Input placeholder="e.g. Finance Budget Review Sync" size="large" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="platform" label={<span style={{ color: '#94A3B8' }}>Platform</span>} rules={[{ required: true }]}>
                <Select placeholder="Select Platform" size="large">
                  <Option value="Zoom">Zoom Meeting</Option>
                  <Option value="Microsoft Teams">Microsoft Teams</Option>
                  <Option value="Google Meet">Google Meet</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label={<span style={{ color: '#94A3B8' }}>Date & Time</span>} rules={[{ required: true }]}>
                <DatePicker showTime style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="link" label={<span style={{ color: '#94A3B8' }}>Meeting Link</span>} rules={[{ required: true, type: 'url', message: 'Please enter a valid URL' }]}>
            <Input prefix={<LinkOutlined style={{ color: '#475569' }} />} placeholder="https://zoom.us/j/... or https://teams.microsoft.com/..." size="large" />
          </Form.Item>
          <Form.Item name="accessType" label={<span style={{ color: '#94A3B8' }}>Access Control</span>} rules={[{ required: true }]}>
            <Select placeholder="Set Access Layer" size="large">
              <Option value="University Students Only">University Students Only</Option>
              <Option value="Restricted">Restricted</Option>
              <Option value="Public / Open">Public / Open</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#14B8A6', borderColor: '#0F766E', fontWeight: 'bold' }}>
              Schedule Meeting
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .dark-modal .ant-modal-content {
          background: #1E293B !important;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08) !important;
        }
        .dark-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
        }
        .dark-modal .ant-modal-title { color: #FFFFFF !important; }
        .dark-modal .ant-modal-close { color: #94A3B8 !important; }
        .dark-modal .ant-form-item-label > label { color: #94A3B8 !important; }
        .dark-modal .ant-input,
        .dark-modal .ant-input-affix-wrapper,
        .dark-modal .ant-picker,
        .dark-modal .ant-select-selector {
          background: #0F172A !important;
          border-color: #334155 !important;
          color: #FFFFFF !important;
        }
        .dark-modal .ant-input::placeholder { color: #475569 !important; }
        .dark-modal .ant-select-selection-placeholder { color: #475569 !important; }
        .dark-modal .ant-picker-input > input { color: #FFFFFF !important; }
      `}</style>
    </div>
  );
};

export default SecureMeetings;
