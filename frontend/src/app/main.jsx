import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/styles/index.css';
import { App as AntdApp } from 'antd';
import 'antd/dist/reset.css'; // Since antd v5 doesn't need css import, this might fail, let's just use empty styles, or rely on token.

ReactDOM.createRoot(document.getElementById('root')).render(
  <AntdApp>
    <App />
  </AntdApp>
);

