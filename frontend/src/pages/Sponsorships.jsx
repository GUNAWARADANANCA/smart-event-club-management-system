import React, { useState } from 'react';
import { CalendarDays, MapPin, Users, CheckCircle2, Mail, Phone, ExternalLink, Send } from 'lucide-react';
import { Modal, Form, Input, Button, message, Typography } from 'antd';

const { Title, Text } = Typography;

export default function Sponsorships() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSponsorSubmit = (values) => {
    console.log('Sponsorship Application:', values);
    message.success('Application submitted successfully! Our team will contact you soon.');
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="min-h-[80vh] bg-transparent p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-[#FFFFFF]/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-[#E2E8F0]">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side: Brand/Event Info with strong gradient */}
          <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#14B8A6] via-[#14B8A6] to-[#ffffff]">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#14B8A6] rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
            
            <div className="relative z-10">
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/30 text-purple-300 text-xs font-bold tracking-wider uppercase mb-8 shadow-md">
                Premium Sponsorship Opportunity
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight" style={{ borderBottom: 'none' }}>
                Tech Innovation <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] to-blue-400">Expo 2026</span>
              </h1>
              <p className="text-purple-100 text-base leading-relaxed mb-10 opacity-95">
                Join the largest gathering of tech innovators, developers, and industry leaders. Position your brand at the forefront of the digital revolution!
              </p>
              
              <div className="space-y-5">
                <div className="flex items-center text-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mr-4 border border-purple-500/20">
                    <CalendarDays className="w-5 h-5 text-[#0F766E]" />
                  </div>
                  <span className="font-medium text-white">August 15-17, 2026</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 border border-blue-500/20">
                    <MapPin className="w-5 h-5 text-[#14B8A6]" />
                  </div>
                  <span className="font-medium text-white">Grand Silicon Convention Center</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-4 border border-pink-500/20">
                    <Users className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <span className="font-medium text-white">5,000+ Attendees Expected</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side: Benefits and Call to Action */}
          <div className="lg:w-7/12 p-8 lg:p-12 bg-[#F8FAFC] flex flex-col justify-between relative z-20 shadow-md">
            <div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-8 border-b border-[#E2E8F0] pb-4">Exclusive Sponsor Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 mb-10">
                {[
                  'Premium double-booth location',
                  '15 VIP All-Access passes for team',
                  '45-Minute Keynote speaking slot',
                  'Logo placement on all marketing',
                  'Pre & Post event attendee list',
                  'Dedicated executive breakout room'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start group">
                    <CheckCircle2 className="w-5 h-5 mr-3 text-[#1FAF9A] flex-shrink-0 mt-0.5 group-hover:text-[#1FAF9A] transition-colors" />
                    <span className="text-gray-600 group-hover:text-black transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-8 border-t border-[#E2E8F0] mt-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-3 w-full sm:w-auto">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Connect With Us</p>
                  <div className="flex items-center text-gray-600 hover:text-[#0F766E] cursor-pointer transition-colors">
                    <Mail className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">sponsor@tech2026.com</span>
                  </div>
                  <div className="flex items-center text-gray-600 hover:text-[#0F766E] cursor-pointer transition-colors">
                    <Phone className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">+1 (555) 123-4567</span>
                  </div>
                </div>
                
                <button onClick={() => setIsModalOpen(true)} className="btn-teal-primary">
                  <span className="tracking-wide">Become a Sponsor</span>
                  <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={<div className="text-xl font-bold text-[#1FAF9A]">Become a Sponsor</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="rounded-3xl overflow-hidden"
      >
        <Form form={form} layout="vertical" onFinish={handleSponsorSubmit} className="mt-4">
          <Form.Item name="companyName" label="Company Name" rules={[{ required: true, message: 'Please enter company name' }]}>
            <Input placeholder="E.g. Tech Corp" className="rounded-xl border-[#E2E8F0]" />
          </Form.Item>
          <Form.Item name="contactName" label="Contact Person" rules={[{ required: true, message: 'Please enter contact name' }]}>
            <Input placeholder="E.g. Jane Doe" className="rounded-xl border-[#E2E8F0]" />
          </Form.Item>
          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input placeholder="E.g. jane@techcorp.com" className="rounded-xl border-[#E2E8F0]" />
          </Form.Item>
          <Form.Item name="package" label="Interested Package" rules={[{ required: true, message: 'Please select a package' }]}>
            <Input placeholder="E.g. Platinum, Gold, etc." className="rounded-xl border-[#E2E8F0]" />
          </Form.Item>
          <Form.Item className="mb-0 mt-6">
            <Button type="primary" htmlType="submit" className="btn-teal-primary w-full h-12">
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
