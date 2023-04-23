'use client';

import { GenericStatus } from '@/types/genericStatus';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { Button, GlobalToken, Tooltip, theme } from 'antd';
import styled from 'styled-components';

interface StyledButtonProps {
  token: GlobalToken;
  status: GenericStatus;
}

const StyledButton = styled(Button)<StyledButtonProps>`
  background-color: ${({ token, status }) =>
    status === GenericStatus.active ? token.colorSuccess : token.colorError};

  &:hover {
    background-color: ${({ token, status }) =>
      status === GenericStatus.active
        ? token.colorSuccessActive
        : token.colorErrorActive} !important;
  }

  &:active {
    background-color: ${({ token, status }) =>
      status === GenericStatus.active
        ? token.colorSuccessActive
        : token.colorErrorActive} !important;
  }
`;

interface StatusButtonProps {
  currentStatus: GenericStatus;
  onClick: () => void;
}

export const StatusButton: React.FC<StatusButtonProps> = ({
  currentStatus,
  onClick,
}) => {
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <Tooltip placement="bottom" title="Clique para alterar">
      <StyledButton
        size="small"
        shape="round"
        type="primary"
        token={token}
        status={currentStatus}
        onClick={onClick}
        icon={
          currentStatus === GenericStatus.active ? (
            <EyeFilled />
          ) : (
            <EyeInvisibleFilled />
          )
        }
      >
        {currentStatus === GenericStatus.active ? 'Ativo' : 'Inativo'}
      </StyledButton>
    </Tooltip>
  );
};
