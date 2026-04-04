import React, { useState } from 'react';
import { Card, Row, Col, Typography, Tabs, DatePicker, List, Progress, Divider } from 'antd';
import { CaretUpOutlined, CaretDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { mockEvents, mockUsers, mockRequests } from '@/data/mockData';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('1');

  // Dummy data for charts
  const barData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 36 },
    { month: 'Mar', value: 26 },
    { month: 'Apr', value: 29 },
    { month: 'May', value: 55 },
    { month: 'Jun', value: 39 },
    { month: 'Jul', value: 26 },
    { month: 'Aug', value: 34 },
    { month: 'Sep', value: 39 },
    { month: 'Oct', value: 65 },
    { month: 'Nov', value: 48 },
    { month: 'Dec', value: 72 },
  ];

  const rankingData = [
    { title: 'Tech Symposium 2026', value: '3,231' },
    { title: 'Annual Sports Meet', value: '2,984' },
    { title: 'Cultural Fest', value: '2,541' },
    { title: 'Hackathon X', value: '1,932' },
    { title: 'Freshers Welcome', value: '1,540' },
    { title: 'Job Fair', value: '1,120' },
    { title: 'Guest Lecture: AI', value: '980' },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh', margin: '-32px' }}>
      <Row gutter={[24, 24]}>
        {/* Card 1: Total Revenue */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px 24px 8px' }} style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(0,0,0,0.45)' }}>
              <span>Total Revenue</span>
              <InfoCircleOutlined />
            </div>
            <div style={{ fontSize: 30, color: 'rgba(0,0,0,0.85)', marginTop: 4, marginBottom: 16 }}>
              $ 154,430
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>
              <span style={{ marginRight: 16 }}>
                Week ratio <span style={{ marginLeft: 8 }}>13%</span> <CaretUpOutlined style={{ color: '#f5222d' }} />
              </span>
              <span>
                Day ratio <span style={{ marginLeft: 8 }}>10%</span> <CaretDownOutlined style={{ color: '#52c41a' }} />
              </span>
            </div>
            <Divider style={{ margin: '12px 0 8px' }} />
            <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>
              Day Sales $15,443
            </div>
          </Card>
        </Col>

        {/* Card 2: Visits (Registrations) */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px 24px 8px' }} style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(0,0,0,0.45)' }}>
              <span>Visits</span>
              <InfoCircleOutlined />
            </div>
            <div style={{ fontSize: 30, color: 'rgba(0,0,0,0.85)', marginTop: 4, marginBottom: 16 }}>
              6,480
            </div>
            {/* Simple CSS Area Chart representation */}
            <div style={{ height: 46, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
               {[40, 60, 45, 80, 55, 90, 70, 45, 80, 55, 90, 70, 60, 40].map((h, i) => (
                 <div key={i} style={{ flex: 1, backgroundColor: '#8b5cf6', opacity: 0.8, height: `${h}%`, borderRadius: '2px 2px 0 0' }}></div>
               ))}
            </div>
            <Divider style={{ margin: '12px 0 8px' }} />
            <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>
              Day visits 4,280
            </div>
          </Card>
        </Col>

        {/* Card 3: Payments (Tickets) */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px 24px 8px' }} style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(0,0,0,0.45)' }}>
              <span>Payments</span>
              <InfoCircleOutlined />
            </div>
            <div style={{ fontSize: 30, color: 'rgba(0,0,0,0.85)', marginTop: 4, marginBottom: 16 }}>
              5,320
            </div>
            {/* Simple CSS Bar Chart representation */}
            <div style={{ height: 46, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
               {[40, 60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                 <div key={i} style={{ width: 14, backgroundColor: '#1890ff', height: `${h}%` }}></div>
               ))}
            </div>
            <Divider style={{ margin: '12px 0 8px' }} />
            <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>
              Conversion rate 50%
            </div>
          </Card>
        </Col>

        {/* Card 4: Operation Effect */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px 24px 8px' }} style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(0,0,0,0.45)' }}>
              <span>Operation Effect</span>
              <InfoCircleOutlined />
            </div>
            <div style={{ fontSize: 30, color: 'rgba(0,0,0,0.85)', marginTop: 4, marginBottom: 16 }}>
              88%
            </div>
            <div style={{ height: 46, display: 'flex', alignItems: 'flex-start', paddingTop: 8 }}>
              <Progress percent={88} strokeColor="#1890ff" status="normal" showInfo={false} style={{ width: '100%' }} />
            </div>
            <Divider style={{ margin: '12px 0 8px' }} />
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>
              <span style={{ marginRight: 16 }}>
                WoW Change <span style={{ marginLeft: 8 }}>12%</span> <CaretUpOutlined style={{ color: '#f5222d' }} />
              </span>
              <span>
                DoD Change <span style={{ marginLeft: 8 }}>11%</span> <CaretDownOutlined style={{ color: '#52c41a' }} />
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ marginTop: 24, borderRadius: 8 }} bodyStyle={{ padding: 0 }}>
        <Tabs 
          defaultActiveKey="1" 
          size="large" 
          onChange={setActiveTab}
          style={{ padding: '0 24px' }}
          tabBarExtraContent={
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ display: 'flex', gap: 16, color: 'rgba(0,0,0,0.65)', fontWeight: 500 }}>
                <a style={{ color: 'rgba(0,0,0,0.85)', textDecoration: 'none' }}>All day</a>
                <a style={{ color: 'rgba(0,0,0,0.65)', textDecoration: 'none' }}>All week</a>
                <a style={{ color: 'rgba(0,0,0,0.65)', textDecoration: 'none' }}>All month</a>
                <a style={{ color: '#1890ff', textDecoration: 'none' }}>All year</a>
              </div>
              <RangePicker />
            </div>
          }
        >
          <Tabs.TabPane tab={<span style={{ fontWeight: 500 }}>Sales</span>} key="1">
            <Row gutter={48} style={{ padding: '12px 24px 32px' }}>
              <Col xs={24} lg={16}>
                <Title level={5} style={{ marginBottom: 32, fontWeight: 500 }}>Store Sales Trend</Title>
                <div style={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: '4%', paddingBottom: 32, borderBottom: '1px solid #f0f0f0', position: 'relative' }}>
                  {/* Container for Y-axis background grid */}
                  <div style={{ position: 'absolute', top: 0, bottom: 32, left: 0, right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0 }}>
                    {[60, 50, 40, 30, 20, 10, 0].map(val => (
                      <div key={val} style={{ borderTop: '1px dashed #e8e8e8', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: -10, left: -25, fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  
                  {barData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', zIndex: 1, marginLeft: i === 0 ? 12 : 0 }}>
                      <div style={{ width: '40%', backgroundColor: '#5b8ff9', height: `${d.value}%`, minHeight: 4, borderRadius: '2px 2px 0 0' }}></div>
                      <div style={{ position: 'absolute', bottom: -28, fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>{d.month}</div>
                    </div>
                  ))}
                </div>
              </Col>
              <Col xs={24} lg={8}>
                <Title level={5} style={{ marginBottom: 32, fontWeight: 500 }}>Sales ranking</Title>
                <List
                  dataSource={rankingData}
                  style={{ paddingRight: 16 }}
                  renderItem={(item, index) => (
                    <List.Item style={{ border: 'none', padding: '10px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <div style={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          backgroundColor: index < 3 ? '#314659' : '#fafafa',
                          color: index < 3 ? '#fff' : 'rgba(0,0,0,0.65)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          marginRight: 16,
                          fontWeight: 600
                        }}>
                          {index + 1}
                        </div>
                        <span style={{ flex: 1, color: 'rgba(0,0,0,0.65)', fontSize: 14 }}>{item.title}</span>
                        <span style={{ fontWeight: 500, color: 'rgba(0,0,0,0.85)', fontSize: 14 }}>{item.value}</span>
                      </div>
                    </List.Item>
                  )}                  
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span style={{ fontWeight: 500 }}>Visits</span>} key="2">
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(0,0,0,0.45)' }}>
              Detailed visits tracking area will load here.
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>
      
      {/* Global CSS overrides inside Dashboard to match specific stylistic requests */}
      <style>{`
        .ant-tabs-nav::before { border-bottom: 2px solid #f0f0f0 !important; }
        .ant-tabs-tab { padding: 16px 0 !important; font-size: 16px; margin: 0 40px 0 0 !important; }
        .ant-card { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02); }
      `}</style>
    </div>
  );
}
