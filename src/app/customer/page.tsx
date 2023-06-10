'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, Button, Input, Form, RadioChangeEvent } from 'antd';
import { GenericStatus } from '@/types/genericStatus';
import SideBar from '../components/Sidebar/Sidebar';
import Headers from '../components/Headers/Headers';
import Pagination from 'antd/lib/pagination';
import styled from 'styled-components';
import { customerService } from '@/services/customer';
import { Customer } from '@/types/customer';
import { CustomerDialogForm } from './components/CustomerDialogForm/EmployeeDialogForm';
import PageHeader from './components/CustomerHeader/CustomerHeader';
import { CustomerTable } from './components/CustomerTable/EmployeeTable';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const { Content } = Layout;

const Customer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['customer', page, statusFilter, search], {
    queryFn: () =>
      customerService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  const [customerToEdit, setCustomerToEdit] = useState<Customer>();
  const [showCustomerDialogForm, setShowCustomerDialogForm] = useState(false);

  const handleOpenCustomerDialogForm = (customer?: Customer) => {
    if (customer) {
      setCustomerToEdit(customer);
    }

    setShowCustomerDialogForm(true);
  };

  const handleCloseCustomerDialogForm = () => {
    setShowCustomerDialogForm(false);

    if (customerToEdit) {
      setCustomerToEdit(undefined);
    }
  };

  return (
    <>
      <CustomerDialogForm
        open={showCustomerDialogForm}
        customerToEdit={customerToEdit}
        onClose={handleCloseCustomerDialogForm}
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
                handleOpenEventDialogForm={handleOpenCustomerDialogForm}
              />
              <CustomerTable
                customer={data?.data ?? []}
                onEdit={handleOpenCustomerDialogForm}
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

export default Customer;
