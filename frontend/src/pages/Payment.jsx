import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, message, Spin } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const Payment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Payment processing successful!');
      navigate('/finance/ticket');
    }, 1500);
  };

  return (
    <div>
      <Title level={2}>Mock Ticket Purchase</Title>
      <Card style={{ maxWidth: 500, margin: '0 auto' }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="event" label="Select Event" rules={[{ required: true }]}>
             <Select placeholder="Choose event to attend">
                <Option value="Tech Symposium">Tech Symposium - $15.00</Option>
                <Option value="Art Workshop">Art Workshop - $5.00</Option>
             </Select>
          </Form.Item>
          
          <div style={{ padding: '16px', background: 'transparent', border: '1px solid #303030', borderRadius: 8, marginBottom: 24 }}>
            <Text strong><CreditCardOutlined /> Payment Details (Mock)</Text>
            <Form.Item name="cardName" label="Name on Card" rules={[{ required: true }]} style={{ marginTop: 16 }}>
              <Input placeholder="John Doe" />
            </Form.Item>
            <Form.Item name="cardNumber" label="Card Number" rules={[{ required: true, len: 16, message: 'Must be 16 digits' }]}>
              <Input placeholder="1234 5678 9101 1121" maxLength={16} />
            </Form.Item>
            <div style={{ display: 'flex', gap: 16 }}>
                <Form.Item name="expiry" label="Expiry" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <Input placeholder="MM/YY" />
                </Form.Item>
                <Form.Item name="cvv" label="CVV" rules={[{ required: true, len: 3 }]} style={{ flex: 1 }}>
                  <Input placeholder="123" maxLength={3} />
                </Form.Item>
            </div>
          </div>
          
          <Button type="primary" htmlType="submit" size="large" block disabled={loading}>
            {loading ? <Spin /> : 'Pay Now'}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Payment;
