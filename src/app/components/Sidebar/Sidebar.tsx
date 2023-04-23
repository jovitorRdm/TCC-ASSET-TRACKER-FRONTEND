'use client';
import React, { useState } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  CalendarOutlined,
  BarsOutlined,
  HomeOutlined,
  ContactsOutlined,
  InboxOutlined,
  FormOutlined,
  TeamOutlined,
  CarryOutOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Home', '1', <HomeOutlined />),
  getItem('Serviços', '2', <FormOutlined />),
  getItem('Estoque', '3', <InboxOutlined />),
  getItem('Usuarios', '4', <ContactsOutlined />),
  getItem('Funcionários', '5', <TeamOutlined />),
  getItem('Agendamentos', '6', <CarryOutOutlined />),
  getItem('Tipos de Eventos', '7', <BarsOutlined />),
  getItem('Tipos de Produtos', '8', <FileDoneOutlined />),
  getItem('Relatorios', '9', <CalendarOutlined />),
];

const SideBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      theme="light"
      collapsible
      width={205}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu defaultSelectedKeys={['7']} mode="inline" items={items} />
    </Sider>
  );
};

export default SideBar;
