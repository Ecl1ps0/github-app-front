import type React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router";
import { Content } from "antd/es/layout/layout";
import Sidebar from "../../components/Sidebar";
import UserPanel from "../../components/UserPanel";

const { Sider } = Layout;

const CustomLayout: React.FC = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={240} theme="dark">
        <Sidebar />
      </Sider>
      <Layout>
        <Content>
          <Outlet />
        </Content>
        <Sider width={240} theme="light">
          <UserPanel />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
