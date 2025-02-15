import type { FC } from "react";
import { Typography, List, Card, Spin } from "antd";
import { Link } from "react-router";
import { useAppSelector } from "../shared/store/store";
import { useGetUserChannelsQuery } from "../shared/api/channel.api";

const { Title } = Typography;

const Home: FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const { data: servers, isLoading } = useGetUserChannelsQuery(user.id);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Welcome to Your Servers</Title>

      {isLoading ? (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={servers || []}
          renderItem={(server) => (
            <List.Item>
              <Card title={server.name} hoverable>
                <Link to={`/server/${server.id}`}>View Server</Link>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Home;
