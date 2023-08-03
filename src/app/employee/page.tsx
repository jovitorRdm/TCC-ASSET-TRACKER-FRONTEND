'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, Button, Input, Form, RadioChangeEvent } from 'antd';
import { GenericStatus } from '@/types/genericStatus';
import Pagination from 'antd/lib/pagination';
import styled from 'styled-components';
import { employeeService } from '@/services/employee';
import { Employee } from '@/types/employee';
import { EmployeeTable } from './components/EmployeeTable/EmployeeTable';
import PageHeader from './components/EmployeeHeader/EmployeeHeader';
import { EmployeeDialogForm } from './components/EmployeeDialogForm/EmployeeDialogForm';
import Headers from '@/app/components/Headers/Headers';
import SideBar from '@/app/components/Sidebar/Sidebar';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const { Content } = Layout;

const Employee: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['employee', page, statusFilter, search], {
    queryFn: () =>
      employeeService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  const [employeeToEdit, setEmployeeToEdit] = useState<Employee>();
  const [showEmployeeDialogForm, setShowEmployeeDialogForm] = useState(false);

  const handleOpenEmployeeDialogForm = (employee?: Employee) => {
    if (employee) {
      setEmployeeToEdit(employee);
    }

    setShowEmployeeDialogForm(true);
  };

  const handleCloseEmployeeDialogForm = () => {
    setShowEmployeeDialogForm(false);

    if (employeeToEdit) {
      setEmployeeToEdit(undefined);
    }
  };

  return (
    <>
      <EmployeeDialogForm
        open={showEmployeeDialogForm}
        employeeToEdit={employeeToEdit}
        onClose={handleCloseEmployeeDialogForm}
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
                handleOpenEventDialogForm={handleOpenEmployeeDialogForm}
              />

              <EmployeeTable
                employee={data?.data ?? []}
                onEdit={handleOpenEmployeeDialogForm}
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

export default Employee;
