import React, { useState } from 'react';
import { Form, Input, Button, Card, Space, Typography, message, Divider, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        timeLimit: values.timeLimit,
        eventId: values.eventId,
        questions: values.questions.map(q => ({
          text: q.text,
          options: [q.option1, q.option2, q.option3, q.option4],
          correctAnswer: q.correctAnswer
        }))
      };

      await api.post('/quiz', payload);
      message.success('Quiz created successfully!');
      navigate('/quizzes');
    } catch (err) {
      console.error(err);
      message.error('Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#1FAF9A]/30 rounded-3xl overflow-hidden relative p-6 md:p-8">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/quizzes')}
          className="hover:scale-105 transition-transform btn-teal-secondary bg-white/10 border-white/20 text-white"
        />
        <Title level={4} className="m-0 !text-[#94A3B8] tracking-tight font-extrabold uppercase tracking-widest text-xs border-b border-[#1FAF9A]/30 pb-2">Create New Quiz</Title>
      </div>
 
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ questions: [{}] }}
        autoComplete="off"
      >
        <Card className="bg-[#0F172A] border-[#1E293B] shadow-2xl rounded-3xl mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6]/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#14B8A6]/20 transition-colors duration-500 pointer-events-none"></div>
          <Title level={4} className="!text-white mb-6 relative z-10 font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-2">General Information</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label={<Text className="text-gray-300 font-semibold tracking-wide uppercase text-xs tracking-widest">Quiz Title</Text>}
              rules={[
                { required: true, message: 'Please input quiz title!' },
                { pattern: /^[A-Za-z\s]+$/, message: 'Quiz title must contain letters only, no numbers allowed!' }
              ]}
            >
              <Input placeholder="Enter quiz title" className="bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl h-10" />
            </Form.Item>

            <Form.Item
              name="eventId"
              label={<Text className="text-gray-300 font-semibold tracking-wide uppercase text-xs tracking-widest">Associated Event</Text>}
              rules={[{ required: true, message: 'Please select an event association' }]}
            >
              <Select 
                placeholder="Select event" 
                className="dark-select"
                popupClassName="dark-dropdown"
              >
                <Option value={101}>Tech Symposium 2026</Option>
                <Option value={102}>AI Ethics Workshop</Option>
                <Option value={103}>CodeRed Hackathon</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="timeLimit"
              label={<Text className="text-gray-300 font-semibold tracking-wide uppercase text-xs tracking-widest">Time Limit (minutes)</Text>}
              rules={[{ required: true, message: 'Please set a time limit!' }]}
            >
              <Select
                placeholder="Select time limit"
                className="dark-select"
                popupClassName="dark-dropdown"
              >
                {[5, 10, 15, 20, 30, 45, 60, 90, 120].map(t => (
                  <Option key={t} value={t}>{t} minutes</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label={<Text className="text-gray-300 font-semibold tracking-wide uppercase text-xs tracking-widest">Description</Text>}
            rules={[{ pattern: /^[A-Za-z\s]+$/, message: 'Description must contain letters only, no numbers allowed!' }]}
          >
            <Input.TextArea placeholder="Enter quiz description" rows={3} className="bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl resize-none" />
          </Form.Item>
        </Card>

        <Divider orientation="left" className="!border-white/10">
          <Text className="text-gray-400 font-bold uppercase tracking-widest text-xs">Questions</Text>
        </Divider>

        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Card 
                  key={key} 
                  className="bg-[#0F172A] border-white/10 shadow-lg rounded-2xl mb-6 relative overflow-hidden group"
                  title={<Text className="text-gray-300 font-bold uppercase text-xs tracking-widest">Question {index + 1}</Text>}
                  extra={
                    fields.length > 1 && (
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => remove(name)}
                        className="hover:bg-red-500/10 rounded-full"
                      />
                    )
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'text']}
                    rules={[
                      { required: true, message: 'Missing question text' },
                      { pattern: /^[A-Za-z\s]+$/, message: 'Question must contain letters only!' }
                    ]}
                  >
                    <Input.TextArea placeholder="Type your question here..." className="bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl resize-none" />
                  </Form.Item>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'option1']}
                      label={<Text className="text-gray-500 text-xs uppercase font-bold tracking-tight">Option 1</Text>}
                      rules={[{ required: true, message: 'Missing option 1' }, { pattern: /^[A-Za-z\s]+$/, message: 'Letters only!' }]}
                    >
                      <Input placeholder="Option 1" className="bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl h-10" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option2']}
                      label={<Text className="text-gray-500 text-xs uppercase font-bold tracking-tight">Option 2</Text>}
                      rules={[{ required: true, message: 'Missing option 2' }, { pattern: /^[A-Za-z\s]+$/, message: 'Letters only!' }]}
                    >
                      <Input placeholder="Option 2" className="bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl h-10" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option3']}
                      label={<Text className="text-gray-500 text-xs uppercase font-bold tracking-tight">Option 3</Text>}
                      rules={[{ required: true, message: 'Missing option 3' }, { pattern: /^[A-Za-z\s]+$/, message: 'Letters only!' }]}
                    >
                      <Input placeholder="Option 3" className="bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl h-10" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option4']}
                      label={<Text className="text-gray-500 text-xs uppercase font-bold tracking-tight">Option 4</Text>}
                      rules={[{ required: true, message: 'Missing option 4' }, { pattern: /^[A-Za-z\s]+$/, message: 'Letters only!' }]}
                    >
                      <Input placeholder="Option 4" className="bg-white/5 border-white/10 text-white placeholder-gray-500 hover:border-[#14B8A6] focus:border-[#14B8A6] rounded-xl h-10" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    {...restField}
                    name={[name, 'correctAnswer']}
                    label={<Text className="text-[#0F766E] font-bold uppercase tracking-wider text-xs">Correct Answer</Text>}
                    rules={[{ required: true, message: 'Please select the correct answer' }]}
                  >
                    <Select 
                      placeholder="Select correct option" 
                      className="dark-select"
                      popupClassName="dark-dropdown"
                    >
                      <Option value={1}>Option 1</Option>
                      <Option value={2}>Option 2</Option>
                      <Option value={3}>Option 3</Option>
                      <Option value={4}>Option 4</Option>
                    </Select>
                  </Form.Item>
                </Card>
              ))}
              <Form.Item>
                 <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  block 
                  icon={<PlusOutlined />}
                  className="h-16 border-dashed border-[#14B8A6] text-[#14B8A6] hover:text-white hover:border-[#14B8A6] bg-white/5 hover:bg-[#14B8A6]/10 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all"
                >
                  Add Question Now
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item className="mt-12">
           <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            icon={<SaveOutlined />}
            loading={loading}
            className="h-14 bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:from-[#0F766E] hover:to-[#0d9488] border-0 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl transition-all text-white"
          >
            Create Quiz Now
          </Button>
        </Form.Item>
      </Form>
      </div>
    </div>
  );
};

export default CreateQuiz;
