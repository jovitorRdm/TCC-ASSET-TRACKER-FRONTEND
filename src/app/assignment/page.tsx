'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, Button, Input, Form, RadioChangeEvent } from 'antd';
import { GenericStatus } from '@/types/genericStatus';
import Pagination from 'antd/lib/pagination';
import styled from 'styled-components';
import { assignmentService } from '@/services/assignment';
import { Assignment } from '@/types/assignment';
import { AssignmentsTable } from './components/AssignmentTable/AssignmentTable';
import { AssignmentDialogForm } from './components/AssignmentDialogForm/AssignmentDialogForm';
import PageHeader from './components/PageHeader/PageHeader';
import Headers from '@/app/components/Headers/Headers';
import SideBar from '@/app/components/Sidebar/Sidebar';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const { Content } = Layout;

const Assignment: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['assignments', page, statusFilter, search], {
    queryFn: () =>
      assignmentService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment>();
  const [showAssignmentDialogForm, setShowAssignmentDialogForm] =
    useState(false);

  const handleOpenAssignmentDialogForm = (assignment?: Assignment) => {
    if (assignment) {
      setAssignmentToEdit(assignment);
    }

    setShowAssignmentDialogForm(true);
  };

  const handleCloseAssignmentDialogForm = () => {
    setShowAssignmentDialogForm(false);

    if (assignmentToEdit) {
      setAssignmentToEdit(undefined);
    }
  };

  return (
    <>
      <AssignmentDialogForm
        open={showAssignmentDialogForm}
        assignmentToEdit={assignmentToEdit}
        onClose={handleCloseAssignmentDialogForm}
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
                handleOpenEventDialogForm={handleOpenAssignmentDialogForm}
              />

              <AssignmentsTable
                assignments={data?.data ?? []}
                onEdit={handleOpenAssignmentDialogForm}
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

export default Assignment;
