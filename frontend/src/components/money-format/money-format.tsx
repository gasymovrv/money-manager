import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';

const MoneyFormat: React.FC<NumberFormatProps> = (props) => {
  return (
    <NumberFormat
      {...props}
      style={{whiteSpace: 'nowrap'}}
      displayType="text"
      thousandSeparator=" "
      allowLeadingZeros={false}
      fixedDecimalScale={true}
      decimalSeparator=","
      decimalScale={2}
    />
  )
}
export default MoneyFormat;