import type React from "react";
import { ComponentState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { User } from "../models/User.entity";
import { usePostCreateChannelMutation } from "../shared/api/channel.api";

const { Title, Paragraph } = Typography;

const AddChannel: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const user: User = useSelector((state: ComponentState) => state.user.user);
  const [createChannel, { isLoading }] = usePostCreateChannelMutation();

  const onFinish = async (values: { name: string; description: string }) => {
    console.log("New channel:", values);

    const data = {
      ...values,
      creator_id: user.id,
    };

    const { data: result } = await createChannel(data);

    form.resetFields();

    navigate(`/server/${result?.channel_id}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 500,
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "16px" }}>
          Add New Channel
        </Title>
        <Paragraph style={{ textAlign: "center", color: "#888" }}>
          Create a new discussion channel for your community.
        </Paragraph>
        <Form
          form={form}
          name="add-channel"
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: "16px" }}
        >
          <Form.Item
            name="name"
            label="Channel Name"
            rules={[
              { required: true, message: "Please input the channel name!" },
            ]}
          >
            <Input placeholder="Enter channel name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Channel Description"
            rules={[
              {
                required: true,
                message: "Please input the channel description!",
              },
            ]}
          >
            <Input.TextArea
              style={{ resize: "none" }}
              rows={4}
              placeholder="Enter channel description"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={isLoading}
              block
            >
              Create Channel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddChannel;
