import type React from "react";
import { Layout, Menu } from "antd";
import { NavLink } from "react-router";
import {
  PlusCircleOutlined,
  CompassOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  return (
    <Sider width={240} theme="dark">
      <Menu theme="dark" mode="inline">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "ant-menu-item-selected" : ""
            }
          >
            Home
          </NavLink>
        </Menu.Item>
        <Menu.Item key="addChannel" icon={<PlusCircleOutlined />}>
          <NavLink
            to="/add-channel"
            className={({ isActive }) =>
              isActive ? "ant-menu-item-selected" : ""
            }
          >
            Add Channel
          </NavLink>
        </Menu.Item>
        <Menu.Item key="explorer" icon={<CompassOutlined />}>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? "ant-menu-item-selected" : ""
            }
          >
            Explore Servers
          </NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
