'use client';
import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import decode from 'jwt-decode';
import {
  CoffeeOutlined,
  HomeOutlined,
  AuditOutlined,
  IdcardOutlined,
  FileDoneOutlined,
  BarsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { getAuthorizedRoutesByRoles } from '@/helpers/getAuthorizedRoutesByRoles ';
import { AccountType } from '@/types/accountType';

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
  getItem('Home', '/panel', <HomeOutlined />),
  getItem('Atribuição', '/assignment', <IdcardOutlined />),
  getItem('Eventos', '/event-type', <FileDoneOutlined />),
  getItem('Colaboradores', '/employee', <AuditOutlined />),
  getItem('Clientes', '/customer', <TeamOutlined />),
  getItem('Serviços', '/serviceItem', <CoffeeOutlined />),
  getItem('Produtos', '/product', <BarsOutlined />),
];

const SideBar: React.FC = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(items);

  const accessToken = getCookie('helloWorld');

  const { account } =
    typeof window === 'undefined'
      ? { account: [AccountType.EVENTADMINISTRATOR] }
      : (decode(accessToken as string) as { account: AccountType[] });

  useEffect(() => {
    if (typeof accessToken === 'string') {
      setItemsToShow(
        items.filter((item) =>
          getAuthorizedRoutesByRoles(account).includes(
            (item?.key as string) ?? ''
          )
        )
      );
    }
  }, [accessToken]);

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
