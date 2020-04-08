import React from 'react';

export const renderUsername = ({ availableErr, input, label, type, meta: { touched, error } }) => {
    if (!error) error = availableErr;
    const className = `field ${error && touched ? 'error' : ''}`;
    let iconClass = `user icon ${!error && touched ? 'green' : ''}`;
    return (
        <div className={className}>
            <div className="ui left icon input">
                <i className={iconClass}></i>
                <input {...input} placeholder={label} autoComplete="off" type={type} />
            </div>
            {touched && (error && <span><i className="exclamation icon red" />{error}</span>)}
        </div>
    );
};

export const renderPassword = ({ input, label, type, meta: { touched, error, warning } }) => {
    const text = ['Bad', 'Very weak', 'Weak', 'Medium', 'Strong'];
    const color = ['', 'red', 'orange', 'yellow', 'green'];
    let strength = warning.strength;
    let className = `field ${error && touched ? 'error' : ''}`;
    let iconClass = `lock icon ${strength ? color[strength] : ''}`;
    const tooltip = strength ? text[strength] : null;
    return (
        <div className={className}>
            <div className="ui left icon input" data-tooltip={tooltip} data-position="right center">
                <i className={iconClass}></i>
                <input {...input} placeholder={label} autoComplete="off" type={type} />
            </div>
            {touched && (error && <span><i className="exclamation icon red" />{error}</span>)}
        </div >
    );
};

export const renderPasswordNoWarn = ({ input, label, type, meta: { touched, error } }) => {
    let className = `field ${error && touched ? 'error' : ''}`;
    let iconClass = `lock icon`;
    return (
        <div className={className}>
            <div className="ui left icon input">
                <i className={iconClass}></i>
                <input {...input} placeholder={label} autoComplete="off" type={type} />
            </div>
            {touched && (error && <span><i className="exclamation icon red" />{error}</span>)}
        </div >
    );
};

export const renderEmail = ({ availableErr, input, label, type, meta: { touched, error } }) => {
    if (!error) error = availableErr;
    let className = `field ${error && touched ? 'error' : ''}`;
    let iconClass = `at icon ${!error && touched ? 'green' : ''}`;
    return (
        <div className={className}>
            <div className="ui left icon input">
                <i className={iconClass}></i>
                <input {...input} placeholder={label} autoComplete="off" type={type} />
            </div>
            {touched && (error && <span><i className="exclamation icon red" />{error}</span>)}
        </div >
    );
};

export const renderContactInput = ({ input, label, type, meta: { touched, error } }) => {
    let className = `field ${error && touched ? 'error' : ''}`;
    let iconClass = `address book outline icon ${!error && touched ? 'green' : ''}`;
    return (
        <div className={className}>
            <div className="ui left icon input">
                <i className={iconClass}></i>
                <input {...input} placeholder={label} autoComplete="off" type={type} />
            </div>
            {touched && (error && <span><i className="exclamation icon red" />{error}</span>)}
        </div >
    );
};

export const renderInput = ({ input, label, type, meta: { touched, error } }) => {
    let className = `field ${error && touched ? 'error' : ''}`;
    let iconClass = `${!error && touched ? 'green' : ''}`;
    return (
        <div className={className}>
            <div className="ui left input">
                <i className={iconClass}></i>
                <input {...input} placeholder={label} autoComplete="off" type={type} />
            </div>
            {touched && (error && <span><i className="exclamation icon red" />{error}</span>)}
        </div >
    );
};

export const renderTextbox = ({ input, label, type, meta: { touched, error } }) => {
    let className = `field ${error && touched ? 'error' : ''}`;
    let iconClass = `${!error && touched ? 'green' : ''}`;
    return (
        <div className={className}>
            <div className="ui left input">
                <i className={iconClass}></i>
                <textarea {...input} placeholder={label} autoComplete="off" type={type} />
            </div>
            {touched && (error && <span><i className="exclamation icon red" />{error}</span>)}
        </div >
    );
};