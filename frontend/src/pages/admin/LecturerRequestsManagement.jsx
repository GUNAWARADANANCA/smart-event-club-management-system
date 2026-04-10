import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Card,
  Row,
  Col,
  Tag,
  Typography,
} from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

const LecturerRequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewForm] = Form.useForm();

  // Fetch all lecturer requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/lecturer-requests/admin');
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch lecturer requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle approve/reject
  const handleReview = async (requestId, status) => {
    try {
      const values = await reviewForm.validateFields();
      const response = await api.put(`/api/lecturer-requests/${requestId}`, {
        status,
        reviewNotes: values.reviewNotes || '',
      });

      message.success(`Request ${status} successfully`);
      fetchRequests();
      setModalOpen(false);
      setSelectedRequest(null);
      reviewForm.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Failed to update request');
    }
  };

  // Open review modal
  const openReviewModal = (request) => {
    setSelectedRequest(request);
    reviewForm.setFieldsValue({
      reviewNotes: request.reviewNotes || '',
    });
    setModalOpen(true);
  };

  const columns = [
    {
      title: 'Applicant',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          pending: { color: 'orange', text: 'Pending' },
          approved: { color: 'green', text: 'Approved' },
          rejected: { color: 'red', text: 'Rejected' },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => openReviewModal(record)}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Review
              </Button>
            </>
          )}
          {record.status !== 'pending' && (
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => openReviewModal(record)}
            >
              View
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>
              Lecturer Requests Management
            </Title>
            <Text type="secondary">
              Review and manage lecturer application requests
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={fetchRequests}
              loading={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={requests}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Review Modal */}
      <Modal
        title={`Review Lecturer Request - ${selectedRequest?.fullName}`}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSelectedRequest(null);
          reviewForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        {selectedRequest && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small" title="Applicant Details">
                  <p><strong>Name:</strong> {selectedRequest.fullName}</p>
                  <p><strong>Email:</strong> {selectedRequest.email}</p>
                  <p><strong>Department:</strong> {selectedRequest.department}</p>
                  <p><strong>Subject:</strong> {selectedRequest.subject}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Application Status">
                  <p><strong>Status:</strong> <Tag color={
                    selectedRequest.status === 'approved' ? 'green' :
                    selectedRequest.status === 'rejected' ? 'red' : 'orange'
                  }>{selectedRequest.status}</Tag></p>
                  <p><strong>Submitted:</strong> {new Date(selectedRequest.submittedAt).toLocaleDateString()}</p>
                  {selectedRequest.reviewedAt && (
                    <p><strong>Reviewed:</strong> {new Date(selectedRequest.reviewedAt).toLocaleDateString()}</p>
                  )}
                </Card>
              </Col>
            </Row>

            <Card size="small" title="Bio" style={{ marginBottom: 24 }}>
              <p>{selectedRequest.bio}</p>
            </Card>

            {selectedRequest.status === 'pending' ? (
              <Form form={reviewForm} layout="vertical">
                <Form.Item
                  label="Review Notes (Optional)"
                  name="reviewNotes"
                >
                  <TextArea
                    rows={4}
                    placeholder="Add any notes about this application..."
                  />
                </Form.Item>
                <Row justify="end" gutter={16}>
                  <Col>
                    <Button
                      danger
                      onClick={() => handleReview(selectedRequest._id, 'rejected')}
                      icon={<CloseOutlined />}
                    >
                      Reject
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      onClick={() => handleReview(selectedRequest._id, 'approved')}
                      icon={<CheckOutlined />}
                      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    >
                      Approve
                    </Button>
                  </Col>
                </Row>
              </Form>
            ) : (
              <div>
                <h4>Review Notes:</h4>
                <p>{selectedRequest.reviewNotes || 'No review notes provided.'}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LecturerRequestsManagement;