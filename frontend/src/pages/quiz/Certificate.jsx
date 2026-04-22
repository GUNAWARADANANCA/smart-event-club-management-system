import React, { useState } from 'react';
import { Form, Input, Button, Card, Space, Typography, message, Divider, Select, Tooltip, Alert, Badge, Progress } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined, QuestionCircleOutlined, CheckCircleOutlined, WarningOutlined, TrophyOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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
  const [validationProgress, setValidationProgress] = useState(0);

  const calculateProgress = (values) => {
    let completed = 0;
    let total = 4; // title, eventId, timeLimit, at least one question
    
    if (values?.title) completed++;
    if (values?.eventId) completed++;
    if (values?.timeLimit) completed++;
    if (values?.questions?.length > 0 && values.questions[0]?.text) completed++;
    
    setValidationProgress((completed / total) * 100);
  };

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

      const localQuiz = {
        id: `local-${Date.now()}`,
        title: payload.title,
        description: payload.description || '',
        questions: payload.questions?.length || 0,
        closeDate: isoDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        materials: [],
        createdAt: new Date().toISOString(),
        timeLimit: payload.timeLimit,
        eventId: payload.eventId
      };

      addLocalQuiz(localQuiz);
      message.success({
        content: `Quiz "${payload.title}" created successfully!`,
        icon: <CheckCircleOutlined style={{ color: '#4CAF50' }} />,
        duration: 3,
      });
      form.resetFields();
      setQuestionCount(1);
      setValidationProgress(0);
      navigate('/quizzes', { state: { refresh: true, newQuiz: localQuiz } });
    } catch (error) {
      console.error('Quiz creation error:', error);
      message.error({
        content: 'Failed to create quiz. Please check all fields and try again.',
        icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    calculateProgress(allValues);
  };

  const handleAddQuestion = (add) => {
    if (questionCount >= 20) {
      message.warning('Maximum 20 questions allowed per quiz');
      return;
    }
    add();
    setQuestionCount(prev => prev + 1);
    message.success(`Question ${questionCount + 1} added`, 1.5);
  };

  const handleRemoveQuestion = (remove, name) => {
    if (questionCount <= 1) {
      message.warning('Quiz must have at least one question');
      return;
    }
    remove(name);
    setQuestionCount(prev => prev - 1);
    message.info('Question removed', 1.5);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#4CAF50]/25 overflow-hidden relative p-4 md:p-8 bg-gradient-to-br from-gray-50 via-white to-[#F1F8E9]">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4CAF50]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4CAF50]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4CAF50]/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Tooltip title="Back to Quizzes">
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => navigate('/quizzes')}
                  className="hover:scale-105 transition-all duration-300 bg-white border-[#C8E6C9] text-[#2E7D32] hover:!bg-[#4CAF50] hover:!text-white hover:!border-[#4CAF50] rounded-xl shadow-sm"
                />
              </Tooltip>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrophyOutlined className="text-[#4CAF50] text-xl" />
                  <Title level={3} className="!text-[#2E7D32] !mb-0 font-bold">
                    Create New Quiz
                  </Title>
                </div>
                <Text type="secondary" className="text-sm ml-7">
                  Design engaging quizzes with multiple choice questions
                </Text>
              </div>
            </div>
            <Badge count={`${questionCount} Question${questionCount !== 1 ? 's' : ''}`} style={{ backgroundColor: '#4CAF50' }} />
          </div>
          
          {/* Progress indicator */}
          <div className="ml-12 mr-4">
            <div className="flex justify-between items-center mb-2">
              <Text className="text-xs text-gray-500">Quiz completion progress</Text>
              <Text className="text-xs font-semibold text-[#4CAF50]">{Math.round(validationProgress)}%</Text>
            </div>
            <Progress 
              percent={validationProgress} 
              showInfo={false}
              strokeColor={{
                '0%': '#4CAF50',
                '100%': '#66BB6A',
              }}
              trailColor="#E8F5E9"
              size="small"
              className="!mb-0"
            />
          </div>
        </div>
 
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          initialValues={{ questions: [{}] }}
          autoComplete="off"
        >
          {/* Enhanced General Information Card */}
          <Card className="bg-white/95 backdrop-blur-sm border-[#C8E6C9] shadow-xl rounded-3xl mb-8 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#4CAF50]/10 to-[#81C784]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#4CAF50]/5 to-transparent rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-1 h-8 bg-gradient-to-b from-[#4CAF50] to-[#81C784] rounded-full"></div>
              <FileTextOutlined className="text-[#4CAF50] text-xl" />
              <Title level={4} className="!text-gray-800 m-0 font-bold">
                General Information
              </Title>
              <Tooltip title="Basic details about your quiz - all fields marked with * are required">
                <QuestionCircleOutlined className="text-gray-400 cursor-help hover:text-[#4CAF50] transition-colors" />
              </Tooltip>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Form.Item
                name="title"
                label={
                  <Text className="text-gray-700 font-semibold">
                    Quiz Title <span className="text-red-500">*</span>
                  </Text>
                }
                rules={[
                  { required: true, message: 'Please input quiz title!' },
                  { whitespace: true, message: 'Quiz title cannot be empty.' },
                  { pattern: /^[A-Za-z\s]+$/, message: 'Numbers are not allowed (letters only).' },
                  { min: 3, message: 'Title must be at least 3 characters' },
                  { max: 100, message: 'Title cannot exceed 100 characters' }
                ]}
                normalize={(value) =>
                  String(value ?? '')
                    .replace(/[^A-Za-z\s]/g, '')
                    .replace(/\s+/g, ' ')
                    .trimStart()
                }
                tooltip="Choose a clear, descriptive title for your quiz"
              >
                <Input 
                  placeholder="e.g., JavaScript Fundamentals" 
                  size="large"
                  className="bg-gray-50 border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl transition-all duration-200"
                  prefix={<span className="text-[#4CAF50] mr-2">📝</span>}
                />
              </Form.Item>

              <Form.Item
                name="eventId"
                label={
                  <Text className="text-gray-700 font-semibold">
                    Associated Event <span className="text-red-500">*</span>
                  </Text>
                }
                rules={[{ required: true, message: 'Please select an event association' }]}
                tooltip="Select which event this quiz belongs to"
              >
                <Select 
                  placeholder="Select event" 
                  size="large"
                  className="rounded-xl"
                  popupClassName="dark-dropdown"
                  suffixIcon={<span className="text-[#4CAF50]">▼</span>}
                >
                  <Option value={101}>
                    <div className="flex items-center gap-2">
                      <span>🎯</span> Tech Symposium 2026
                    </div>
                  </Option>
                  <Option value={102}>
                    <div className="flex items-center gap-2">
                      <span>🤖</span> AI Ethics Workshop
                    </div>
                  </Option>
                  <Option value={103}>
                    <div className="flex items-center gap-2">
                      <span>💻</span> CodeRed Hackathon
                    </div>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="timeLimit"
                label={
                  <Text className="text-gray-700 font-semibold">
                    Time Limit <span className="text-red-500">*</span>
                  </Text>
                }
                rules={[{ required: true, message: 'Please set a time limit!' }]}
                tooltip="Set how many minutes participants have to complete the quiz"
              >
                <Select
                  placeholder="Select time limit"
                  size="large"
                  className="rounded-xl"
                  popupClassName="dark-dropdown"
                  suffixIcon={<ClockCircleOutlined className="text-[#4CAF50]" />}
                >
                  {[5, 10, 15, 20, 30, 45, 60, 90, 120].map(t => (
                    <Option key={t} value={t}>
                      <div className="flex items-center justify-between">
                        <span>{t} minute{t !== 1 ? 's' : ''}</span>
                        {t === 30 && <span className="text-xs text-[#4CAF50]">Recommended</span>}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="description"
              label={<Text className="text-gray-700 font-semibold">Description</Text>}
              rules={[
                { pattern: /^[A-Za-z\s]+$/, message: 'Description must contain letters only, no numbers allowed!' },
                { max: 500, message: 'Description cannot exceed 500 characters' }
              ]}
              normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
              tooltip="Provide a brief description of what this quiz covers (optional)"
            >
              <TextArea 
                placeholder="Enter quiz description (optional) - e.g., This quiz tests your knowledge on..." 
                rows={3} 
                className="bg-gray-50 border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl resize-none transition-all duration-200"
                showCount
                maxLength={500}
              />
            </Form.Item>

            {/* Info alert */}
            <Alert
              message="Tip: Keep your quiz title clear and concise. Use the description to provide additional context about the quiz content."
              type="info"
              showIcon
              className="mt-4 bg-blue-50 border-blue-200 rounded-xl"
              icon={<QuestionCircleOutlined />}
            />
          </Card>

          <Divider orientation="left" className="!border-gray-200 my-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                <span className="text-[#4CAF50] font-bold">{questionCount}</span>
              </div>
              <Text className="text-gray-600 font-bold uppercase tracking-wider text-sm">
                Questions
              </Text>
              <div className="h-px w-32 bg-gradient-to-r from-[#4CAF50] to-transparent"></div>
            </div>
          </Divider>

          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card 
                    key={key} 
                    className="bg-gradient-to-br from-white to-[#F7FCF7] border-[#C8E6C9] shadow-lg rounded-2xl mb-6 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
                    title={
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] text-white text-sm flex items-center justify-center font-bold shadow-md">
                          {index + 1}
                        </div>
                        <Text className="text-gray-800 font-bold">
                          Question {index + 1}
                        </Text>
                        {fields.length > 1 && (
                          <Badge count="Active" style={{ backgroundColor: '#4CAF50' }} className="ml-2" />
                        )}
                      </div>
                    }
                    extra={
                      fields.length > 1 && (
                        <Tooltip title="Remove this question">
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => handleRemoveQuestion(remove, name)}
                            className="hover:bg-red-500/10 rounded-full transition-all duration-200"
                            size="large"
                          />
                        </Tooltip>
                      )
                    }
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'text']}
                      rules={[
                        { required: true, message: 'Please enter the question text' },
                        { pattern: /^[A-Za-z\s]+$/, message: 'Question must contain letters only!' },
                        { min: 5, message: 'Question must be at least 5 characters' },
                        { max: 200, message: 'Question cannot exceed 200 characters' }
                      ]}
                      normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
                    >
                      <TextArea 
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
                        label={
                          <Text className="text-gray-600 text-sm font-semibold">
                            Option A <span className="text-red-500">*</span>
                          </Text>
                        }
                        rules={[
                          { required: true, message: 'Option A is required' }, 
                          { pattern: /^[A-Za-z\s]+$/, message: 'Numbers are not allowed (letters only).' }
                        ]}
                        normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
                      >
                        <Input 
                          placeholder="Enter option A" 
                          className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl h-10 transition-all duration-200"
                          prefix={<span className="text-[#4CAF50] font-bold mr-1">A.</span>}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'option2']}
                        label={
                          <Text className="text-gray-600 text-sm font-semibold">
                            Option B <span className="text-red-500">*</span>
                          </Text>
                        }
                        rules={[
                          { required: true, message: 'Option B is required' }, 
                          { pattern: /^[A-Za-z\s]+$/, message: 'Numbers are not allowed (letters only).' }
                        ]}
                        normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
                      >
                        <Input 
                          placeholder="Enter option B" 
                          className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl h-10 transition-all duration-200"
                          prefix={<span className="text-[#4CAF50] font-bold mr-1">B.</span>}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'option3']}
                        label={
                          <Text className="text-gray-600 text-sm font-semibold">
                            Option C <span className="text-red-500">*</span>
                          </Text>
                        }
                        rules={[
                          { required: true, message: 'Option C is required' }, 
                          { pattern: /^[A-Za-z\s]+$/, message: 'Numbers are not allowed (letters only).' }
                        ]}
                        normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
                      >
                        <Input 
                          placeholder="Enter option C" 
                          className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl h-10 transition-all duration-200"
                          prefix={<span className="text-[#4CAF50] font-bold mr-1">C.</span>}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'option4']}
                        label={
                          <Text className="text-gray-600 text-sm font-semibold">
                            Option D <span className="text-red-500">*</span>
                          </Text>
                        }
                        rules={[
                          { required: true, message: 'Option D is required' }, 
                          { pattern: /^[A-Za-z\s]+$/, message: 'Numbers are not allowed (letters only).' }
                        ]}
                        normalize={(value) => String(value ?? '').replace(/[^A-Za-z\s]/g, '')}
                      >
                        <Input 
                          placeholder="Enter option D" 
                          className="bg-white border-[#C8E6C9] text-gray-900 placeholder-gray-400 hover:border-[#4CAF50] focus:border-[#4CAF50] rounded-xl h-10 transition-all duration-200"
                          prefix={<span className="text-[#4CAF50] font-bold mr-1">D.</span>}
                        />
                      </Form.Item>
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, 'correctAnswer']}
                      label={
                        <div className="flex items-center gap-2">
                          <TrophyOutlined className="text-[#4CAF50]" />
                          <Text className="text-[#2E7D32] font-bold">
                            Correct Answer <span className="text-red-500">*</span>
                          </Text>
                          <Tooltip title="Select which option is the correct answer for this question">
                            <QuestionCircleOutlined className="text-gray-400 cursor-help" />
                          </Tooltip>
                        </div>
                      }
                      rules={[{ required: true, message: 'Please select the correct answer' }]}
                    >
                      <Select 
                        placeholder="Choose the correct answer" 
                        size="large"
                        className="rounded-xl"
                        popupClassName="dark-dropdown"
                        suffixIcon={<CheckCircleOutlined className="text-[#4CAF50]" />}
                      >
                        <Option value={1}>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">A</span>
                            Option A
                          </div>
                        </Option>
                        <Option value={2}>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">B</span>
                            Option B
                          </div>
                        </Option>
                        <Option value={3}>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">C</span>
                            Option C
                          </div>
                        </Option>
                        <Option value={4}>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">D</span>
                            Option D
                          </div>
                        </Option>
                      </Select>
                    </Form.Item>
                  </Card>
                ))}
                
                {/* Enhanced Add Question Button */}
                <div className="flex justify-center my-8">
                  <Button
                    type="dashed"
                    onClick={() => handleAddQuestion(add)}
                    icon={<PlusOutlined />}
                    size="large"
                    className="border-2 border-dashed border-[#4CAF50] text-[#4CAF50] hover:!bg-[#4CAF50] hover:!text-white rounded-xl px-8 h-12 transition-all duration-300 hover:scale-105"
                    disabled={questionCount >= 20}
                  >
                    {questionCount >= 20 ? 'Maximum Questions Reached' : 'Add Another Question'}
                  </Button>
                </div>
                
                {questionCount >= 20 && (
                  <Alert
                    message="Maximum Questions Limit"
                    description="You've reached the maximum limit of 20 questions per quiz."
                    type="warning"
                    showIcon
                    className="mb-6 rounded-xl"
                  />
                )}
              </>
            )}
          </Form.List>

          {/* Enhanced Form Actions */}
          <Card className="bg-white/95 backdrop-blur-sm border-[#C8E6C9] shadow-lg rounded-3xl mt-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <Text className="text-gray-500 text-sm">
                  {questionCount} question{questionCount !== 1 ? 's' : ''} will be added to this quiz
                </Text>
                <br />
                <Text type="secondary" className="text-xs">
                  All fields marked with <span className="text-red-500">*</span> are required
                </Text>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/quizzes')}
                  size="large"
                  className="border-gray-300 text-gray-600 hover:!border-gray-400 rounded-xl font-medium px-6 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                  className="bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] hover:!from-[#43A047] hover:!to-[#4CAF50] border-0 rounded-xl font-bold shadow-lg shadow-green-600/30 transition-all duration-300 hover:scale-105 px-8"
                >
                  {loading ? 'Creating Quiz...' : 'Create Quiz'}
                </Button>
              </div>
            </div>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default CreateQuiz;