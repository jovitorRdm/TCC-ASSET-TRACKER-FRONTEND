import { supplierService } from '@/services/supplier';
import { GenericStatus } from '@/types/genericStatus';
import { Supplier } from '@/types/supplier';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Table, Tag, Tooltip } from 'antd';
import { ClientComponentLoader } from '@/components/ClientComponentLoader';
import { StatusButton } from '@/components/StatusButton';
import { formatPhoneNumber } from '@/helpers/utils/formatPhoneNumber';
import { formatCpf } from '@/helpers/utils/formatCpf';
import dayjs from 'dayjs';
import styled from 'styled-components';

const TableContainer = styled.div`
  border-radius: 8px;
  overflow: auto;
  min-height: 529px;

  /* filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15)); */

  & > div {
    min-width: 750px;

    thead tr th::before {
      display: none;
    }
  }
`;

interface SupplierTableProps {
  supplier: Supplier[];
  onEdit: (supplier: Supplier) => void;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
  supplier,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const { confirm } = Modal;

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      supplierService.changeStatus(params.id, params.status),
    onSuccess: () => queryClient.invalidateQueries(['supplier']),
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
      <TableContainer>
        <Table
          size="small"
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'FORNECEDORES',
              dataIndex: 'name',
              key: 'name',
              align: 'left',
            },
            {
              dataIndex: 'actions',
              key: 'actions',
              align: 'right',
              render: (_, record) => (
                <>
                  <StatusButton
                    currentStatus={record.status}
                    onClick={() =>
                      handleChangeStatus(record.id as string, record.status)
                    }
                  />

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
                </>
              ),
            },
          ]}
          dataSource={supplier}
          expandable={{
            expandedRowRender: ({
              document,
              birthdate,
              email,
              phoneNumber,
              address: { street, number, neighborhood, city, state },
            }) => (
              <div style={{ paddingLeft: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 48,
                    paddingTop: 8,
                  }}
                >
                  <p>
                    <strong>CPF:</strong> {formatCpf(document)}
                  </p>

                  <p>
                    <strong>Data de nascimento:</strong>{' '}
                    {dayjs(birthdate).format('DD/MM/YYYY')}
                  </p>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div>
                  <p>
                    <strong>E-mail:</strong> {email}
                  </p>

                  <p>
                    <strong>Telefone:</strong> {formatPhoneNumber(phoneNumber)}
                  </p>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <p>
                  <strong>Endereço:</strong>{' '}
                  {`${street}, ${number}, ${neighborhood}, ${city} - ${state}`}
                </p>
              </div>
            ),
          }}
        />
      </TableContainer>
    </ClientComponentLoader>
  );
};
