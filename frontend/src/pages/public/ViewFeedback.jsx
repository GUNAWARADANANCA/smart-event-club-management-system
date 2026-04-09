import React, { useEffect, useState } from "react";
import {
  Table,
  Rate,
  Tag,
  Card,
  Typography,
  Button,
  Modal,
  Spin,
  message,
} from "antd";
import { MessageSquare, Star, MessageCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const ViewFeedback = () => {
  const navigate = useNavigate();
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    responseRate: "100%",
  });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);

      const [feedbackRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/feedback"),
        axios.get("http://localhost:5000/api/feedback/stats"),
      ]);

      const mappedFeedbacks = feedbackRes.data.feedbacks.map((item) => ({
        key: item._id,
        id: item._id,
        user: item.name || "Anonymous",
        rating: item.rating,
        category: item.category,
        subject: item.subject,
        message: item.message,
        date: new Date(item.createdAt).toISOString().split("T")[0],
      }));

      setFeedbacks(mappedFeedbacks);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Fetch feedbacks error:", error);
      message.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text) => <Text className="text-slate-900 font-bold">{text}</Text>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <Rate disabled value={rating} className="text-[#4CAF50] text-xs" />
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        let color = "cyan";
        if (category === "Bug Report") color = "volcano";
        if (category === "Feature Request") color = "purple";
        if (category === "UI/UX") color = "blue";
        return <Tag color={color} className="rounded-full px-3">{category}</Tag>;
      },
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text) => <Text className="text-slate-700">{text}</Text>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => <Text className="text-gray-500 text-xs">{text}</Text>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          className="text-[#4CAF50] hover:text-[#2E7D32] p-0"
          onClick={() => setSelectedFeedback(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] font-sans selection:bg-[#4CAF50]/25 rounded-3xl overflow-hidden shadow-sm relative p-6 md:p-8">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#4CAF50]/8 to-transparent pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeft size={18} />}
              onClick={() => navigate(-1)}
              className="hover:scale-105 transition-transform bg-white border border-[#C8E6C9] text-slate-800 rounded-xl shadow-sm"
            />
            <Title level={2} className="m-0 !text-slate-800 tracking-tight font-black uppercase tracking-tighter">
              Feedback{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50]">
                Center
              </span>
            </Title>
          </div>

          <Button
            icon={<MessageCircle size={18} />}
            onClick={() => navigate("/feedback")}
            style={{
              background: "linear-gradient(to right, #43A047, #4CAF50)",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 12,
              boxShadow: "0 4px 14px rgba(76, 175, 80, 0.25)",
            }}
          >
            Your Feedback
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Total Feedbacks",
              value: stats.totalFeedbacks,
              icon: <MessageSquare className="text-blue-500" />,
            },
            {
              label: "Average Rating",
              value: stats.averageRating,
              icon: <Star className="text-yellow-500" />,
            },
            {
              label: "Response Rate",
              value: stats.responseRate,
              icon: <MessageSquare className="text-green-500" />,
            },
          ].map((stat, i) => (
            <Card
              key={i}
              variant="outlined"
              className="bg-white border-[#E2E8F0] shadow-sm rounded-3xl overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl">{stat.icon}</div>
                <div>
                  <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest block">
                    {stat.label}
                  </Text>
                  <Title level={3} className="m-0 !text-slate-800 font-black">
                    {stat.value}
                  </Title>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card
          variant="outlined"
          className="bg-white border-[#C8E6C9] shadow-lg rounded-3xl overflow-hidden"
        >
          <div className="mb-6 flex items-center justify-between">
            <Title
              level={4}
              className="m-0 !text-slate-800 font-bold uppercase tracking-widest text-xs border-b border-[#C8E6C9] pb-2"
            >
              Recent Submissions
            </Title>
            <Text className="text-gray-500 text-xs italic">Live feedback data</Text>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={feedbacks}
              pagination={{ pageSize: 5 }}
              className="dark-table"
              rowClassName="hover:bg-[#E8F5E9]/50 cursor-pointer transform transition-all"
            />
          )}
        </Card>
      </div>

      <Modal
        open={!!selectedFeedback}
        onCancel={() => setSelectedFeedback(null)}
        footer={null}
        centered
        width={600}
      >
        {selectedFeedback && (
          <div>
            <Title level={4}>{selectedFeedback.subject}</Title>
            <Text strong>User: </Text>
            <Text>{selectedFeedback.user}</Text>
            <br />
            <Text strong>Category: </Text>
            <Text>{selectedFeedback.category}</Text>
            <br />
            <Text strong>Rating: </Text>
            <Rate disabled value={selectedFeedback.rating} />
            <br />
            <br />
            <Text strong>Message:</Text>
            <p>{selectedFeedback.message}</p>
            <Text type="secondary">{selectedFeedback.date}</Text>
          </div>
        )}
      </Modal>

      <style>{`
        .dark-table .ant-table {
          background: transparent !important;
          color: #1F2937 !important;
        }
        .dark-table .ant-table-thead > tr > th {
          background: #E8F5E9 !important;
          color: #2E7D32 !important;
          border-bottom: 1px solid #C8E6C9 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          font-weight: 800 !important;
        }
        .dark-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #E8F5E9 !important;
          padding: 16px !important;
          background: #FFFFFF !important;
        }
      `}</style>
    </div>
  );
};

export default ViewFeedback;