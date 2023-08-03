import { assignmentService } from '@/services/assignment';
import { Assignment } from '@/types/assignment';
import { Employee } from '@/types/employee';
import { GenericStatus } from '@/types/genericStatus';
import { useQuery } from '@tanstack/react-query';
import { Checkbox, Form, FormInstance, Radio } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

const StyledCheckboxGroup = styled(Checkbox.Group)`
  flex-direction: column;
  gap: 4px;

  label {
    margin: 0 !important;
  }
`;

interface EmployeeAssignmentStepProps {
  disabled: boolean;
  form: FormInstance<Employee>;
}

export const EmployeeRolesStep: React.FC<EmployeeAssignmentStepProps> = ({
  disabled,
  form,
}) => {
  const { getFieldValue, getFieldsValue } = form;
  const [search, setSearch] = useState('');
  const { Group: RadioGroup } = Radio;

  const [selectedOption, setSelectedOption] = useState(null);

  const { data } = useQuery(['assignments', 1, 'active', search], {
    queryFn: () =>
      assignmentService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });

  return (
    <Form
      disabled={disabled}
      layout="vertical"
      size="middle"
      form={form}
      initialValues={getFieldsValue()}
      onValuesChange={(fields) => {
        setSelectedOption(fields.roles);
      }}
    >
      <Form.Item
        required
        label="Selecione as atribuições do colaborador"
        name="assignmentId"
      >
        <RadioGroup
          style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {data?.data.map((assignment: Assignment, index: number) => (
            <Radio key={index} value={assignment.id}>
              {assignment.name}
            </Radio>
          ))}
        </RadioGroup>
      </Form.Item>
    </Form>
  );
};
