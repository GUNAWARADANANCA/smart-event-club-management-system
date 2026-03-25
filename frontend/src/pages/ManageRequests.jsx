import React, { useState } from 'react';
import { Table, Tag, Space, Button, Modal, Typography, Card } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { mockRequests } from '../mockData';

const { Title, Text } = Typography;

const ManageRequests = () => {
  const [data, setData] = useState(mockRequests);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    // Modify internal mock array so it persists on route change
    const requestIndex = mockRequests.findIndex(r => r.id === id);
    if (requestIndex > -1) {
      mockRequests[requestIndex].status = newStatus;
    }
    // Update local state to trigger re-render
    setData([...mockRequests]);
  };

  const showDetails = (record) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
  };

  const columns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id' },
    { title: 'Student Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Year', dataIndex: 'academicYear', key: 'academicYear' },
    { 
      title: 'Type', 
      dataIndex: 'requestType', 
      key: 'requestType',
      filters: [
        { text: 'Event', value: 'University Event Request' },
        { text: 'Club', value: 'Club Management Request' },
      ],
      onFilter: (value, record) => record.requestType.includes(value),
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: status => {
        let className = status === 'Approved' ? 'tag-teal-pill active' : status === 'Rejected' ? 'tag-teal-pill inactive' : 'tag-teal-pill inactive';
        return <Tag className={className}>{status}</Tag>;
      }
    },
    { title: 'Date', dataIndex: 'submittedDate', key: 'submittedDate' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => showDetails(record)} size="small" className="btn-teal-secondary">View</Button>
          {record.status === 'Pending' && (
            <>
              <Button icon={<CheckCircleOutlined />} onClick={() => handleStatusChange(record.id, 'Approved')} size="small" className="btn-teal-primary">Approve</Button>
              <Button icon={<CloseCircleOutlined />} onClick={() => handleStatusChange(record.id, 'Rejected')} size="small" className="btn-teal-secondary">Reject</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100%', borderRadius: 16, padding: '8px' }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={2} style={{ color: '#000000' }}>Manage Requests</Title>
        <Text style={{ color: '#334155' }}>Review, approve, or reject student requests for events and clubs.</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: 12, backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 7 }} scroll={{ x: true }} />
      </Card>

      <Modal
        title={`Request Details: ${selectedRequest?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)} className="btn-teal-primary">Close</Button>
        ]}
      >
        {selectedRequest && (
          <div style={{ fontSize: 16, color: '#FFFFFF' }}>
            <p><strong style={{ color: '#FFFFFF' }}>Student Name:</strong> <span style={{ color: '#2DD4BF' }}>{selectedRequest.fullName}</span></p>
            <p><strong style={{ color: '#FFFFFF' }}>Email:</strong> <span style={{ color: '#E2E8F0' }}>{selectedRequest.email}</span></p>
            <p><strong style={{ color: '#FFFFFF' }}>Academic Year:</strong> <span style={{ color: '#E2E8F0' }}>{selectedRequest.academicYear}</span></p>
            <p><strong style={{ color: '#FFFFFF' }}>Request Type:</strong> <span style={{ color: '#E2E8F0' }}>{selectedRequest.requestType}</span></p>
            <p><strong style={{ color: '#FFFFFF' }}>Status:</strong> <Tag color={selectedRequest.status === 'Approved' ? '#14B8A6' : selectedRequest.status === 'Rejected' ? '#F97316' : '#0F766E'}>{selectedRequest.status}</Tag></p>
            <div style={{ marginTop: 24 }}>
              <strong style={{ color: '#FFFFFF' }}>Description:</strong>
              <div style={{ padding: 16, background: '#1E293B', border: '1px solid #334155', borderRadius: 8, marginTop: 8, color: '#F1F5F9' }}>
                {selectedRequest.description}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageRequests;
