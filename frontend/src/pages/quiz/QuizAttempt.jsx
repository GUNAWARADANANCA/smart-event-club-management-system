import React from 'react';
import { Form, Radio, Button, Card, Typography, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@/lib/api';

const { Title, Paragraph, Text } = Typography;
const LOCAL_RESULTS_KEY = 'localQuizResults';

const appendLocalQuizResult = (entry) => {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_RESULTS_KEY) || '[]');
    const safe = Array.isArray(existing) ? existing : [];
    safe.unshift(entry);
    localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(safe.slice(0, 100)));
  } catch {
    // ignore local storage write failures
  }
};

const quizBank = {
  'oop-basics': {
    title: 'OOP Basics',
    description: 'Review object-oriented programming concepts such as classes, objects, inheritance, and polymorphism.',
    closeDate: '2026-05-30',
    questions: [
      {
        id: 'q1',
        text: 'Which of the following is NOT one of the four pillars of OOP?',
        options: {
          a: 'Encapsulation',
          b: 'Inheritance',
          c: 'Compilation',
          d: 'Polymorphism',
        },
        answer: 'c',
      },
      {
        id: 'q2',
        text: 'What does encapsulation allow you to do?',
        options: {
          a: 'Hide internal details and expose a controlled interface',
          b: 'Execute code faster',
          c: 'Duplicate objects automatically',
          d: 'Avoid using functions',
        },
        answer: 'a',
      },
      {
        id: 'q3',
        text: 'Which feature allows a subclass to provide a different implementation of a base class method?',
        options: {
          a: 'Abstraction',
          b: 'Inheritance',
          c: 'Polymorphism',
          d: 'Encapsulation',
        },
        answer: 'c',
      },
    ],
  },
  'csharp-basics': {
    title: 'C# Basics',
    description: 'Practice C# syntax, data types, and common programming constructs used in beginner applications.',
    closeDate: '2026-04-05',
    questions: [
      {
        id: 'q1',
        text: 'Which keyword is used to define a class in C#?',
        options: {
          a: 'struct',
          b: 'class',
          c: 'module',
          d: 'define',
        },
        answer: 'b',
      },
      {
        id: 'q2',
        text: 'Which keyword declares a constant value in C#?',
        options: {
          a: 'const',
          b: 'volatile',
          c: 'sealed',
          d: 'static',
        },
        answer: 'a',
      },
      {
        id: 'q3',
        text: 'What is the correct C# type for a boolean value?',
        options: {
          a: 'Boolean',
          b: 'bool',
          c: 'boolean',
          d: 'Bit',
        },
        answer: 'b',
      },
    ],
  },
  'cpp-basics': {
    title: 'C++ Basics',
    description: 'Test your understanding of C++ fundamentals like pointers, headers, and loop structures.',
    closeDate: '2026-05-20',
    questions: [
      {
        id: 'q1',
        text: 'Which operator is used to dereference a pointer in C++?',
        options: {
          a: '&',
          b: '*',
          c: '->',
          d: '%',
        },
        answer: 'b',
      },
      {
        id: 'q2',
        text: 'Which header is required to use std::cout?',
        options: {
          a: '<cstdio>',
          b: '<iostream>',
          c: '<string>',
          d: '<vector>',
        },
        answer: 'b',
      },
      {
        id: 'q3',
        text: 'Which keyword is used to create a loop that executes while a condition is true?',
        options: {
          a: 'for',
          b: 'while',
          c: 'repeat',
          d: 'goto',
        },
        answer: 'b',
      },
    ],
  },
  'java-basics': {
    title: 'Java Basics',
    description: 'Review Java fundamentals like object creation, entry point methods, and basic access control.',
    closeDate: '2026-04-05',
    questions: [
      {
        id: 'q1',
        text: 'Which keyword is used to create a new object in Java?',
        options: {
          a: 'new',
          b: 'create',
          c: 'build',
          d: 'make',
        },
        answer: 'a',
      },
      {
        id: 'q2',
        text: 'What is the standard entry point method signature for a Java application?',
        options: {
          a: 'public static void main(String[] args)',
          b: 'public void main(String[] args)',
          c: 'static void main(String[] args)',
          d: 'public static int main(String[] args)',
        },
        answer: 'a',
      },
      {
        id: 'q3',
        text: 'Which access modifier restricts visibility to the defining class only?',
        options: {
          a: 'public',
          b: 'protected',
          c: 'private',
          d: 'default',
        },
        answer: 'c',
      },
    ],
  },
};

const TODAY = '2026-04-10';

const isQuizClosed = (quiz) => Boolean(quiz?.closeDate && quiz.closeDate < TODAY);

const QuizAttempt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quizId = location.state?.quizId || 'oop-basics';
  const quiz = quizBank[quizId] || quizBank['oop-basics'];

  const fullName = location.state?.fullName || '';
  const email = location.state?.email || '';

  const onFinish = (values) => {
    if (isQuizClosed(quiz)) {
      message.error('This quiz is closed and cannot be accessed.');
      navigate('/quizzes');
      return;
    }

    if (!fullName || !email) {
      message.error('Please start the quiz from the library and enter your name and email.');
      navigate('/quizzes');
      return;
    }

    let correctCount = 0;
    quiz.questions.forEach((question) => {
      if (values[question.id] === question.answer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);

    appendLocalQuizResult({
      quizId,
      quizTitle: quiz.title,
      score,
      totalQuestions: quiz.questions.length,
      createdAt: new Date().toISOString(),
    });
    
    // Save result to backend
    const userId = localStorage.getItem('userId');
    if (userId) {
      api.post('/api/quiz/results', {
        userId,
        quizId: quizId,
        quizTitle: quiz.title,
        score,
        totalQuestions: quiz.questions.length
      }).catch(err => console.error('Failed to save quiz result:', err));
    }

    message.success('Quiz submitted successfully!');
    navigate('/quizzes/result', {
      state: {
        score,
        fullName,
        email,
        quizTitle: quiz.title,
      },
    });
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={2} style={{ color: '#0F172A', marginBottom: 8 }}>{quiz.title}</Title>
      <Paragraph style={{ color: '#4B5563', marginBottom: 12 }}>{quiz.description}</Paragraph>
      {isQuizClosed(quiz) && (
        <Card style={{ marginBottom: 24, borderRadius: 16, background: '#FFF1F2', border: '1px solid #FECACA' }}>
          <Text strong style={{ color: '#B91C1C' }}>This quiz is closed and cannot be accessed.</Text>
          <div style={{ marginTop: 12 }}>
            <Button onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
          </div>
        </Card>
      )}
      {!isQuizClosed(quiz) && fullName && email && (
        <Card style={{ marginBottom: 24, borderRadius: 16, background: '#F6F9F4' }}>
          <Text strong>Participant:</Text> {fullName} | <Text strong>Email:</Text> {email}
        </Card>
      )}
      {!isQuizClosed(quiz) && (
        <Card style={{ borderRadius: 20, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.04)' }}>
          <Form layout="vertical" onFinish={onFinish}>
            {quiz.questions.map((question, index) => (
              <div key={question.id} style={{ marginBottom: 28 }}>
                <Title level={5} style={{ marginBottom: 16 }}>{index + 1}. {question.text}</Title>
                <Form.Item
                  name={question.id}
                  rules={[{ required: true, message: 'Please select an answer' }]}
                >
                  <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {Object.entries(question.options).map(([key, label]) => (
                      <Radio key={key} value={key}>{label}</Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </div>
            ))}

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Submit Quiz
              </Button>
              <Button style={{ marginLeft: 12 }} size="large" onClick={() => navigate('/quizzes')}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default QuizAttempt;
