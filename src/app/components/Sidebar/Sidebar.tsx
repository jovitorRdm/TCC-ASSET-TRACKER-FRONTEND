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
  ContactsOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { getAuthorizedRoutesByRoles } from '@/helpers/getAuthorizedRoutesByRoles ';
import { AccountType } from '@/types/accountType';
import { ClientComponentLoader } from '@/components/ClientComponentLoader';

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
  getItem('Eventos', '/event-type', <FileDoneOutlined />),
  getItem('Colaboradores', '/employee', <AuditOutlined />),
  getItem('fornecedores', '/supplier', <ContactsOutlined />),
  getItem('Clientes', '/customer', <TeamOutlined />),
  getItem('Serviços', '/serviceItem', <CoffeeOutlined />),
  getItem('Produtos', '/product', <BarsOutlined />),
];

const SideBar: React.FC = () => {
  const { push } = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(items);

  const token = getCookie('helloWorld');

  const { accountType } =
    typeof window === 'undefined'
      ? { accountType: [AccountType.EVENTADMINISTRATOR] }
      : (decode(token as string) as { accountType: AccountType });

  useEffect(() => {
    if (typeof token === 'string') {
      setItemsToShow(
        items.filter((item) =>
          getAuthorizedRoutesByRoles(accountType as AccountType).includes(
            (item?.key as string) ?? ''
          )
        )
      );
    }
  }, [token]);

  return (
    <Sider
      theme="light"
      collapsible
      width={205}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <ClientComponentLoader>
        <Menu
          mode="inline"
          items={itemsToShow}
          defaultSelectedKeys={[pathname]}
          onClick={({ key }) => push(key)}
        />
      </ClientComponentLoader>
    </Sider>
  );
};

export default SideBar;
