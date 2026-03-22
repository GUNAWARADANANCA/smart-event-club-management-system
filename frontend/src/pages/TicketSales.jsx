import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, message, Upload } from 'antd';
import { Ticket, Coins, TrendingUp, Users, Upload as UploadIcon } from 'lucide-react';
import axios from 'axios';

const { Option } = Select;

export default function TicketSales() {
  const summaryCards = [
    { title: 'Total Revenue', value: 'RS 13,569,300', icon: <Coins className="w-6 h-6 text-emerald-400" />, trend: '+12% this week', color: 'from-emerald-500/20 to-emerald-900/20' },
    { title: 'Tickets Sold', value: '1,245', icon: <Ticket className="w-6 h-6 text-[#0F766E]" />, trend: '+8% this week', color: 'from-[#0F766E]/20 to-[#F8FAFC]' },
    { title: 'Active Events', value: '8', icon: <TrendingUp className="w-6 h-6 text-[#14B8A6]" />, trend: 'Stable', color: 'from-blue-500/20 to-blue-900/20' },
    { title: 'VIP Passes', value: '120', icon: <Users className="w-6 h-6 text-[#F97316]" />, trend: '+3% this week', color: 'from-[#F97316]/20 to-pink-900/20' },
  ];

  const [salesData, setSalesData] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setSalesData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [parkingRequired, setParkingRequired] = useState(false);
  const [isOnlinePayment, setIsOnlinePayment] = useState(false);
  const [isBankTransfer, setIsBankTransfer] = useState(false);
  const [form] = Form.useForm();

  const handleBookingSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('event', values.event);
      formData.append('buyer', values.fullName);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      if (values.studentId) formData.append('studentId', values.studentId);
      formData.append('type', values.type);
      formData.append('quantity', values.quantity || 1);
      formData.append('paymentMethod', values.paymentMethod);
      formData.append('amount', values.amount);
      formData.append('parkingRequired', values.parkingRequired === 'Yes');
      if (values.parkingSlot) formData.append('parkingSlot', values.parkingSlot);

      if (values.paymentMethod === 'Online') {
        formData.append('cardDetails', JSON.stringify({
          holderName: values.cardHolderName,
          cardNumber: values.cardNumber.slice(-4),
          expiryDate: values.expiryDate
        }));
      }

      if (values.paymentMethod === 'Bank Transfer') {
        formData.append('bankReference', values.bankReference);
        if (values.receiptFile && values.receiptFile.fileList[0]) {
          formData.append('receiptFile', values.receiptFile.fileList[0].originFileObj);
        }
      }

      await axios.post('http://localhost:5000/api/bookings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      message.success('Booking request submitted successfully!');
      setIsModalVisible(false);
      setParkingRequired(false);
      setIsOnlinePayment(false);
      setIsBankTransfer(false);
      form.resetFields();
      fetchBookings();
    } catch (err) {
      message.error('Failed to submit booking');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#14B8A6]/30 p-6 md:p-8 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0F766E]/5 to-transparent pointer-events-none z-0"></div>
      
      <div className="relative z-10 max-w-[1600px] mx-auto pb-20">
        
        {/* Local Navbar Area mirroring EventsGallery */}
        <nav className="w-full bg-[#FFFFFF] shadow-sm backdrop-blur-2xl border border-[#E2E8F0] px-8 py-5 flex flex-col md:flex-row justify-between items-center mb-10 rounded-3xl shadow-2xl z-50">
          <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] to-[#14B8A6] tracking-tighter uppercase mb-4 md:mb-0">
            Ticket Sales Hub
          </h1>
          <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-gray-500">
            <span className="text-slate-800 border-b-2 border-purple-500 pb-1">Overview</span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Reports</span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Settings</span>
          </div>
        </nav>

        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-[#0F766E]/10 border border-[#14B8A6]/30 text-[#0F766E] text-xs font-bold uppercase tracking-widest mb-4">
              Financial Dashboard
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter mb-4 drop-shadow-md">
              Sales <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] via-[#14B8A6] to-[#F97316]">Metrics</span>
            </h2>
            <p className="text-lg text-gray-500 font-medium max-w-2xl">
              Monitor real-time ticket transactions, revenue analytics, and overall financial performance for your university events.
            </p>
          </div>
          <button onClick={() => setIsModalVisible(true)} className="px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm bg-gradient-to-r from-[#0F766E] to-[#14B8A6] text-white shadow-md hover:scale-105 transition-transform">
            Booking Ticket
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {summaryCards.map((card, idx) => (
            <div key={idx} className={`p-6 rounded-3xl bg-gradient-to-br ${card.color} border border-[#E2E8F0] backdrop-blur-md shadow-xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8FAFC] rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#E2E8F0] transition-colors duration-500 pointer-events-none"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl border border-[#E2E8F0] backdrop-blur-md shadow-inner">
                  {card.icon}
                </div>
                <span className="text-xs font-bold text-gray-500 bg-[#F8FAFC] border border-[#E2E8F0] backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E2E8F0] shadow-inner">{card.trend}</span>
              </div>
              <h3 className="text-gray-500 font-bold tracking-wider text-sm uppercase mb-2">{card.title}</h3>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Sales Table Area */}
        <div className="bg-[#FFFFFF] shadow-sm backdrop-blur-2xl border border-[#E2E8F0] rounded-3xl p-6 md:p-10 shadow-md relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-wide uppercase">Recent Transactions</h2>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] shadow-sm border border-[#E2E8F0] text-gray-600 hover:text-slate-800 hover:border-[#14B8A6]/50 hover:bg-[#0F766E]/5 transition-all duration-300 text-sm font-bold uppercase tracking-wider backdrop-blur-md">Filter</button>
              <button className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] shadow-sm border border-[#E2E8F0] text-gray-600 hover:text-slate-800 hover:border-[#F97316]/50 hover:bg-[#F97316]/10 transition-all duration-300 text-sm font-bold uppercase tracking-wider backdrop-blur-md">Sort</button>
            </div>
          </div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-[#E2E8F0] text-gray-500 text-xs font-black uppercase tracking-widest">
                  <th className="pb-5 pr-6 w-32">Txn ID</th>
                  <th className="pb-5 pr-6">Event</th>
                  <th className="pb-5 pr-6">Buyer</th>
                  <th className="pb-5 pr-6 w-32">Ticket Type</th>
                  <th className="pb-5 pr-6 w-24">Amount</th>
                  <th className="pb-5 pr-6 w-32">Pay Method</th>
                  <th className="pb-5 pr-6 w-28">Date</th>
                  <th className="pb-5 w-32">Payment Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-medium">
                {salesData.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group">
                    <td className="py-6 pr-6 font-mono text-[#0F766E] group-hover:text-purple-300 transition-colors">{(row._id || row.id || '').toString().slice(-6).toUpperCase()}</td>
                    <td className="py-6 pr-6 text-slate-800 group-hover:text-[#F97316] transition-colors font-bold tracking-wide">{row.event}</td>
                    <td className="py-6 pr-6 text-gray-500 group-hover:text-slate-800 transition-colors">{row.buyer}</td>
                    <td className="py-6 pr-6">
                      <span className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-gray-600">
                        {row.type}
                      </span>
                    </td>
                    <td className="py-6 pr-6 font-black text-lg text-emerald-400 tracking-tight">RS {row.amount?.toLocaleString()}</td>
                    <td className="py-6 pr-6 text-gray-500 font-bold uppercase tracking-wider text-xs">{row.paymentMethod || 'Online'}</td>
                    <td className="py-6 pr-6 text-gray-500">{new Date(row.date).toLocaleDateString()}</td>
                    <td className="py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                        (row.status === 'Completed' || row.status === 'Approved') 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md' 
                          : row.status === 'Rejected'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-md'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-md'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Form Modal */}
        <Modal
          title={<div className="text-xl font-bold text-gray-800 tracking-wide uppercase">Book New Ticket</div>}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setParkingRequired(false);
            setIsOnlinePayment(false);
            setIsBankTransfer(false);
            form.resetFields();
          }}
          footer={null}
          destroyOnClose
          styles={{ content: { background: 'transparent', boxShadow: 'none' }, body: { background: 'transparent' } }}
        >
          <Form form={form} layout="vertical" onFinish={handleBookingSubmit} className="mt-4">
            <Form.Item name="event" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Select Event</span>} rules={[{ required: true, message: 'Please select an event' }]}>
              <Select placeholder="Choose an event" className="green-select" popupClassName="green-dropdown">
                <Option value="Spring Break Hackathon">Spring Break Hackathon</Option>
                <Option value="Global Tech Symposium">Global Tech Symposium</Option>
                <Option value="University Chess Masters">University Chess Masters</Option>
                <Option value="Annual Cultural Night">Annual Cultural Night</Option>
              </Select>
            </Form.Item>
            <Form.Item name="fullName" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Full Name</span>} rules={[{ required: true, message: 'Please enter full name' }]}>
              <Input placeholder="E.g. John Doe" />
            </Form.Item>
            <Form.Item name="email" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Email Address</span>} rules={[{ required: true, message: 'Please enter email address', type: 'email' }]}>
              <Input placeholder="E.g. john@example.com" />
            </Form.Item>
            <Form.Item name="phone" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Phone Number</span>} rules={[{ required: true, message: 'Please enter phone number' }]}>
              <Input placeholder="E.g. +94 77 123 4567" />
            </Form.Item>
            <Form.Item name="studentId" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Student ID (Optional)</span>}>
              <Input placeholder="E.g. IT21000000" />
            </Form.Item>
            <Form.Item name="type" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Ticket Type</span>} rules={[{ required: true, message: 'Please select ticket type' }]}>
              <Select 
                placeholder="Select type"
                className="green-select"
                popupClassName="green-dropdown"
                onChange={(value) => {
                  const prices = {
                    'General': 10000,
                    'VIP': 45000,
                    'Student': 4500
                  };
                  const qty = form.getFieldValue('quantity') || 1;
                  form.setFieldsValue({ amount: (prices[value] || 0) * qty });
                }}
              >
                <Option value="General">General</Option>
                <Option value="VIP">VIP</Option>
                <Option value="Student">Student</Option>
              </Select>
            </Form.Item>

            <Form.Item name="parkingRequired" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Parking Required</span>} rules={[{ required: true, message: 'Please select if parking is required' }]}>
              <Select placeholder="Yes / No" className="green-select" popupClassName="green-dropdown" onChange={(value) => setParkingRequired(value === 'Yes')}>
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </Form.Item>

            {parkingRequired && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl border border-[#E2E8F0] mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-500 uppercase text-xs tracking-widest">Available Slots:</span>
                  <span className="font-black text-emerald-400 tracking-wider">42 Slots</span>
                </div>
                <Form.Item name="parkingSlot" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Select Parking Slot</span>} rules={[{ required: true, message: 'Please select a parking slot' }]} className="mb-0">
                  <Select placeholder="Choose slot" className="green-select" popupClassName="green-dropdown">
                    <Option value="A-01">A-01</Option>
                    <Option value="A-02">A-02</Option>
                    <Option value="B-01">B-01</Option>
                    <Option value="B-02">B-02</Option>
                    <Option value="VIP-1">VIP-1</Option>
                  </Select>
                </Form.Item>
              </div>
            )}

            <div className="flex gap-4">
              <Form.Item name="quantity" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Quantity</span>} initialValue={1} rules={[{ required: true, message: 'Please enter quantity' }]} className="flex-1">
                <InputNumber style={{ width: '100%' }} min={1} max={10} onChange={(val) => {
                  const type = form.getFieldValue('type');
                  if (type) {
                    const prices = { 'General': 10000, 'VIP': 45000, 'Student': 4500 };
                    form.setFieldsValue({ amount: (prices[type] || 0) * val });
                  }
                }}/>
              </Form.Item>
              <Form.Item name="paymentMethod" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Payment Method</span>} rules={[{ required: true, message: 'Please select method' }]} className="flex-1">
                <Select placeholder="Select method" className="green-select" popupClassName="green-dropdown" onChange={(value) => {
                  setIsOnlinePayment(value === 'Online');
                  setIsBankTransfer(value === 'Bank Transfer');
                }}>
                  <Option value="Online">Online Credit/Debit</Option>
                  <Option value="Bank Transfer">Bank Transfer</Option>
                </Select>
              </Form.Item>
            </div>

            {isBankTransfer && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl border border-[#E2E8F0] mb-6">
                <div className="mb-4">
                  <span className="font-bold text-[#14B8A6] uppercase text-xs tracking-widest">Bank Transfer Details</span>
                </div>
                <Form.Item name="bankReference" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Reference Number</span>} rules={[{ required: true, message: 'Please enter reference number' }]}>
                  <Input placeholder="E.g. REF-2026-991823" className="bg-[#F8FAFC] border-[#E2E8F0] text-slate-800 placeholder:text-gray-500 hover:border-blue-500 focus:border-blue-500" />
                </Form.Item>
                <Form.Item name="receiptFile" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Upload Receipt (JPG/PNG/PDF)</span>} rules={[{ required: true, message: 'Please upload the payment receipt' }]}>
                  <Upload 
                    beforeUpload={(file) => {
                      const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
                      if (!isValidType) {
                        message.error('You can only upload JPG/PNG/PDF files!');
                      }
                      return false; // Prevent automatic upload
                    }}
                    maxCount={1}
                    accept=".jpg,.jpeg,.png,.pdf"
                  >
                    <button type="button" className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] shadow-sm border border-[#E2E8F0] text-gray-600 hover:text-slate-800 hover:border-blue-500/50 hover:bg-[#0F766E]/10 transition-all duration-300 flex items-center gap-2">
                      <UploadIcon className="w-4 h-4" /> Select File
                    </button>
                  </Upload>
                </Form.Item>
              </div>
            )}

            {isOnlinePayment && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl border border-[#E2E8F0] mb-6">
                <div className="mb-4">
                  <span className="font-bold text-[#0F766E] uppercase text-xs tracking-widest">Secure Card Payment</span>
                </div>
                <Form.Item name="cardHolderName" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Card Holder Name</span>} rules={[{ required: true, message: 'Please enter card holder name' }]}>
                  <Input placeholder="E.g. John Doe" className="bg-[#F8FAFC] border-[#E2E8F0] text-slate-800 placeholder:text-gray-500 hover:border-[#0F766E] focus:border-[#0F766E]" />
                </Form.Item>
                <Form.Item name="cardNumber" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Card Number</span>} rules={[
                  { required: true, message: 'Please enter a valid card number' },
                  { pattern: /^[0-9]{16}$/, message: 'Card number must be exactly 16 digits' }
                ]}>
                  <Input placeholder="1234 5678 9101 1121" maxLength={16} className="bg-[#F8FAFC] border-[#E2E8F0] text-slate-800 placeholder:text-gray-500 hover:border-[#0F766E] focus:border-[#0F766E] font-mono tracking-widest" />
                </Form.Item>
                <div className="flex gap-4">
                  <Form.Item name="expiryDate" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Expiry Date</span>} rules={[
                    { required: true, message: 'Please enter expiry date' },
                    { pattern: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/, message: 'Format MM/YY' }
                  ]} className="flex-1 mb-0">
                    <Input placeholder="MM/YY" maxLength={5} className="bg-[#F8FAFC] border-[#E2E8F0] text-slate-800 placeholder:text-gray-500 hover:border-[#0F766E] focus:border-[#0F766E] font-mono" />
                  </Form.Item>
                  <Form.Item name="cvv" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">CVV</span>} rules={[
                    { required: true, message: 'Please enter CVV' },
                    { pattern: /^[0-9]{3,4}$/, message: 'CVV must be 3 or 4 digits' }
                  ]} className="flex-1 mb-0">
                    <Input placeholder="123" maxLength={4} type="password" className="bg-[#F8FAFC] border-[#E2E8F0] text-slate-800 placeholder:text-gray-500 hover:border-[#0F766E] focus:border-[#0F766E] font-mono tracking-widest" />
                  </Form.Item>
                </div>
              </div>
            )}

            <Form.Item name="amount" label={<span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Amount (RS)</span>} rules={[{ required: true, message: 'Please enter amount' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="E.g. 1500" min={1} />
            </Form.Item>
            <Form.Item className="mb-0 mt-6 flex justify-end">
              <button type="submit" className="px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-sm bg-[#0F766E] hover:bg-[#14B8A6] text-white shadow-lg transition-colors">
                Book Ticket
              </button>
            </Form.Item>
          </Form>
        </Modal>

      </div>
    </div>
  );
}
