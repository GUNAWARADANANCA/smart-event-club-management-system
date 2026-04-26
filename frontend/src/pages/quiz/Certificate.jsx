import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Divider, Space, message, Tooltip, Modal, Result, Spin, Statistic, Row, Col } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const AwardOutlined = Icons.AwardOutlined || Icons.TrophyOutlined;
const { Title, Text, Paragraph } = Typography;

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
        <style>
          @page { 
            size: A4 landscape; 
            margin: 0; 
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body { 
            height: 100%; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          body { 
            margin: 0; 
            font-family: 'Segoe UI', 'Poppins', 'Arial', sans-serif; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate-container {
            width: 297mm;
            height: 210mm;
            padding: 8mm;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #fff 0%, #fef9e7 100%);
            border: 12px double #d4af37;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
            pointer-events: none;
          }
          .certificate-content {
            padding: 15mm 20mm;
            text-align: center;
            position: relative;
            z-index: 1;
          }
          .seal {
            position: absolute;
            bottom: 20mm;
            right: 20mm;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 3px solid #d4af37;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #d4af37;
            font-weight: bold;
            text-align: center;
            background: rgba(212,175,55,0.1);
          }
          .title {
            font-size: 42px;
            color: #d4af37;
            font-family: 'Georgia', 'Times New Roman', serif;
            margin: 0 0 8mm;
            letter-spacing: 4px;
            text-transform: uppercase;
            font-weight: bold;
          }
          .subtitle {
            font-size: 18px;
            font-style: italic;
            margin: 0 0 6mm;
            color: #555;
          }
          .name {
            font-size: 44px;
            font-weight: 800;
            margin: 0 0 4mm;
            color: #2c3e50;
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .email {
            font-size: 14px;
            margin: 0 0 10mm;
            color: #7f8c8d;
          }
          .score-badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 8px 20px;
            border-radius: 50px;
            margin: 10mm auto;
            color: white;
            font-weight: bold;
          }
          .desc {
            font-size: 16px;
            margin: 0 0 10mm;
            color: #555;
          }
          .quiz {
            font-size: 24px;
            font-weight: 800;
            margin-top: 2mm;
            color: #2c3e50;
          }
          .divider {
            border-top: 2px solid #d4af37;
            margin: 12mm 0 8mm;
            width: 80%;
            margin-left: auto;
            margin-right: auto;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            padding: 0 20mm;
            margin-top: 8mm;
          }
          .sig {
            width: 45%;
            text-align: center;
          }
          .sigLine {
            border-top: 2px solid #2c3e50;
            margin: 0 auto 3mm;
            width: 70mm;
          }
          .sigText {
            font-size: 12px;
            color: #555;
          }
          .certificate-id {
            position: absolute;
            bottom: 10mm;
            left: 20mm;
            font-size: 10px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="certificate">
            <div class="certificate-content">
              <div class="seal">CERTIFIED</div>
              <h1 class="title">Certificate of Achievement</h1>
              <p class="subtitle">This is proudly presented to</p>
              <div class="name">${escapeHtml(fullName)}</div>
              <div class="email">${escapeHtml(email)}</div>
              ${score ? `<div class="score-badge">Score: ${escapeHtml(score)} (${escapeHtml(percentage)}%)</div>` : ''}
              <div class="desc">
                For successfully completing the quiz for<br/>
                <div class="quiz">${escapeHtml(quizTitle)}</div>
              </div>
              <div class="divider"></div>
              <div class="footer">
                <div class="sig">
                  <div class="sigLine"></div>
                  <div class="sigText">Date: ${escapeHtml(issuedDate)}</div>
                </div>
                <div class="sig">
                  <div class="sigLine"></div>
                  <div class="sigText">Event Organizer</div>
                </div>
              </div>
            </div>
            <div class="certificate-id">Certificate ID: ${escapeHtml(filenameBase)}-${Date.now()}</div>
          </div>
        </div>
        <script>
          window.addEventListener('load', () => {
            requestAnimationFrame(() => {
              setTimeout(() => {
                try { window.focus(); window.print(); } catch (e) {}
              }, 100);
            });
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
  
  const fullName = location.state?.fullName || 'Learner';
  const email = location.state?.email || 'No email provided';
  const quizTitle = location.state?.quizTitle || 'Quiz';
  const score = location.state?.score || null;
  const percentage = location.state?.percentage || null;
  const issuedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const certificateId = `${quizTitle.replace(/\s/g, '-')}-${Date.now()}`;

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
            <AwardOutlined className="text-yellow-400 text-xl" />
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