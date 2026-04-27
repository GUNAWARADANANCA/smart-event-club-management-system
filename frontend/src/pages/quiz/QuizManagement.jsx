import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Row, Col, Card, Button, Typography, Modal, Form, Input, Dropdown, Tag, message } from 'antd';
import { DownloadOutlined, TrophyOutlined, BarChartOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@/lib/api';
import { getAuthRole, ROLES } from '@/lib/auth';

const { Title, Paragraph, Text } = Typography;

// ==================== CONSTANTS ====================
const LOCAL_QUIZZES_KEY = 'localQuizzes';
const LOCAL_RESULTS_KEY = 'localQuizResults';
const PASS_SCORE = 50;

const STATUS_FILTERS = {
  ALL: 'all',
  COMPLETED: 'completed',
  AVAILABLE: 'available'
};

// ==================== UTILITY FUNCTIONS ====================
const readLocalQuizzes = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_QUIZZES_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const readLocalResults = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_RESULTS_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const normalizeResult = (result) => ({
  quizId: String(result?.quizId || ''),
  quizTitle: String(result?.quizTitle || ''),
  score: Number(result?.score || 0),
  createdAt: result?.createdAt || result?.date || null,
});

const isQuizClosed = (quiz) => {
  const today = new Date();
  const closeDate = quiz?.closeDate ? new Date(quiz.closeDate) : null;
  return Boolean(closeDate && !Number.isNaN(closeDate.getTime()) && closeDate < today);
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

const quizCoverImageMap = {
  'oop-basics': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=60',
  'csharp-basics': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=60',
  'cpp-basics': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60',
  'java-basics': 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200&q=60',
};

// ==================== REUSABLE COMPONENTS ====================
const FilterButton = ({ label, filter, currentFilter, onClick, isCompletedFilter = false }) => {
  const isActive = currentFilter === filter;
  
  const getStyle = () => {
    if (!isActive) {
      return { borderColor: '#C8E6C9', color: '#1F2937' };
    }
    if (isCompletedFilter && filter === STATUS_FILTERS.COMPLETED) {
      return { background: '#16A34A', borderColor: '#16A34A' };
    }
    if (filter === STATUS_FILTERS.AVAILABLE) {
      return { background: '#1677ff', borderColor: '#1677ff' };
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

const QuizCard = ({ quiz, onStartQuiz, onMaterialClick, highlighted, isCompleted }) => {
  const closed = isQuizClosed(quiz);
  const quizKey = quiz?.id || quiz?._id;
  const coverImage = quizCoverImageMap[quizKey] || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=60';
  
  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 20,
        minHeight: 260,
        boxShadow: highlighted ? '0 12px 30px rgba(22, 119, 255, 0.18)' : '0 12px 30px rgba(72, 187, 120, 0.08)',
        border: highlighted ? '2px solid #1677ff' : '1px solid #E8F5E9',
        overflow: 'hidden',
      }}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ position: 'relative', height: 120, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: -12,
            backgroundImage: `url(${coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)',
            transform: 'scale(1.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(120deg, rgba(15,23,42,0.72) 0%, rgba(30,64,175,0.38) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
          <div>
            <Text strong style={{ color: '#ffffff', letterSpacing: '0.08em', fontSize: '0.8rem' }}>
              {isCompleted ? 'COMPLETED QUIZ' : 'AVAILABLE QUIZ'}
            </Text>
            <Title level={4} style={{ margin: '8px 0 0', color: '#ffffff' }}>{quiz.title}</Title>
          </div>
          <Tag color={isCompleted ? 'green' : 'blue'} style={{ borderRadius: 999, marginTop: 2 }}>
            {isCompleted ? 'Completed' : 'Pending'}
          </Tag>
        </div>
      </div>

      <div style={{ padding: '22px 24px 24px' }}>
        <Paragraph style={{ color: '#4B5563', lineHeight: 1.75, minHeight: 70 }}>{quiz.description}</Paragraph>
      
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
                  style={{ borderColor: '#4CAF50', color: '#4CAF50', borderRadius: 8 }}
                >
                  Materials
                </Button>
              </Dropdown>
            )}
            
            <Button
              type="primary"
              disabled={closed}
              onClick={() => onStartQuiz(quiz, closed)}
              style={closed ? undefined : { background: '#4CAF50', borderColor: '#43A047', borderRadius: 8 }}
            >
              {closed ? 'Unavailable' : isCompleted ? 'Retry Quiz' : 'Start Quiz'}
            </Button>
          </div>
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
  const authRole = getAuthRole() || ROLES.STUDENT;
  const isAdmin = authRole !== ROLES.STUDENT;
  
  // State Management
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTERS.ALL);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAchievementModalVisible, setIsAchievementModalVisible] = useState(false);
  const [materialModal, setMaterialModal] = useState({ visible: false, title: '', content: '', links: [] });
  const [focusQuizId, setFocusQuizId] = useState(null);
  
  // Form Instances
  const [quizForm] = Form.useForm();
  const [achievementForm] = Form.useForm();

  // ==================== DATA FETCHING ====================
  const fetchQuizzes = useCallback(async () => {
    const localQuizzes = readLocalQuizzes();
    setQuizzes(mergeQuizzes(fallbackQuizzes, localQuizzes));
  }, []);

  const fetchResults = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    const backendResults = userId
      ? await api.get(`/api/quiz/results/${userId}`).then((res) => (Array.isArray(res.data) ? res.data : [])).catch(() => [])
      : [];

    const mergedResults = [...backendResults, ...readLocalResults()].map(normalizeResult);
    setResults(mergedResults);
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

  const closeMaterialModal = () => {
    setMaterialModal({ ...materialModal, visible: false });
  };

  // ==================== MEMOIZED VALUES ====================
  const completedQuizKeys = useMemo(() => {
    const keys = new Set();
    results
      .filter((result) => result.score >= PASS_SCORE)
      .forEach((result) => {
        if (result.quizId) {
          keys.add(String(result.quizId));
        }
        if (result.quizTitle) {
          keys.add(String(result.quizTitle).toLowerCase().trim());
        }
      });
    return keys;
  }, [results]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const quizId = String(quiz?.id || quiz?._id || '');
      const quizTitle = String(quiz?.title || '').toLowerCase().trim();
      const isCompleted = completedQuizKeys.has(quizId) || completedQuizKeys.has(quizTitle);

      if (statusFilter === STATUS_FILTERS.COMPLETED) return isCompleted;
      if (statusFilter === STATUS_FILTERS.AVAILABLE) return !isCompleted;
      return true;
    });
  }, [quizzes, statusFilter, completedQuizKeys]);

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchQuizzes();
    fetchResults();
  }, [fetchQuizzes, fetchResults]);

  useEffect(() => {
    if (location.state?.refresh) {
      setStatusFilter(STATUS_FILTERS.AVAILABLE);
      fetchQuizzes();
      fetchResults();
      navigate('/quizzes', { replace: true });
      return;
    }

    if (location.state?.statusFilter || location.state?.focusQuizId) {
      const incomingFilter = location.state?.statusFilter;
      const mappedFilter = incomingFilter === 'open' ? STATUS_FILTERS.AVAILABLE : incomingFilter;
      const normalizedFilter = Object.values(STATUS_FILTERS).includes(incomingFilter)
        ? incomingFilter
        : Object.values(STATUS_FILTERS).includes(mappedFilter)
          ? mappedFilter
        : STATUS_FILTERS.ALL;

      setStatusFilter(normalizedFilter);
      setFocusQuizId(location.state?.focusQuizId || null);
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
            Pick a subject and start a quick basics quiz. Track your completion in real-time with completed and available filters.
          </Paragraph>
        </div>
        
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button
            icon={<BarChartOutlined />}
            onClick={() => navigate('/quizzes/progress')}
            style={{ borderColor: '#1890ff', color: '#1677ff', fontWeight: 'bold' }}
          >
            See Progress So Far
          </Button>
          <Button
            icon={<TrophyOutlined />}
            onClick={() => setIsAchievementModalVisible(true)}
            style={{ borderColor: '#4CAF50', color: '#2E7D32', fontWeight: 'bold' }}
          >
            User Achievements
          </Button>
          {isAdmin && (
            <Button
              type="primary"
              onClick={() => navigate('/quizzes/create')}
              style={{ background: '#4CAF50', borderColor: '#43A047', color: '#ffffff', fontWeight: 'bold' }}
            >
              Quiz Management (Create)
            </Button>
          )}
        </div>
      </div>

      {/* Filter Section */}
      {focusQuizId && (
        <div
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            borderRadius: 10,
            background: '#e6f4ff',
            border: '1px solid #91caff',
            color: '#0958d9',
            fontWeight: 500,
          }}
        >
          You came from Overall Progress. The recommended available quiz is highlighted below.
        </div>
      )}

      {/* Filter Section */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        <FilterButton 
          label="All Quizzes" 
          filter={STATUS_FILTERS.ALL} 
          currentFilter={statusFilter} 
          onClick={setStatusFilter} 
        />
        <FilterButton 
          label="Completed Quizzes" 
          filter={STATUS_FILTERS.COMPLETED} 
          currentFilter={statusFilter} 
          onClick={setStatusFilter}
          isCompletedFilter={true}
        />
        <FilterButton 
          label="Available Quizzes" 
          filter={STATUS_FILTERS.AVAILABLE} 
          currentFilter={statusFilter} 
          onClick={setStatusFilter}
        />
      </div>

      {/* Quiz Cards Grid */}
      <Row gutter={[24, 24]}>
        {filteredQuizzes.map((quiz) => (
          <Col xs={24} sm={12} lg={12} xl={12} key={quiz.id}>
            {(() => {
              const quizId = String(quiz?.id || quiz?._id || '');
              const quizTitle = String(quiz?.title || '').toLowerCase().trim();
              const isCompleted = completedQuizKeys.has(quizId) || completedQuizKeys.has(quizTitle);
              return (
            <QuizCard 
              quiz={quiz} 
              onStartQuiz={handleStartQuiz} 
              onMaterialClick={handleMaterialClick}
              highlighted={focusQuizId === quiz.id}
              isCompleted={isCompleted}
            />
              );
            })()}
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

      <MaterialsModal modalState={materialModal} onClose={closeMaterialModal} />
    </div>
  );
};

export default QuizManagement;