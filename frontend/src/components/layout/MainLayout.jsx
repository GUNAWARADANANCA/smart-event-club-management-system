import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  Camera,
  Star,
  Users,
  Globe,
  CalendarDays,
  CircleDollarSign,
  Award,
  MessageSquare
} from 'lucide-react';

const { Content, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    { key: '/gallery', icon: <Camera size={18} />, label: 'Past Event Gallery' },
    { key: '/sponsorships', icon: <Star size={18} />, label: 'Sponsorships' },
    { key: '/users', icon: <Users size={18} />, label: 'Event/Club Requests' },
    { key: '/portal', icon: <Globe size={18} />, label: 'Events Portal' },
    { key: '/events', icon: <CalendarDays size={18} />, label: 'Events' },
    { key: '/finance', icon: <CircleDollarSign size={18} />, label: 'Finance' },
    { key: '/quizzes', icon: <Award size={18} />, label: 'Quiz & Certs' },
    { key: '/view-feedback', icon: <MessageSquare size={18} />, label: 'View Feedback' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <Sider
        collapsible
        width={260}
        theme="light"
        className="layout-sider-light"
        style={{
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
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout style={{ background: '#FAFAFA', marginLeft: 260 }}>
        <Content style={{ margin: '28px 32px', overflow: 'initial', background: 'transparent' }}>
          <div style={{ minHeight: 360, borderRadius: borderRadiusLG }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
