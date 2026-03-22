import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Tag, Row, Col, Modal, Input, message, Space, Descriptions } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, FilePdfOutlined } from '@ant-design/icons';
import api from '../api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const FinanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/finance/budgets');
      setRequests(res.data.requests || []);
    } catch (err) {
      message.error('Failed to load finance requests from backend');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = (req) => {
    setSelectedRequest(req);
    setRemarks(req.remarks || '');
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
    setRemarks('');
  };

  const handleAction = async (status) => {
    try {
      await api.post('/finance/budgets', { id: selectedRequest.id, status, remarks });
      message.success(`Request ${status} successfully!`);
      closeModal();
      fetchRequests(); // conceptual reload
    } catch (err) {
      message.error(`Failed to process request: ${err.message}`);
    }
  };

  const getStatusTag = (status) => {
    if (status === 'Approved') return <Tag color="green">Approved</Tag>;
    if (status === 'Rejected') return <Tag color="red">Rejected</Tag>;
    return <Tag color="orange">Pending</Tag>;
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0 }}>Finance Request Review</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>Review and manage pending PDF requests submitted by clubs and events.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {requests.map(req => (
          <Col xs={24} md={12} lg={8} key={req.id}>
            <Card 
              hoverable
              style={{ 
                height: '100%', 
                background: 'rgba(20, 20, 20, 0.6)', 
                backdropFilter: 'blur(16px)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 16,
                display: 'flex', flexDirection: 'column'
              }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <Title level={4} style={{ color: '#a78bfa', margin: 0 }}>{req.name}</Title>
                  <Text type="secondary">{req.id}</Text>
                </div>
                {getStatusTag(req.status)}
              </div>
              
              <Space style={{ marginBottom: 16 }}>
                <Tag color={req.type === 'Event' ? 'magenta' : 'geekblue'}>{req.type} Request</Tag>
                <Tag color="default">{req.submittedDate}</Tag>
              </Space>

              <div style={{ flex: 1, marginBottom: 24 }}>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {req.description}
                </Paragraph>
              </div>

              <Button 
                type="primary" 
                icon={<EyeOutlined />} 
                block 
                size="large"
                style={{ background: '#8b5cf6', borderColor: '#8b5cf6', borderRadius: 8 }}
                onClick={() => handleViewPDF(req)}
              >
                View PDF
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={
          <Space>
            <FilePdfOutlined style={{ color: '#f5222d', fontSize: 24 }} />
            <span style={{ fontSize: 20 }}>Review Request: {selectedRequest?.name}</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={900}
        bodyStyle={{ padding: '24px 24px' }}
        centered
        className="glass-modal"
      >
        {selectedRequest && (
          <Row gutter={24}>
            <Col span={14}>
              {/* Dummy PDF Viewer */}
              <div style={{ 
                height: '500px', 
                background: '#1f1f1f', 
                border: '1px solid #303030', 
                borderRadius: 8,
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                <FilePdfOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                <Title level={4} style={{ color: '#a78bfa' }}>{selectedRequest.name}</Title>
                <Text>Submitted Date: {selectedRequest.submittedDate}</Text>
                <Text style={{ marginTop: 16 }}>(PDF Document Viewer Embedded Here)</Text>
              </div>
            </Col>
            
            <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ color: 'white' }}>Request Details</Title>
                <Descriptions column={1} size="small" style={{ marginBottom: 24 }}>
                  <Descriptions.Item label="ID">{selectedRequest.id}</Descriptions.Item>
                  <Descriptions.Item label="Type">{selectedRequest.type}</Descriptions.Item>
                  <Descriptions.Item label="Status">{getStatusTag(selectedRequest.status)}</Descriptions.Item>
                </Descriptions>
                
                <Title level={5} style={{ color: 'white' }}>Original Description</Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.7)', padding: 12, background: '#141414', borderRadius: 8, border: '1px solid #303030' }}>
                  {selectedRequest.description}
                </Paragraph>

                <Title level={5} style={{ color: 'white' }}>Admin Remarks (Optional)</Title>
                <TextArea 
                  rows={4} 
                  placeholder="Enter comments or justification for approval/rejection..." 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  style={{ background: '#141414', borderColor: '#303030', color: 'white', marginBottom: 24 }}
                />
              </div>

              {selectedRequest.status === 'Pending' ? (
                <Space style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                  <Button 
                    danger 
                    icon={<CloseCircleOutlined />} 
                    size="large"
                    onClick={() => handleAction('Rejected')}
                  >
                    Reject
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    size="large"
                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                    onClick={() => handleAction('Approved')}
                  >
                    Approve
                  </Button>
                </Space>
              ) : (
                <div style={{ textAlign: 'right', padding: 16, background: '#141414', borderRadius: 8, border: '1px dashed #303030' }}>
                  <Text strong>This request was previously {selectedRequest.status.toLowerCase()}.</Text>
                  <br/>
                  <Text type="secondary">Saved Remarks: {selectedRequest.remarks || 'None provided.'}</Text>
                </div>
              )}
            </Col>
          </Row>
        )}
      </Modal>

      <style>{`
        .glass-modal .ant-modal-content {
          background: rgba(20, 20, 20, 0.85) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(139, 92, 246, 0.3) !important;
          border-radius: 16px;
        }
        .glass-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        .glass-modal .ant-modal-title {
          color: white !important;
        }
        .glass-modal .ant-modal-close {
          color: white !important;
        }
      `}</style>
    </div>
  );
};

// Also require Descriptions import from antd above, let me make sure it is there.
// I will patch the import in the component.

export default FinanceRequests;
