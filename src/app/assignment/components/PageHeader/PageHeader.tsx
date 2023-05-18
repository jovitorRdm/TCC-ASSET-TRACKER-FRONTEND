'use client';

import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { GenericStatus } from '@/types/genericStatus';
import { Button, Input, Select, Space } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 18px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1020px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const LeftContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  @media (max-width: 1020px) {
    margin-bottom: 12px;
  }

  .Input {
    width: 350px;
    margin-right: 30px;
    min-width: 43px;
    @media (max-width: 1020px) {
      width: 100%;
    }

    @media (max-width: 450px) {
      width: 100%;
    }
  }
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 1020px) {
    justify-content: flex-end;
  }
`;

interface PageHeaderProps {
  statusFilter: GenericStatus | 'all';
  onChangeStatusFilter: (status: GenericStatus | 'all') => void;
  onChangeSearch: (search: string) => void;
  handleOpenEventDialogForm: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  statusFilter,
  onChangeStatusFilter,
  onChangeSearch,
  handleOpenEventDialogForm,
}) => {
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value === '' || value.length >= 3) {
        onChangeSearch(value);
      }
    }, 500),
    []
  );
  return (
    <Container>
      <LeftContent>
        <Input
          className="Input"
          placeholder="Pesquisar Evento"
          suffix={<SearchOutlined />}
          onChange={(e) => debouncedSearch(e.target.value)}
        />

        <Space wrap>
          <Select
            value={statusFilter}
            defaultValue="all"
            style={{ width: 180 }}
            onChange={(value) => onChangeStatusFilter(value as GenericStatus)}
            options={[
              { value: GenericStatus.active, label: 'ATIVOS' },
              { value: GenericStatus.inactive, label: 'INATIVOS' },
              { value: 'all', label: 'TODOS' },
            ]}
          />
        </Space>
      </LeftContent>

      <RightContent>
        <Button
          style={{ backgroundColor: '#409322' }}
          icon={<PlusCircleOutlined />}
          onClick={() => handleOpenEventDialogForm()}
          type="primary"
        >
          ADICIONAR
        </Button>
      </RightContent>
    </Container>
  );
};

export default PageHeader;
