import React, { useState } from 'react';
import { Form, Input, Button, Rate, message, Card, Typography, Radio } from 'antd';
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
      <>
        {contextHolder}
        <div className="min-h-[80vh] bg-white font-sans rounded-3xl overflow-hidden relative p-8 flex items-center justify-center">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#14B8A6]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0F766E]/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="w-full max-w-md relative z-10 text-center">
            <Card
              className="border border-[#14B8A6]/20 shadow-2xl rounded-3xl overflow-hidden p-12"
              style={{ background: '#0f172a' }}
              variant="outlined"
            >
              <div className="w-20 h-20 bg-[#14B8A6]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <SmileOutlined className="text-5xl text-[#14B8A6]" />
              </div>

              <h2 className="text-3xl font-black text-white mb-4">Submitted Successfully!</h2>

              <p className="text-slate-400 mb-8">
                Thank you for sharing your thoughts. Your feedback helps us build a better experience for everyone.
              </p>

              <Button
                type="primary"
                size="large"
                onClick={() => setSubmitted(false)}
                className="bg-gradient-to-r from-[#0F766E] to-[#14B8A6] border-0 rounded-xl px-10 font-bold"
              >
                SHARE MORE FEEDBACK
              </Button>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <style>{categoryStyles}</style>

      <div
        className="min-h-[80vh] bg-white font-sans selection:bg-[#1FAF9A]/30 rounded-3xl overflow-hidden relative p-8 flex items-center justify-center"
        style={{ background: '#f8fafc' }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#14B8A6]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0F766E]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-2xl relative z-10">
          <Card
            className="border border-[#14B8A6]/20 shadow-2xl rounded-3xl overflow-hidden"
            styles={{
              body: {
                padding: '3rem',
                background: '#0f172a',
                borderRadius: '1.5rem',
              },
            }}
            style={{ background: '#0f172a' }}
            variant="outlined"
          >
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-1 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/30 text-[#14B8A6] text-xs font-bold uppercase tracking-widest mb-6">
                We value your opinion
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
                Share Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#14B8A6]">
                  Feedback
                </span>
              </h2>

              <p className="text-slate-400 font-medium">
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
                label={
                  <span className="text-white font-bold tracking-wide uppercase text-sm">
                    How would you rate your experience?
                  </span>
                }
                rules={[{ required: true, message: 'Please provide a rating' }]}
                className="text-center mb-8"
              >
                <Rate
                  character={({ index = 0 }) => customIcons[index + 1]}
                  className="text-4xl text-[#14B8A6] hover:text-[#0F766E] transition-colors"
                  style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
                />
              </Form.Item>

              <Form.Item
                name="category"
                label={
                  <span className="text-white font-bold tracking-wide uppercase text-sm">
                    Feedback Category
                  </span>
                }
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Radio.Group className="w-full feedback-category-options">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['General', 'Bug Report', 'Feature Request', 'UI/UX'].map((cat) => (
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
                label={
                  <span className="text-white font-bold tracking-wide uppercase text-sm">
                    Subject
                  </span>
                }
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input
                  size="large"
                  placeholder="Briefly describe your feedback"
                  className="border-[#334155] text-white placeholder-slate-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl px-4 py-3 font-medium"
                  style={{ background: '#1e293b', color: '#f1f5f9' }}
                />
              </Form.Item>

              <Form.Item
                name="message"
                label={
                  <span className="text-white font-bold tracking-wide uppercase text-sm">
                    Detailed Feedback
                  </span>
                }
                rules={[{ required: true, message: 'Please enter your feedback details' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Tell us exactly what you think..."
                  className="border-[#334155] text-white placeholder-slate-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl p-4 text-base resize-none font-medium"
                  style={{ background: '#1e293b', color: '#f1f5f9' }}
                />
              </Form.Item>

              <Form.Item className="mt-8 mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitting}
                  icon={!submitting ? <SendOutlined /> : null}
                  className="w-full h-14 bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:from-[#0F766E] hover:to-[#0d9488] border-0 rounded-xl text-lg font-bold tracking-wider shadow-lg shadow-teal-900/20 text-white"
                >
                  SUBMIT FEEDBACK
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;