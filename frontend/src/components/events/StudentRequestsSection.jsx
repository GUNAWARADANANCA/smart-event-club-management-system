import React, { useMemo, useState } from 'react';
import { Table, Tag, Space, Button, Modal, Typography, Card, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, SendOutlined, FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockRequests, mockManagedEvents } from '@/data/mockData';
import { sendProposalToFinance } from '@/store/proposalStore';

const { Title, Text } = Typography;

const StudentRequestsSection = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(mockRequests);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sentProposals, setSentProposals] = useState([]);

  const handleStatusChange = (id, newStatus) => {
    const requestIndex = mockRequests.findIndex(r => r.id === id);
    if (requestIndex > -1) mockRequests[requestIndex].status = newStatus;
    setData([...mockRequests]);
  };

  const handleSendProposal = (record) => {
    sendProposalToFinance({
      id: record.id,
      name: record.fullName + ' — ' + record.requestType,
      type: record.requestType.includes('Event') ? 'Event' : 'Club',
      submittedDate: record.submittedDate,
      status: 'Pending',
      description: record.description,
      remarks: '',
      source: 'ManageRequests',
    });
    setSentProposals(prev => [...prev, record.id]);
    message.success(`Proposal for ${record.fullName} sent to Finance!`);
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
          {record.status === 'Approved' && (
            <Button
              icon={<SendOutlined />}
              size="small"
              className="btn-teal-primary"
              disabled={sentProposals.includes(record.id)}
              onClick={() => handleSendProposal(record)}
            >
              {sentProposals.includes(record.id) ? 'Sent' : 'Send Proposal'}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const eventStatusColumns = useMemo(() => [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Venue', dataIndex: 'venue', key: 'venue' },
    { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Approved' ? 'green' : (status === 'Pending' ? 'orange' : 'red');
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle" wrap>
          <Button icon={<FileTextOutlined />} type="default" size="small" onClick={() => { setStatusModalOpen(false); navigate('/portal'); }}>
            View in Portal
          </Button>
          <Button icon={<EditOutlined />} type="dashed" size="small" onClick={() => { setStatusModalOpen(false); navigate('/events'); }}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} danger size="small" onClick={() => message.info('Delete events from the Event Management page.')}>
            Delete
          </Button>
        </Space>
      ),
    },
  ], [navigate]);

  return (
    <div style={{ }}>
      <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          {/* <Title level={2} style={{ color: '#0F172A', marginBottom: 4 }}>Manage Requests</Title> */}
          <Text style={{ color: '#64748B' }}>Review, approve, or reject student requests for events and clubs.</Text>
        </div>
        <Button type="default" className="btn-teal-secondary" onClick={() => setStatusModalOpen(true)}>
          View Status
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 12, backgroundColor: '#FFFFFF', borderColor: '#C8E6C9', boxShadow: '0 4px 14px rgba(46, 125, 50, 0.08)' }}>
        <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 7 }} scroll={{ x: true }} className="dark-table" />
      </Card>

      <Modal
        title={<span style={{ color: '#0F172A' }}>Event publication status</span>}
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        footer={[
          <Button key="close" type="primary" className="btn-teal-primary" onClick={() => setStatusModalOpen(false)}>Close</Button>
        ]}
        width={960}
        styles={{ body: { paddingTop: 12 } }}
      >
        <Table
          columns={eventStatusColumns}
          dataSource={mockManagedEvents}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: false }}
          scroll={{ x: 720 }}
        />
      </Modal>

      <Modal
        title={`Request Details: ${selectedRequest?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)} className="btn-teal-primary">Close</Button>
        ]}
      >
        {selectedRequest && (
          <div style={{ fontSize: 16, color: '#1F2937' }}>
            <p><strong style={{ color: '#0F172A' }}>Student Name:</strong> <span style={{ color: '#2E7D32' }}>{selectedRequest.fullName}</span></p>
            <p><strong style={{ color: '#0F172A' }}>Email:</strong> <span style={{ color: '#475569' }}>{selectedRequest.email}</span></p>
            <p><strong style={{ color: '#0F172A' }}>Academic Year:</strong> <span style={{ color: '#475569' }}>{selectedRequest.academicYear}</span></p>
            <p><strong style={{ color: '#0F172A' }}>Request Type:</strong> <span style={{ color: '#475569' }}>{selectedRequest.requestType}</span></p>
            <p><strong style={{ color: '#0F172A' }}>Status:</strong> <Tag color={selectedRequest.status === 'Approved' ? '#4CAF50' : selectedRequest.status === 'Rejected' ? '#F97316' : '#81C784'}>{selectedRequest.status}</Tag></p>
            <div style={{ marginTop: 24 }}>
              <strong style={{ color: '#0F172A' }}>Description:</strong>
              <div style={{ padding: 16, background: '#F7FCF7', border: '1px solid #C8E6C9', borderRadius: 8, marginTop: 8, color: '#1F2937' }}>
                {selectedRequest.description}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentRequestsSection;
