import React, { useState } from 'react';
import { Table, Button, Space, Typography, Tag, message, Modal, Descriptions, Badge } from 'antd';
import { FilePdfOutlined, SendOutlined } from '@ant-design/icons';
import { mockBudgets } from '../mockData';

const { Title } = Typography;

const downloadBudgetPDF = (budget) => {
  const html = `
    <html>
    <head>
      <title>Budget Proposal - ${budget.event}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
        h1 { color: #0F766E; border-bottom: 2px solid #0F766E; padding-bottom: 8px; }
        h2 { color: #0F766E; margin-top: 24px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { background: #0F766E; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .total { font-weight: bold; font-size: 16px; color: #0F766E; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold; background: ${budget.status === 'Approved' ? '#d1fae5' : '#fef3c7'}; color: ${budget.status === 'Approved' ? '#065f46' : '#92400e'}; }
        .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      </style>
    </head>
    <body>
      <h1>Budget Proposal</h1>
      <p><strong>Event:</strong> ${budget.event}</p>
      <p><strong>Status:</strong> <span class="badge">${budget.status}</span></p>

      <h2>Introduction</h2>
      <p>${budget.introduction || 'N/A'}</p>

      <h2>Objectives</h2>
      <p>${budget.objectives || 'N/A'}</p>

      <h2>Cost Breakdown</h2>
      <table>
        <tr><th>Category</th><th>Amount (Rs.)</th></tr>
        <tr><td>Equipment</td><td>Rs. ${Number(budget.equipmentCost || 0).toLocaleString()}</td></tr>
        <tr><td>Labor</td><td>Rs. ${Number(budget.laborCost || 0).toLocaleString()}</td></tr>
        <tr><td>Materials</td><td>Rs. ${Number(budget.materialsCost || 0).toLocaleString()}</td></tr>
        <tr><td>Miscellaneous</td><td>Rs. ${Number(budget.miscellaneousCost || 0).toLocaleString()}</td></tr>
        <tr><td class="total">Total</td><td class="total">Rs. ${Number(budget.amount).toLocaleString()}</td></tr>
      </table>

      <h2>Justification</h2>
      <p>${budget.justification || 'N/A'}</p>

      <div class="footer">Generated on ${new Date().toLocaleDateString()} &nbsp;|&nbsp; Smart Event Club Management System</div>
    </body>
    </html>
  `;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
};

const BudgetApproval = () => {
  const [data, setData] = useState(mockBudgets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [sentToFinance, setSentToFinance] = useState([]);

  const approveBudget = (id) => {
    setData(data.map(b => b.id === id ? { ...b, status: 'Approved' } : b));
    if (selectedBudget) setSelectedBudget(prev => ({ ...prev, status: 'Approved' }));
    message.success('Approved successfully');
  };

  const rejectBudget = (id) => {
    setData(data.map(b => b.id === id ? { ...b, status: 'Rejected' } : b));
    if (selectedBudget) setSelectedBudget(prev => ({ ...prev, status: 'Rejected' }));
    message.success('Budget rejected.');
  };

  const sendToFinance = (budget) => {
    setSentToFinance(prev => [...prev, budget.id]);
    message.success(`Budget proposal for "${budget.event}" sent to Finance!`);
  };

  const handleReview = (record) => {
    setSelectedBudget(record);
    setIsModalOpen(true);
  };

  const columns = [
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { title: 'Total Amount (Rs.)', dataIndex: 'amount', key: 'amount', render: val => `Rs. ${Number(val).toLocaleString()}` },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: status => {
        let color = status === 'Approved' ? 'green' : (status === 'Pending' ? 'orange' : 'red');
        return <Tag className={`tag-teal-pill ${status === 'Approved' ? 'active' : 'inactive'}`}>{status}</Tag>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" wrap>
          <Button onClick={() => handleReview(record)} className="btn-teal-secondary">Review</Button>
          {record.status === 'Pending' && (
            <>
              <Button className="btn-teal-primary" onClick={() => approveBudget(record.id)}>Approve</Button>
              <Button danger className="rounded-full" onClick={() => rejectBudget(record.id)}>Reject</Button>
            </>
          )}
          {record.status === 'Approved' && (
            <>
              <Button icon={<FilePdfOutlined />} onClick={() => downloadBudgetPDF(record)} className="btn-teal-secondary">Download PDF</Button>
              <Button
                icon={<SendOutlined />}
                onClick={() => sendToFinance(record)}
                disabled={sentToFinance.includes(record.id)}
                className="btn-teal-primary"
              >
                {sentToFinance.includes(record.id) ? 'Sent' : 'Send to Finance'}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <Title level={2} style={{ color: '#000000', marginBottom: 24 }}>Budget Approvals</Title>
      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title={<span style={{ color: '#FFFFFF' }}>Review Budget Proposal: {selectedBudget?.event}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>Close</Button>,
          selectedBudget?.status === 'Approved' && (
            <React.Fragment key="approved-actions">
              <Button key="pdf" icon={<FilePdfOutlined />} onClick={() => downloadBudgetPDF(selectedBudget)} className="btn-teal-secondary">Download PDF</Button>
              <Button
                key="finance"
                icon={<SendOutlined />}
                onClick={() => sendToFinance(selectedBudget)}
                disabled={sentToFinance.includes(selectedBudget?.id)}
                className="btn-teal-primary"
              >
                {sentToFinance.includes(selectedBudget?.id) ? 'Sent to Finance' : 'Send to Finance'}
              </Button>
            </React.Fragment>
          ),
          selectedBudget?.status === 'Pending' && (
            <React.Fragment key="pending-actions">
              <Button danger className="rounded-full" onClick={() => rejectBudget(selectedBudget.id)}>Reject</Button>
              <Button className="btn-teal-primary" onClick={() => approveBudget(selectedBudget.id)}>Approve</Button>
            </React.Fragment>
          )
        ]}
        width={700}
        className="glass-modal"
      >
        {selectedBudget && (
          <Descriptions bordered column={1} size="small" labelStyle={{ width: '150px', color: '#FFFFFF', fontWeight: 'bold' }} contentStyle={{ color: '#FFFFFF' }}>
             <Descriptions.Item label="Status">
               <Badge status={selectedBudget.status === 'Approved' ? 'success' : selectedBudget.status === 'Pending' ? 'warning' : 'error'} text={selectedBudget.status} />
             </Descriptions.Item>
             <Descriptions.Item label="Event">{selectedBudget.event}</Descriptions.Item>
             <Descriptions.Item label="Introduction">{selectedBudget.introduction || 'N/A'}</Descriptions.Item>
             <Descriptions.Item label="Objectives">{selectedBudget.objectives || 'N/A'}</Descriptions.Item>
             
             <Descriptions.Item label="Equipment Cost">Rs. {Number(selectedBudget.equipmentCost || 0).toLocaleString()}</Descriptions.Item>
             <Descriptions.Item label="Labor Cost">Rs. {Number(selectedBudget.laborCost || 0).toLocaleString()}</Descriptions.Item>
             <Descriptions.Item label="Materials Cost">Rs. {Number(selectedBudget.materialsCost || 0).toLocaleString()}</Descriptions.Item>
             <Descriptions.Item label="Miscellaneous">Rs. {Number(selectedBudget.miscellaneousCost || 0).toLocaleString()}</Descriptions.Item>
             <Descriptions.Item label="Total Cost"><strong>Rs. {Number(selectedBudget.amount).toLocaleString()}</strong></Descriptions.Item>
             
             <Descriptions.Item label="Justification">{selectedBudget.justification || 'N/A'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default BudgetApproval;
