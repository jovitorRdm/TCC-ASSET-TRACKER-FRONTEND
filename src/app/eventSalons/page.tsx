'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from 'antd';
import { GenericStatus } from '@/types/genericStatus';
import PageHeader from './components/PageHeader/PageHeader';
import Pagination from 'antd/lib/pagination';
import styled from 'styled-components';
import Headers from '@/app/components/Headers/Headers';
import SideBar from '@/app/components/Sidebar/Sidebar';
import { eventSalonsService } from '@/services/eventSalons';
import { EventSalons } from '@/types/eventSalons';
import { EventsSalonsTable } from './components/EventsSalonsTable/EventsSalonsTable';
import { EventSalonsDialogForm } from './components/EventSalonsDialogForm/EventSalonsDialogForm';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const { Content } = Layout;

const EventSalons: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['eventSalons', page, statusFilter, search], {
    queryFn: () =>
      eventSalonsService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  const [eventSalonsToEdit, setEventSalonsToEdit] = useState<EventSalons>();
  const [showEventSalonsDialogForm, setShowEventSalonsDialogForm] =
    useState(false);

  const handleOpenEventSalonsDialogForm = (event?: EventSalons) => {
    if (event) {
      setEventSalonsToEdit(event);
    }

    setShowEventSalonsDialogForm(true);
  };

  const handleCloseEventDialogForm = () => {
    setShowEventSalonsDialogForm(false);

    if (eventSalonsToEdit) {
      setEventSalonsToEdit(undefined);
    }
  };

  return (
    <>
      <EventSalonsDialogForm
        open={showEventSalonsDialogForm}
        eventToEdit={eventSalonsToEdit}
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
                handleOpenEventSalonsDialogForm={
                  handleOpenEventSalonsDialogForm
                }
              />

              <EventsSalonsTable
                eventsSalons={data?.data ?? []}
                onEdit={handleOpenEventSalonsDialogForm}
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

export default EventSalons;
