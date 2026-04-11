import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Select, message, Spin, Radio, Divider, Upload, Tag } from 'antd';
import { CreditCardOutlined, BankOutlined, UploadOutlined, CarOutlined, TagOutlined, DollarOutlined, WalletOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const bookingData = location.state?.bookingDetails;
  const eventData = location.state?.event;
  const paymentType = location.state?.paymentType;
  const parkingSlot = location.state?.parkingSlot;
  const totalAmount = location.state?.totalAmount;

  useEffect(() => {
    if (eventData) {
      form.setFieldsValue({
        event: eventData.event,
        cardName: bookingData?.fullName || ''
      });
    }
  }, [eventData, bookingData, form]);

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

        {/* ===== ORDER SUMMARY ===== */}
        {paymentType && (
          <div className="mb-6 p-5 rounded-2xl border border-[#C8E6C9] bg-[#E8F5E9]/60">
            <Text strong className="text-slate-900 mb-4 block text-lg">
              <DollarOutlined className="mr-2 text-[#4CAF50]" /> Order Summary
            </Text>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Text className="text-slate-600 text-sm">Event</Text>
                <Text className="text-slate-900 font-bold">{eventData?.event || '—'}</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text className="text-slate-600 text-sm">
                  <TagOutlined className="mr-1" /> Pass Type
                </Text>
                <Tag 
                  color={paymentType.color} 
                  className="font-bold m-0 text-xs"
                >
                  {paymentType.label} — Rs. {paymentType.price}.00
                </Tag>
              </div>
              {bookingData?.quantity && (
                <div className="flex justify-between items-center">
                  <Text className="text-slate-600 text-sm">Quantity</Text>
                  <Text className="text-slate-900 font-bold">×{bookingData.quantity}</Text>
                </div>
              )}
              {parkingSlot && (
                <div className="flex justify-between items-center">
                  <Text className="text-slate-600 text-sm">
                    <CarOutlined className="mr-1 text-[#F97316]" /> Parking Slot
                  </Text>
                  <Tag color="#F97316" className="font-bold m-0 text-xs">
                    🅿️ {parkingSlot} — Rs. 500.00
                  </Tag>
                </div>
              )}
              <Divider className="my-2 border-[#C8E6C9]" />
              <div className="flex justify-between items-center">
                <Text className="text-slate-800 font-black uppercase text-xs tracking-widest">Total</Text>
                <Text className="text-[#2E7D32] font-black text-2xl">
                  Rs. {totalAmount ? totalAmount.toFixed(2) : paymentType.price.toFixed(2)}
                </Text>
              </div>
            </div>
          </div>
        )}

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="event" label="Select Event" rules={[{ required: true }]}>
             <Select placeholder="Choose event to attend" className="green-select" popupClassName="green-dropdown">
                <Option value="CodeRed Hackathon">CodeRed Hackathon - Rs. 1200.00</Option>
                <Option value="Robotics Workshop">Robotics Workshop - Rs. 1000.00</Option>
                <Option value="Tech Symposium">Tech Symposium - Rs. 1500.00</Option>
                <Option value="Art Workshop">Art Workshop - Rs. 500.00</Option>
             </Select>
          </Form.Item>
          
          <Divider />

          <Form.Item label={<Text strong className="text-slate-800">Choose Payment Method</Text>} className="mb-8">
            <style>{`
              .payment-options .ant-radio-button-wrapper-checked {
                background-color: #4CAF50 !important;
                border-color: #43A047 !important;
                color: white !important;
              }
              .payment-options .ant-radio-button-wrapper-checked::before {
                background-color: transparent !important;
                display: none !important;
              }
              .payment-options .ant-radio-button-wrapper:hover {
                color: #2E7D32;
              }
              .payment-options .ant-radio-button-wrapper:focus-within,
              .payment-options .ant-radio-button-wrapper:focus {
                box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.35) !important;
                border-inline-start-color: #4CAF50 !important;
              }
            `}</style>
            <Radio.Group 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              value={paymentMethod}
              className="w-full flex flex-wrap gap-3 payment-options"
            >
              <Radio.Button value="card" className="flex-1 min-w-[120px] h-12 flex items-center justify-center font-bold rounded-xl border-[#C8E6C9] bg-white text-slate-600">
                <CreditCardOutlined className="mr-2" /> Card
              </Radio.Button>
              <Radio.Button value="bank" className="flex-1 min-w-[120px] h-12 flex items-center justify-center font-bold rounded-xl border-[#C8E6C9] bg-white text-slate-600">
                <BankOutlined className="mr-2" /> Bank Deposit
              </Radio.Button>
              <Radio.Button value="cash" className="flex-1 min-w-[120px] h-12 flex items-center justify-center font-bold rounded-xl border-[#C8E6C9] bg-white text-slate-600">
                <WalletOutlined className="mr-2" /> Cash
              </Radio.Button>
              <Radio.Button value="paypal" className="flex-1 min-w-[120px] h-12 flex items-center justify-center font-bold rounded-xl border-[#C8E6C9] bg-white text-slate-600">
                PayPal
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {paymentMethod === 'card' && (
            <div className="p-6 bg-[#F9FAF9] border border-[#C8E6C9] rounded-2xl mb-8">
              <Text strong className="text-slate-900 mb-6 block text-lg"><CreditCardOutlined className="mr-2 text-[#4CAF50]" /> Card Details</Text>
              <Form.Item name="cardName" label={<span className="text-slate-600 text-xs uppercase font-bold tracking-widest">Name on Card</span>} rules={[{ required: true }]} className="mb-4">
                <Input placeholder="John Doe" className="bg-white border-[#C8E6C9] text-slate-900 rounded-xl h-11 hover:border-[#81C784]" />
              </Form.Item>
              <Form.Item
                name="cardNumber"
                label={<span className="text-slate-600 text-xs uppercase font-bold tracking-widest">Card Number</span>}
                rules={[
                  { required: true, message: 'Required' },
                  { len: 16, message: 'Must be 16 digits' },
                  { pattern: /^\d+$/, message: 'Digits only' },
                ]}
                normalize={(value) => String(value ?? '').replace(/\D/g, '').slice(0, 16)}
                className="mb-4"
              >
                <Input
                  placeholder="1234567891011121"
                  inputMode="numeric"
                  maxLength={16}
                  className="bg-white border-[#C8E6C9] text-slate-900 rounded-xl h-11 hover:border-[#81C784]"
                />
              </Form.Item>
              <div className="flex gap-4 flex-wrap">
                  <Form.Item
                    name="expiry"
                    label={<span className="text-slate-600 text-xs uppercase font-bold tracking-widest">Expiry</span>}
                    rules={[
                      { required: true, message: 'Required' },
                      { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Use MM/YY (01-12)' },
                      {
                        validator: async (_, value) => {
                          const v = String(value || '').trim();
                          if (!v) return;
                          const match = v.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
                          if (!match) return;

                          const month = Number(match[1]);
                          const year = 2000 + Number(match[2]);
                          const now = new Date();
                          const currentMonth = now.getMonth() + 1;
                          const currentYear = now.getFullYear();

                          if (year < currentYear || (year === currentYear && month < currentMonth)) {
                            throw new Error('Card is expired');
                          }
                        },
                      },
                    ]}
                    normalize={(value) => {
                      const digits = String(value ?? '').replace(/\D/g, '').slice(0, 4);
                      if (digits.length <= 2) return digits;
                      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
                    }}
                    className="flex-1 min-w-[140px]"
                  >
                    <Input
                      placeholder="MM/YY"
                      inputMode="numeric"
                      maxLength={5}
                      className="bg-white border-[#C8E6C9] text-slate-900 rounded-xl h-11 hover:border-[#81C784]"
                    />
                  </Form.Item>
                  <Form.Item
                    name="cvv"
                    label={<span className="text-slate-600 text-xs uppercase font-bold tracking-widest">CVV</span>}
                    rules={[
                      { required: true, message: 'Please enter cvv' },
                      { len: 3, message: 'Must be 3 digits' },
                      { pattern: /^\d+$/, message: 'Digits only' },
                    ]}
                    normalize={(value) => String(value ?? '').replace(/\D/g, '').slice(0, 3)}
                    className="flex-1 min-w-[140px]"
                  >
                    <Input
                      placeholder="123"
                      inputMode="numeric"
                      maxLength={3}
                      className="bg-white border-[#C8E6C9] text-slate-900 rounded-xl h-11 hover:border-[#81C784]"
                    />
                  </Form.Item>
              </div>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div className="p-6 bg-[#F9FAF9] border border-[#C8E6C9] rounded-2xl mb-8">
              <Text strong className="text-slate-900 mb-4 block text-lg"><BankOutlined className="mr-2 text-[#F97316]" /> Bank Account Details</Text>
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#C8E6C9] mb-6">
                <div className="flex justify-between"><Text type="secondary">Bank:</Text><Text strong className="text-slate-900">Bank of Ceylon (BOC)</Text></div>
                <div className="flex justify-between"><Text type="secondary">Branch:</Text><Text strong className="text-slate-900">University Branch</Text></div>
                <div className="flex justify-between"><Text type="secondary">Account Name:</Text><Text strong className="text-slate-900">Smart Event Club</Text></div>
                <div className="flex justify-between"><Text type="secondary">Account Number:</Text><Text strong className="text-slate-900">0084 1234 5678</Text></div>
              </div>
              
              <Form.Item name="slip" label={<span className="text-slate-600 text-xs uppercase font-bold tracking-widest">Upload Deposit Slip</span>} rules={[{ required: true, message: 'Please upload the slip' }]}>
                <Upload action="/upload" listType="picture" maxCount={1}>
                  <Button icon={<UploadOutlined />} className="w-full h-11 bg-white border-dashed border-[#C8E6C9] text-slate-600 hover:text-[#2E7D32] hover:border-[#4CAF50] rounded-xl transition-colors">Click to Upload Slip</Button>
                </Upload>
              </Form.Item>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="p-6 bg-[#F9FAF9] border border-[#C8E6C9] rounded-2xl mb-8">
              <Text strong className="text-slate-900 mb-4 block text-lg"><WalletOutlined className="mr-2 text-[#4CAF50]" /> Cash Payment</Text>
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#C8E6C9] mb-6">
                <Text className="text-slate-600">You have selected to pay by cash. Please make the payment at the registration desk on the day of the event.</Text>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="p-6 bg-[#F9FAF9] border border-[#C8E6C9] rounded-2xl mb-8 flex flex-col items-center justify-center text-center">
              <Text strong className="text-slate-900 mb-4 block text-lg">Pay with PayPal</Text>
              <Text className="text-slate-600 mb-6 block text-sm max-w-sm">
                You will be redirected safely to PayPal to securely complete your purchase.
              </Text>
              <Button type="primary" size="large" className="bg-[#0070BA] hover:bg-[#003087] border-0 h-11 px-8 rounded-xl font-bold flex items-center justify-center">
                Proceed to PayPal
              </Button>
            </div>
          )}
          
          <Button type="primary" htmlType="submit" size="large" block disabled={loading}>
            {loading ? <Spin /> : 'Pay Now'}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Payment;
