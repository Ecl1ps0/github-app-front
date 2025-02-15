import type { FC } from "react";
import { List, Card, Button, Space, Typography, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useGetUserChannelsNotParticipatingQuery } from "../shared/api/channel.api";
import { useAppSelector } from "../shared/store/store";
import { usePostJoinChannelMutation } from "../shared/api/user.api";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;

const ServerExplorer: FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const { data: channels, isLoading } = useGetUserChannelsNotParticipatingQuery(
    user.id
  );
  const [joinChannel, { isLoading: isJoining }] = usePostJoinChannelMutation();

  const handleJoinChannel = async (userId: string, channelId: string) => {
    await joinChannel({ userId, channelId });
    navigate(`/server/${channelId}`);
  };

  return (
    <div style={{ padding: 24, height: "100%", overflow: "auto" }}>
      <Title level={2}>Explore Servers</Title>

      {isLoading ? (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={channels}
          renderItem={(channel) => (
            <List.Item>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Title level={4} style={{ margin: 0 }}>
                    {channel.name}
                  </Title>
                  <Text type="secondary">{channel.description}</Text>
                  <Button
                    type="primary"
                    icon={<UserOutlined />}
                    block
                    onClick={() => handleJoinChannel(user.id, channel.id)}
                    loading={isJoining}
                  >
                    Join Server
                  </Button>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ServerExplorer;
