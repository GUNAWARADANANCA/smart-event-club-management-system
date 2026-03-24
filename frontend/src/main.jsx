import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'antd/dist/reset.css'; // Since antd v5 doesn't need css import, this might fail, let's just use empty styles, or rely on token.

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />,
);

