import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Modal, Form, Input, InputNumber, Button, Typography, message, Radio, Tooltip, Upload, Steps } from 'antd';
import api from '@/lib/api';
import { CarOutlined, CheckCircleFilled, CreditCardOutlined, BankOutlined, UploadOutlined, CheckOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const buildParkingSlots = (occupiedIds) => {
  const occupied = new Set(
    (occupiedIds || [])
      .map((id) => String(id).trim().toUpperCase())
      .filter(Boolean)
  );
  const slots = [];
  const rows = ['A', 'B', 'C', 'D'];
  rows.forEach((row) => {
    for (let i = 1; i <= 8; i++) {
      const id = `${row}${i}`;
      slots.push({ id, row, number: i, occupied: occupied.has(id) });
    }
  });
  return slots;
};

const paymentTypes = [
  { value: 'standard', label: 'Standard', price: 1000, color: '#4CAF50', perks: 'General seating' },
  { value: 'vip', label: 'VIP', price: 2500, color: '#F97316', perks: 'Front row + Snacks' },
  { value: 'vvip', label: 'VVIP', price: 5000, color: '#8B5CF6', perks: 'VIP Lounge + Merch' },
];

const TicketSales = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();
  const [selectedPaymentType, setSelectedPaymentType] = useState('standard');
  const [selectedParkingSlot, setSelectedParkingSlot] = useState(null);
  const [occupiedParkingIds, setOccupiedParkingIds] = useState([]);
  const [parkingFetchLoading, setParkingFetchLoading] = useState(false);
  const [paymentMethodForm, setPaymentMethodForm] = useState('card');
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingConfirm, setBookingConfirm] = useState(null);

  const parkingSlots = useMemo(
    () => buildParkingSlots(occupiedParkingIds),
    [occupiedParkingIds]
  );

  useEffect(() => {
    if (!isModalOpen || currentStep !== 1) return undefined;
    let cancelled = false;
    (async () => {
      setParkingFetchLoading(true);
      try {
        const { data } = await api.get('/api/tickets/parking/occupied');
        if (!cancelled) {
          const raw = data.occupiedSlotIds || [];
          setOccupiedParkingIds(
            raw.map((id) => String(id).trim().toUpperCase()).filter(Boolean)
          );
        }
      } catch (err) {
        if (!cancelled) {
          setOccupiedParkingIds([]);
          message.warning('Could not load booked parking slots. Check the API is running.');
        }
      } finally {
        if (!cancelled) setParkingFetchLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      setParkingFetchLoading(false);
    };
  }, [isModalOpen, currentStep]);

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['fullName', 'email', 'phone', 'quantity']);
      }
      setCurrentStep(curr => curr + 1);
    } catch (err) {
      console.log('Validation Failed:', err);
    }
  };

  const handlePrev = () => {
    setCurrentStep(curr => curr - 1);
  };

  const columns = [
    { title: 'Event', dataIndex: 'event', key: 'event', className: 'font-bold text-gray-900' },
    { title: 'Tickets Sold', dataIndex: 'sold', key: 'sold', className: 'text-gray-600 font-medium' },
    { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', className: 'text-green-400 font-bold' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider border border-green-200">
          {status}
        </span>
      ) 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <button 
          onClick={() => {
            setSelectedEvent(record);
            setSelectedPaymentType('standard');
            setSelectedParkingSlot(null);
            setCurrentStep(0);
            form.resetFields();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-[#43A047] to-[#4CAF50] text-white rounded-xl font-bold text-sm shadow-md shadow-green-600/15 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 transform active:scale-95"
        >
          Book Ticket
        </button>
      )
    }
  ];

  const getSelectedTypeInfo = () => paymentTypes.find(t => t.value === selectedPaymentType);

  const handleBookingSubmit = async (values) => {
    const typeInfo = getSelectedTypeInfo();
    const qty = values.quantity || 1;
    const totalAmount = typeInfo.price * qty + (selectedParkingSlot ? 500 : 0);
    const bookingId = `TKT-${Date.now().toString(36).toUpperCase()}`;

    const confirmData = {
      bookingId,
      name: values.fullName,
      email: values.email,
      event: selectedEvent.event,
      passType: typeInfo.label,
      quantity: qty,
      parking: selectedParkingSlot,
      total: totalAmount,
      qrData: `BOOKING:${bookingId}|EVENT:${selectedEvent.event}|NAME:${values.fullName}|PASS:${typeInfo.label}|QTY:${qty}|TOTAL:Rs.${totalAmount}`,
    };

    try {
      await api.post('/api/tickets', {
        bookingId,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        quantity: qty,
        event: selectedEvent.event,
        passType: typeInfo.label,
        passCode: selectedPaymentType,
        parkingSlot: selectedParkingSlot,
        totalAmount,
        paymentMethod: values.paymentMethod,
      });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.details?.join?.(', ') ||
        'Could not save your booking. Please try again.';
      message.error(msg);
      return;
    }

    if (selectedParkingSlot) {
      const slotId = String(selectedParkingSlot).trim().toUpperCase();
      setOccupiedParkingIds((prev) =>
        prev.includes(slotId) ? prev : [...prev, slotId]
      );
    }

    setIsModalOpen(false);
    setBookingConfirm(confirmData);
  };

  const data = [
    { key: '1', event: 'CodeRed Hackathon', sold: 120, revenue: 'Rs. 1200', status: 'Active' },
    { key: '2', event: 'Robotics Workshop', sold: 45, revenue: 'Rs. 4500', status: 'Active' },
  ];

  const availableCount = parkingSlots.filter(s => !s.occupied).length;
  const totalSlots = parkingSlots.length;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#4CAF50]/25 rounded-3xl overflow-hidden shadow-lg shadow-green-900/5 relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#E8F5E9]/90 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 p-6 md:p-8">
        <nav className="w-full bg-white shadow-sm border border-[#C8E6C9] px-8 py-5 flex flex-col md:flex-row justify-between items-center mb-16 rounded-3xl sticky top-4 z-50">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] tracking-tighter uppercase mb-4 md:mb-0">
            Uni Gallery
          </h1>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-bold uppercase tracking-widest text-gray-600">
            <span onClick={() => navigate('/news')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">News</span>
            <span onClick={() => navigate('/meetings')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Meetings</span>
            <span onClick={() => navigate('/gallery')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Gallery</span>
            <span onClick={() => navigate('/feedback')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Feedback</span>
            <span className="text-[#2E7D32] border-b-2 border-[#4CAF50] pb-1">Ticket Sales</span>
          </div>
        </nav>

        <main className="max-w-[1200px] mx-auto pb-20">
          
          {/* Page Heading */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold uppercase tracking-widest mb-6">
              Track Performace & Revenue
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter mb-6">
              Ticket <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] via-[#4CAF50] to-[#F97316]">Dashboard</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Monitor your event ticket sales, track revenue, and analyze attendance all in one place.
            </p>
          </div>

          {/* Content Area */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#C8E6C9] shadow-green-900/5">
            <Table 
              columns={columns} 
              dataSource={data} 
              pagination={false}
              className="custom-ticket-table"
              rowClassName="transition-colors"
            />
          </div>

          <Modal
            title={<Title level={3} className="m-0 text-[#2E7D32]">Book Your Tickets</Title>}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            centered
            width={640}
            className="booking-modal dark-modal"
          >
            <div className="mb-8 p-6 bg-gradient-to-br from-[#43A047] to-[#4CAF50] rounded-2xl shadow-lg shadow-green-600/20 transform transition-all">
              <Text className="block mb-2 text-xs uppercase font-black tracking-[0.2em] text-white/90">Proceeding with</Text>
              <Text strong className="text-2xl text-white tracking-tight">{selectedEvent?.event}</Text>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleBookingSubmit}
              requiredMark={false}
              initialValues={{ quantity: 1 }}
              className="px-2"
            >
              <style>{`
                .booking-wizard-steps .ant-steps-item-title {
                  color: #9ca3af !important;
                  font-weight: bold;
                  font-size: 11px;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                }
                .booking-wizard-steps .ant-steps-item-active .ant-steps-item-title {
                  color: #4CAF50 !important;
                }
                .booking-wizard-steps .ant-steps-item-wait .ant-steps-item-icon {
                  border-color: #4b5563 !important;
                  background-color: transparent !important;
                }
                .booking-wizard-steps .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon {
                  color: #9ca3af !important;
                }
                .booking-wizard-steps .ant-steps-item-finish .ant-steps-item-icon {
                  border-color: #4CAF50 !important;
                }
                .booking-wizard-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
                  color: #4CAF50 !important;
                }
              `}</style>
              <Steps 
                current={currentStep} 
                items={[
                  { title: 'Your Details' },
                  { title: 'Pass Options' },
                  { title: 'Payment' }
                ]} 
                className="mb-8 px-2 booking-wizard-steps"
              />

              {/* STEP 1: DETAILS */}
              <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
              <Form.Item
                name="fullName"
                label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Full Name</span>}
                rules={[
                  { required: true, message: 'Please enter your full name' },
                  { pattern: /^[A-Za-z\s]+$/, message: 'Name must contain letters only, no numbers allowed!' },
                  { pattern: /^[A-Z]/, message: 'First letter must be capital!' },
                ]}
              >
                <Input size="large" placeholder="Enter your full name" className="rounded-xl bg-white border border-[#C8E6C9] text-gray-900 hover:border-[#4CAF50] focus:border-[#4CAF50]" />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Email Address</span>}
                rules={[
                  { required: true, message: 'Required' },
                  { type: 'email', message: 'Enter a valid email' }
                ]}
              >
                <Input size="large" placeholder="example@email.com" className="rounded-xl bg-white border border-[#C8E6C9] text-gray-900 hover:border-[#4CAF50] focus:border-[#4CAF50]" />
              </Form.Item>

              <div className="flex gap-4">
                <Form.Item
                  name="phone"
                  label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Phone Number</span>}
                  rules={[
                    { required: true, message: 'Required' },
                    { pattern: /^0[0-9]{9}$/, message: 'Must be 10 digits and start with 0' }
                  ]}
                  className="flex-1"
                >
                  <Input
                    size="large"
                    placeholder="07XXXXXXXX"
                    maxLength={10}
                    className="rounded-xl bg-white border border-[#C8E6C9] text-gray-900 hover:border-[#4CAF50] focus:border-[#4CAF50]"
                    onChange={(e) => {
                      const numericOnly = e.target.value.replace(/[^0-9]/g, '');
                      form.setFieldValue('phone', numericOnly);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="quantity"
                  label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Tickets</span>}
                  initialValue={1}
                  rules={[
                    { required: true, message: 'Please enter quantity' },
                    {
                      validator: async (_, value) => {
                        const qty = Number(value);
                        if (Number.isFinite(qty) && qty === 1) return;
                        throw new Error('You can select 1 ticket only');
                      },
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={1}
                    size="large"
                    className="w-full rounded-xl bg-white border border-[#C8E6C9] text-gray-900 hover:border-[#4CAF50] focus:border-[#4CAF50]"
                    disabled
                  />
                </Form.Item>
              </div>

              </div>

              {/* STEP 2: OPTIONS */}
              <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
              {/* ===== PAYMENT TYPE SELECTION ===== */}
              <div className="mb-6">
                <Text className="block font-bold text-gray-600 uppercase text-xs tracking-widest mb-3">Select Pass Type</Text>
                <div className="grid grid-cols-3 gap-3">
                  {paymentTypes.map(type => {
                    const isSelected = selectedPaymentType === type.value;
                    return (
                      <div
                        key={type.value}
                        onClick={() => setSelectedPaymentType(type.value)}
                        className="cursor-pointer rounded-2xl p-4 text-center transition-all duration-300 transform hover:scale-[1.03]"
                        style={{
                          border: `2px solid ${isSelected ? type.color : 'rgba(255,255,255,0.1)'}`,
                          background: isSelected ? `${type.color}15` : 'rgba(255,255,255,0.03)',
                          boxShadow: isSelected ? `0 0 20px ${type.color}30` : 'none',
                        }}
                      >
                        <div className="text-2xl font-black tracking-tight" style={{ color: type.color }}>
                          Rs. {type.price}
                        </div>
                        <div className="text-gray-900 font-bold text-sm mt-1">{type.label}</div>
                        <div className="text-gray-500 text-xs mt-1">{type.perks}</div>
                        {isSelected && (
                          <CheckCircleFilled style={{ color: type.color, fontSize: 18, marginTop: 8 }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ===== PARKING SLOT AVAILABILITY ===== */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <Text className="font-bold text-gray-600 uppercase text-xs tracking-widest">
                    <CarOutlined className="mr-2 text-[#4CAF50]" />
                    Parking Slots
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {parkingFetchLoading ? (
                      <span className="text-gray-400">Loading parking…</span>
                    ) : (
                      <>
                        <span className="text-[#4CAF50] font-bold">{availableCount}</span> / {totalSlots}{' '}
                        available
                      </>
                    )}
                    {selectedParkingSlot && (
                      <span className="ml-2 text-[#F97316] font-bold">• +Rs. 500.00</span>
                    )}
                  </Text>
                </div>

                <div className="p-4 rounded-2xl border border-[#C8E6C9] bg-[#F7FCF7]">
                  {/* Legend */}
                  <div className="flex gap-4 mb-3 justify-center">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span className="w-3 h-3 rounded bg-[#4CAF50]/30 border border-[#4CAF50]/50 inline-block"></span> Available
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50 inline-block"></span> Occupied
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span className="w-3 h-3 rounded bg-[#F97316] border border-[#F97316] inline-block"></span> Selected
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-8 gap-1.5">
                    {parkingSlots.map(slot => {
                      const isSelected = selectedParkingSlot === slot.id;
                      const isOccupied = slot.occupied;
                      
                      let bgColor = 'rgba(76, 175, 80, 0.12)';
                      let borderColor = 'rgba(76, 175, 80, 0.35)';
                      let textColor = '#4CAF50';
                      
                      if (isOccupied) {
                        bgColor = 'rgba(239, 68, 68, 0.15)';
                        borderColor = 'rgba(239, 68, 68, 0.35)';
                        textColor = '#6B7280';
                      } else if (isSelected) {
                        bgColor = '#F97316';
                        borderColor = '#F97316';
                        textColor = '#FFFFFF';
                      }

                      return (
                        <Tooltip
                          key={slot.id}
                          title={
                            isOccupied
                              ? `${slot.id} — Booked (unavailable)`
                              : isSelected
                                ? `${slot.id} — Your selection`
                                : `${slot.id} — Available`
                          }
                        >
                          <div
                            onClick={() => {
                              if (!isOccupied) {
                                setSelectedParkingSlot(isSelected ? null : slot.id);
                              }
                            }}
                            className="flex items-center justify-center rounded-lg text-[10px] font-bold transition-all duration-200"
                            style={{
                              height: 32,
                              background: bgColor,
                              border: `1.5px solid ${borderColor}`,
                              color: textColor,
                              cursor: isOccupied ? 'not-allowed' : 'pointer',
                              opacity: isOccupied ? 0.5 : 1,
                            }}
                          >
                            {slot.id}
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>

                  {selectedParkingSlot && (
                    <div className="mt-3 text-center">
                      <Tag color="#F97316" className="text-xs font-bold px-3 py-0.5">
                        🅿️ Slot {selectedParkingSlot} reserved
                      </Tag>
                    </div>
                  )}
                </div>
              </div>

              </div>

              {/* STEP 3: PAYMENT */}
              <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
              {/* ===== PAYMENT METHOD SELECTION ===== */}
              <Form.Item
                name="paymentMethod"
                label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Select Payment Method</span>}
                rules={[{ required: true, message: 'Please select a payment method' }]}
                className="mb-8"
                initialValue="card"
              >
                <style>{`
                  .ticket-payment-options .ant-radio-button-wrapper-checked {
                    background-color: #4CAF50 !important;
                    border-color: #4CAF50 !important;
                    color: white !important;
                  }
                  .ticket-payment-options .ant-radio-button-wrapper-checked::before {
                    background-color: transparent !important;
                    display: none !important;
                  }
                  .ticket-payment-options .ant-radio-button-wrapper:hover {
                    color: #4CAF50;
                  }
                  .ticket-payment-options .ant-radio-button-wrapper:focus-within,
                  .ticket-payment-options .ant-radio-button-wrapper:focus {
                    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.35) !important;
                    border-inline-start-color: #4CAF50 !important;
                  }
                `}</style>
                <Radio.Group 
                  className="w-full flex gap-4 ticket-payment-options"
                  onChange={(e) => setPaymentMethodForm(e.target.value)}
                >
                  <Radio.Button value="card" className="flex-1 h-12 flex items-center justify-center font-bold rounded-xl border-[#C8E6C9] bg-white text-gray-600 transition-all">
                    <CreditCardOutlined className="mr-2" /> Card
                  </Radio.Button>
                  <Radio.Button value="bank" className="flex-1 h-12 flex items-center justify-center font-bold rounded-xl border-[#C8E6C9] bg-white text-gray-600 transition-all">
                    <BankOutlined className="mr-2" /> Bank Deposit
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>

              {/* ===== CONDITIONAL PAYMENT DETAILS ===== */}
              {paymentMethodForm === 'card' && (
                <div className="p-5 bg-[#F7FCF7] border border-[#C8E6C9] rounded-2xl mb-6 shadow-inner">
                  <Text className="text-gray-900 mb-4 block text-sm font-bold"><CreditCardOutlined className="mr-2 text-[#4CAF50]" /> Card Details</Text>
                  
                  <Form.Item name="cardName" label={<span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Name on Card</span>} rules={[{ required: true, message: 'Required' }]} className="mb-3">
                    <Input placeholder="John Doe" className="bg-white border-[#C8E6C9] text-gray-900 rounded-lg h-10 hover:border-[#4CAF50] focus:border-[#4CAF50]" />
                  </Form.Item>
                  
                  <Form.Item name="cardNumber" label={<span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Card Number</span>} rules={[{ required: true, len: 16, message: '16 digits' }]} className="mb-3">
                    <Input placeholder="1234 5678 9101 1121" maxLength={16} className="bg-white border-[#C8E6C9] text-gray-900 rounded-lg h-10 hover:border-[#4CAF50] focus:border-[#4CAF50]" />
                  </Form.Item>
                  
                  <div className="flex gap-3">
                      <Form.Item name="expiry" label={<span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Expiry</span>} rules={[{ required: true, message: 'Required' }, { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Use MM/YY format (e.g. 08/27)' }]} className="flex-1 mb-0">
                        <Input placeholder="MM/YY" maxLength={5} className="bg-white border-[#C8E6C9] text-gray-900 rounded-lg h-10 hover:border-[#4CAF50] focus:border-[#4CAF50]"
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                            form.setFieldValue('expiry', val);
                          }}
                        />
                      </Form.Item>
                      <Form.Item name="cvv" label={<span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">CVV</span>} rules={[{ required: true, len: 3 }]} className="flex-1 mb-0">
                        <Input placeholder="123" maxLength={3} className="bg-white border-[#C8E6C9] text-gray-900 rounded-lg h-10 hover:border-[#4CAF50] focus:border-[#4CAF50]" />
                      </Form.Item>
                  </div>
                </div>
              )}

              {paymentMethodForm === 'bank' && (
                <div className="p-5 bg-[#F7FCF7] border border-[#C8E6C9] rounded-2xl mb-6 shadow-inner">
                  <Text className="text-gray-900 mb-4 block text-sm font-bold"><BankOutlined className="mr-2 text-[#F97316]" /> Bank Deposit Info</Text>
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-[#C8E6C9] mb-4 text-xs">
                    <div className="flex justify-between"><Text type="secondary">Bank:</Text><Text strong className="text-gray-900">Bank of Ceylon (BOC)</Text></div>
                    <div className="flex justify-between"><Text type="secondary">Branch:</Text><Text strong className="text-gray-900">University Branch</Text></div>
                    <div className="flex justify-between"><Text type="secondary">Name:</Text><Text strong className="text-gray-900">Smart Event Club</Text></div>
                    <div className="flex justify-between"><Text type="secondary">Acc. Number:</Text><Text strong className="text-gray-900">0084 1234 5678</Text></div>
                  </div>
                  <Form.Item name="slip" label={<span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Upload Deposit Slip</span>} rules={[{ required: true, message: 'Please upload the slip' }]} className="mb-0">
                    <Upload action="/upload" listType="picture" maxCount={1}>
                      <Button icon={<UploadOutlined />} className="w-full h-10 bg-white border-dashed border-[#C8E6C9] text-gray-600 hover:text-[#2E7D32] hover:border-[#4CAF50] rounded-lg transition-all hover:bg-[#E8F5E9]">Click to Upload Slip</Button>
                    </Upload>
                  </Form.Item>
                </div>
              )}

              {/* ===== TOTAL SUMMARY ===== */}
              <div className="mb-6 p-4 rounded-2xl border border-[#C8E6C9] bg-[#E8F5E9]/50">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600 text-sm">Pass: {getSelectedTypeInfo()?.label}</Text>
                  <Text className="text-gray-900 font-bold">Rs. {getSelectedTypeInfo()?.price}.00</Text>
                </div>
                {selectedParkingSlot && (
                  <div className="flex justify-between items-center mt-1">
                    <Text className="text-gray-600 text-sm">Parking ({selectedParkingSlot})</Text>
                    <Text className="text-gray-900 font-bold">Rs. 500.00</Text>
                  </div>
                )}
                <div className="border-t border-[#C8E6C9] mt-2 pt-2 flex justify-between items-center">
                  <Text className="text-gray-900 font-black uppercase text-xs tracking-widest">Total</Text>
                  <Text className="text-[#4CAF50] font-black text-xl">
                    Rs. {getSelectedTypeInfo()?.price + (selectedParkingSlot ? 500 : 0)}.00
                  </Text>
                </div>
              </div>
              
              </div>

              {/* WIZARD NAVIGATION CONTROLS */}
              <div className="flex justify-between items-center mt-8 pt-4 border-t border-[#E8F5E9]">
                <Button 
                  onClick={handlePrev} 
                  disabled={currentStep === 0}
                  className={`h-12 px-8 rounded-xl font-bold transition-all border-0 ${currentStep === 0 ? 'opacity-0 cursor-default hidden' : 'bg-transparent text-gray-500 hover:text-[#2E7D32] hover:bg-[#E8F5E9]'}`}
                >
                  BACK
                </Button>
                
                {currentStep < 2 ? (
                  <Button 
                    type="primary" 
                    onClick={handleNext}
                    className="h-12 px-10 bg-[#4CAF50] hover:bg-[#43A047] border-0 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all ml-auto text-white"
                  >
                    CONTINUE TO NEXT
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="h-12 px-10 bg-gradient-to-r from-[#F97316] to-[#f59e0b] border-0 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-white ml-auto"
                  >
                    COMPLETE BOOKING
                  </Button>
                )}
              </div>
            </Form>
          </Modal>

        </main>
      </div>

      {/* Booking Confirmation + QR Modal */}
      {bookingConfirm && (
        <Modal
          open={!!bookingConfirm}
          onCancel={() => setBookingConfirm(null)}
          footer={null}
          centered
          width={480}
          className="dark-modal"
        >
          <div className="text-center py-4">
            {/* Success icon */}
            <div className="w-16 h-16 rounded-full bg-[#4CAF50]/20 border-2 border-[#4CAF50] flex items-center justify-center mx-auto mb-4">
              <CheckOutlined style={{ fontSize: 28, color: '#4CAF50' }} />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-1">Booking Confirmed!</h2>
            <p className="text-gray-600 text-sm mb-6">Your ticket has been reserved successfully.</p>

            {/* QR Code via Google Charts API */}
            <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(bookingConfirm.qrData)}`}
                alt="Booking QR Code"
                width={180}
                height={180}
                className="rounded-lg"
              />
            </div>

            {/* Booking details */}
            <div className="bg-[#F7FCF7] border border-[#C8E6C9] rounded-2xl p-4 text-left mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Booking ID</span>
                <span className="text-[#2E7D32] font-black tracking-wider">{bookingConfirm.bookingId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Name</span>
                <span className="text-gray-900 font-semibold">{bookingConfirm.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Event</span>
                <span className="text-gray-900 font-semibold">{bookingConfirm.event}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pass</span>
                <span className="text-gray-900 font-semibold">{bookingConfirm.passType} × {bookingConfirm.quantity}</span>
              </div>
              {bookingConfirm.parking && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Parking</span>
                  <span className="text-[#F97316] font-semibold">Slot {bookingConfirm.parking}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-[#C8E6C9] pt-2 mt-2">
                <span className="text-gray-900 font-black uppercase text-xs tracking-widest">Total Paid</span>
                <span className="text-[#4CAF50] font-black text-lg">Rs. {bookingConfirm.total}.00</span>
              </div>
            </div>

            <p className="text-gray-500 text-xs mb-6">Show this QR code at the event entrance for check-in.</p>

            <Button
              onClick={() => setBookingConfirm(null)}
              className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-white border-0"
              style={{ background: 'linear-gradient(to right, #43A047, #66BB6A)' }}
            >
              Done
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TicketSales;
