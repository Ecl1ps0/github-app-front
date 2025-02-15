import type React from "react";
import { Layout, Avatar, Typography, Space, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAppSelector } from "../shared/store/store";
import Paragraph from "antd/es/typography/Paragraph";

const { Content } = Layout;
const { Title, Text } = Typography;

const UserPanel: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <Layout style={{ height: "100%", padding: "24px" }}>
      <Content>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Profile Section */}
          <Space align="center" size="large">
            <Avatar size={80} icon={<UserOutlined />} />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {user.username}
              </Title>
            </div>
          </Space>

          {/* About Me Section */}
          <Card
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              background: "#f9f9f9",
            }}
          >
            <Title level={4} style={{ marginBottom: "8px", color: "#555" }}>
              About Me
            </Title>
            <Paragraph
              type="secondary"
              style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}
            >
              {user.am || "No bio available. Update your profile to add one!"}
            </Paragraph>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};

export default UserPanel;
