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
    // fetchRequests(); // No need for backend now
    setRequests([
      { 
        id: 'FR-2026-001', 
        name: 'Annual Tech Symposium Budget', 
        type: 'Event', 
        submittedDate: '2026-03-15', 
        status: 'Pending', 
        description: 'Budget request for venue booking, speaker fees, and marketing materials for the upcoming symposium.',
        remarks: '' 
      },
      { 
        id: 'FR-2026-002', 
        name: 'Robotics Club Equipment', 
        type: 'Club', 
        submittedDate: '2026-03-18', 
        status: 'Approved', 
        description: 'Purchase of 10 Arduino and 5 Raspberry Pi kits for the upcoming workshops.',
        remarks: 'Approved as per previous committee meeting.' 
      },
      { 
        id: 'FR-2026-003', 
        name: 'Cultural Night Performance Costumes', 
        type: 'Event', 
        submittedDate: '2026-03-20', 
        status: 'Pending', 
        description: 'Request for costume rentals and stage setup for the Annual Cultural Night.',
        remarks: '' 
      },
      { 
        id: 'FR-2026-004', 
        name: 'Library Renovation Phase 1', 
        type: 'Other', 
        submittedDate: '2026-03-22', 
        status: 'Pending', 
        description: 'Initial budget request for library furniture replacement and painting as part of the phase 1 renovation plan.',
        remarks: '' 
      }
    ]);
    setLoading(false);
  }, []);

  const handleViewPDF = (req) => {
    setSelectedRequest(req);
    setRemarks(req.remarks || '');
    setIsModalVisible(true);
  };
  
  const handleCancel = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'Cancelled' } : req));
    message.info(`Request ${id} has been cancelled.`);
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
    if (status === 'Cancelled') return <Tag color="default">Cancelled</Tag>;
    return <Tag color="orange">Pending</Tag>;
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, color: '#000000' }}>Finance Request Review</Title>
        <Text style={{ fontSize: 16, color: '#000000' }}>Review and manage pending PDF requests submitted by clubs and events.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {requests.map(req => (
          <Col xs={24} md={12} lg={8} key={req.id}>
            <Card 
              hoverable
              style={{ 
                height: '100%', 
                background: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                display: 'flex', flexDirection: 'column'
              }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <Title level={4} style={{ color: '#000000', margin: 0 }}>{req.name}</Title>
                  <Text style={{ color: '#000000' }}>{req.id}</Text>
                </div>
                {getStatusTag(req.status)}
              </div>
              
              <Space style={{ marginBottom: 16 }}>
                <Tag color={req.type === 'Event' ? 'magenta' : 'geekblue'}>{req.type} Request</Tag>
                <Tag color="default">{req.submittedDate}</Tag>
              </Space>

              <div style={{ flex: 1, marginBottom: 24 }}>
                <Paragraph style={{ color: '#000000' }}>
                  {req.description}
                </Paragraph>
              </div>

              <Space direction="vertical" style={{ width: '100%' }}>
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
                {req.status === 'Pending' && (
                  <Button 
                    danger 
                    block
                    style={{ borderRadius: 8 }}
                    onClick={() => handleCancel(req.id)}
                  >
                    Cancel Request
                  </Button>
                )}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={
          <Space>
            <FilePdfOutlined style={{ color: '#f5222d', fontSize: 24 }} />
            <span style={{ fontSize: 20, color: '#000000' }}>Review Request: {selectedRequest?.name}</span>
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
                background: '#F0F2F5', 
                border: '1px solid #E2E8F0', 
                borderRadius: 8,
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                color: '#475569'
              }}>
                <FilePdfOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                <Title level={4} style={{ color: '#000000' }}>{selectedRequest.name}</Title>
                <Text>Submitted Date: {selectedRequest.submittedDate}</Text>
                <Text style={{ marginTop: 16 }}>(PDF Document Viewer Embedded Here)</Text>
              </div>
            </Col>
            
            <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ color: '#000000' }}>Request Details</Title>
                <Descriptions column={1} size="small" style={{ marginBottom: 24 }}>
                  <Descriptions.Item label="ID">{selectedRequest.id}</Descriptions.Item>
                  <Descriptions.Item label="Type">{selectedRequest.type}</Descriptions.Item>
                  <Descriptions.Item label="Status">{getStatusTag(selectedRequest.status)}</Descriptions.Item>
                </Descriptions>
                
                <Title level={5} style={{ color: '#000000' }}>Original Description</Title>
                <Paragraph style={{ color: '#000000', padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  {selectedRequest.description}
                </Paragraph>

                <Title level={5} style={{ color: '#000000' }}>Admin Remarks (Optional)</Title>
                <TextArea 
                  rows={4} 
                  placeholder="Enter comments or justification for approval/rejection..." 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#000000', marginBottom: 24 }}
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
          background: #FFFFFF !important;
          border-radius: 16px;
          border: 1px solid #E2E8F0 !important;
        }
        .glass-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid #F0F0F0 !important;
        }
        .glass-modal .ant-modal-title {
          color: #000000 !important;
        }
        .glass-modal .ant-modal-close {
          color: #000000 !important;
        }
      `}</style>
    </div>
  );
};

// Also require Descriptions import from antd above, let me make sure it is there.
// I will patch the import in the component.

export default FinanceRequests;
