import React from 'react';
import { Card, Typography, Button, Result } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const QuizResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const score = location.state?.score || 0;
  const fullName = location.state?.fullName || 'Learner';
  const email = location.state?.email || '';
  const quizTitle = location.state?.quizTitle || 'Quiz';
  
  const passed = score >= 50;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 600, textAlign: 'center', padding: 24 }}>
        <Result
          status={passed ? 'success' : 'error'}
          title={passed ? 'Congratulations! You Passed!' : 'Failed. Try Again.'}
          subTitle={`You scored ${score} out of 100.`}
          extra={[
            passed ? (
              <Button
                type="primary"
                key="cert"
                onClick={() => navigate('/quizzes/certificate', {
                  state: { fullName, email, quizTitle, score },
                })}
              >
                View Certificate
              </Button>
            ) : (
               <Button type="primary" key="retry" onClick={() => navigate('/quizzes/attempt')}>
                Retry Quiz
              </Button>
            ),
            <Button key="home" onClick={() => navigate('/quizzes')}>
              Back to Quizzes
            </Button>
          ]}
        />
      </Card>
    </div>
  );
};

export default QuizResult;
