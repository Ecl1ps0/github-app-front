import React from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Typography,
  message,
  Card,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import dayjs from "dayjs";
import axios from "axios";
import { instance } from "../shared/axios";

const { Title, Text } = Typography;

const Registration: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log("Registration values:", values);

    const payload = {
      ...values,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
    };

    await instance.post("/auth/register", payload);

    message.success({ content: "Registration successful!" });

    navigate("/login");
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
          width: 400,
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Register
        </Title>
        <Form form={form} name="register" onFinish={onFinish} layout="vertical">
          <Form.Item name="name">
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>

          <Form.Item name="surname">
            <Input prefix={<UserOutlined />} placeholder="Surname" />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item name="dob" label="Date of Birth">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { type: "email", message: "The input is not valid E-mail!" },
              { required: true, message: "Please input your E-mail!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="am">
            <Input.TextArea placeholder="About Me" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Register
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: "block", textAlign: "center" }}>
          Already have an account? <Link to="/login">Login</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Registration;
