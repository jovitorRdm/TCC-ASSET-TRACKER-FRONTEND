import { GenericStatus } from '@/types/genericStatus';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Tag, Tooltip } from 'antd';
import { ClientComponentLoader } from '@/components/ClientComponentLoader';
import { StatusButton } from '@/components/StatusButton';
import { ServiceItem } from '@/types/serviceItem';
import { servicesItemService } from '@/services/serviceItem';
import { Assignment } from '@/types/assignment';

interface ServicesItemTableProps {
  services: ServiceItem[];
  onEdit: (service: ServiceItem) => void;
}

export const ServicesItemTable: React.FC<ServicesItemTableProps> = ({
  services,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const { confirm } = Modal;

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      servicesItemService.changeStatus(params.id, params.status),
    onSuccess: () => queryClient.invalidateQueries(['service']),
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
            title: 'SERVIÇOS',
            dataIndex: 'name',
            key: 'name',
            align: 'left',
          },
          // {
          //   title: 'Descrição',
          //   dataIndex: 'description',
          //   key: 'description',
          //   align: 'left',
          //   ellipsis: true,
          // },
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
        dataSource={services}
        expandable={{
          expandedRowRender: ({ description, assignments }) => (
            <div style={{ paddingLeft: 8 }}>
              <span style={{ paddingLeft: '40px' }}>
                <strong>Descrição:</strong> {`${description}`} <br />
                <strong style={{ paddingLeft: '40px', listStyle: 'none' }}>
                  Atrubuições Requeridas:{' '}
                </strong>
                {assignments && assignments.length > 0 ? (
                  <span>
                    {assignments.map((assignment) => (
                      <Tag
                        style={{ textTransform: 'uppercase', fontWeight: 700 }}
                        key={assignment.id}
                      >
                        {assignment.name}
                      </Tag>
                    ))}
                  </span>
                ) : (
                  <p>Nenhuma atribuição encontrada.</p>
                )}
              </span>
            </div>
          ),
        }}
      />
    </ClientComponentLoader>
  );
};
