import type React from "react";
import { Modal, Form, Input, Radio, Button } from "antd";

interface CreateChatModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateChat: (values: { name: string; type: "text" | "voice" }) => void;
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({
  isVisible,
  onClose,
  onCreateChat,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: { name: string; type: "text" | "voice" }) => {
    onCreateChat(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Create New Chat"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input the chat name!" }]}
        >
          <Input placeholder="Chat Name" />
        </Form.Item>
        <Form.Item
          name="type"
          rules={[{ required: true, message: "Please select the Chat type!" }]}
        >
          <Radio.Group>
            <Radio value="text">Text</Radio>
            <Radio value="voice">Voice</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
          <Button onClick={onClose} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateChatModal;
