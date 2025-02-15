import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Message } from "../models/Message.entity";

const { TextArea } = Input;

interface TextChatAreaProps {
  handleSendMessage: (msg: string) => void;
  messages: Message[];
}

const TextChatArea: React.FC<TextChatAreaProps> = ({
  handleSendMessage,
  messages,
}) => {
  const [newMessage, setNewMessage] = useState("");

  return (
    <>
      <div
        style={{
          height: "60vh",
          overflowY: "auto",
          border: "1px solid #d9d9d9",
          padding: "16px",
          marginBottom: "16px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        {messages?.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "8px",
              padding: "8px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <strong>{msg.sender_id}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <TextArea
          value={newMessage}
          onChange={(e) =>
            !!e.target.value.length && setNewMessage(e.target.value)
          }
          // onPressEnter={handleSendMessage}
          style={{ flexGrow: 1, borderRadius: "6px" }}
          rows={2}
          placeholder="Type a message..."
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => {
            handleSendMessage(newMessage);
            setNewMessage("");
          }}
        >
          Send
        </Button>
      </div>
    </>
  );
};

export default TextChatArea;
