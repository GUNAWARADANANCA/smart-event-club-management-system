import React, { useState } from 'react';
import { Form, Input, Button, Card, Space, Typography, message, Divider, Select, Tooltip, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined, QuestionCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
const { Title, Text } = Typography;
const { Option } = Select;

const LOCAL_QUIZZES_KEY = 'localQuizzes';

const addLocalQuiz = (quiz) => {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_QUIZZES_KEY) || '[]');
    const next = Array.isArray(existing) ? [quiz, ...existing] : [quiz];
    localStorage.setItem(LOCAL_QUIZZES_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
};

const isoDate = (date) => date.toISOString().slice(0, 10);

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);

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

      await api.post('/api/quiz', payload);
      message.success({
        content: 'Quiz created successfully!',
        icon: <CheckCircleOutlined style={{ color: '#4CAF50' }} />,
        duration: 3,
      });
      form.resetFields();
      setQuestionCount(1);
      navigate('/quizzes', { state: { refresh: true } });
    } catch (error) {
      message.error('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = (add) => {
    add();
    setQuestionCount(prev => prev + 1);
    message.info(`Question ${questionCount + 1} added`, 1);
  };

  const handleRemoveQuestion = (remove, name) => {
    remove(name);
    setQuestionCount(prev => prev - 1);
    message.warning('Question removed', 1);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#4CAF50]/25 rounded-3xl overflow-hidden relative p-6 md:p-8 bg-gradient-to-br from-gray-50 to-[#F1F8E9]">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-[#4CAF50]/5 via-transparent to-transparent pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Tooltip title="Back to Quizzes">
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/quizzes')}
                className="hover:scale-105 transition-transform btn-teal-secondary bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32] hover:!bg-[#4CAF50] hover:!text-white hover:!border-[#4CAF50] rounded-xl"
              />
            </Tooltip>
            <div>
              <Title level={4} className="!text-[#2E7D32] tracking-tight font-extrabold uppercase tracking-widest text-xs border-l-4 border-[#4CAF50] pl-3 m-0">
                Create New Quiz
              </Title>
              <Text type="secondary" className="text-xs ml-3">Fill in the details to create your quiz</Text>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#E8F5E9] px-3 py-1 rounded-full">
              <Text className="text-[#2E7D32] text-xs font-semibold">
                Questions: {questionCount}
              </Text>
            </div>
          </div>
        </div>
 
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ questions: [{}] }}
          autoComplete="off"
        >
          {/* General Information Card */}
          <Card className="bg-white border-[#C8E6C9] shadow-lg rounded-3xl mb-8 relative overflow-hidden group transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CAF50]/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#4CAF50]/20 transition-colors duration-500 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4CAF50]/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <div className="w-1 h-6 bg-[#4CAF50] rounded-full"></div>
              <Title level={4} className="!text-gray-900 m-0 font-bold uppercase tracking-widest text-sm">
                General Information
              </Title>
              <Tooltip title="Basic details about your quiz">
                <QuestionCircleOutlined className="text-gray-400 cursor-help" />
              </Tooltip>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label={<Text className="text-gray-600 font-semibold tracking-wide uppercase text-xs tracking-widest">Quiz Title *</Text>}
              rules={[
                { required: true, message: 'Please input quiz title!' },
                { whitespace: true, message: 'Quiz title cannot be empty.' },
                { pattern: /^[A-Za-z\s]+$/, message: 'Numbers are not allowed (letters only).' },
                { min: 3, message: 'Title must be at least 3 characters' }
              ]}
              normalize={(value) =>
                String(value ?? '')
                  .replace(/[^A-Za-z\s]/g, '')
                  .replace(/\s+/g, ' ')
                  .trimStart()
              }
            >
              <Input 
                placeholder="e.g., JavaScript Fundamentals" 
                className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl h-10 transition-all duration-200"
                prefix={<span className="text-[#4CAF50] mr-2">📝</span>}
              />
            </Form.Item>

            <Form.Item
              name="eventId"
              label={<Text className="text-gray-600 font-semibold tracking-wide uppercase text-xs tracking-widest">Associated Event *</Text>}
              rules={[{ required: true, message: 'Please select an event association' }]}
            >
              <Select 
                placeholder="Select event" 
                className="dark-select rounded-xl"
                popupClassName="dark-dropdown"
                suffixIcon={<span className="text-[#4CAF50]">▼</span>}
              >
                <Option value={101}>🎯 Tech Symposium 2026</Option>
                <Option value={102}>🤖 AI Ethics Workshop</Option>
                <Option value={103}>💻 CodeRed Hackathon</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="timeLimit"
              label={<Text className="text-gray-600 font-semibold tracking-wide uppercase text-xs tracking-widest">Time Limit *</Text>}
              rules={[{ required: true, message: 'Please set a time limit!' }]}
              tooltip="Set how many minutes participants have to complete the quiz"
            >
              <Select
                placeholder="Select time limit"
                className="dark-select rounded-xl"
                popupClassName="dark-dropdown"
                suffixIcon={<span className="text-[#4CAF50]">⏱️</span>}
              >
                {[5, 10, 15, 20, 30, 45, 60, 90, 120].map(t => (
                  <Option key={t} value={t}>
                    {t} minute{t !== 1 ? 's' : ''}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label={<Text className="text-gray-600 font-semibold tracking-wide uppercase text-xs tracking-widest">Description</Text>}
            rules={[
              { pattern: /^[A-Za-z\s]+$/, message: 'Description must contain letters only, no numbers allowed!' },
              { max: 500, message: 'Description cannot exceed 500 characters' }
            ]}
            normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
            tooltip="Provide a brief description of what this quiz covers"
          >
            <Input.TextArea 
              placeholder="Enter quiz description (optional)" 
              rows={3} 
              className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl resize-none transition-all duration-200"
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Card>

        <Divider orientation="left" className="!border-white/10 my-6">
          <div className="flex items-center gap-2">
            <Text className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              Questions
            </Text>
            <div className="h-px w-20 bg-gradient-to-r from-[#4CAF50] to-transparent"></div>
          </div>
        </Divider>

        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Card 
                  key={key} 
                  className="bg-gradient-to-br from-white to-[#F7FCF7] border-[#C8E6C9] shadow-md rounded-2xl mb-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg"
                  title={
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#4CAF50] text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <Text className="text-gray-700 font-bold uppercase text-xs tracking-widest">
                        Question
                      </Text>
                    </div>
                  }
                  extra={
                    fields.length > 1 && (
                      <Tooltip title="Remove question">
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => handleRemoveQuestion(remove, name)}
                          className="hover:bg-red-500/10 rounded-full transition-all duration-200"
                        />
                      </Tooltip>
                    )
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'text']}
                    rules={[
                      { required: true, message: 'Missing question text' },
                      { pattern: /^[A-Za-z\s]+$/, message: 'Question must contain letters only!' },
                      { min: 5, message: 'Question must be at least 5 characters' }
                    ]}
                    normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
                  >
                    <Input.TextArea 
                      placeholder="Type your question here..." 
                      rows={2}
                      className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl resize-none transition-all duration-200 font-medium"
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'option1']}
                      label={<Text className="text-gray-500 text-xs uppercase font-bold tracking-tight">Option A</Text>}
                      rules={[
                        { required: true, message: 'Missing option 1' }, 
                        { pattern: /^[A-Za-z\s]+$/, message: 'Numbers are not allowed (letters only).' }
                      ]}
                      normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
                    >
                      <Input 
                        placeholder="Option A" 
                        className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl h-10 transition-all duration-200"
                        prefix="A."
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option2']}
                      label={<Text className="text-gray-500 text-xs uppercase font-bold tracking-tight">Option B</Text>}
                      rules={[
                        { required: true, message: 'Missing option 2' }, 
                        { pattern: /^[A-Za-z\s]+$/, message: 'Numbers are not allowed (letters only).' }
                      ]}
                      normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
                    >
                      <Input 
                        placeholder="Option B" 
                        className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl h-10 transition-all duration-200"
                        prefix="B."
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option3']}
                      label={<Text className="text-gray-500 text-xs uppercase font-bold tracking-tight">Option C</Text>}
                      rules={[
                        { required: true, message: 'Missing option 3' }, 
                        { pattern: /^[A-Za-z\s]+$/, message: 'Numbers are not allowed (letters only).' }
                      ]}
                      normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
                    >
                      <Input 
                        placeholder="Option C" 
                        className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl h-10 transition-all duration-200"
                        prefix="C."
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option4']}
                      label={<Text className="text-gray-500 text-xs uppercase font-bold tracking-tight">Option D</Text>}
                      rules={[
                        { required: true, message: 'Missing option 4' }, 
                        { pattern: /^[A-Za-z\s]+$/, message: 'Numbers are not allowed (letters only).' }
                      ]}
                      normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
                    >
                      <Input 
                        placeholder="Option D" 
                        className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl h-10 transition-all duration-200"
                        prefix="D."
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    {...restField}
                    name={[name, 'correctAnswer']}
                    label={
                      <div className="flex items-center gap-2">
                        <Text className="text-[#2E7D32] font-bold uppercase tracking-wider text-xs">
                          Correct Answer
                        </Text>
                        <Tooltip title="Select which option is the correct answer">
                          <QuestionCircleOutlined className="text-[#2E7D32] text-xs" />
                        </Tooltip>
                      </div>
                    }
                    rules={[{ required: true, message: 'Please select the correct answer' }]}
                  >
                    <Select 
                      placeholder="Select correct option" 
                      className="dark-select rounded-xl"
                      popupClassName="dark-dropdown"
                      suffixIcon={<span className="text-[#4CAF50]">✓</span>}
                    >
                      <Option value={1}>🎯 Option A</Option>
                      <Option value={2}>🎯 Option B</Option>
                      <Option value={3}>🎯 Option C</Option>
                      <Option value={4}>🎯 Option D</Option>
                    </Select>
                  </Form.Item>
                </Card>
              ))}
              
              {/* Add Question Button */}
              <div className="flex justify-center mb-8">
                <Button
                  type="dashed"
                  onClick={() => handleAddQuestion(add)}
                  icon={<PlusOutlined />}
                  className="border-[#4CAF50] text-[#4CAF50] hover:!bg-[#4CAF50] hover:!text-white rounded-xl h-10 px-6 transition-all duration-200"
                >
                  Add Question
                </Button>
              </div>
            </>
          )}
        </Form.List>

        {/* Form Actions */}
        <Form.Item className="mt-10">
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => navigate('/quizzes')}
              className="border-gray-300 text-gray-600 hover:!border-gray-400 rounded-xl font-medium uppercase tracking-widest text-xs px-6 h-11 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              className="bg-[#4CAF50] hover:!bg-[#43A047] border-0 rounded-xl font-bold uppercase tracking-widest text-xs px-8 h-11 shadow-md shadow-green-600/20 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              {loading ? 'Creating...' : 'Create Quiz'}
            </Button>
          </div>
        </Form.Item>
      </Form>
      </div>
    </div>
  );
};

export default CreateQuiz;