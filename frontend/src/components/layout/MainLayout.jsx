import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Button,
  Drawer,
  Space,
  Divider
} from 'antd';
import {
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { getAuthToken, clearAuthSession, getAuthRole } from '@/lib/auth';
import ProfileDrawer from '@/components/ProfileDrawer';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = getAuthRole();
  const isLoggedIn = Boolean(getAuthToken());

  const handleLogout = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  const handleProfileUpdate = () => {
    // Handle profile update if needed
  };

  const menuItems = [
    {
      key: 'gallery',
      icon: <HomeOutlined />,
      label: 'Gallery',
      onClick: () => navigate('/gallery')
    },
    {
      key: 'news',
      icon: <FileTextOutlined />,
      label: 'News',
      onClick: () => navigate('/news')
    },
    {
      key: 'meetings',
      icon: <CalendarOutlined />,
      label: 'Meetings',
      onClick: () => navigate('/meetings')
    },
    {
      key: 'ticket-sales',
      icon: <DollarOutlined />,
      label: 'Ticket Sales',
      onClick: () => navigate('/ticket-sales')
    },
    {
      key: 'events',
      icon: <CalendarOutlined />,
      label: 'Events',
      children: [
        { key: 'event-management', label: 'Event Management', onClick: () => navigate('/events') },
        { key: 'create-event', label: 'Create Event', onClick: () => navigate('/events/create') },
        { key: 'clubs', label: 'Club Management', onClick: () => navigate('/clubs') },
        { key: 'approvals', label: 'Approvals', onClick: () => navigate('/approvals') },
        { key: 'archives', label: 'Archives', onClick: () => navigate('/archives') },
        { key: 'manage-news', label: 'Manage News', onClick: () => navigate('/admin/news') },
        { key: 'lecturer-requests', label: 'Lecturer Requests', onClick: () => navigate('/admin/lecturer-requests') }
      ]
    },
    {
      key: 'finance',
      icon: <DollarOutlined />,
      label: 'Finance',
      children: [
        { key: 'finance-dashboard', label: 'Finance Dashboard', onClick: () => navigate('/finance') },
        { key: 'budget-approval', label: 'Budget Approval', onClick: () => navigate('/finance/budget-approval') },
        { key: 'expenses', label: 'Expenses', onClick: () => navigate('/finance/expenses') },
        { key: 'requests', label: 'Requests', onClick: () => navigate('/finance/requests') },
        { key: 'payment', label: 'Payment', onClick: () => navigate('/finance/payment') }
      ]
    },
    {
      key: 'quizzes',
      icon: <SafetyCertificateOutlined />,
      label: 'Quizzes',
      children: [
        { key: 'quiz-management', label: 'Quiz Management', onClick: () => navigate('/quizzes') },
        { key: 'create-quiz', label: 'Create Quiz', onClick: () => navigate('/quizzes/create') },
        { key: 'performance', label: 'Performance', onClick: () => navigate('/quizzes/performance') }
      ]
    },
    {
      key: 'feedback',
      icon: <CommentOutlined />,
      label: 'Feedback',
      children: [
        { key: 'feedback-form', label: 'Submit Feedback', onClick: () => navigate('/feedback') },
        { key: 'view-feedback', label: 'View Feedback', onClick: () => navigate('/view-feedback') }
      ]
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'Users',
      onClick: () => navigate('/users')
    }
  ];

  const currentPath = location.pathname.split('/')[1] || 'gallery';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
        className="hidden lg:block"
        style={{
          background: '#ffffff',
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0, color: '#2E7D32' }}>
            {collapsed ? 'SEC' : 'Smart Event Club'}
          </Title>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[currentPath]}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Sider>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        size={280}
        className="lg:hidden"
      >
        <Menu
          mode="inline"
          selectedKeys={[currentPath]}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Drawer>

      <Layout>
        {/* Header */}
        <Header
          style={{
            background: '#ffffff',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Mobile menu button */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden mr-4"
            />

            <Title level={4} style={{ margin: 0, color: '#2E7D32' }}>
              {menuItems.find(item => item.key === currentPath)?.label || 'Dashboard'}
            </Title>
          </div>

          <Space>
            {isLoggedIn ? (
              <>
                <Button type="text" icon={<BellOutlined />} />
                <Divider orientation="vertical" />
                <Space>
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setProfileDrawerOpen(true)}
                  />
                  <div style={{ lineHeight: '1.2' }}>
                    <Text strong>User</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {userRole || 'Student'}
                    </Text>
                  </div>
                </Space>
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </Space>
        </Header>

        {/* Main Content */}
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Outlet />
        </Content>
      </Layout>

      {/* Profile Drawer */}
      <ProfileDrawer
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        onProfileUpdated={handleProfileUpdate}
      />
    </Layout>
  );
};

export default MainLayout;