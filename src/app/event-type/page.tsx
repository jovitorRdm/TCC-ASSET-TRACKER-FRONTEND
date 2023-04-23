'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, Button, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { GenericStatus } from '@/types/genericStatus';
import { eventService } from '@/services/event';
import SideBar from '../components/Sidebar/Sidebar';
import Headers from '../components/Headers/Headers';
import { EventsTable } from './components/EventsTable/EventsTable';
import { EventType } from '@/types/event';
import PageHeader from './components/PageHeader/PageHeader';

const { Content } = Layout;

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

  const [eventToEdit, setEventToEdit] = useState<EventType>();
  const [showEventForm, setShowEventDialogForm] = useState(false);

  const handleOpenEventDialogForm = (event?: EventType) => {
    if (event) {
      setEventToEdit(event);
    }

    setShowEventDialogForm(true);
  };

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
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <PageHeader
                  onChangeStatusFilter={(value) => setStatusFilter(value)}
                  onChangeSearch={(value) => setSearch(value)}
                  statusFilter={statusFilter}
                />
              </div>
              <Button
                style={{ backgroundColor: '#409322' }}
                icon={<PlusCircleOutlined />}
                type="primary"
              >
                ADICIONAR
              </Button>
            </div>
            <EventsTable
              events={data?.data ?? []}
              onEdit={handleOpenEventDialogForm}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default EventType;
