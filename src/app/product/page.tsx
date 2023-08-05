'use client';

import { productService } from '@/services/product';
import { GenericStatus } from '@/types/genericStatus';
import { Product } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import { Layout, Pagination } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import PageHeader from './components/ProductHeader/ProductHeader';
import { ProductDialogForm } from './components/ProductDialogForm/ProductDialogForm';
import { ProductTable } from './components/ProductTable/ProductTable';
import Headers from '@/app/components/Headers/Headers';
import SideBar from '@/app/components/Sidebar/Sidebar';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const { Content } = Layout;

const Product: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['product', page, statusFilter, search], {
    queryFn: () =>
      productService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  const [productToEdit, setProductToEdit] = useState<Product>();
  const [showProductDialogForm, setShowProductDialogForm] = useState(false);

  const handleOpenProductDialogForm = (product?: Product) => {
    if (product) {
      setProductToEdit(product);
    }

    setShowProductDialogForm(true);
  };

  const handleCloseProductDialogForm = () => {
    setShowProductDialogForm(false);

    if (productToEdit) {
      setProductToEdit(undefined);
    }
  };

  return (
    <>
      <ProductDialogForm
        open={showProductDialogForm}
        serviceItemToEdit={productToEdit}
        onClose={handleCloseProductDialogForm}
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
                handleOpenProductDialogForm={handleOpenProductDialogForm}
              />

              <ProductTable
                products={data?.data ?? []}
                onEdit={handleOpenProductDialogForm}
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

export default Product;
