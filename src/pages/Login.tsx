import React from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import { setUser } from "../shared/store/user.store";
import { useDispatch } from "react-redux";
import { instance } from "../shared/axios";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    console.log("Login values:", values);

    const { data: result } = await instance.post("/auth/login", values);

    localStorage.setItem("access_token", result.access_token);

    const data = JSON.parse(atob(result.access_token.split(".")[1]));
    dispatch(setUser(data.user));

    message.success({
      content: "Login successful!",
    });

    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f4f4f4",
      }}
    >
      <Card
        style={{
          width: 350,
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Login
        </Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: "block", textAlign: "center" }}>
          Or <Link to="/register">register now!</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Login;
