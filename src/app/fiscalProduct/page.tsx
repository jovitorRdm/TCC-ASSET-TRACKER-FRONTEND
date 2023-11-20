'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import Headers from '@/app/components/Headers/Headers';
import SideBar from '@/app/components/Sidebar/Sidebar';
import { Layout, Pagination } from 'antd';
import { GenericStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { fiscalProductService } from '@/services/fiscalProduct';
import { FiscalProduct } from '@/types/fiscalProduct';
import PageHeader from './components/PageHeader/PageHeader';
import { FiscalProductTable } from './components/fiscalProductTable/fiscalProductTable';
import { FiscalProductDialogForm } from './components/fiscalProductDialogForm/fiscalProductDialogForm';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const { Content } = Layout;

const FiscalProduct: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['fiscalProduct', page, statusFilter, search], {
    queryFn: () =>
      fiscalProductService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  const [fiscalProductToEdit, setFiscalProductToEdit] =
    useState<FiscalProduct>();

  const [showFiscalProductDialogForm, setShowFiscalProductDialogForm] =
    useState(false);

  const handleOpenFiscalProductDialogForm = (fiscalProduct?: FiscalProduct) => {
    if (fiscalProduct) {
      setFiscalProductToEdit(fiscalProduct);
    }

    setShowFiscalProductDialogForm(true);
  };

  const handleCloseFiscalProductDialogForm = () => {
    setShowFiscalProductDialogForm(false);

    if (fiscalProductToEdit) {
      setFiscalProductToEdit(undefined);
    }
  };

  return (
    <>
      <LayoutStyled>
        <FiscalProductDialogForm
          open={showFiscalProductDialogForm}
          fiscalProductToEdit={fiscalProductToEdit}
          onClose={handleCloseFiscalProductDialogForm}
        />

        <Headers />
        <Layout>
          <SideBar />
          <Content style={{ padding: 10, margin: '0 16px' }}>
            <PageHeader
              onChangeStatusFilter={(value) => setStatusFilter(value)}
              onChangeSearch={(value) => setSearch(value)}
              statusFilter={statusFilter}
              handleOpenFiscalProductDialogForm={
                handleOpenFiscalProductDialogForm
              }
            />

            <FiscalProductTable
              fiscalProduct={data?.data ?? []}
              onEdit={handleOpenFiscalProductDialogForm}
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
      </LayoutStyled>
    </>
  );
};

export default FiscalProduct;
