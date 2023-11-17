'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, Pagination } from 'antd';
import styled from 'styled-components';
import Headers from '@/app/components/Headers/Headers';
import SideBar from '@/app/components/Sidebar/Sidebar';
import { GenericStatus, Product } from '@/types';
import { productService } from '@/services/product';
import { ProductDialogForm } from './components/ProductDialogForm/ProductDialogForm';
import PageProductHeader from './components/ProductHeader/ProductHeader';
import { ProductTable } from './components/ProductTable/ProductTable';

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

  const { data } = useQuery(['product', statusFilter, search], {
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

  const hadleCloseProductDialogForm = () => {
    setShowProductDialogForm(false);

    if (productToEdit) {
      setProductToEdit(undefined);
    }
  };

  return (
    <>
      <ProductDialogForm
        open={showProductDialogForm}
        productToEdit={productToEdit}
        onClose={hadleCloseProductDialogForm}
      />

      <LayoutStyled>
        <Headers />
        <Layout>
          <SideBar />
          <Layout>
            <Content style={{ padding: 10, margin: '0 16px' }}>
              <PageProductHeader
                onChangeStatusFilter={(value) => setStatusFilter(value)}
                onChangeSearch={(value) => setSearch(value)}
                statusFilter={statusFilter}
                handleOpenProductDialogForm={handleOpenProductDialogForm}
              />

              <ProductTable
                product={data?.data ?? []}
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
