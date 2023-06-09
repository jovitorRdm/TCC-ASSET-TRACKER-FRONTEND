'use client';
import React, { useState } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  BarsOutlined,
  HomeOutlined,
  AuditOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { usePathname, useRouter } from 'next/navigation';

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
  getItem('Home', '/', <HomeOutlined />),
  getItem('Atribuição', '/assignment', <IdcardOutlined />),
  getItem('Eventos', '/event-type', <BarsOutlined />),
  getItem('Colaboradores', '/employee', <AuditOutlined />),
  // getItem('Home', '/assignment', <HomeOutlined />),
  // getItem('Serviços', '2', <FormOutlined />),
  // getItem('Estoque', '3', <InboxOutlined />),
  // getItem('Usuarios', '4', <ContactsOutlined />),
  // getItem('Funcionários', '5', <TeamOutlined />),
  // getItem('Agendamentos', '6', <CarryOutOutlined />),
  // getItem('Tipos de Eventos', '/assignment', <FileDoneOutlined />),
  // getItem('Tipos de Produtos', '8', <FileDoneOutlined />),
  // getItem('Relatorios', '9', <CalendarOutlined />),
];

const SideBar: React.FC = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      theme="light"
      collapsible
      width={205}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu
        mode="inline"
        items={items}
        defaultSelectedKeys={[pathname]}
        onClick={({ key }) => push(key)}
      />
    </Sider>
  );
};

export default SideBar;
