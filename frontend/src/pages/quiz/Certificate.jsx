import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Divider, Space, message, Tooltip, Modal, Result, Statistic, Input, List, Tag, Empty } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@/lib/api';

const {
  TrophyOutlined,
  SafetyCertificateOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  MailOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  StarOutlined
} = Icons;

const { Title, Text, Paragraph } = Typography;
const LOCAL_RESULTS_KEY = 'localQuizResults';
const PASS_SCORE = 50;

const readLocalResults = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_RESULTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const downloadCertificatePDF = ({ fullName, email, quizTitle, issuedDate, score, percentage }) => {
  const filenameBase = String(quizTitle || 'certificate')
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'certificate';

  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(filenameBase)}-certificate</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Great+Vibes&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 landscape; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Montserrat', sans-serif; 
            background-color: #f0f0f0; 
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            -webkit-print-color-adjust: exact;
          }
          .cert-outer {
            width: 297mm;
            height: 210mm;
            padding: 15mm;
            background: #fff;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc;
          }
          .cert-inner {
            width: 100%;
            height: 100%;
            border: 8px double #d4af37;
            padding: 10mm;
            position: relative;
            background: radial-gradient(circle, #fffaf0 0%, #ffffff 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            text-align: center;
          }
          .corner-decoration {
            position: absolute;
            width: 80px;
            height: 80px;
            border: 4px solid #d4af37;
          }
          .top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
          .top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
          .bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
          .bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }

          .header { margin-top: 10mm; }
          .logo { font-family: 'Cinzel Decorative', cursive; font-size: 28px; color: #b8860b; margin-bottom: 5mm; }
          .main-title { font-family: 'Cinzel Decorative', cursive; font-size: 48px; color: #1a1a1a; letter-spacing: 4px; border-bottom: 2px solid #d4af37; display: inline-block; padding-bottom: 5mm; margin-bottom: 10mm; }
          
          .presentation { font-size: 18px; color: #555; font-style: italic; margin-bottom: 5mm; }
          .name { font-family: 'Great Vibes', cursive; font-size: 64px; color: #b8860b; margin: 5mm 0; }
          
          .description { font-size: 18px; color: #333; max-width: 80%; line-height: 1.6; }
          .course-name { font-weight: 700; font-size: 24px; color: #1a1a1a; display: block; margin-top: 3mm; }
          
          .stats { margin: 10mm 0; }
          .score { font-weight: 700; font-size: 22px; color: #d4af37; background: #fafafa; padding: 5px 20px; border: 1px solid #eee; border-radius: 5px; }
          
          .signature-section { width: 85%; display: flex; justify-content: space-between; margin-bottom: 15mm; }
          .signature-box { width: 70mm; border-top: 2px solid #333; padding-top: 2mm; }
          .sig-label { font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: 1px; }
          
          .gold-seal { position: absolute; bottom: 25mm; left: 50%; transform: translateX(-50%); width: 100px; height: 100px; background: #ffd700; border-radius: 50%; box-shadow: 0 5px 15px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; border: 4px double #b8860b; }
          .gold-seal-inner { width: 80px; height: 80px; border: 2px dashed #b8860b; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel Decorative', cursive; font-size: 10px; font-weight: 900; color: #b8860b; text-align: center; }
          
          .cert-id { position: absolute; bottom: 5mm; right: 5mm; font-size: 10px; color: #aaa; }
        </style>
      </head>
      <body>
        <div class="cert-outer">
          <div class="cert-inner">
            <div class="corner-decoration top-left"></div>
            <div class="corner-decoration top-right"></div>
            <div class="corner-decoration bottom-left"></div>
            <div class="corner-decoration bottom-right"></div>

            <div class="header">
              <div class="logo">UNI EVENT PRO</div>
              <h1 class="main-title">Certificate of Achievement</h1>
            </div>

            <p class="presentation">This certificate is proudly presented to</p>
            <h2 class="name">${escapeHtml(fullName)}</h2>

            <div class="description">
              Has successfully fulfilled the requirements and demonstrated proficiency in the curriculum of
              <span class="course-name">${escapeHtml(quizTitle)}</span>
            </div>

            <div class="stats">
              <span class="score">Grade Achievement: ${escapeHtml(score)}%</span>
            </div>

            <div class="gold-seal">
              <div class="gold-seal-inner">OFFICIAL<br>GRADUATE</div>
            </div>

            <div class="signature-section">
              <div class="signature-box">
                <p class="sig-label">Date of Issue: ${escapeHtml(issuedDate)}</p>
              </div>
              <div class="signature-box">
                <p class="sig-label">Authorized Signature</p>
              </div>
            </div>

            <div class="cert-id italic line-height-1">Verification ID: ${escapeHtml(filenameBase)}-${Date.now()}</div>
          </div>
        </div>
        <script>
          window.addEventListener('load', () => {
            setTimeout(() => { window.print(); }, 500);
          });
        </script>
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) {
    URL.revokeObjectURL(url);
    message.error('Please allow pop-ups to download the certificate');
    return;
  }

  const revoke = () => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  win.onafterprint = revoke;
  const timer = setInterval(() => {
    if (win.closed) {
      clearInterval(timer);
      revoke();
    }
  }, 500);
};

const Certificate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [achievedCertificates, setAchievedCertificates] = useState([]);
  const [activeCertificate, setActiveCertificate] = useState(null);
  
  const fallbackName = localStorage.getItem('userName') || location.state?.fullName || 'Learner';
  const fallbackEmail = localStorage.getItem('userEmail') || location.state?.email || 'No email provided';

  const selectedCertificate = activeCertificate || {
    fullName: fallbackName,
    email: fallbackEmail,
    quizTitle: location.state?.quizTitle || 'Quiz',
    score: Number(location.state?.score || 0),
    issuedAt: location.state?.issuedDate || new Date().toISOString(),
  };

  const fullName = selectedCertificate.fullName;
  const email = selectedCertificate.email;
  const quizTitle = selectedCertificate.quizTitle;
  const score = selectedCertificate.score;
  const percentage = score;
  const issuedDate = new Date(selectedCertificate.issuedAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const certificateId = `${quizTitle.replace(/\s/g, '-')}-${new Date(selectedCertificate.issuedAt || Date.now()).getTime()}`;

  useEffect(() => {
    const loadCertificates = async () => {
      const userId = localStorage.getItem('userId');
      const [resultRes] = await Promise.all([
        userId ? api.get(`/api/quiz/results/${userId}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
      ]);

      const backendResults = Array.isArray(resultRes.data) ? resultRes.data : [];
      const mergedResults = [...backendResults, ...readLocalResults()]
        .map((result) => ({
          quizId: String(result?.quizId || ''),
          quizTitle: String(result?.quizTitle || 'Quiz'),
          score: Number(result?.score || 0),
          createdAt: result?.createdAt || result?.date || new Date().toISOString(),
        }))
        .filter((result) => result.score >= PASS_SCORE)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const unique = [];
      const seen = new Set();
      mergedResults.forEach((item) => {
        const key = `${item.quizId || item.quizTitle.toLowerCase().trim()}-${new Date(item.createdAt).getTime()}`;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push({
            fullName: fallbackName,
            email: fallbackEmail,
            quizTitle: item.quizTitle,
            score: item.score,
            issuedAt: item.createdAt,
          });
        }
      });

      if (location.state?.quizTitle && Number(location.state?.score || 0) >= PASS_SCORE) {
        const current = {
          fullName: fallbackName,
          email: fallbackEmail,
          quizTitle: location.state.quizTitle,
          score: Number(location.state.score || 0),
          issuedAt: location.state?.issuedDate || new Date().toISOString(),
        };
        const exists = unique.some((item) => item.quizTitle === current.quizTitle && item.score === current.score);
        if (!exists) {
          unique.unshift(current);
        }
      }

      setAchievedCertificates(unique);
      if (!activeCertificate && unique.length > 0) {
        setActiveCertificate(unique[0]);
      }
    };

    loadCertificates();
  }, []);

  useEffect(() => {
    // Animation on mount
    const timer = setTimeout(() => {
      message.success({
        content: '🎉 Congratulations on completing the quiz!',
        duration: 4,
        icon: <TrophyOutlined style={{ color: '#d4af37' }} />
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Certificate - ${quizTitle}`,
          text: `I successfully completed the "${quizTitle}" quiz! 🎉`,
          url: window.location.href,
        });
        message.success('Shared successfully!');
      } else {
        setShowShareModal(true);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        message.error('Unable to share. Copy the link manually.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailCertificate = () => {
    const subject = encodeURIComponent(`Certificate - ${quizTitle}`);
    const body = encodeURIComponent(
      `Dear ${fullName},\n\n` +
      `Congratulations on completing the "${quizTitle}" quiz!\n\n` +
      `Your certificate is attached. You can also download it from the link below.\n\n` +
      `Best regards,\nEvent Team`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    message.info('Opening email client...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] py-12 px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
            <TrophyOutlined className="text-yellow-400 text-xl" />
            <span className="text-white font-semibold">Certificate of Excellence</span>
          </div>
          <Title level={2} className="!text-white !mb-2">
            Your Achievement Certificate
          </Title>
          <Text className="text-white/80 text-lg">
            Congratulations on your accomplishment!
          </Text>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Certificate Card */}
          <div className="lg:col-span-2">
            <Card 
              className="shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl transform hover:scale-[1.02]"
              style={{ 
                background: 'linear-gradient(135deg, #fff 0%, #fef9e7 100%)',
                border: 'none',
                borderRadius: '24px'
              }}
              bodyStyle={{ padding: 0 }}
            >
              {/* Decorative ribbon */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d4af37] to-[#ffd700] transform rotate-45 translate-x-16 -translate-y-16"></div>
              </div>

              <div className="p-8 md:p-12 text-center relative">
                <div className="mb-6">
                  <div className="inline-block p-4 bg-gradient-to-br from-[#d4af37]/10 to-[#ffd700]/10 rounded-full mb-4">
                    <SafetyCertificateOutlined className="text-6xl text-[#d4af37]" />
                  </div>
                </div>
                
                <Title level={1} className="!text-[#d4af37] !font-serif !mb-4 !text-3xl md:!text-4xl">
                  Certificate of Achievement
                </Title>
                
                <Text className="text-gray-600 text-lg italic block mb-6">
                  This is proudly presented to
                </Text>
                
                <Title level={2} className="!text-gray-800 !mb-2 !text-2xl md:!text-3xl">
                  {fullName}
                </Title>
                
                <Text className="text-gray-500 block mb-6">
                  {email}
                </Text>

                {(score || percentage) && (
                  <div className="inline-block bg-gradient-to-r from-[#667eea] to-[#764ba2] px-6 py-3 rounded-full mb-6">
                    <div className="flex items-center gap-3">
                      <TrophyOutlined className="text-yellow-400 text-xl" />
                      <Text className="text-white font-semibold">
                        Score: {score} ({percentage}%)
                      </Text>
                    </div>
                  </div>
                )}
                
                <Text className="text-gray-600 text-base block mb-4">
                  For successfully completing the quiz for
                </Text>
                
                <Title level={3} className="!text-gray-800 !mb-8 !text-xl md:!text-2xl">
                  {quizTitle}
                </Title>
                
                <Divider className="!border-[#d4af37] !my-8" />
                
                <div className="flex justify-between items-center flex-wrap gap-6">
                  <div className="text-center flex-1">
                    <div className="border-b-2 border-gray-800 w-32 mx-auto mb-2"></div>
                    <Text className="text-gray-600 text-sm">Date: {issuedDate}</Text>
                  </div>
                  <div className="text-center flex-1">
                    <div className="border-b-2 border-gray-800 w-32 mx-auto mb-2"></div>
                    <Text className="text-gray-600 text-sm">Event Organizer</Text>
                  </div>
                </div>

                {/* Certificate ID */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <Text className="text-gray-400 text-xs">
                    Certificate ID: {certificateId}
                  </Text>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats and Actions Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="shadow-xl rounded-2xl bg-white/95 backdrop-blur-sm">
              <Statistic
                title={<Text className="text-gray-600">Certificate Status</Text>}
                value="Active"
                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                prefix={<CheckCircleOutlined />}
              />
              <Divider className="!my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text className="text-gray-500">Recipient</Text>
                  <Text className="font-semibold">{fullName}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-500">Quiz Title</Text>
                  <Text className="font-semibold">{quizTitle}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-500">Issue Date</Text>
                  <Text className="font-semibold">{issuedDate}</Text>
                </div>
              </div>
            </Card>

            {/* Actions Card */}
            <Card className="shadow-xl rounded-2xl bg-white/95 backdrop-blur-sm">
              <Title level={5} className="!mb-4">Actions</Title>
              <Space direction="vertical" className="w-full" size="middle">
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="large"
                  block
                  onClick={() => downloadCertificatePDF({ fullName, email, quizTitle, issuedDate, score, percentage })}
                  className="bg-gradient-to-r from-[#667eea] to-[#764ba2] border-0 hover:shadow-lg transition-all"
                >
                  Download PDF
                </Button>
                
                <Button
                  icon={<PrinterOutlined />}
                  size="large"
                  block
                  onClick={handlePrint}
                  className="border-[#d4af37] text-[#d4af37] hover:!bg-[#d4af37] hover:!text-white transition-all"
                >
                  Print Certificate
                </Button>
                
                <Button
                  icon={<ShareAltOutlined />}
                  size="large"
                  block
                  onClick={handleShare}
                  loading={isSharing}
                  className="border-[#1890ff] text-[#1890ff] hover:!bg-[#1890ff] hover:!text-white transition-all"
                >
                  Share Achievement
                </Button>
                
                <Tooltip title="Send certificate via email">
                  <Button
                    icon={<MailOutlined />}
                    size="large"
                    block
                    onClick={handleEmailCertificate}
                    className="border-[#ff7c43] text-[#ff7c43] hover:!bg-[#ff7c43] hover:!text-white transition-all"
                  >
                    Email Certificate
                  </Button>
                </Tooltip>

                <Divider className="!my-2" />

                <Button
                  icon={<HomeOutlined />}
                  size="large"
                  block
                  onClick={() => navigate('/quizzes')}
                  className="border-gray-300 text-gray-600 hover:!border-gray-400 transition-all"
                >
                  Back to Quizzes
                </Button>
              </Space>
            </Card>

            {/* Social Proof */}
            <Card className="shadow-xl rounded-2xl bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-center">
              <StarOutlined className="text-3xl mb-2" />
              <Text className="text-white block font-semibold mb-1">
                Share your achievement!
              </Text>
              <Text className="text-white/80 text-sm">
                Let others know about your success on social media
              </Text>
            </Card>

            {/* Achieved Certificates */}
            <Card className="shadow-xl rounded-2xl bg-white/95 backdrop-blur-sm" title="Achieved Certificates">
              {achievedCertificates.length === 0 ? (
                <Empty description="No certificates achieved yet." />
              ) : (
                <List
                  dataSource={achievedCertificates}
                  renderItem={(item) => {
                    const isActive =
                      item.quizTitle === selectedCertificate.quizTitle &&
                      String(item.issuedAt) === String(selectedCertificate.issuedAt);

                    return (
                      <List.Item
                        style={{
                          cursor: 'pointer',
                          borderRadius: 10,
                          padding: '10px 12px',
                          background: isActive ? '#e6f4ff' : 'transparent',
                          border: isActive ? '1px solid #91caff' : '1px solid transparent',
                        }}
                        onClick={() => setActiveCertificate(item)}
                      >
                        <List.Item.Meta
                          title={item.quizTitle}
                          description={`Issued ${new Date(item.issuedAt).toLocaleDateString()}`}
                        />
                        <Tag color="gold">{item.score}%</Tag>
                      </List.Item>
                    );
                  }}
                />
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        title="Share Your Certificate"
        open={showShareModal}
        onCancel={() => setShowShareModal(false)}
        footer={null}
        className="rounded-2xl"
      >
        <Result
          icon={<TrophyOutlined style={{ color: '#d4af37' }} />}
          title="Share this achievement!"
          subTitle="Copy the link below to share your certificate"
          extra={
            <div className="space-y-3">
              <Input.TextArea 
                value={`I successfully completed the "${quizTitle}" quiz! 🎉\n\nCertificate ID: ${certificateId}`}
                rows={3}
                readOnly
                className="rounded-xl"
              />
              <Button 
                type="primary" 
                block
                onClick={() => {
                  navigator.clipboard.writeText(`I successfully completed the "${quizTitle}" quiz! 🎉\nCertificate ID: ${certificateId}`);
                  message.success('Copied to clipboard!');
                  setShowShareModal(false);
                }}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] border-0"
              >
                Copy to Clipboard
              </Button>
            </div>
          }
        />
      </Modal>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none;
          }
          .ant-card {
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Certificate;