import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { App as AntdApp, ConfigProvider} from "antd";

import { Login } from "./routes/login";
import { Dashboard } from "./routes/dashboard";

export default function App() {
  return (
    <ConfigProvider
    theme={{
      token:{
        borderRadius: 6
      },
      components: {
        Layout:{
          bodyBg: '#F8F9F8',
          headerBg: '#f0f1f0',
          siderBg: '#f0f1f0',
        },
        Menu:{
          itemBg: '#EDF0ED'
        }
      },
    }}
  >
    <Router>
      <AntdApp>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </AntdApp>
    </Router>
    </ConfigProvider>
  );
}
