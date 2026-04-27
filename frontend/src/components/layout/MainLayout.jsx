// Version: 1.0.1 - Fixed icon imports
import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { clearAuthSession, getAuthRole, ROLES } from '@/lib/auth';
import {
  Camera,
  Star,
  Users,
  Globe,
  CalendarDays,
  CircleDollarSign,
  Award,
  MessageSquare,
  BarChart2,
  LogOut as LogOutIcon,
  Trophy
} from 'lucide-react';
import ProgressModal from '../ProgressModal';

const { Content, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const authRole = getAuthRole() || ROLES.STUDENT;
  const isAdmin = authRole !== ROLES.STUDENT;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (location.pathname.startsWith('/quizzes')) {
      setOpenKeys((prev) => (prev.includes('quizzes-section') ? prev : ['quizzes-section']));
    }
  }, [location.pathname]);

  const selectedMenuKey = location.pathname.startsWith('/quizzes')
    ? (location.pathname.startsWith('/quizzes/progress')
      ? '/quizzes/progress'
      : location.pathname.startsWith('/quizzes/certificate')
        ? '/quizzes/certificate'
        : '/quizzes')
    : location.pathname;

  const baseItems = [
    { key: '/gallery', icon: <Camera size={18} />, label: 'Past Event Gallery' },
    { key: '/portal', icon: <Globe size={18} />, label: 'Events Portal' },
    { key: '/view-feedback', icon: <MessageSquare size={18} />, label: 'View Feedback' },
  ];

  const studentItems = [
    {
      key: 'quizzes-section',
      icon: <Award size={18} />,
      label: 'Quiz & Certs',
      children: [
        { key: '/quizzes', label: 'Quiz Library' },
        { key: '/quizzes/progress', icon: <BarChart2 size={16} />, label: 'Overall Progress' },
        { key: '/quizzes/certificate', label: 'Certificates' },
      ],
    },
    { key: '/users', icon: <Users size={18} />, label: 'User Hub' },
    { key: '/sports/enrollment', icon: <Trophy size={18} />, label: 'Sport Enrollment' },
  ];

  const adminItems = [
    { key: '/events', icon: <CalendarDays size={18} />, label: 'Sports Management' },
    { key: '/users', icon: <Users size={18} />, label: 'Event/Club Requests' },
    { key: '/finance', icon: <CircleDollarSign size={18} />, label: 'Finance' },
    { key: '/sponsorships', icon: <Star size={18} />, label: 'Sponsorships' },
    {
      key: 'quizzes-section',
      icon: <Award size={18} />,
      label: 'Quiz & Certs',
      children: [
        { key: '/quizzes', label: 'Quiz Library' },
        { key: '/quizzes/create', label: 'Quiz Management (Create)' },
      ],
    },
  ];

  const menuItems = [...baseItems, ...(isAdmin ? adminItems : studentItems)];

  return (
    <Layout style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <Sider
        collapsible
        width={260}
        theme="light"
        className="layout-sider-light"
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
          borderRight: '1px solid #C8E6C9',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
        }}
      >
        <div style={{ height: 48, margin: '24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.35rem', letterSpacing: '0.5px', color: '#2E7D32', fontWeight: 700 }}>UNI EVENT PRO</h2>
        </div>
        <Menu
          className="custom-menu"
          theme="light"
          style={{ flex: 1, overflowY: 'auto' }}
          selectedKeys={[selectedMenuKey]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => {
            if (key === 'quizzes-section') {
              navigate('/quizzes');
              return;
            }
            if (typeof key === 'string' && key.startsWith('/')) {
              navigate(key);
            }
          }}
        />

        {!isAdmin && (
          <div style={{ padding: '0 14px 12px' }}>
            <Button
              onClick={() => setIsProgressVisible(true)}
              style={{
                width: '100%',
                height: 48,
                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                transition: 'all 0.3s ease'
              }}
              className="progress-btn-hover"
            >
              <BarChart2 size={18} />
              Check My Progress
            </Button>
          </div>
        )}

        <div style={{ padding: '0 14px 16px' }}>
          <Button
            danger
            block
            icon={<LogOutIcon size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Sider>
      <Layout style={{ background: '#FAFAFA', marginLeft: 260 }}>
        <Content style={{ margin: '28px 32px', overflow: 'initial', background: 'transparent' }}>
          <div style={{ minHeight: 360, borderRadius: borderRadiusLG }}>
            <Outlet />
          </div>
        </Content>
        <ProgressModal 
          visible={isProgressVisible} 
          onClose={() => setIsProgressVisible(false)} 
          userId={userId} 
        />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
