'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, Button, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { GenericStatus } from '@/types/genericStatus';
import { eventService } from '@/services/event';
import { CreateEventRequestData, EventType } from '@/types/event';
import Pagination from 'antd/lib/pagination';
import styled from 'styled-components';
import Headers from '@/app/components/Headers/Headers';
import SideBar from '@/app/components/Sidebar/Sidebar';
import PageHeader from './components/budgetHeader/budgetHeader';
import { Customer } from '@/types';
import { Budget } from '@/types/budget';
import { BudgetDialogForm } from './components/budgetDialogForm/budgetDialogForm';
import { BudgetTable } from './components/budgetTable/budgetTable';
import { budgetService } from '@/services/budget';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const { Content } = Layout;

const Budget: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const [budgetToEdit, setBudgetToEdit] = useState<Budget>();
  const [showBudgetDialogForm, setShowBudgetDialogForm] = useState(false);

  const handleOpenBudgetDialogForm = (budget?: Budget) => {
    if (budget) {
      setBudgetToEdit(budget);
    }

    setShowBudgetDialogForm(true);
  };

  const { data } = useQuery(['budget', page, statusFilter, search], {
    queryFn: () =>
      budgetService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  return (
    <>
      <BudgetDialogForm
        open={showBudgetDialogForm}
        budgetToEdit={budgetToEdit}
        onClose={() => {
          setShowBudgetDialogForm(false);
          setBudgetToEdit(undefined);
        }}
      ></BudgetDialogForm>

      <LayoutStyled>
        <Headers />
        <Layout>
          <SideBar />
          <Layout>
            <Content style={{ padding: 10, margin: '0 16px' }}>
              <PageHeader
                statusFilter={statusFilter}
                onChangeStatusFilter={setStatusFilter}
                onChangeSearch={setSearch}
                handleOpenBudgetDialogForm={handleOpenBudgetDialogForm}
              />
              <BudgetTable
                budget={data?.data ?? []}
                onEdit={handleOpenBudgetDialogForm}
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

export default Budget;
