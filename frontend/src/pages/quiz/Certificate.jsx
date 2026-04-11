import React from 'react';
import { Card, Typography, Button, Divider } from 'antd';
import { DownloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const downloadCertificatePDF = ({ fullName, email, quizTitle, issuedDate }) => {
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
          @page { size: A4; margin: 0; }
          html, body { height: 100%; }
          body { margin: 0; background: #fffcf2; font-family: Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page { width: 210mm; height: 297mm; padding: 18mm; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
          .card { width: 100%; height: 100%; border: 8px solid #d4af37; background: #fffcf2; box-sizing: border-box; padding: 22mm 18mm; text-align: center; }
          .title { font-size: 34px; color: #d4af37; font-family: Georgia, 'Times New Roman', serif; margin: 0 0 10mm; }
          .subtitle { font-size: 18px; font-style: italic; margin: 0 0 6mm; color: #111827; }
          .name { font-size: 34px; font-weight: 800; text-decoration: underline; margin: 0 0 4mm; color: #111827; }
          .email { font-size: 14px; margin: 0 0 10mm; color: #111827; }
          .desc { font-size: 16px; margin: 0 0 10mm; color: #111827; }
          .quiz { font-size: 20px; font-weight: 800; margin-top: 2mm; }
          .divider { border-top: 1px solid #d4af37; margin: 14mm 0; }
          .footer { display: flex; justify-content: space-between; padding: 0 10mm; }
          .sig { width: 45%; text-align: center; }
          .sigLine { border-top: 1px solid #111; margin: 0 auto 3mm; width: 60mm; }
          .sigText { font-size: 12px; color: #111827; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="card">
            <h1 class="title">Certificate of Achievement</h1>
            <p class="subtitle">This is proudly presented to</p>
            <p class="name">${escapeHtml(fullName)}</p>
            <p class="email">${escapeHtml(email)}</p>
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
        </div>
        <script>
          // Print after layout to avoid blank previews in some browsers.
          window.addEventListener('load', () => {
            requestAnimationFrame(() => {
              setTimeout(() => {
                try { window.focus(); window.print(); } catch (e) {}
              }, 50);
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
  const fullName = location.state?.fullName || 'Learner';
  const email = location.state?.email || 'No email provided';
  const quizTitle = location.state?.quizTitle || 'Quiz';
  const issuedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Title level={2}>Your Certificate</Title>
      
      <Card 
        style={{ 
          width: 700, 
          textAlign: 'center', 
          border: '8px solid #d4af37', 
          borderRadius: 2, 
          background: '#fffcf2',
          padding: 40 
        }}
      >
        <SafetyCertificateOutlined style={{ fontSize: 48, color: '#d4af37', marginBottom: 16 }} />
        <Title level={1} style={{ color: '#d4af37', fontFamily: 'serif', marginTop: 0 }}>Certificate of Achievement</Title>
        <Text style={{ fontSize: 18, fontStyle: 'italic' }}>This is proudly presented to</Text>
        <Title level={2} style={{ margin: '16px 0', textDecoration: 'underline' }}>{fullName}</Title>
        <Text style={{ fontSize: 16 }}>{email}</Text>
        <Text style={{ fontSize: 16, display: 'block', marginTop: 16 }}>
          For successfully completing the quiz for<br/>
          <strong style={{ fontSize: 20 }}>{quizTitle}</strong>
        </Text>
        
        <Divider style={{ borderColor: '#d4af37', margin: '32px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid black', width: 120, marginBottom: 8 }}></div>
            <Text>Date: {issuedDate}</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
             <div style={{ borderBottom: '1px solid black', width: 120, marginBottom: 8 }}></div>
             <Text>Event Organizer</Text>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          size="large"
          onClick={() => downloadCertificatePDF({ fullName, email, quizTitle, issuedDate })}
        >
          Download PDF
        </Button>
        <Button size="large" onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
      </div>
    </div>
  );
};

export default Certificate;
