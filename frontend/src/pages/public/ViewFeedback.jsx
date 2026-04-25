import React, { useEffect, useState } from "react";
import {
  Table, Rate, Tag, Card, Typography, Button, Modal, Spin, message, Form, Input, Select,
} from "antd";
import { MessageSquare, Star, TrendingUp, ArrowLeft, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;
const { TextArea } = Input;

const sentimentColor = {
  positive: { bg: "#E8F5E9", text: "#2E7D32", border: "#C8E6C9" },
  neutral:  { bg: "#FFF8E1", text: "#F57F17", border: "#FFE082" },
  negative: { bg: "#FFEBEE", text: "#C62828", border: "#FFCDD2" },
};

const CATEGORIES = ["General", "Bug Report", "Feature Request", "UI/UX"];

function EmotionBar({ label, value }) {
  const color = value >= 70 ? "#4CAF50" : value >= 40 ? "#FFA726" : "#EF5350";
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3, color: "var(--color-text-secondary)" }}>
        <span style={{ textTransform: "capitalize" }}>{label}</span>
        <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{value}</span>
      </div>
      <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 999, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function ScoreRing({ score, sentiment }) {
  const color = score >= 70 ? "#4CAF50" : score >= 40 ? "#FFA726" : "#EF5350";
  const r = 38, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--color-background-secondary)" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 48 48)" />
        <text x="48" y="52" textAnchor="middle" fontSize="18" fontWeight="500" fill={color}>{score}</text>
      </svg>
      <span style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {sentiment || "—"}
      </span>
    </div>
  );
}

const ViewFeedback = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    totalFeedbacks: 0, averageRating: 0, responseRate: "100%",
    avgEmotionScore: null, sentimentCounts: { positive: 0, neutral: 0, negative: 0 },
  });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const [feedbackRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/feedback"),
        axios.get("http://localhost:5000/api/feedback/stats"),
      ]);
      const mapped = feedbackRes.data.feedbacks.map((item) => ({
        key: item._id,
        id: item._id,
        user: item.name || "Anonymous",
        rating: item.rating,
        category: item.category,
        subject: item.subject,
        message: item.message,
        date: new Date(item.createdAt).toISOString().split("T")[0],
        emotionScore: item.emotionScore,
        sentiment: item.sentiment,
        emotions: item.emotions,
        dominantEmotion: item.dominantEmotion,
        emotionSummary: item.emotionSummary,
        recommendation: item.recommendation,
      }));
      setFeedbacks(mapped);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  // Open edit modal
  const handleEdit = (record) => {
    setEditingFeedback(record);
    form.setFieldsValue({
      name: record.user,
      rating: record.rating,
      category: record.category,
      subject: record.subject,
      message: record.message,
    });
  };

  // Submit edit
  const handleEditSubmit = async (values) => {
    try {
      setEditLoading(true);
      await axios.put(`http://localhost:5000/api/feedback/${editingFeedback.id}`, values);
      message.success("Feedback updated successfully");
      setEditingFeedback(null);
      form.resetFields();
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
      message.error("Failed to update feedback");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete with confirmation
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete feedback",
      content: `Are you sure you want to delete "${record.subject}"? This cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/feedback/${record.id}`);
          message.success("Feedback deleted");
          fetchFeedbacks();
        } catch (err) {
          console.error(err);
          message.error("Failed to delete feedback");
        }
      },
    });
  };

  const columns = [
    {
      title: "User", dataIndex: "user", key: "user",
      render: (t) => <Text style={{ fontWeight: 500 }}>{t}</Text>,
    },
    {
      title: "Rating", dataIndex: "rating", key: "rating",
      render: (r) => <Rate disabled value={r} style={{ fontSize: 12, color: "#4CAF50" }} />,
    },
    {
      title: "Category", dataIndex: "category", key: "category",
      render: (c) => {
        const colors = { "Bug Report": "volcano", "Feature Request": "purple", "UI/UX": "blue", General: "cyan" };
        return <Tag color={colors[c] || "cyan"} style={{ borderRadius: 999, padding: "0 10px" }}>{c}</Tag>;
      },
    },
    {
      title: "Subject", dataIndex: "subject", key: "subject",
      render: (t) => <Text style={{ color: "var(--color-text-primary)" }}>{t}</Text>,
    },
    {
      title: "Emotion score", dataIndex: "emotionScore", key: "emotionScore",
      render: (score, record) => {
        if (score == null) return <Text style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>—</Text>;
        const s = sentimentColor[record.sentiment] || sentimentColor.neutral;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 14, color: s.text }}>{score}/100</span>
            <span style={{ fontSize: 11, background: s.bg, color: s.text, border: `1px solid ${s.border}`, borderRadius: 999, padding: "1px 8px" }}>
              {record.sentiment}
            </span>
          </div>
        );
      },
    },
    {
      title: "Date", dataIndex: "date", key: "date",
      render: (t) => <Text style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{t}</Text>,
    },
    {
      title: "Action", key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button type="link" style={{ color: "#4CAF50", padding: 0 }} onClick={() => setSelectedFeedback(record)}>
            View
          </Button>
          {/* <Button
            type="text" size="small"
            icon={<Pencil size={13} />}
            style={{ color: "#1890ff", padding: "2px 6px" }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="text" size="small"
            icon={<Trash2 size={13} />}
            style={{ color: "#ff4d4f", padding: "2px 6px" }}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button> */}
        </div>
      ),
    },
  ];

  const sc = stats.sentimentCounts || {};
  const total = stats.totalFeedbacks || 1;

  return (
    <div className="min-h-screen bg-[#F8FAF8] font-sans rounded-3xl overflow-hidden shadow-sm relative p-6 md:p-8">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#4CAF50]/6 to-transparent pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button icon={<ArrowLeft size={18} />} onClick={() => navigate(-1)}
              className="hover:scale-105 transition-transform bg-white border border-[#C8E6C9] text-slate-800 rounded-xl shadow-sm" />
            <Title level={2} className="m-0 !text-slate-800 font-black uppercase tracking-tighter">
              Feedback <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50]">Center</span>
            </Title>
          </div>
          <Button icon={<MessageCircle size={18} />} onClick={() => navigate("/feedback")}
            style={{ background: "linear-gradient(to right,#43A047,#4CAF50)", border: "none", color: "#fff", fontWeight: 700, borderRadius: 12, boxShadow: "0 4px 14px rgba(76,175,80,0.25)" }}>
            Your feedback
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total feedbacks", value: stats.totalFeedbacks, icon: <MessageSquare size={16} className="text-blue-500" /> },
            { label: "Average rating", value: stats.averageRating, icon: <Star size={16} className="text-yellow-500" /> },
            { label: "Emotion score", value: stats.avgEmotionScore != null ? `${stats.avgEmotionScore}/100` : "—", icon: <TrendingUp size={16} className="text-green-500" /> },
            { label: "Response rate", value: stats.responseRate, icon: <MessageSquare size={16} className="text-green-500" /> },
          ].map((s, i) => (
            <Card key={i} variant="outlined" className="bg-white border-[#E2E8F0] shadow-sm rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl">{s.icon}</div>
                <div>
                  <Text style={{ color: "var(--color-text-secondary)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}>{s.label}</Text>
                  <Title level={4} className="m-0 !text-slate-800 font-black">{s.value}</Title>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Sentiment distribution */}
        <Card variant="outlined" className="bg-white border-[#C8E6C9] shadow-sm rounded-3xl mb-6">
          <Text style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)" }}>
            Sentiment distribution
          </Text>
          <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
            {["positive", "neutral", "negative"].map((s) => {
              const count = sc[s] || 0;
              const pct = Math.round((count / total) * 100);
              const col = sentimentColor[s];
              return (
                <div key={s} style={{ flex: "1 1 120px", background: col.bg, border: `1px solid ${col.border}`, borderRadius: 12, padding: "12px 16px" }}>
                  <div style={{ fontSize: 11, textTransform: "capitalize", fontWeight: 700, color: col.text }}>{s}</div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: col.text }}>{pct}%</div>
                  <div style={{ fontSize: 11, color: col.text, opacity: 0.7 }}>{count} responses</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Table */}
        <Card variant="outlined" className="bg-white border-[#C8E6C9] shadow-lg rounded-3xl overflow-hidden">
          <div className="mb-6 flex items-center justify-between">
            <Text style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)" }}>
              Recent submissions
            </Text>
            <Text style={{ color: "var(--color-text-secondary)", fontSize: 12, fontStyle: "italic" }}>Live feedback data</Text>
          </div>
          {loading ? (
            <div className="py-16 text-center"><Spin size="large" /></div>
          ) : (
            <Table columns={columns} dataSource={feedbacks} pagination={{ pageSize: 5 }}
              rowClassName="hover:bg-[#E8F5E9]/50 cursor-pointer"
              scroll={{ x: 1000 }} />
          )}
        </Card>
      </div>

      {/* View detail modal */}
      <Modal open={!!selectedFeedback} onCancel={() => setSelectedFeedback(null)} footer={null} centered width={640}>
        {selectedFeedback && (
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>{selectedFeedback.subject}</Title>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              <Tag color={selectedFeedback.category === "Bug Report" ? "volcano" : selectedFeedback.category === "Feature Request" ? "purple" : "cyan"}
                style={{ borderRadius: 999 }}>{selectedFeedback.category}</Tag>
              {selectedFeedback.sentiment && (
                <span style={{ fontSize: 12, background: sentimentColor[selectedFeedback.sentiment]?.bg, color: sentimentColor[selectedFeedback.sentiment]?.text, border: `1px solid ${sentimentColor[selectedFeedback.sentiment]?.border}`, borderRadius: 999, padding: "2px 10px" }}>
                  {selectedFeedback.sentiment}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
              <div>
                <Text style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>User</Text>
                <div style={{ fontWeight: 500 }}>{selectedFeedback.user}</div>
              </div>
              <div>
                <Text style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>Date</Text>
                <div style={{ fontWeight: 500 }}>{selectedFeedback.date}</div>
              </div>
              <div>
                <Text style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>Star rating</Text>
                <Rate disabled value={selectedFeedback.rating} style={{ fontSize: 13, color: "#4CAF50" }} />
              </div>
            </div>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
              <Text style={{ color: "var(--color-text-primary)" }}>{selectedFeedback.message}</Text>
            </div>
            {selectedFeedback.emotionScore != null && (
              <div>
                <Text style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", display: "block", marginBottom: 12 }}>
                  Emotion analysis
                </Text>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <ScoreRing score={selectedFeedback.emotionScore} sentiment={selectedFeedback.sentiment} />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    {selectedFeedback.emotions && Object.entries(selectedFeedback.emotions).map(([k, v]) => (
                      <EmotionBar key={k} label={k} value={v} />
                    ))}
                  </div>
                </div>
                {selectedFeedback.emotionSummary && (
                  <div style={{ marginTop: 12, fontSize: 13, color: "var(--color-text-secondary)", fontStyle: "italic", borderLeft: "3px solid #C8E6C9", paddingLeft: 12 }}>
                    {selectedFeedback.emotionSummary}
                  </div>
                )}
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Overall verdict:</Text>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 999,
                    background: selectedFeedback.recommendation === "positive" ? "#E8F5E9" : "#FFEBEE",
                    color: selectedFeedback.recommendation === "positive" ? "#2E7D32" : "#C62828",
                    border: `1px solid ${selectedFeedback.recommendation === "positive" ? "#C8E6C9" : "#FFCDD2"}`,
                  }}>
                    {selectedFeedback.recommendation === "positive" ? "Positive feedback" : "Needs attention"}
                  </span>
                </div>
              </div>
            )}
            <div style={{ marginTop: 20, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button icon={<Pencil size={13} />} onClick={() => { setSelectedFeedback(null); handleEdit(selectedFeedback); }}>
                Edit
              </Button>
              <Button danger icon={<Trash2 size={13} />} onClick={() => { setSelectedFeedback(null); handleDelete(selectedFeedback); }}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editingFeedback}
        onCancel={() => { setEditingFeedback(null); form.resetFields(); }}
        footer={null}
        centered
        width={560}
        title="Edit feedback"
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Your name">
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item name="rating" label="Rating" rules={[{ required: true, message: "Please provide a rating" }]}>
            <Rate style={{ color: "#4CAF50" }} />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select>
                {CATEGORIES.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
              <Input placeholder="Brief subject" />
            </Form.Item>
          </div>
          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Your feedback details" />
          </Form.Item>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={() => { setEditingFeedback(null); form.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={editLoading}
              style={{ background: "linear-gradient(to right,#43A047,#4CAF50)", border: "none" }}>
              Save changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewFeedback;