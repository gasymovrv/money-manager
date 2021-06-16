import React from 'react';
import NumberFormat from 'react-number-format';

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const EditableMoneyFormat: React.FC<NumberFormatCustomProps> = (props) => {
  const {inputRef, onChange, name, ...other} = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: name,
            value: values.value,
          },
        });
      }}
      thousandSeparator=" "
      isNumericString
      isAllowed={(values) => {
        const {formattedValue, floatValue} = values;
        return formattedValue === '' || floatValue === undefined || floatValue > 0;
      }}
    />
  )
}
export default EditableMoneyFormat;