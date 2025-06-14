import type React from "react";
import { Layout, Avatar, Typography, Space, Card, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../shared/store/store";
import Paragraph from "antd/es/typography/Paragraph";
import { logoutUser } from "../shared/store/user.store";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;

const UserPanel: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <Layout style={{ height: "100%", padding: "24px" }}>
      <Content>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Profile Section */}
          <Space
            align="center"
            size="large"
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            <Space align="center" size="large">
              <Avatar size={80} icon={<UserOutlined />} />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {user.username}
                </Title>
              </div>
            </Space>
          </Space>

          {/* About Me Section */}
          <Card
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "16px",
              borderRadius: "12px",
              background: "#f9f9f9",
            }}
          >
            <Paragraph>
              <Text strong>Name: </Text>
              {user.name || "N/A"}
            </Paragraph>
            <Paragraph>
              <Text strong>Email: </Text>
              {user.email || "N/A"}
            </Paragraph>
            <Paragraph>
              <Text strong>Date of Birth: </Text>
              {user.date_of_birth
                ? dayjs(user.date_of_birth).format("MMMM D, YYYY")
                : "N/A"}
            </Paragraph>
            <Title level={4} style={{ marginBottom: "8px", color: "#555" }}>
              About Me
            </Title>
            <Paragraph
              type="secondary"
              style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}
            >
              {user.about_me ||
                "No bio available. Update your profile to add one!"}
            </Paragraph>
          </Card>
        </Space>
        <Button
          style={{ width: "100%", marginTop: "16px" }}
          type="primary"
          danger
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Content>
    </Layout>
  );
};

export default UserPanel;
