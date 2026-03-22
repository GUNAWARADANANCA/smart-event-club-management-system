import React, { useState } from 'react';
import { Card, Button, Typography, Tag, Row, Col, Modal, Form, Input, Select, DatePicker, message, Space, Timeline } from 'antd';
import { VideoCameraOutlined, LockOutlined, GlobalOutlined, PlusOutlined, KeyOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const mockMeetings = [
  {
    id: 'MTG-001',
    title: 'University Core Committee Sync',
    platform: 'Microsoft Teams',
    date: '2026-03-22 10:00 AM',
    accessType: 'Passcode Protected',
    status: 'Upcoming',
    link: 'https://teams.microsoft.com/...',
    passcode: '1234'
  },
  {
    id: 'MTG-002',
    title: 'Robotics Club Architecture Review',
    platform: 'Zoom',
    date: '2026-03-23 02:00 PM',
    accessType: 'University Students Only',
    status: 'Upcoming',
    link: 'https://zoom.us/j/...',
    passcode: null
  }
];

const SecureMeetings = () => {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [form] = Form.useForm();

  const handleScheduleSubmit = (values) => {
    const newMeeting = {
      id: `MTG-00${meetings.length + 1}`,
      title: values.title,
      platform: values.platform,
      date: values.date.format('YYYY-MM-DD hh:mm A'),
      accessType: values.accessType,
      status: 'Upcoming',
      link: 'https://secure-meeting.app/join',
      passcode: values.passcode || null
    };
    setMeetings([...meetings, newMeeting]);
    message.success('Secure meeting scheduled successfully!');
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleJoinClick = (meeting) => {
    if (meeting.accessType === 'Passcode Protected') {
      setSelectedMeeting(meeting);
      setPasscodeAttempt('');
      setIsJoinModalVisible(true);
    } else {
      message.loading('Validating University Credentials...', 1).then(() => {
        message.success('Access Granted. Redirecting to meeting...');
      });
    }
  };

  const verifyPasscode = () => {
    if (passcodeAttempt === selectedMeeting.passcode) {
      message.success('Access Granted! Connecting securely...');
      setIsJoinModalVisible(false);
    } else {
      message.error('Invalid Passcode. Access Denied.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Secure Meeting Schedule</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Manage unified access and schedule restricted meetings for clubs and events.</Text>
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
            title={<><VideoCameraOutlined style={{ color: '#8b5cf6', marginRight: 8 }}/> Upcoming Secure Meetings</>}
            bordered={false} 
            style={{ background: '#141414', borderColor: '#303030', borderRadius: 16 }}
          >
            {meetings.length === 0 ? (
              <Empty description="No upcoming scheduled meetings" />
            ) : (
              <Timeline style={{ marginTop: 20 }}>
                {meetings.map((mtg, index) => (
                  <Timeline.Item key={index} color={mtg.accessType === 'Passcode Protected' ? 'red' : 'blue'}>
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
                          <Tag icon={mtg.accessType === 'Passcode Protected' ? <LockOutlined /> : <GlobalOutlined />} color={mtg.accessType === 'Passcode Protected' ? 'error' : 'processing'}>
                            {mtg.accessType}
                          </Tag>
                        </Space>
                        <div>
                          <Text type="secondary" strong>{mtg.date}</Text>
                        </div>
                      </div>
                      
                      <Button 
                        type="primary" 
                        shape="round"
                        icon={mtg.accessType === 'Passcode Protected' ? <LockOutlined /> : null}
                        onClick={() => handleJoinClick(mtg)}
                        style={{ background: '#3b82f6', borderColor: '#3b82f6' }}
                      >
                        Join Securely
                      </Button>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Access Security Rules" 
            bordered={false} 
            style={{ background: '#141414', borderColor: '#303030', borderRadius: 16 }}
          >
            <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>
              1. <strong style={{color:'white'}}>University Students Only:</strong> End-users must be logged in with a certified `.edu` or `.lk` domain. Access is automatically filtered.
            </Paragraph>
            <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>
              2. <strong style={{color:'white'}}>Passcode Protected:</strong> High-security meetings require the host-provided 4-to-6 digit PIN before exposing the transport link.
            </Paragraph>
            <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>
              3. <strong style={{color:'white'}}>E2E Encryption:</strong> All meeting handshakes are strictly encrypted via the central gateway server to prevent link sniffing.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Schedule Modal */}
      <Modal
        title="Schedule Secure Meeting"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="glass-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleScheduleSubmit}>
          <Form.Item name="title" label="Meeting Topic" rules={[{ required: true }]}>
            <Input placeholder="e.g. Finance Budget Review Sync" size="large" />
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

          <Form.Item name="accessType" label="Security & Access Control" rules={[{ required: true }]}>
            <Select placeholder="Set Access Layer" size="large">
              <Option value="University Students Only">University Authentication Only</Option>
              <Option value="Passcode Protected">Strict Passcode Protected</Option>
              <Option value="Public / Open">Public / Open</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            noStyle 
            shouldUpdate={(prevValues, currentValues) => prevValues.accessType !== currentValues.accessType}
          >
            {({ getFieldValue }) =>
              getFieldValue('accessType') === 'Passcode Protected' ? (
                <Form.Item name="passcode" label="Meeting Passcode" rules={[{ required: true }]}>
                  <Input.Password placeholder="Enter 4-6 digit passcode" size="large" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#8b5cf6', borderColor: '#8b5cf6' }}>
              Schedule & Generate Link
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Join Validation Modal */}
      <Modal
        title={
          <Space>
            <LockOutlined style={{ color: '#f5222d' }} />
            Protected Meeting Access
          </Space>
        }
        open={isJoinModalVisible}
        onCancel={() => setIsJoinModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsJoinModalVisible(false)}>
            Abort
          </Button>,
          <Button key="submit" type="primary" onClick={verifyPasscode} style={{ background: '#f5222d', borderColor: '#f5222d' }}>
            Verify & Join
          </Button>,
        ]}
        bodyStyle={{ textAlign: 'center', padding: '32px 16px' }}
        className="glass-modal"
      >
        <Title level={4} style={{ color: 'white' }}>{selectedMeeting?.title}</Title>
        <Text type="secondary">This meeting endpoint requires validation.</Text>
        
        <div style={{ marginTop: 24 }}>
          <Input.Password
            prefix={<KeyOutlined />}
            size="large"
            placeholder="Enter Meeting Passcode"
            value={passcodeAttempt}
            onChange={(e) => setPasscodeAttempt(e.target.value)}
            style={{ maxWidth: 300, background: '#000', borderColor: '#303030', color: 'white' }}
            onPressEnter={verifyPasscode}
          />
        </div>
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
      `}</style>
    </div>
  );
};

export default SecureMeetings;
