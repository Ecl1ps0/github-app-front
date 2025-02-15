"use client";

import type React from "react";
import { useState, useEffect, type ComponentState, useRef } from "react";
import { useParams } from "react-router";
import { Layout, Menu, Typography, Button, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateChatModal from "../components/CreateChatModal";
import TextChatArea from "../components/TextChatArea";
import VoiceChatPanel from "../components/VoiceChatPanel";
import { useGetChannelQuery } from "../shared/api/channel.api";
import type { Channel } from "../models/Channel.entity";
import type { Chat } from "../models/Chat.entity";
import {
  useGetChannelVoiceChatsQuery,
  useLazyGetVoiceChatQuery,
  usePostCreateVoiceChatMutation,
} from "../shared/api/voice_chat.api";
import { useSelector } from "react-redux";
import type { User } from "../models/User.entity";
import {
  useGetChannelTextChatsQuery,
  useGetTextChatMessagesQuery,
  useLazyGetTextChatQuery,
  usePostCreateTextChatMutation,
} from "../shared/api/text_chat.api";
import type { Message } from "../models/Message.entity";

const { Content, Sider } = Layout;
const { Title } = Typography;

const ServerView: React.FC = () => {
  const { serverId } = useParams<string>();
  const user: User = useSelector((state: ComponentState) => state.user.user);

  const { data, isLoading } = useGetChannelQuery(serverId!);
  const [channel, setChannel] = useState<Channel | null>(null);

  const { data: voiceChatData, isLoading: loadingVoice } =
    useGetChannelVoiceChatsQuery(serverId!, {
      skip: serverId === undefined,
    });
  const { data: textChatData, isLoading: loadingText } =
    useGetChannelTextChatsQuery(serverId!, {
      skip: serverId === undefined,
    });

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { data: messagesData, isLoading: loadingMessages } =
    useGetTextChatMessagesQuery(selectedChat!, {
      skip: selectedChat === null,
    });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [createVoiceChat, { isLoading: creatingVoiceChat }] =
    usePostCreateVoiceChatMutation();
  const [getVoiceChat] = useLazyGetVoiceChatQuery();

  const [createTextChat] = usePostCreateTextChatMutation();
  const [getTextChat] = useLazyGetTextChatQuery();

  useEffect(() => {
    if (!(isLoading && loadingVoice && loadingText)) {
      setChannel(data!);
      console.log(textChatData);
      setChats([...(voiceChatData || [])!, ...(textChatData || [])!]);
    }
  }, [isLoading, loadingVoice, loadingText]);

  const handleCreateChat = async (values: {
    name: string;
    type: "text" | "voice";
  }) => {
    const chatData = {
      name: values.name,
      channel_id: channel?.id,
    };

    if (values.type === "text") {
      const { data } = await createTextChat(chatData);
      const textChatData = await getTextChat(data?.text_chat_id!).unwrap();
      setChats([...chats, textChatData]);
    } else {
      const { data } = await createVoiceChat(chatData);
      const voiceChatData = await getVoiceChat(data?.voice_chat_id!).unwrap();
      setChats([...chats, voiceChatData]);
    }

    setIsModalVisible(false);
    message.success(
      `${values.type} chat "${values.name}" created successfully`
    );
  };

  const listenUpdates = (message: string) => {
    const msgData = JSON.parse(message) as Message;

    console.log(msgData, "listenner");
    setMessages((prev) => [...prev, msgData]);
  };

  const connected = useRef(false);
  const ws = useRef<WebSocket>(null);

  useEffect(() => {
    if (!selectedChat) return;

    const wsInstance = new WebSocket(
      `ws://localhost:8080/api/text_chats/ws/${selectedChat}`
    );
    ws.current = wsInstance;

    wsInstance.onopen = () => {
      console.log("Connected to chat:", selectedChat);
      setMessages(messagesData || []);
      connected.current = true;
    };

    wsInstance.onmessage = (e) => {
      listenUpdates(e.data);
    };

    wsInstance.onclose = () => {
      console.log("Connection closed for chat:", selectedChat);
      if (ws.current === wsInstance) {
        ws.current = null;
        connected.current = false;
      }
    };

    wsInstance.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      console.log("Cleaning up WebSocket for chat:", selectedChat);
      wsInstance.close();
      if (ws.current === wsInstance) {
        ws.current = null;
        connected.current = false;
      }
      setMessages([]);
    };
  }, [selectedChat, messagesData]);

  const handleSendMessage = (newMessage: string) => {
    if (
      newMessage.trim() &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      const msg = {
        content: newMessage,
        sender_id: user.id,
        text_chat_id: selectedChat,
      };

      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket is not open. Message not sent.");
    }
  };

  if (isLoading || loadingVoice || loadingText || loadingMessages) {
    return (
      <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} theme="light">
        <div style={{ padding: "16px" }}>
          <Title level={4}>
            {channel ? channel.name : "Loading Channel..."}
          </Title>
        </div>
        <Button
          hidden={channel?.creator_id !== user.id}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          style={{ margin: "0 16px 16px" }}
        >
          Create Chat
        </Button>
        <Menu mode="inline" selectedKeys={[selectedChat || ""]}>
          <Menu.ItemGroup key="text-chats" title="Text Chats">
            {chats
              .filter((chat) => chat.type === "text")
              .map((chat) => (
                <Menu.Item
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  {chat.name}
                </Menu.Item>
              ))}
          </Menu.ItemGroup>
          <Menu.ItemGroup key="voice-chats" title="Voice Chats">
            {chats
              .filter((chat) => chat.type === "voice")
              .map((chat) => (
                <Menu.Item
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  {chat.name}
                </Menu.Item>
              ))}
          </Menu.ItemGroup>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: "24px" }}>
          {selectedChat &&
            chats.find(
              (chat) => chat.id === selectedChat && chat.type === "text"
            ) && (
              <TextChatArea
                messages={messages}
                handleSendMessage={handleSendMessage}
              />
            )}
          {selectedChat &&
            chats.find(
              (chat) => chat.id === selectedChat && chat.type === "voice"
            ) && (
              <VoiceChatPanel
                chatId={selectedChat}
                currentUser={{
                  id: user.id,
                  name: user.name,
                }}
              />
            )}
        </Content>
      </Layout>
      <CreateChatModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCreateChat={handleCreateChat}
      />
    </Layout>
  );
};

export default ServerView;
