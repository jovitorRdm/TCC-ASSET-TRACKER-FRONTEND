import { GenericStatus } from '@/types/genericStatus';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Button, Divider, Form, Modal, Table, Tooltip } from 'antd';
import { ClientComponentLoader } from '@/components/ClientComponentLoader';
import { StatusButton } from '@/components/StatusButton';
import { formatCpf } from '@/helpers/utils/formatCpf';
import { formatPhoneNumber } from '@/helpers/utils/formatPhoneNumber';
import styled from 'styled-components';
import { Budget } from '@/types/budget';
import { budgetService } from '@/services/budget';
import Search from 'antd/es/transfer/search';
import { customerService } from '@/services/customer';
import { useEffect, useState } from 'react';
import { BudgetPrint } from '../budgetPrint/budgetPrint';

type BudgetTableProps = {
  budget: Budget[];
  budgetToEdit?: Budget;
  onEdit: (budget: Budget) => void;
};

export const BudgetTable: React.FC<BudgetTableProps> = ({
  budget,
  budgetToEdit,
  onEdit,
}) => {
  const [search, setSearch] = useState('');
  const [budgetToPrint, setBudgetToPrint] = useState<Budget>();
  const queryClient = useQueryClient();

  const { confirm } = Modal;

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      budgetService.changeStatus(params.id, params.status),
    onSuccess: () => queryClient.invalidateQueries(['budget']),
  });

  const { data: dataCustomer } = useQuery(['customer', 1, 'active', search], {
    queryFn: () =>
      customerService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });

  const handleChangeStatus = (id: string, status: GenericStatus) => {
    confirm({
      centered: true,
      title: `Alterar status para ${
        status === GenericStatus.active ? '"inativo"' : '"ativo"'
      }?`,
      icon: <ExclamationCircleOutlined />,
      content: `Após confirmar o cadastro ficará ${
        status === GenericStatus.active
          ? 'indisponível para uso até que o status retorne para "ativo".'
          : 'disponível para uso.'
      }`,
      okText: 'Alterar',
      cancelButtonProps: {
        danger: true,
      },
      onOk() {
        changeStatus.mutate({
          id,
          status:
            status === GenericStatus.active
              ? GenericStatus.inactive
              : GenericStatus.active,
        });
      },
    });
  };

  return (
    <ClientComponentLoader>
      <Table
        size="small"
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: 'Nome do cliente',
            dataIndex: 'customerId',
            key: 'customerId',
            align: 'left',
            render: (_, record) => (
              <>
                {dataCustomer?.data
                  .filter((customer) => customer.id === record.customerId)
                  .map((customer) => (
                    <p key={customer.id}>{customer.name}</p>
                  ))}
              </>
            ),
          },
          {
            dataIndex: 'actions',
            key: 'actions',
            width: 200,
            align: 'right',
            render: (_, record) => (
              <>
                <Tooltip placement="bottom" title="Editar">
                  <Button
                    size="middle"
                    shape="circle"
                    type="text"
                    style={{ marginLeft: 8 }}
                    onClick={() => onEdit(record)}
                  >
                    <EditOutlined />
                  </Button>
                </Tooltip>

                <Tooltip placement="bottom" title="Imprimir">
                  <Button
                    size="middle"
                    shape="circle"
                    type="text"
                    style={{ marginLeft: 8 }}
                    onClick={() => setBudgetToPrint(record)}
                  >
                    <FileTextOutlined />
                  </Button>
                </Tooltip>
              </>
            ),
          },
        ]}
        dataSource={budget}
      />
      {budgetToPrint && (
        <BudgetPrint
          budget={budgetToPrint}
          clear={() => setBudgetToPrint(undefined)}
        />
      )}
    </ClientComponentLoader>
  );
};
