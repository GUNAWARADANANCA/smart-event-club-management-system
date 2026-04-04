import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Tag, Row, Col, Modal, Input, message, Space, Descriptions } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, FilePdfOutlined, DownloadOutlined } from '@ant-design/icons';
import api from '../api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const downloadBudgetPDF = (req) => {
  const equipment = req.equipmentCost || 0;
  const labor = req.laborCost || 0;
  const materials = req.materialsCost || 0;
  const misc = req.miscellaneousCost || 0;
  const total = equipment + labor + materials + misc;
  const fmt = (n) => `Rs. ${Number(n).toLocaleString()}`;

  const steps = [
    { step: 1, label: 'Equipment & Technology', amount: equipment, desc: 'Hardware, devices, AV equipment, and technical tools required.' },
    { step: 2, label: 'Labor & Human Resources', amount: labor, desc: 'Staff wages, contractor fees, and volunteer allowances.' },
    { step: 3, label: 'Materials & Supplies', amount: materials, desc: 'Printed materials, stationery, decorations, and consumables.' },
    { step: 4, label: 'Miscellaneous & Contingency', amount: misc, desc: 'Unforeseen expenses, transport, and emergency reserves.' },
  ];

  const stepsHTML = steps.map(s =>
    '<tr>' +
    '<td style="padding:12px 10px; border-bottom:1px solid #e2e8f0;">' +
    '<div style="display:flex; align-items:center; gap:12px;">' +
    '<div style="width:28px;height:28px;border-radius:50%;background:#0F766E;color:white;font-weight:bold;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + s.step + '</div>' +
    '<div>' +
    '<div style="font-weight:bold;color:#0f172a;">' + s.label + '</div>' +
    '<div style="font-size:12px;color:#64748b;margin-top:2px;">' + s.desc + '</div>' +
    '</div></div></td>' +
    '<td style="padding:12px 10px; border-bottom:1px solid #e2e8f0; text-align:right; font-weight:bold; color:#0f172a; white-space:nowrap;">' + fmt(s.amount) + '</td>' +
    '</tr>'
  ).join('');

  const totalRow = '<tr class="total-row"><td>Total Budget</td><td style="text-align:right;">' + fmt(total) + '</td></tr>';
  const remarksSection = req.remarks ? '<h2>Admin Remarks</h2><div class="box">' + req.remarks + '</div>' : '';
  const statusBg = req.status==='Approved'?'#d1fae5':req.status==='Rejected'?'#fee2e2':'#fef3c7';
  const statusColor = req.status==='Approved'?'#065f46':req.status==='Rejected'?'#991b1b':'#92400e';

  const html = `
    <html>
    <head>
      <title>${req.name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
        h1 { color: #0F766E; border-bottom: 3px solid #0F766E; padding-bottom: 10px; }
        h2 { color: #0F766E; margin-top: 28px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; }
        .meta-row { display:flex; justify-content:space-between; padding:7px 0; border-bottom:1px solid #e2e8f0; font-size:14px; }
        .badge { display:inline-block; padding:3px 14px; border-radius:999px; font-size:12px; font-weight:bold; background:${statusBg}; color:${statusColor}; }
        .box { padding:14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-top:8px; font-size:14px; line-height:1.6; }
        table { width:100%; border-collapse:collapse; margin-top:8px; }
        .total-row td { padding:14px 10px; background:#f0fdf4; font-size:16px; font-weight:bold; color:#0F766E; }
        .footer { margin-top:40px; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:12px; }
      </style>
    </head>
    <body>
      <h1>Budget Proposal</h1>
      <div class="meta-row"><span><strong>Request ID</strong></span><span>${req.id}</span></div>
      <div class="meta-row"><span><strong>Name</strong></span><span>${req.name}</span></div>
      <div class="meta-row"><span><strong>Type</strong></span><span>${req.type}</span></div>
      <div class="meta-row"><span><strong>Submitted Date</strong></span><span>${req.submittedDate}</span></div>
      <div class="meta-row"><span><strong>Status</strong></span><span class="badge">${req.status}</span></div>
      <h2>Description</h2>
      <div class="box">${req.description}</div>
      <h2>Budget Breakdown</h2>
      <table>
        <thead>
          <tr style="background:#0F766E;">
            <th style="padding:10px;color:white;text-align:left;">Category</th>
            <th style="padding:10px;color:white;text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>${stepsHTML}${totalRow}</tbody>
      </table>
      ${remarksSection}
      <div class="footer">Downloaded on ${new Date().toLocaleDateString()} &nbsp;|&nbsp; Smart Event Club Management System</div>
    </body>
    </html>
  `;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
};

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
        remarks: '',
        equipmentCost: 80000,
        laborCost: 120000,
        materialsCost: 95000,
        miscellaneousCost: 45000,
      },
      { 
        id: 'FR-2026-002', 
        name: 'Robotics Club Equipment', 
        type: 'Club', 
        submittedDate: '2026-03-18', 
        status: 'Approved', 
        description: 'Purchase of 10 Arduino and 5 Raspberry Pi kits for the upcoming workshops.',
        remarks: 'Approved as per previous committee meeting.',
        equipmentCost: 55000,
        laborCost: 20000,
        materialsCost: 30000,
        miscellaneousCost: 10000,
      },
      { 
        id: 'FR-2026-003', 
        name: 'Cultural Night Performance Costumes', 
        type: 'Event', 
        submittedDate: '2026-03-20', 
        status: 'Pending', 
        description: 'Request for costume rentals and stage setup for the Annual Cultural Night.',
        remarks: '',
        equipmentCost: 25000,
        laborCost: 40000,
        materialsCost: 60000,
        miscellaneousCost: 15000,
      },
      { 
        id: 'FR-2026-004', 
        name: 'Library Renovation Phase 1', 
        type: 'Other', 
        submittedDate: '2026-03-22', 
        status: 'Pending', 
        description: 'Initial budget request for library furniture replacement and painting as part of the phase 1 renovation plan.',
        remarks: '',
        equipmentCost: 200000,
        laborCost: 150000,
        materialsCost: 180000,
        miscellaneousCost: 70000,
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
      message.success(status === 'Approved' ? 'Approved successfully!' : `Request ${status} successfully!`);
      closeModal();
      fetchRequests(); // conceptual reload
    } catch (err) {
      message.error(`Failed to process request: ${err.message}`);
    }
  };

  const getStatusTag = (status) => {
    if (status === 'Approved') return <Tag className="tag-teal-pill active">Approved</Tag>;
    if (status === 'Rejected') return <Tag color="red" className="rounded-full">Rejected</Tag>;
    if (status === 'Cancelled') return <Tag className="tag-teal-pill inactive">Cancelled</Tag>;
    return <Tag className="tag-teal-pill inactive" style={{ color: 'orange' }}>Pending</Tag>;
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, color: '#000000' }}>Finance Request Review</Title>
        <Text style={{ fontSize: 16, color: '#475569' }}>Review and manage pending PDF requests submitted by clubs and events.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {requests.map(req => (
          <Col xs={24} md={12} lg={8} key={req.id}>
            <Card 
              hoverable
              style={{ 
                height: '100%', 
                background: '#0F172A', 
                border: '1px solid #1E293B',
                borderRadius: 16,
                display: 'flex', flexDirection: 'column'
              }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <Title level={4} style={{ color: '#FFFFFF', margin: 0 }}>{req.name}</Title>
                  <Text style={{ color: '#94A3B8' }}>{req.id}</Text>
                </div>
                {getStatusTag(req.status)}
              </div>
              
              <Space style={{ marginBottom: 16 }}>
                <Tag className={`tag-teal-pill ${req.type === 'Event' ? 'active' : 'inactive'}`}>{req.type} Request</Tag>
                <Tag className="tag-teal-pill inactive">{req.submittedDate}</Tag>
              </Space>

              <div style={{ flex: 1, marginBottom: 24 }}>
                <Paragraph style={{ color: '#E2E8F0' }}>
                  {req.description}
                </Paragraph>
              </div>

              <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    className="btn-teal-primary"
                    icon={<EyeOutlined />} 
                    block 
                    size="large"
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
            <span style={{ fontSize: 20, color: '#FFFFFF' }}>Review Request: {selectedRequest?.name}</span>
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
                background: '#1E293B', 
                border: '1px solid #334155', 
                borderRadius: 8,
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                color: '#94A3B8'
              }}>
                <FilePdfOutlined style={{ fontSize: 64, marginBottom: 16, color: '#ef4444' }} />
                <Title level={4} style={{ color: '#FFFFFF' }}>{selectedRequest.name}</Title>
                <Text style={{ color: '#CBD5E1' }}>Submitted Date: {selectedRequest.submittedDate}</Text>
                <Text style={{ marginTop: 16, color: '#94A3B8' }}>(PDF Document Viewer Embedded Here)</Text>
              </div>
            </Col>
            
            <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ color: '#FFFFFF' }}>Request Details</Title>
                <Descriptions column={1} size="small" style={{ marginBottom: 24 }} labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }} contentStyle={{ color: '#FFFFFF' }}>
                  <Descriptions.Item label="ID">{selectedRequest.id}</Descriptions.Item>
                  <Descriptions.Item label="Type">{selectedRequest.type}</Descriptions.Item>
                  <Descriptions.Item label="Status">{getStatusTag(selectedRequest.status)}</Descriptions.Item>
                </Descriptions>
                
                <Title level={5} style={{ color: '#FFFFFF' }}>Original Description</Title>
                <Paragraph style={{ color: '#E2E8F0', padding: 12, background: '#1E293B', borderRadius: 8, border: '1px solid #334155' }}>
                  {selectedRequest.description}
                </Paragraph>

                <Title level={5} style={{ color: '#FFFFFF' }}>Admin Remarks (Optional)</Title>
                <TextArea 
                  rows={4} 
                  placeholder="Enter comments or justification for approval/rejection..." 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  style={{ background: '#1E293B', borderColor: '#334155', color: '#FFFFFF', marginBottom: 24 }}
                  className="placeholder-gray-500"
                />
              </div>

              {selectedRequest.status === 'Pending' ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button danger icon={<CloseCircleOutlined />} size="large" onClick={() => handleAction('Rejected')}>Reject</Button>
                    <Button type="primary" icon={<CheckCircleOutlined />} size="large" style={{ background: '#52c41a', borderColor: '#52c41a' }} onClick={() => handleAction('Approved')}>Approve</Button>
                  </Space>
                  <Button block icon={<DownloadOutlined />} size="large" className="btn-teal-secondary" onClick={() => downloadBudgetPDF(selectedRequest)}>
                    Download PDF
                  </Button>
                </Space>
              ) : (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ padding: 16, background: '#141414', borderRadius: 8, border: '1px dashed #303030' }}>
                    <Text strong>This request was previously {selectedRequest.status.toLowerCase()}.</Text>
                    <br/>
                    <Text type="secondary">Saved Remarks: {selectedRequest.remarks || 'None provided.'}</Text>
                  </div>
                  <Button block icon={<DownloadOutlined />} size="large" className="btn-teal-secondary" onClick={() => downloadBudgetPDF(selectedRequest)}>
                    Download PDF
                  </Button>
                </Space>
              )}
            </Col>
          </Row>
        )}
      </Modal>

      <style>{`
        .glass-modal .ant-modal-content {
          background: #0F172A !important;
          border-radius: 16px;
          border: 1px solid #1E293B !important;
        }
        .glass-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid #1E293B !important;
        }
        .glass-modal .ant-modal-title {
          color: #FFFFFF !important;
        }
        .glass-modal .ant-modal-close {
          color: #94A3B8 !important;
        }
        .glass-modal .ant-modal-close:hover {
          color: #FFFFFF !important;
        }
      `}</style>
    </div>
  );
};

// Also require Descriptions import from antd above, let me make sure it is there.
// I will patch the import in the component.

export default FinanceRequests;
