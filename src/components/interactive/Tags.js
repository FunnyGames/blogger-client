import React from 'react';
import CreatableSelect from 'react-select/creatable';

const components = {
    DropdownIndicator: null,
};

const createOption = (label) => ({
    label,
    value: label.toLowerCase(),
});

export default class Tags extends React.Component {
    state = {
        inputValue: '',
        value: [],
    };

    componentDidMount() {
        const { initialValues } = this.props;
        if (!initialValues) return;
        this.setState({ value: initialValues });
    }

    handleChange = (value, actionMeta) => {
        const { onTagChange } = this.props;
        this.setState({ value }, onTagChange(value));
    };

    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
    };

    handleKeyDown = (event) => {
        let { inputValue, value } = this.state;
        if (!inputValue) return;
        if (!value) value = [];
        const { onTagChange } = this.props;
        switch (event.key) {
            case ',':
            case '.':
            case ' ':
            case 'Enter':
            case 'Tab':
                let item = createOption(inputValue);
                for (let i = 0; i < value.length; ++i) {
                    const tag = value[i];
                    if (tag.value === item.value) {
                        event.preventDefault();
                        return;
                    }
                }
                value = [...value, item];
                this.setState({
                    inputValue: '',
                    value,
                }, onTagChange(value));
                event.preventDefault();
                break;
            default: break;
        }
    };

    render() {
        const { inputValue, value } = this.state;
        return (
            <CreatableSelect
                components={components}
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Type tag and press enter..."
                value={value}
            />
        );
    }
}