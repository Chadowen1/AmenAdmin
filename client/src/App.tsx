import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { App as AntdApp, ConfigProvider } from 'antd';

import { Login } from './routes/login';
import { Dashboard } from './routes/dashboard';
import { AmenClient } from './routes/amenclient';
import { AmenComptes } from './routes/amencomptes';
const PrivateRoutes = () => {
  const isAuthenticated = sessionStorage.getItem('userToken') ? true : false;
  return (
    isAuthenticated ? <Outlet /> : <Navigate to='/' />
  )
}

export default function App() {
  const [, setAuthenticated] = useState(false);
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      // Perform token verification logic
      setAuthenticated(true);
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
        },
        components: {
          Layout: {
            bodyBg: 'rgba(244, 245, 247, 1)',
            siderBg: 'rgba(244, 245, 247, 1)',
          },
          Menu: {
            itemBg: 'rgba(244, 245, 247, 1)',
            itemColor: '#707276',
            itemHoverBg: '',
            itemSelectedColor: '#093D91',
            itemSelectedBg: 'rgba(9, 79, 162, 0.3)'
          },
          Result: {
            iconFontSize: 40,
          },
          Tabs: {
            inkBarColor: '#093D90',
            itemColor: 'rgb(9, 61, 145)'
          },
          DatePicker: {
            colorBorder: '#093D91',
            activeBorderColor: '#093d90',
            hoverBorderColor: '#000000'
          },
          Divider: {
            lineWidth: 1,
            colorSplit: '#1d7623'
          }
        },
      }}
    >
      <Router>
        <AntdApp>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<PrivateRoutes />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path="/amenclient" element={<AmenClient />} />
              <Route path='/amencomptes' element={<AmenComptes />} />
            </Route>
          </Routes>
        </AntdApp>
      </Router>
    </ConfigProvider>
  );
}
