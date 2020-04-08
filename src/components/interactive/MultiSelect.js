import React from 'react';
import Select from 'react-select';
import _ from 'lodash';

export default props => {
    const { name, placeholder, options, value, onChange, inputChanged, loading } = props;

    // Update parent component after user finished typing (wait 1 second)
    const onInputChange = _.debounce(val => inputChanged(val), 1000);

    return (
        <Select
            placeholder={placeholder}
            name={name}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            options={options}
            value={value}
            onChange={onChange}
            isLoading={loading}
            isDisabled={loading}
            onInputChange={val => onInputChange(val)}
        />
    );
}