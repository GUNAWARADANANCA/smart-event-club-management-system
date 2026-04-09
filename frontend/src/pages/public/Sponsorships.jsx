import React, { useState } from 'react';
import { CalendarDays, MapPin, Users, CheckCircle2, Mail, Phone, ExternalLink } from 'lucide-react';
import { Modal, Form, Input, Button, message } from 'antd';

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
    <div className="min-h-[80vh] bg-gradient-to-br from-white via-[#F7FCF7] to-[#E8F5E9] p-4 md:p-8 flex items-center justify-center rounded-3xl">
      <div className="max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-xl border border-[#C8E6C9] shadow-green-900/10">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#43A047] via-[#4CAF50] to-[#81C784]">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/20 rounded-full blur-2xl opacity-50" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-white/15 rounded-full blur-2xl opacity-40" />

            <div className="relative z-10">
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold tracking-wider uppercase mb-8 shadow-sm">
                Premium Sponsorship Opportunity
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight" style={{ borderBottom: 'none' }}>
                Tech Innovation <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#E8F5E9]">Expo 2026</span>
              </h1>
              <p className="text-white/90 text-base leading-relaxed mb-10">
                Join the largest gathering of tech innovators, developers, and industry leaders. Position your brand at the forefront of the digital revolution!
              </p>

              <div className="space-y-5">
                <div className="flex items-center text-white">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4 border border-white/30">
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">August 15-17, 2026</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mr-4 border border-white/25">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">Grand Silicon Convention Center</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mr-4 border border-white/25">
                    <Users className="w-5 h-5 text-[#FFF9C4]" />
                  </div>
                  <span className="font-medium">5,000+ Attendees Expected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-7/12 p-8 lg:p-12 bg-white flex flex-col justify-between relative z-20">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b border-[#E8F5E9] pb-4">Exclusive Sponsor Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 mb-10">
                {[
                  'Premium double-booth location',
                  '15 VIP All-Access passes for team',
                  '45-Minute Keynote speaking slot',
                  'Logo placement on all marketing',
                  'Pre & Post event attendee list',
                  'Dedicated executive breakout room',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start group">
                    <CheckCircle2 className="w-5 h-5 mr-3 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 group-hover:text-[#2E7D32] transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-[#E8F5E9] mt-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-3 w-full sm:w-auto">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Connect With Us</p>
                  <div className="flex items-center text-gray-500 hover:text-[#2E7D32] cursor-pointer transition-colors">
                    <Mail className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">sponsor@tech2026.com</span>
                  </div>
                  <div className="flex items-center text-gray-500 hover:text-[#2E7D32] cursor-pointer transition-colors">
                    <Phone className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">+1 (555) 123-4567</span>
                  </div>
                </div>

                <button type="button" onClick={() => setIsModalOpen(true)} className="btn-teal-primary">
                  <span className="tracking-wide">Become a Sponsor</span>
                  <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={<div className="text-xl font-bold text-[#2E7D32]">Become a Sponsor</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="rounded-3xl overflow-hidden"
      >
        <Form form={form} layout="vertical" onFinish={handleSponsorSubmit} className="mt-4">
          <Form.Item name="companyName" label="Company Name" rules={[{ required: true, message: 'Please enter company name' }]}>
            <Input placeholder="E.g. Tech Corp" className="rounded-xl border-[#C8E6C9]" />
          </Form.Item>
          <Form.Item name="contactName" label="Contact Person" rules={[{ required: true, message: 'Please enter contact name' }]}>
            <Input placeholder="E.g. Jane Doe" className="rounded-xl border-[#C8E6C9]" />
          </Form.Item>
          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input placeholder="E.g. jane@techcorp.com" className="rounded-xl border-[#C8E6C9]" />
          </Form.Item>
          <Form.Item name="package" label="Interested Package" rules={[{ required: true, message: 'Please select a package' }]}>
            <Input placeholder="E.g. Platinum, Gold, etc." className="rounded-xl border-[#C8E6C9]" />
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
