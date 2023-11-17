import React from 'react';
import { Input } from 'antd';
import InputMask from 'react-input-mask';

interface MaskedInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MaskedInput: React.FC<MaskedInputProps> = ({ value, onChange }) => (
  <InputMask
    mask="9999 9999 9999 9999 9999 9999 9999 9999 9999 9999 9999"
    value={value}
    onChange={onChange}
  >
    <Input />
  </InputMask>
);

export default MaskedInput;
