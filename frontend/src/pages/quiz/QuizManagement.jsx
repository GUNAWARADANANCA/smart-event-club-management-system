import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Row, Col, Card, Button, Typography, Modal, Form, Input, Dropdown, Tag, message } from 'antd';
import { DownloadOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

// ==================== CONSTANTS ====================
const TODAY = '2026-04-10';
const LOCAL_QUIZZES_KEY = 'localQuizzes';
const ADMIN_CREDENTIALS = {
  username: 'quize.admin',
  password: '123456'
};

const STATUS_FILTERS = {
  ALL: 'all',
  OPEN: 'open',
  CLOSED: 'closed'
};

// ==================== UTILITY FUNCTIONS ====================
const isQuizClosed = (quiz) => Boolean(quiz?.closeDate && quiz.closeDate < TODAY);

const readLocalQuizzes = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_QUIZZES_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const mergeQuizzes = (serverQuizzes, localQuizzes) => {
  const seen = new Set();
  const merged = [];

  [...(localQuizzes || []), ...(serverQuizzes || [])].forEach((q) => {
    const id = q?.id || q?._id;
    if (!id || seen.has(id)) return;
    seen.add(id);
    merged.push(q);
  });

  return merged;
};

// ==================== QUIZ DATA ====================
const fallbackQuizzes = [
  {
    id: 'oop-basics',
    title: 'OOP Basics',
    description: 'Understand the core concepts of object-oriented programming, including classes, objects, and inheritance.',
    questions: 8,
    closeDate: '2026-05-30',
    materials: [
      { title: 'OOP Fundamentals Guide', url: '#' },
      { title: 'OOP Recordings', url: '#' },
    ],
  },
  {
    id: 'csharp-basics',
    title: 'C# Basics',
    description: 'Review essential C# syntax, data types, and control structures for beginners.',
    questions: 8,
    closeDate: '2026-04-05',
    materials: [
      { title: 'C# Syntax Reference', url: '#' },
      { title: 'Data Types Cheat Sheet', url: '#' },
    ],
  },
  {
    id: 'cpp-basics',
    title: 'C++ Basics',
    description: 'Test your knowledge of memory management, pointers, and standard syntax in C++.',
    questions: 8,
    closeDate: '2026-05-20',
    materials: [
      { title: 'Pointers & Memory Guide', url: '#' },
      { title: 'C++ Standards Reference', url: '#' },
    ],
  },
  {
    id: 'java-basics',
    title: 'Java Basics',
    description: 'Practice Java fundamentals such as classes, methods, and object creation.',
    questions: 8,
    closeDate: '2026-04-05',
    materials: [
      { title: 'Java Methods Tutorial', url: '#' },
      { title: 'Object Creation Guide', url: '#' },
    ],
  },
];

// ==================== MATERIALS CONTENT ====================
const materialsContent = {
  'OOP Fundamentals Guide': {
    title: 'OOP Fundamentals Guide',
    content: `Object-Oriented Programming (OOP) is a programming paradigm that uses "objects" and "classes" to structure software.

Key Concepts:

1. Classes & Objects
   - A class is a blueprint for creating objects
   - An object is an instance of a class
   - Objects have properties (attributes) and methods (functions)

2. Encapsulation
   - Bundling data and methods together
   - Hiding internal details from the outside world
   - Use access modifiers (public, private, protected)

3. Inheritance
   - Creating new classes based on existing classes
   - Child classes inherit properties and methods from parent classes
   - Promotes code reuse

4. Polymorphism
   - Objects can take multiple forms
   - Method overriding and method overloading
   - Allows flexibility in code design

5. Abstraction
   - Showing only essential features while hiding complexity
   - Use abstract classes and interfaces
   - Reduces complexity and improves maintainability

Additional Resources:
- OOP Recording 1: Introduction to Classes and Objects
- OOP Recording 2: Encapsulation & Inheritance`
  },
  'OOP Recordings': {
    title: 'OOP Recordings',
    content: `Watch the OOP recording series to reinforce the fundamentals:

These videos cover key OOP concepts and practical code examples to help you prepare for quizzes and real projects.`,
    links: [
      {
        label: 'OOP Recording 1: Introduction to Classes and Objects',
        url: 'https://www.youtube.com/watch?v=pTB0EiLXUC8',
      },
      {
        label: 'OOP Recording 2: Encapsulation & Inheritance',
        url: 'https://www.youtube.com/watch?v=lbz4T8K0NhQ',
      },
    ],
  },
};

// ==================== REUSABLE COMPONENTS ====================
const FilterButton = ({ label, filter, currentFilter, onClick, isClosedFilter = false }) => {
  const isActive = currentFilter === filter;
  
  const getStyle = () => {
    if (!isActive) {
      return { borderColor: '#C8E6C9', color: '#1F2937' };
    }
    if (isClosedFilter && filter === STATUS_FILTERS.CLOSED) {
      return { background: '#EF4444', borderColor: '#EF4444' };
    }
    return { background: '#4CAF50', borderColor: '#43A047' };
  };

  return (
    <Button
      type={isActive ? 'primary' : 'default'}
      onClick={() => onClick(filter)}
      style={getStyle()}
    >
      {label}
    </Button>
  );
};

const QuizCard = ({ quiz, onStartQuiz, onMaterialClick }) => {
  const closed = isQuizClosed(quiz);
  
  return (
    <Card
      bordered={false}
      style={{ borderRadius: 20, minHeight: 260, boxShadow: '0 12px 30px rgba(72, 187, 120, 0.08)' }}
      bodyStyle={{ padding: '28px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <Text strong style={{ color: '#4CAF50', letterSpacing: '0.08em', fontSize: '0.85rem' }}>
          {quiz.title}
        </Text>
        {closed && <Tag color="red" style={{ borderRadius: 999 }}>Unavailable</Tag>}
      </div>
      
      <Title level={4} style={{ marginTop: 16, color: '#0F172A' }}>{quiz.title}</Title>
      <Paragraph style={{ color: '#4B5563', lineHeight: 1.75 }}>{quiz.description}</Paragraph>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <div>
          <Text type="secondary">{quiz.questions} Questions</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Closes on {quiz.closeDate}
            </Text>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {quiz.materials?.length > 0 && (
            <Dropdown
              menu={{
                items: quiz.materials.map((material, idx) => ({
                  key: idx,
                  label: material.title,
                  onClick: () => onMaterialClick(material.title),
                })),
              }}
              trigger={['click']}
            >
              <Button
                type="default"
                icon={<DownloadOutlined />}
                style={{ borderColor: '#4CAF50', color: '#4CAF50', borderRadius: 6 }}
              >
                Materials
              </Button>
            </Dropdown>
          )}
          
          <Button
            type="primary"
            disabled={closed}
            onClick={() => onStartQuiz(quiz, closed)}
            style={closed ? undefined : { background: '#4CAF50', borderColor: '#43A047' }}
          >
            {closed ? 'Unavailable' : 'Start Quiz'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const UserDetailsForm = ({ form, onFinish, title, buttonText, isVisible, onCancel }) => (
  <Modal
    title={title}
    open={isVisible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    okText={buttonText}
  >
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[{ required: true, message: 'Please enter your full name' }]}
      >
        <Input placeholder="Enter your full name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email Address"
        rules={[
          { required: true, message: 'Please enter your email address' },
          { type: 'email', message: 'Please enter a valid email address' },
        ]}
      >
        <Input placeholder="Enter your email address" />
      </Form.Item>
    </Form>
  </Modal>
);

const MaterialsModal = ({ modalState, onClose }) => (
  <Modal
    title={modalState.title}
    open={modalState.visible}
    onCancel={onClose}
    onOk={onClose}
    width={700}
    okText="Close"
  >
    {modalState.links?.length > 0 ? (
      <div style={{ color: '#1F2937', fontSize: 14, lineHeight: 1.8 }}>
        <div style={{ whiteSpace: 'pre-wrap', marginBottom: 16 }}>{modalState.content}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {modalState.links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'underline' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    ) : (
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#1F2937', fontSize: 14 }}>
        {modalState.content}
      </div>
    )}
  </Modal>
);

// ==================== MAIN COMPONENT ====================
const QuizManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State Management
  const [quizzes, setQuizzes] = useState([]);
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTERS.ALL);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAchievementModalVisible, setIsAchievementModalVisible] = useState(false);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
  const [materialModal, setMaterialModal] = useState({ visible: false, title: '', content: '', links: [] });
  
  // Form Instances
  const [quizForm] = Form.useForm();
  const [achievementForm] = Form.useForm();
  const [adminForm] = Form.useForm();

  // ==================== DATA FETCHING ====================
  const fetchQuizzes = useCallback(async () => {
    const localQuizzes = readLocalQuizzes();
    setQuizzes(mergeQuizzes(fallbackQuizzes, localQuizzes));
  }, []);

  // ==================== EVENT HANDLERS ====================
  const handleStartQuiz = (quiz, isClosed) => {
    if (isClosed) {
      message.error('This quiz is closed and cannot be accessed.');
      return;
    }
    setSelectedQuiz(quiz);
    setIsModalVisible(true);
  };

  const handleMaterialClick = (materialTitle) => {
    const content = materialsContent[materialTitle] || { 
      title: materialTitle, 
      content: 'Content not available', 
      links: [] 
    };
    setMaterialModal({
      visible: true,
      title: content.title,
      content: content.content,
      links: content.links || [],
    });
  };

  const handleQuizSubmit = (values) => {
    setIsModalVisible(false);
    navigate('/quizzes/attempt', {
      state: {
        quizId: selectedQuiz?.id,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
      },
    });
    quizForm.resetFields();
  };

  const handleAchievementSubmit = (values) => {
    localStorage.setItem('userName', values.fullName.trim());
    localStorage.setItem('userEmail', values.email.trim());
    setIsAchievementModalVisible(false);
    achievementForm.resetFields();
    navigate('/quizzes/performance');
  };

  const handleAdminSubmit = (values) => {
    const username = String(values.username || '').trim();
    const password = String(values.password || '');

    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      message.error('Login failed: username must be "quize.admin" and password must be "123456".');
      return;
    }

    setIsAdminModalVisible(false);
    adminForm.resetFields();
    navigate('/quizzes/create');
  };

  const closeMaterialModal = () => {
    setMaterialModal({ ...materialModal, visible: false });
  };

  // ==================== MEMOIZED VALUES ====================
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      if (statusFilter === STATUS_FILTERS.OPEN) return !isQuizClosed(quiz);
      if (statusFilter === STATUS_FILTERS.CLOSED) return isQuizClosed(quiz);
      return true;
    });
  }, [quizzes, statusFilter]);

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  useEffect(() => {
    if (location.state?.refresh) {
      setStatusFilter(STATUS_FILTERS.OPEN);
      fetchQuizzes();
      navigate('/quizzes', { replace: true });
    }
  }, [location.key, fetchQuizzes, navigate]);

  // ==================== RENDER ====================
  return (
    <div style={{ 
      padding: '24px', 
      borderRadius: 20, 
      background: '#FFFFFF', 
      border: '1px solid #C8E6C9', 
      boxShadow: '0 4px 24px rgba(46, 125, 50, 0.08)' 
    }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#0F172A' }}>Quiz Library</Title>
          <Paragraph style={{ maxWidth: 640, color: '#4B5563', marginBottom: 0 }}>
            Pick a subject and start a quick basics quiz in OOP, C#, C++, or Java.
          </Paragraph>
        </div>
        
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button
            icon={<TrophyOutlined />}
            onClick={() => setIsAchievementModalVisible(true)}
            style={{ borderColor: '#4CAF50', color: '#2E7D32', fontWeight: 'bold' }}
          >
            User Achievements
          </Button>
          <Button
            type="primary"
            onClick={() => setIsAdminModalVisible(true)}
            style={{ background: '#4CAF50', borderColor: '#43A047', color: '#ffffff', fontWeight: 'bold' }}
          >
            Create New Quiz
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        <FilterButton 
          label="All Quizzes" 
          filter={STATUS_FILTERS.ALL} 
          currentFilter={statusFilter} 
          onClick={setStatusFilter} 
        />
        <FilterButton 
          label="Open Quizzes" 
          filter={STATUS_FILTERS.OPEN} 
          currentFilter={statusFilter} 
          onClick={setStatusFilter} 
        />
        <FilterButton 
          label="Closed Quizzes" 
          filter={STATUS_FILTERS.CLOSED} 
          currentFilter={statusFilter} 
          onClick={setStatusFilter} 
          isClosedFilter={true}
        />
      </div>

      {/* Quiz Cards Grid */}
      <Row gutter={[24, 24]}>
        {filteredQuizzes.map((quiz) => (
          <Col xs={24} sm={12} lg={12} xl={12} key={quiz.id}>
            <QuizCard 
              quiz={quiz} 
              onStartQuiz={handleStartQuiz} 
              onMaterialClick={handleMaterialClick} 
            />
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748B', fontSize: 16 }}>
          No quizzes found for this filter.
        </div>
      )}

      {/* Modals */}
      <UserDetailsForm
        form={quizForm}
        onFinish={handleQuizSubmit}
        title={selectedQuiz ? `Start ${selectedQuiz.title}` : 'Start Quiz'}
        buttonText="Start Quiz"
        isVisible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          quizForm.resetFields();
        }}
      />

      <UserDetailsForm
        form={achievementForm}
        onFinish={handleAchievementSubmit}
        title="Enter your details"
        buttonText="Continue"
        isVisible={isAchievementModalVisible}
        onCancel={() => {
          setIsAchievementModalVisible(false);
          achievementForm.resetFields();
        }}
      />

      <Modal
        title="Admin Login"
        open={isAdminModalVisible}
        onCancel={() => {
          setIsAdminModalVisible(false);
          adminForm.resetFields();
        }}
        onOk={() => adminForm.submit()}
        okText="Continue"
      >
        <Form form={adminForm} layout="vertical" onFinish={handleAdminSubmit}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter admin username' }]}
          >
            <Input placeholder="quize.admin" autoComplete="username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password placeholder="123456" autoComplete="current-password" />
          </Form.Item>
        </Form>
      </Modal>

      <MaterialsModal modalState={materialModal} onClose={closeMaterialModal} />
    </div>
  );
};

export default QuizManagement;