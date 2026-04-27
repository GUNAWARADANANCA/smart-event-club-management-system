// Version: 1.0.2 - Fixed real data integration
import React, { useMemo, useState } from 'react';
import { Table, Tag, Space, Button, Modal, Typography, Card, message } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SendOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
// import { mockRequests } from '@/data/mockData';
const mockManagedEvents = []; // Placeholder for real managed events if needed
import {
  createBudgetProposalFromRequest,
  getSentBudgetProposals,
  sendProposalToFinance,
} from '@/store/proposalStore';

const { Text } = Typography;

// const initialRequests = mockRequests.filter(
//   (request) => request.requestType !== 'Club Management Request'
// );

const openBudgetProposalPreview = (proposal) => {
  const fmt = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;
  const html = `
    <html>
      <head>
        <title>Budget Proposal - ${proposal.event}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; max-width: 820px; margin: 0 auto; }
          h1 { color: #2E7D32; border-bottom: 2px solid #4CAF50; padding-bottom: 8px; }
          h2 { color: #2E7D32; margin-top: 26px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          p { line-height: 1.6; }
          .meta { display: flex; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold; background: #d1fae5; color: #065f46; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th { background: #2E7D32; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .total { font-weight: bold; font-size: 16px; color: #2E7D32; }
          .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div style="font-size:12px; color:#64748b; margin-bottom:12px;">Generated ${proposal.generatedAt || new Date().toLocaleString()}</div>
        <h1>Budget Proposal</h1>
        <div class="meta">
          <div><strong>Event:</strong> ${proposal.event}</div>
          <div><strong>Status:</strong> <span class="badge">${proposal.status}</span></div>
        </div>
        <h2>Introduction</h2>
        <p>${proposal.introduction}</p>
        <h2>Objectives</h2>
        <p>${proposal.objectives}</p>
        <h2>Cost Breakdown</h2>
        <table>
          <tr><th>Category</th><th>Amount (Rs.)</th></tr>
          <tr><td>Equipment</td><td>${fmt(proposal.equipmentCost)}</td></tr>
          <tr><td>Labor</td><td>${fmt(proposal.laborCost)}</td></tr>
          <tr><td>Materials</td><td>${fmt(proposal.materialsCost)}</td></tr>
          <tr><td>Miscellaneous</td><td>${fmt(proposal.miscellaneousCost)}</td></tr>
          <tr><td class="total">Total</td><td class="total">${fmt(proposal.amount)}</td></tr>
        </table>
        <h2>Justification</h2>
        <p>${proposal.justification}</p>
        <div class="footer">Generated automatically by Smart Event Club Management System</div>
      </body>
    </html>
  `;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
};

const StudentRequestsSection = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sentProposals, setSentProposals] = useState([]);
  
  React.useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/lecturer-requests/admin');
      setData(response.data);
    } catch (error) {
      console.error('Failed to load real requests:', error);
      message.error('Failed to fetch real student requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/lecturer-requests/${id}`, { status: newStatus.toLowerCase() });
      message.success(`Request ${newStatus} successfully!`);
      fetchRequests();
    } catch (error) {
       message.error('Failed to update request status');
    }
  };

  const handleSendProposal = (record) => {
    const proposal = record.generatedProposal || createBudgetProposalFromRequest(record);
    sendProposalToFinance({
      ...proposal,
      status: 'Pending',
    });
    setSentProposals((prev) => [...prev, record.id]);
    message.success(`Budget proposal for ${record.fullName} sent to Finance!`);
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
      filters: [{ text: 'Event', value: 'Event Approval Request' }],
      onFilter: (value, record) => record.requestType === value,
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
      render: (status) => {
        const className =
          status === 'Approved'
            ? 'tag-teal-pill active'
            : 'tag-teal-pill inactive';
        return <Tag className={className}>{status}</Tag>;
      },
    },
    { title: 'Date', dataIndex: 'submittedDate', key: 'submittedDate' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            size="small"
            className="btn-teal-secondary"
          >
            View
          </Button>
          {record.status === 'Pending' && (
            <>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusChange(record.id, 'Approved')}
                size="small"
                className="btn-teal-primary"
              >
                Approve
              </Button>
              <Button
                icon={<CloseCircleOutlined />}
                onClick={() => handleStatusChange(record.id, 'Rejected')}
                size="small"
                className="btn-teal-secondary"
              >
                Reject
              </Button>
            </>
          )}
          {record.status === 'Approved' && (
            <>
              <Button
                icon={<FilePdfOutlined />}
                size="small"
                className="btn-teal-secondary"
                onClick={() =>
                  openBudgetProposalPreview(
                    record.generatedProposal || createBudgetProposalFromRequest(record)
                  )
                }
              >
                View Budget
              </Button>
              <Button
                icon={<SendOutlined />}
                size="small"
                className="btn-teal-primary"
                disabled={sentProposals.includes(record.id)}
                onClick={() => handleSendProposal(record)}
              >
                {sentProposals.includes(record.id) ? 'Proposal Sent' : 'Send Budget Proposal'}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const eventStatusColumns = useMemo(
    () => [
      { title: 'Title', dataIndex: 'title', key: 'title' },
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Venue', dataIndex: 'venue', key: 'venue' },
      { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          const color =
            status === 'Approved' ? 'green' : status === 'Pending' ? 'orange' : 'red';
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: 'Action',
        key: 'action',
        render: () => (
          <Space size="middle" wrap>
            <Button
              icon={<FileTextOutlined />}
              type="default"
              size="small"
              onClick={() => {
                setStatusModalOpen(false);
                navigate('/portal');
              }}
            >
              View in Portal
            </Button>
            <Button
              icon={<EditOutlined />}
              type="dashed"
              size="small"
              onClick={() => {
                setStatusModalOpen(false);
                navigate('/events');
              }}
            >
              Edit
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={() => message.info('Delete events from the Event Management page.')}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div>
          <Text style={{ color: '#64748B' }}>
            Review, approve, or reject student event requests.
          </Text>
        </div>
        <Button
          type="default"
          className="btn-teal-secondary"
          onClick={() => setStatusModalOpen(true)}
        >
          View Status
        </Button>
      </div>

      <Card
        variant="borderless"
        style={{
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          borderColor: '#C8E6C9',
          boxShadow: '0 4px 14px rgba(46, 125, 50, 0.08)',
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 7 }}
          scroll={{ x: true }}
          className="dark-table"
        />
      </Card>

      <Modal
        title={<span style={{ color: '#0F172A' }}>Event publication status</span>}
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            className="btn-teal-primary"
            onClick={() => setStatusModalOpen(false)}
          >
            Close
          </Button>,
        ]}
        width={960}
        styles={{ body: { paddingTop: 12 } }}
      >
        <Table
          columns={eventStatusColumns}
          dataSource={[]}
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
          <Button
            key="close"
            onClick={() => setIsModalVisible(false)}
            className="btn-teal-primary"
          >
            Close
          </Button>,
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
