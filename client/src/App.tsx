import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { App as AntdApp, ConfigProvider } from 'antd';

import { Login } from './routes/login';
import { Dashboard } from './routes/dashboard';
import { AmenClient } from './routes/amenclient';
import { ClientProfile } from './routes/amenclient/clientprofile/ClientProfile';
import { Products } from './routes/amenclient/products/Products';

const PrivateRoutes = () => {
  const isAuthenticated = sessionStorage.getItem('userToken') ? true : false;
  return (
    isAuthenticated ? <Outlet /> : <Navigate to='/' />
  )
}

export default function App() {
  const [, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      // Perform token verification logic
      setAuthenticated(true);
    }
    setLoading(false); // Set loading to false after authentication check
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
        },
        components: {
          Layout: {
            bodyBg: 'rgba(199, 239, 207, 1)',
            siderBg: 'rgba(199, 239, 207, 1)',
          },
          Menu: {
            itemBg: 'rgba(199, 239, 207, 1)',
            itemSelectedColor: '#4caf50',
          },
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
              <Route path="/clientprofile" element={<ClientProfile />} />
              <Route path='/products' element={<Products />} />
            </Route>
          </Routes>
        </AntdApp>
      </Router>
    </ConfigProvider>
  );
}
