import React, { useState } from 'react';
import { Form, Input, Button, Rate, message, Card, Radio } from 'antd';
import { SmileOutlined, MehOutlined, FrownOutlined, SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const customIcons = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};

const categoryStyles = `
  .feedback-category-options .ant-radio-button-wrapper {
    border-inline-start-width: 1px !important;
    border-color: #334155 !important;
    background: #1e293b !important;
    color: #94a3b8 !important;
  }

  .feedback-category-options .ant-radio-button-wrapper-checked {
    background-color: rgba(20, 184, 166, 0.2) !important;
    border-color: #14B8A6 !important;
    color: #14B8A6 !important;
    box-shadow: none !important;
  }

  .feedback-category-options .ant-radio-button-wrapper-checked::before {
    display: none !important;
  }

  .feedback-category-options .ant-radio-button-wrapper:hover {
    color: #38bdf8 !important;
    border-color: #38bdf8 !important;
  }
`;

const FeedbackForm = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      messageApi.success('Your feedback has been submitted successfully!');
      form.resetFields();
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] bg-white font-sans rounded-3xl overflow-hidden relative p-8 flex items-center justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#4CAF50]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#81C784]/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 text-center">
          <Card className="border border-[#C8E6C9] shadow-xl shadow-green-900/5 rounded-3xl overflow-hidden p-12 bg-white">
            <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6">
              <SmileOutlined className="text-5xl text-[#4CAF50]" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Submitted Successfully!</h2>
            <p className="text-slate-600 mb-8">
              Thank you for sharing your thoughts. Your feedback helps us build a better experience for everyone.
            </p>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => setSubmitted(false)}
              className="bg-gradient-to-r from-[#43A047] to-[#4CAF50] border-0 rounded-xl px-10 font-bold shadow-md shadow-green-600/20"
            >
              SHARE MORE FEEDBACK
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#F8FAF8] font-sans selection:bg-[#4CAF50]/25 rounded-3xl overflow-hidden relative p-8 flex items-center justify-center">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#4CAF50]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#81C784]/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10">
        <Card 
          className="border border-[#C8E6C9] shadow-xl shadow-green-900/5 rounded-3xl overflow-hidden"
          bodyStyle={{ padding: '3rem', background: '#FFFFFF', borderRadius: '1.5rem' }}
          style={{ background: '#FFFFFF' }}
        >
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold uppercase tracking-widest mb-6">
              We value your opinion
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50]">Feedback</span>
            </h2>
            <p className="text-slate-600 font-medium">
              Help us improve your experience by providing your honest feedback and rating.
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
            requiredMark={false}
          >
            <Form.Item
              name="rating"
              label={<span className="text-slate-800 font-bold tracking-wide uppercase text-sm">How would you rate your experience?</span>}
              rules={[{ required: true, message: 'Please provide a rating' }]}
              className="text-center mb-8"
            >
              <Rate 
                character={({ index }) => customIcons[index + 1]} 
                className="text-4xl text-[#4CAF50] hover:text-[#2E7D32] transition-colors"
                style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
              />
            </Form.Item>

            <Form.Item
              name="category"
              label={<span className="text-slate-800 font-bold tracking-wide uppercase text-sm">Feedback Category</span>}
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <style>{`
                .feedback-category-options .ant-radio-button-wrapper {
                  border-inline-start-width: 1px !important;
                  border-color: #C8E6C9 !important;
                  background: #F9FAF9 !important;
                  color: #475569 !important;
                }
                .feedback-category-options .ant-radio-button-wrapper-checked {
                  background-color: #E8F5E9 !important;
                  border-color: #4CAF50 !important;
                  color: #2E7D32 !important;
                  box-shadow: none !important;
                }
                .feedback-category-options .ant-radio-button-wrapper-checked::before {
                  display: none !important;
                }
                .feedback-category-options .ant-radio-button-wrapper:hover {
                  color: #2E7D32 !important;
                  border-color: #81C784 !important;
                }
              `}</style>
              <Radio.Group className="w-full feedback-category-options">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['General', 'Bug Report', 'Feature Request', 'UI/UX'].map(cat => (
                    <Radio.Button 
                      key={cat} 
                      value={cat} 
                      className="h-12 flex items-center justify-center rounded-xl border font-bold text-sm transition-all text-center"
                    >
                      {cat}
                    </Radio.Button>
                  ))}
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="subject"
              label={<span className="text-slate-800 font-bold tracking-wide uppercase text-sm">Subject</span>}
              rules={[{ required: true, message: 'Please enter a subject' }]}
            >
              <Input 
                size="large" 
                placeholder="Briefly describe your feedback" 
                className="border-[#C8E6C9] text-slate-900 placeholder-slate-400 hover:border-[#81C784] focus:border-[#4CAF50] rounded-xl px-4 py-3 font-medium transition-colors"
                style={{ background: '#FFFFFF', color: '#0f172a' }}
              />
            </Form.Item>

            <Form.Item
              name="message"
              label={<span className="text-slate-800 font-bold tracking-wide uppercase text-sm">Detailed Feedback</span>}
              rules={[{ required: true, message: 'Please enter your feedback details' }]}
            >
              <TextArea 
                rows={6} 
                placeholder="Tell us exactly what you think..." 
                className="border-[#C8E6C9] text-slate-900 placeholder-slate-400 hover:border-[#81C784] focus:border-[#4CAF50] rounded-xl p-4 text-base resize-none font-medium transition-colors"
                style={{ background: '#FFFFFF', color: '#0f172a' }}
              />
            </Form.Item>

            <Form.Item className="mt-8 mb-0">
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                loading={submitting}
                icon={!submitting && <SendOutlined />}
                className="w-full h-14 bg-gradient-to-r from-[#43A047] to-[#4CAF50] hover:from-[#388E3C] hover:to-[#43A047] border-0 rounded-xl text-lg font-bold tracking-wider shadow-lg shadow-green-600/20 text-white transition-all"
              >
                SUBMIT FEEDBACK
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackForm;