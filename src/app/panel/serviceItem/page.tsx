'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, Button, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { GenericStatus } from '@/types/genericStatus';
import SideBar from '../components/Sidebar/Sidebar';
import Headers from '../components/Headers/Headers';
import PageHeader from './components/PageHeader/PageHeader';
import Pagination from 'antd/lib/pagination';
import styled from 'styled-components';
import { servicesItemService } from '@/services/serviceItem';
import { ServiceItem } from '@/types/serviceItem';
import { ServiceDialogForm } from './components/ServiceDialogForm/ServiceDialogForm';
import { ServicesItemTable } from './components/ServiceTable/ServiceTable';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const { Content } = Layout;

const ServiceItem: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['service', page, statusFilter, search], {
    queryFn: () =>
      servicesItemService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  const [servicesToEdit, setServicesToEdit] = useState<ServiceItem>();
  const [showServicesDialogForm, setShowServicesDialogForm] = useState(false);

  const handleOpenServicesDialogForm = (service?: ServiceItem) => {
    if (service) {
      setServicesToEdit(service);
    }

    setShowServicesDialogForm(true);
  };

  const handleCloseServicesDialogForm = () => {
    setShowServicesDialogForm(false);

    if (servicesToEdit) {
      setServicesToEdit(undefined);
    }
  };

  return (
    <>
      <ServiceDialogForm
        open={showServicesDialogForm}
        serviceItemToEdit={servicesToEdit}
        onClose={handleCloseServicesDialogForm}
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
                handleOpenEventDialogForm={handleOpenServicesDialogForm}
              />

              <ServicesItemTable
                services={data?.data ?? []}
                onEdit={handleOpenServicesDialogForm}
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

export default ServiceItem;
