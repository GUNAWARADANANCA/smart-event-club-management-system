import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, InputNumber, Button, Card, Typography, message, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [conflictWarning, setConflictWarning] = useState(false);

  const onFinish = async (values) => {
    if (values.venue === 'Main Hall' && values.date[0].format('YYYY-MM-DD') === '2026-04-10') {
        setConflictWarning(true);
        message.error('Venue is already booked for this date and time.');
        return;
    }
    
    const newEvent = {
        title: values.title,
        date: values.date[0].format('YYYY-MM-DD'),
        venue: values.venue,
        capacity: values.capacity,
        status: 'Approved',
        audience: values.participationType,
        organizer: values.club,
        description: values.description,
        deadline: values.deadline.format('YYYY-MM-DD')
    };
    
    try {
        await api.post('/events', newEvent);
        message.success('Event successfully published to the portal via backend API!');
        navigate('/portal');
    } catch (error) {
        message.error('Failed to submit event to backend.');
    }
  };

  return (
    <div>
      <Title level={2} style={{ color: 'black' }}>Create New Event</Title>
      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        {conflictWarning && <Alert message="Warning" description="This venue has a scheduling conflict with another event." type="warning" showIcon style={{ marginBottom: 24 }} />}
        
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Event Title" rules={[{ required: true, message: 'Please enter the event title' }]}>
            <Input placeholder="e.g. Annual Tech Symposium" />
          </Form.Item>
          
          <Form.Item name="date" label="Event Date & Time" rules={[{ required: true, message: 'Please select start and end date/time' }]}>
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="venue" label="Venue Selection" rules={[{ required: true, message: 'Please select a venue' }]}>
            <Select placeholder="Select a venue" className="green-select">
              <Option value="Main Hall">Main Hall</Option>
              <Option value="Room 201">Room 201</Option>
              <Option value="Auditorium B">Auditorium B</Option>
              <Option value="Sports Complex">Sports Complex</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="capacity" label="Capacity" rules={[
            { required: true, message: 'Please specify the capacity' },
            { type: 'number', min: 1, message: 'Capacity must be positive' }
          ]}>
            <InputNumber placeholder="e.g. 100" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="club" label="Organizer" rules={[{ required: true, message: 'Please specify the organizer' }]}>
            <Select placeholder="Select organizing club" className="green-select">
              <Option value="Tech Society">Tech Society</Option>
              <Option value="Art Club">Art Club</Option>
              <Option value="Student Council">Student Council</Option>
            </Select>
          </Form.Item>

          <Form.Item name="participationType" label="Participation Type" rules={[{ required: true, message: 'Please select participation type' }]}>
            <Select placeholder="Select allowed participants" className="green-select">
              <Option value="University Students Only">University Students Only</Option>
              <Option value="External Students Also Allowed">External Students Also Allowed</Option>
            </Select>
          </Form.Item>

          <Form.Item name="deadline" label="Registration Deadline" rules={[{ required: true, message: 'Please select a deadline' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="Event Description" rules={[{ required: true, message: 'Please provide event details' }]}>
            <Input.TextArea rows={4} placeholder="Describe the event details..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">Submit Event</Button>
            <Button style={{ marginLeft: 8 }} size="large" onClick={() => navigate('/events')}>Cancel</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateEvent;
