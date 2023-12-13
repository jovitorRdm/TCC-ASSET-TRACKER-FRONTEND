import React from 'react';
import { Input } from 'antd';
import InputMask from 'react-input-mask';

const MaskedInput = ({ mask, ...props }: any) => {
  return (
    <InputMask mask={mask} {...props}>
      {(inputProps: any) => <Input {...inputProps} />}
    </InputMask>
  );
};

export default MaskedInput;
