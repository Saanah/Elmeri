import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Select from 'react-select';

const Dropdown2 = forwardRef((props, _ref) => {
  const [selectedOption, setSelectedOption] = useState(null);
  let options = props.list

  useEffect(() => {
    if (props.selected) {
      let index = props.list.findIndex(item => item.value === props.selected)
      setSelectedOption(props.list[index])
    }
  }, [props.selected, props.list])

  useImperativeHandle(_ref, () => ({
    getChildOption: () => {
      return selectedOption;
    }
  }))

  return (
    <div className='flex justify-center'>
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
    </div>
  );
})

export default Dropdown2