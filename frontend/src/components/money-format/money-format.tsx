import React from 'react';
import NumberFormat from 'react-number-format';

const MoneyFormat: React.FC<{ value: number }> = ({value}) => {
  return (
    <NumberFormat
      style={{whiteSpace: 'nowrap'}}
      value={value}
      displayType="text"
      thousandSeparator=" "
    />
  )
}

export default MoneyFormat;