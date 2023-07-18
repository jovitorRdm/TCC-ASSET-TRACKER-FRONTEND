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
import { CreateEventRequestData, EventType } from '@/types/event';
import PageHeader from './components/PageHeader/PageHeader';
import { EventDialogForm } from './components/EventDialogForm/EventDialogForm';
import Pagination from 'antd/lib/pagination';
import styled from 'styled-components';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

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
  const [showEventDialogForm, setShowEventDialogForm] = useState(false);

  const handleOpenEventDialogForm = (event?: EventType) => {
    if (event) {
      setEventToEdit(event);
    }

    setShowEventDialogForm(true);
  };

  const handleCloseEventDialogForm = () => {
    setShowEventDialogForm(false);

    if (eventToEdit) {
      setEventToEdit(undefined);
    }
  };

  return (
    <>
      <EventDialogForm
        open={showEventDialogForm}
        eventToEdit={eventToEdit}
        onClose={handleCloseEventDialogForm}
      />

      <LayoutStyled>
        <Headers />
        <Layout>
          <SideBar />
          <Layout>
            <Content style={{ padding: 10, margin: '0 16px' }}>
              <PageHeader
                onChangeStatusFilter={(value) => setStatusFilter(value)}
                onChangeSearch={(value) => setSearch(value)}
                statusFilter={statusFilter}
                handleOpenEventDialogForm={handleOpenEventDialogForm}
              />

              <EventsTable
                events={data?.data ?? []}
                onEdit={handleOpenEventDialogForm}
              />
              {data && (
                <Pagination
                  style={{ padding: '10px', textAlign: 'center' }}
                  hideOnSinglePage
                  responsive
                  current={page}
                  total={data.totalPages * 10}
                  onChange={(newPage) => setPage(newPage)}
                />
              )}
            </Content>
          </Layout>
        </Layout>
      </LayoutStyled>
    </>
  );
};

export default EventType;
