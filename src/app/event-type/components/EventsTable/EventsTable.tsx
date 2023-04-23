import { eventService } from '@/services/event';
import { EventType } from '@/types/event';
import { GenericStatus } from '@/types/genericStatus';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Tooltip } from 'antd';
import { ClientComponentLoader } from '@/components/ClientComponentLoader';
import { StatusButton } from '@/components/StatusButton';

interface EventTableProps {
  events: EventType[];
  onEdit: (EventType: EventType) => void;
}

export const EventsTable: React.FC<EventTableProps> = ({ events, onEdit }) => {
  const queryClient = useQueryClient();
  const { confirm } = Modal;

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      eventService.changeStatus(params.id, params.status),
    onSuccess: () => queryClient.invalidateQueries(['events']),
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
        rowKey="guid"
        pagination={false}
        columns={[
          {
            title: 'Disciplina',
            dataIndex: 'name',
            key: 'name',
            align: 'left',
          },
          {
            dataIndex: 'actions',
            key: 'actions',
            width: 150,
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
        dataSource={events}
        expandable={{}}
      />
    </ClientComponentLoader>
  );
};
