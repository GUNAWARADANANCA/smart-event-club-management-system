import React, { useState } from 'react';
import { Table, Button, Space, Typography, Tag, message, Modal, Descriptions, Badge } from 'antd';
import { mockBudgets } from '../mockData';

const { Title } = Typography;

const BudgetApproval = () => {
  const [data, setData] = useState(mockBudgets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const approveBudget = (id) => {
    setData(data.map(b => b.id === id ? { ...b, status: 'Approved' } : b));
    message.success('Approved successfully');
    setIsModalOpen(false);
  };

  const rejectBudget = (id) => {
    setData(data.map(b => b.id === id ? { ...b, status: 'Rejected' } : b));
    message.success('Budget rejected.');
    setIsModalOpen(false);
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
        <Space size="middle">
           <Button onClick={() => handleReview(record)} className="btn-teal-secondary">Review</Button>
          {record.status === 'Pending' && (
            <>
              <Button className="btn-teal-primary" onClick={() => approveBudget(record.id)}>Approve</Button>
              <Button danger className="rounded-full" onClick={() => rejectBudget(record.id)}>Reject</Button>
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
          selectedBudget && selectedBudget.status === 'Pending' && (
            <React.Fragment key="actions">
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
