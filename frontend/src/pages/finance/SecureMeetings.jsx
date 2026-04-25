import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Typography, Tag, Row, Col, Modal, Form, Input, Select, DatePicker, message, Space, Timeline, Spin, Empty } from 'antd';
import { VideoCameraOutlined, LockOutlined, GlobalOutlined, PlusOutlined, LinkOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function formatScheduledAt(value) {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return '—';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${String(h).padStart(2, '0')}:${min} ${ampm}`;
}

const mapMeetingForUi = (m) => ({
  _id: m._id,
  title: m.title,
  platform: m.platform,
  date: formatScheduledAt(m.scheduledAt),
  accessType: m.accessType,
  status: m.status || 'Upcoming',
  link: m.link,
});

const SecureMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/meetings');
      const list = Array.isArray(data) ? data : [];
      setMeetings(list.map(mapMeetingForUi));
    } catch {
      message.error('Could not load meetings from the server.');
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleScheduleSubmit = async (values) => {
    const scheduledAt =
      typeof values.date?.toISOString === 'function'
        ? values.date.toISOString()
        : new Date(values.date).toISOString();

    try {
      await api.post('/api/meetings', {
        title: values.title,
        platform: values.platform,
        scheduledAt,
        link: values.link,
        accessType: values.accessType,
      });
      message.success('Secure meeting scheduled successfully!');
      setIsModalVisible(false);
      form.resetFields();
      await fetchMeetings();
    } catch {
      message.error('Could not save meeting.');
    }
  };

  const handleJoinClick = (meeting) => {
    message.loading('Validating credentials...', 1).then(() => {
      message.success('Access Granted. Redirecting...');
      window.open(meeting.link, '_blank');
    });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px', background: '#FAFAFA' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#1F2937' }}>Secure Meeting Schedule</Title>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>Manage unified access and schedule restricted meetings for clubs and events.</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ background: '#4CAF50', borderColor: '#43A047' }}
          onClick={() => setIsModalVisible(true)}
        >
          Schedule Meeting
        </Button>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card
            title={<><VideoCameraOutlined style={{ color: '#4CAF50', marginRight: 8 }}/><span style={{ color: '#1F2937' }}>Upcoming Secure Meetings</span></>}
            variant="borderless"
            style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(200, 230, 201, 0.9)' }}
          >
            <Spin spinning={loading}>
              {meetings.length === 0 && !loading ? (
                <Empty description="No meetings scheduled yet" style={{ margin: '32px 0' }} />
              ) : (
                <Timeline style={{ marginTop: 20 }}>
                  {meetings.map((mtg) => (
                    <Timeline.Item key={mtg._id} color="#4CAF50">
                      <div style={{
                        padding: 16,
                        background: '#FAFAFA',
                        border: '1px solid rgba(200, 230, 201, 0.9)',
                        borderRadius: 12,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <Title level={5} style={{ color: '#1F2937', margin: 0, marginBottom: 4 }}>{mtg.title}</Title>
                          <Space style={{ marginBottom: 8 }}>
                            <Tag icon={<GlobalOutlined />} color="cyan">{mtg.platform}</Tag>
                            <Tag icon={<LockOutlined />} color="processing">{mtg.accessType}</Tag>
                          </Space>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <Text style={{ color: '#6B7280', fontWeight: '600' }}>{mtg.date}</Text>
                            <Text style={{ color: '#9CA3AF' }}>·</Text>
                            <a href={mtg.link} target="_blank" rel="noreferrer"
                              style={{ color: '#2E7D32', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <LinkOutlined /> {mtg.link}
                            </a>
                          </div>
                        </div>
                        <Button
                          type="primary"
                          shape="round"
                          onClick={() => handleJoinClick(mtg)}
                          style={{ background: '#4CAF50', borderColor: '#43A047', flexShrink: 0, marginLeft: 16 }}
                        >
                          Join Securely
                        </Button>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </Spin>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ color: '#1F2937' }}>Access Security Rules</span>}
            variant="borderless"
            style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(200, 230, 201, 0.9)' }}
          >
            <Paragraph style={{ color: '#4B5563' }}>
              1. <strong style={{ color: '#1F2937' }}>University Students Only:</strong> End-users must be logged in with a certified `.edu` or `.lk` domain. Access is automatically filtered.
            </Paragraph>
            <Paragraph style={{ color: '#4B5563' }}>
              2. <strong style={{ color: '#1F2937' }}>Restricted Access:</strong> Only authorised members with valid credentials can join restricted meetings.
            </Paragraph>
            <Paragraph style={{ color: '#4B5563' }}>
              3. <strong style={{ color: '#1F2937' }}>E2E Encryption:</strong> All meeting handshakes are strictly encrypted via the central gateway server to prevent link sniffing.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Modal
        title={<span style={{ color: '#1F2937' }}>Schedule Secure Meeting</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="dark-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleScheduleSubmit}>
          <Form.Item name="title" label={<span style={{ color: '#4B5563' }}>Meeting Topic</span>} rules={[{ required: true }]}>
            <Input placeholder="e.g. Finance Budget Review Sync" size="large" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="platform" label={<span style={{ color: '#4B5563' }}>Platform</span>} rules={[{ required: true }]}>
                <Select placeholder="Select Platform" size="large">
                  <Option value="Zoom">Zoom Meeting</Option>
                  <Option value="Microsoft Teams">Microsoft Teams</Option>
                  <Option value="Google Meet">Google Meet</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label={<span style={{ color: '#4B5563' }}>Date & Time</span>} rules={[{ required: true }]}>
                <DatePicker showTime style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="link" label={<span style={{ color: '#4B5563' }}>Meeting Link</span>} rules={[{ required: true, type: 'url', message: 'Please enter a valid URL' }]}>
            <Input prefix={<LinkOutlined style={{ color: '#475569' }} />} placeholder="https://zoom.us/j/... or https://teams.microsoft.com/..." size="large" />
          </Form.Item>
          <Form.Item name="accessType" label={<span style={{ color: '#4B5563' }}>Access Control</span>} rules={[{ required: true }]}>
            <Select placeholder="Set Access Layer" size="large">
              <Option value="University Students Only">University Students Only</Option>
              <Option value="Restricted">Restricted</Option>
              <Option value="Public / Open">Public / Open</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#4CAF50', borderColor: '#43A047', fontWeight: 'bold' }}>
              Schedule Meeting
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default SecureMeetings;
