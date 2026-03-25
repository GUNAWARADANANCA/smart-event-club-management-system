import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  Camera,
  Star,
  Users,
  Database,
  Globe,
  Heart,
  CalendarDays,
  CircleDollarSign,
  Award,
  Video,
  MessageCircle
} from 'lucide-react';

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const userName = localStorage.getItem('userName') || 'Admin User';

  const menuItems = [
    { key: '/gallery', icon: <Camera size={18} />, label: 'Past Event Gallery' },
    { key: '/sponsorships', icon: <Star size={18} />, label: 'Sponsorships' },
    { key: '/users', icon: <Users size={18} />, label: 'Event/Club Requests' },
    { key: '/manage-requests', icon: <Database size={18} />, label: 'Manage Requests' },
    { key: '/portal', icon: <Globe size={18} />, label: 'Events Portal' },
    { key: '/my-events', icon: <Heart size={18} />, label: 'My Events' },
    { key: '/events', icon: <CalendarDays size={18} />, label: 'Events' },
    { key: '/finance', icon: <CircleDollarSign size={18} />, label: 'Finance' },
    { key: '/quizzes', icon: <Award size={18} />, label: 'Quiz & Certs' },
    { key: '/feedback', icon: <MessageCircle size={18} />, label: 'Feedback & Rating' },
    { key: '/view-feedback', icon: <Database size={18} />, label: 'View Feedback' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#0F172A' }}>
      <Sider collapsible width={260} theme="dark" style={{ background: '#0F172A', position: 'fixed', height: '100vh', zIndex: 1000 }}>
        <div style={{ height: 48, margin: '24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '1px', color: '#14B8A6', fontWeight: 'bold' }}>UNI EVENT PRO</h2>
        </div>
        <Menu 
          className="custom-menu"
          theme="dark" 
          selectedKeys={[location.pathname]} 
          mode="inline" 
          items={menuItems} 
          onClick={({ key }) => navigate(key)} 
        />
      </Sider>
      <Layout style={{ background: '#FFFFFF', marginLeft: 260 }}>
        <Header style={{ padding: '0 32px', background: '#111827', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: '#F8FAFC', fontSize: '16px', fontWeight: 600 }}>
            Welcome back, {userName}
          </div>
        </Header>
        <Content style={{ margin: '32px', overflow: 'initial', background: '#FFFFFF' }}>
          <div style={{ minHeight: 360, borderRadius: borderRadiusLG }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
