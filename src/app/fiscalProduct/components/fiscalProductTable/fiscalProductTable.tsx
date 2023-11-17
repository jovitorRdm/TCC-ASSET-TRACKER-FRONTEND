import { GenericStatus } from '@/types/genericStatus';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Tag, Tooltip } from 'antd';
import { ClientComponentLoader } from '@/components/ClientComponentLoader';
import { StatusButton } from '@/components/StatusButton';
import { FiscalProduct } from '@/types/fiscalProduct';
import { fiscalProductService } from '@/services/fiscalProduct';
import dayjs from 'dayjs';
import { Product } from '@/types';

interface FiscalTableProps {
  fiscalProduct: FiscalProduct[];
  onEdit: (FiscalProduct: FiscalProduct) => void;
}

export const FiscalProductTable: React.FC<FiscalTableProps> = ({
  fiscalProduct,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const { confirm } = Modal;

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      fiscalProductService.changeStatus(params.id, params.status),
    onSuccess: () => queryClient.invalidateQueries(['fiscalProduct']),
  });

  const expandedRowRender = ({ Product }: { Product: Product[] }) => (
    <div>
      <strong>Os produtos comprados:</strong>{' '}
      {Product && Product.length > 0 ? (
        Product.map((Product) => (
          <Tag
            style={{ textTransform: 'uppercase', fontWeight: 700 }}
            key={Product.id}
          >
            {Product.name}
          </Tag>
        ))
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );

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
            title: 'Nome',
            dataIndex: 'supplier',
            key: 'supplier',
            align: 'left',
            render: (_, record) => <div>{record.supplier.name}</div>,
          },

          {
            title: 'Data da Emissão',
            dataIndex: 'issueDate',
            key: 'issueDate',
            align: 'left',
            render: (_, record) => (
              <div>{dayjs(record.issueDate).format('DD/MM/YYYY')}</div>
            ),
          },
          {
            title: 'NF-E',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
            align: 'left',
          },
          {
            dataIndex: 'actions',
            key: 'actions',
            width: 200,
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
        dataSource={fiscalProduct}
        expandable={{ expandedRowRender }}
      />
    </ClientComponentLoader>
  );
};
