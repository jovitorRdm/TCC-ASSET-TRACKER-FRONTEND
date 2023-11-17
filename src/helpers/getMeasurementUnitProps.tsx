import { MeasurementUnit } from '@/types/measurementUnite';

type MeasurementUnitProps = {
  [key in MeasurementUnit]: {
    translated: string;
  };
};

export function getMeasurementUnitProps(role: MeasurementUnit) {
  const props: MeasurementUnitProps = {
    [MeasurementUnit.KILOGRAM]: {
      translated: 'Kg.',
    },
    [MeasurementUnit.LITER]: {
      translated: 'Litro',
    },
    [MeasurementUnit.METER]: {
      translated: 'Metro',
    },
    [MeasurementUnit.PACKAGE]: {
      translated: 'Pacote',
    },
    [MeasurementUnit.UNIT]: {
      translated: 'Unidade',
    },
  };

  return props[role];
}
