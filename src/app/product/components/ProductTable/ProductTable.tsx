import { StatusButton } from '@/components/StatusButton';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { GenericStatus, Product } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Table, Tooltip } from 'antd';
import { ClientComponentLoader } from '@/components/ClientComponentLoader';
import { productService } from '@/services/product';
import { getMeasurementUnitProps } from '@/helpers/getMeasurementUnitProps';
import { MeasurementUnit } from '@/types/measurementUnite';

interface ProductProp {
  product: Product[];
  onEdit: (product: Product) => void;
}

export const ProductTable: React.FC<ProductProp> = ({ product, onEdit }) => {
  const queryClient = useQueryClient();
  const { confirm } = Modal;

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      productService.changeStatus(params.id, params.status),
    onSuccess: () => queryClient.invalidateQueries(['product']),
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

  const productTypeOptions = [
    { value: 'Consumable', label: 'Consumível' },
    { value: 'Rental', label: 'Aluguel' },
  ];

  return (
    <ClientComponentLoader>
      <Table
        size="small"
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            align: 'left',
          },
          {
            title: 'Tipo de Produto',
            dataIndex: 'productType',
            key: 'quantity',
            align: 'left',
            width: '350px',
            render: (value) => {
              const option = productTypeOptions.find(
                (opt) => opt.value === value
              );
              return option ? option.label : value;
            },
          },
          {
            title: 'Quantidade',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'right',
            render: (value) => {
              return value.toLocaleString('pt-BR');
            },
          },
          {
            dataIndex: 'actions',
            width: 800,
            align: 'right',
            key: 'actions',
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
        dataSource={product}
        expandable={{
          expandedRowRender: ({
            consumptionPerPerson,
            measurementUnit,
            description,
            value,
          }) => (
            <div style={{ paddingLeft: 8 }}>
              <span>
                <strong>Descrição:</strong> {`${description}`}
                <br />
                <strong>Unidade de medida:</strong>{' '}
                {`${getMeasurementUnitProps(measurementUnit).translated}`}
                <br />
                <strong>Serve por unidade:</strong> {`${consumptionPerPerson}`}
                <br />
                <strong>Ultimo valor Pago:</strong> {`${value} R$`}
                <br />
              </span>
            </div>
          ),
        }}
      />
    </ClientComponentLoader>
  );
};
