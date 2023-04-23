'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, Space, Button, Input, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { GenericStatus } from '@/types/genericStatus';
import { eventService } from '@/services/event';
import SideBar from '../components/Sidebar/Sidebar';
import Headers from '../components/Headers/Headers';

const { Header, Content } = Layout;

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const ButtonStatus: React.FC = () => (
  <Space wrap>
    <Select
      defaultValue="TODOS"
      style={{ width: 180 }}
      onChange={handleChange}
      options={[
        { value: 'Active', label: 'ATIVOS' },
        { value: 'Inactive', label: 'INATIVOS' },
        { value: 'todos', label: 'TODOS' },
      ]}
    />
  </Space>
);

const EventType: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['events', page, statusFilter, search], {
    queryFn: () =>
      eventService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Headers />
      <Layout>
        <SideBar />
        <Layout>
          <Content style={{ padding: 10, margin: '0 16px' }}>
            <div
              style={{
                width: '100%',
                padding: 24,
                minHeight: '88vh',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div style={{}}>
                <Input
                  style={{ width: '300px', margin: '13px' }}
                  placeholder="Pesquisar Eventos "
                />
                <ButtonStatus />
              </div>
              <Button
                style={{ backgroundColor: '#409322' }}
                icon={<PlusCircleOutlined />}
                type="primary"
              >
                ADICIONAR
              </Button>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default EventType;
