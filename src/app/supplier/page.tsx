'use client';
import { Layout, Pagination } from 'antd';
import styled from 'styled-components';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GenericStatus } from '@/types/genericStatus';
import Headers from '../components/Headers/Headers';
import SideBar from '../components/Sidebar/Sidebar';
import { Supplier } from '@/types/supplier';
import { supplierService } from '@/services/supplier';
import SupplierPageHeader from './components/SupplierHeader/SupplierHeader';
import { SupplierTable } from './components/SupplierTable/SupplierTable';
import { SupplierDialogForm } from './components/SupplierDialogForm/SupplierDialogForm';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const { Content } = Layout;

const Supplier: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['supplier', page, statusFilter, search], {
    queryFn: () =>
      supplierService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  const [supplierToEdit, setSupplierToEdit] = useState<Supplier>();
  const [showSupplierDialogForm, setShowSupplierDialogForm] = useState(false);

  const handleOpenSupplierDialogForm = (supplier?: Supplier) => {
    setShowSupplierDialogForm(true);
    if (supplier) {
      setSupplierToEdit(supplier);
    }
  };

  const handleCloseSupplierDialogForm = () => {
    setShowSupplierDialogForm(false);
    if (supplierToEdit) {
      setSupplierToEdit(undefined);
    }
  };

  return (
    <>
      <SupplierDialogForm
        open={showSupplierDialogForm}
        supplierToEdit={supplierToEdit}
        onClose={handleCloseSupplierDialogForm}
      />

      <LayoutStyled>
        <Headers />
        <Layout>
          <SideBar />
          <Content style={{ padding: 10, margin: '0 16px' }}>
            <SupplierPageHeader
              onChangeStatusFilter={(value) => setStatusFilter(value)}
              onChangeSearch={(value) => setSearch(value)}
              statusFilter={statusFilter}
              handleOpenEventDialogForm={handleOpenSupplierDialogForm}
            />

            <SupplierTable
              supplier={data?.data ?? []}
              onEdit={handleOpenSupplierDialogForm}
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

export default Supplier;
