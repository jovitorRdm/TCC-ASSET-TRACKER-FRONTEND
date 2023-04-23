'use client';

import { SearchOutlined } from '@ant-design/icons';
import { GenericStatus } from '@/types/genericStatus';
import { Input, Select, Space } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';

interface PageHeaderProps {
  statusFilter: GenericStatus | 'all';
  onChangeStatusFilter: (status: GenericStatus | 'all') => void;
  onChangeSearch: (search: string) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  statusFilter,
  onChangeStatusFilter,
  onChangeSearch,
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
    <>
      <Input
        style={{ width: '350px', marginRight: '30px' }}
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
    </>
  );
};

export default PageHeader;
