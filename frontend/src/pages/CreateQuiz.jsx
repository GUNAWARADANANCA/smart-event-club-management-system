import React, { useState } from 'react';
import { Form, Input, Button, Card, Space, Typography, message, Divider, Select, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../api';
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
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/quizzes')}
          className="hover:scale-105 transition-transform"
        />
        <Title level={2} className="m-0 !text-black">Create New Quiz</Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ questions: [{}] }}
        autoComplete="off"
      >
        <Card className="bg-white border-[#E2E8F0] shadow-xl rounded-2xl mb-8">
          <Title level={4} className="!text-black mb-6">General Information</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label={<Text style={{ color: '#000000', fontWeight: '500' }}>Quiz Title</Text>}
              rules={[{ required: true, message: 'Please input quiz title!' }]}
            >
              <Input placeholder="Enter quiz title" className="bg-[#F9FAFB] border-[#D1FAE5] text-black" />
            </Form.Item>

            <Form.Item
              name="eventId"
              label={<Text style={{ color: '#000000', fontWeight: '500' }}>Associated Event</Text>}
              rules={[{ required: true, message: 'Please select an event association' }]}
            >
              <Select 
                placeholder="Select event" 
                className="green-select"
                popupClassName="green-dropdown"
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
              label={<Text style={{ color: '#000000', fontWeight: '500' }}>Time Limit (minutes)</Text>}
              rules={[{ required: true, message: 'Please set a time limit!' }]}
            >
              <InputNumber min={1} max={180} className="w-full bg-[#F9FAFB] border-[#D1FAE5] text-black" />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label={<Text style={{ color: '#000000', fontWeight: '500' }}>Description</Text>}
          >
            <Input.TextArea placeholder="Enter quiz description" rows={3} className="bg-[#F9FAFB] border-[#D1FAE5] text-black" />
          </Form.Item>
        </Card>

        <Divider orientation="left" className="!border-[#E2E8F0]">
          <Text className="text-slate-500 font-bold uppercase tracking-widest text-xs">Questions</Text>
        </Divider>

        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Card 
                  key={key} 
                  className="bg-white border-[#E2E8F0] shadow-lg rounded-2xl mb-6 relative overflow-hidden group"
                  title={<Text style={{ color: '#000000', fontWeight: '600' }}>Question {index + 1}</Text>}
                  extra={
                    fields.length > 1 && (
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => remove(name)}
                        className="hover:bg-red-500/10"
                      />
                    )
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'text']}
                    rules={[{ required: true, message: 'Missing question text' }]}
                  >
                    <Input.TextArea placeholder="Type your question here..." className="bg-[#F9FAFB] border-[#D1FAE5] text-black" />
                  </Form.Item>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'option1']}
                      label={<Text className="text-slate-500 text-xs">Option 1</Text>}
                      rules={[{ required: true, message: 'Missing option 1' }]}
                    >
                      <Input placeholder="Option 1" className="bg-[#F9FAFB] border-[#D1FAE5] text-black" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option2']}
                      label={<Text className="text-slate-500 text-xs">Option 2</Text>}
                      rules={[{ required: true, message: 'Missing option 2' }]}
                    >
                      <Input placeholder="Option 2" className="bg-[#F9FAFB] border-[#D1FAE5] text-black" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option3']}
                      label={<Text className="text-slate-500 text-xs">Option 3</Text>}
                      rules={[{ required: true, message: 'Missing option 3' }]}
                    >
                      <Input placeholder="Option 3" className="bg-[#F9FAFB] border-[#D1FAE5] text-black" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option4']}
                      label={<Text className="text-slate-500 text-xs">Option 4</Text>}
                      rules={[{ required: true, message: 'Missing option 4' }]}
                    >
                      <Input placeholder="Option 4" className="bg-[#F9FAFB] border-[#D1FAE5] text-black" />
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
                      className="green-select"
                      popupClassName="green-dropdown"
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
                  className="h-16 border-dashed border-[#14B8A6] text-[#0F766E] hover:text-[#14B8A6] hover:border-[#0F766E] bg-transparent rounded-2xl"
                >
                  Add Question
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
            style={{ height: 56, background: '#14B8A6', borderColor: '#0F766E', color: 'black', fontWeight: 'bold' }}
            className="rounded-2xl shadow-lg transition-all"
          >
            Create Quiz
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateQuiz;
