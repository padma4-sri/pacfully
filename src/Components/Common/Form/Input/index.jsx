import React from 'react';
import "./styles.scss";

const Input = ({
    controlClassName = "relative", fieldClassName = "flex gap-1 col pb-5", labelClassName = "fs-14",
    errorClassName = "error absolute fs-12 pt-1 tr w-1/1", inputClassName = "w-1/1 px-4 py-2 fs-14", inputId = "",
    errorMessage = "", lable = "", placeHolder = "",
    value = "", type = "text", name = "", element = "input", checked = false,
    readOnly = false, onChange = () => { }, onKeyDown = () => { }, onBlur = () => { },onKeyUp = () => { }, onPaste = () => { },
    id = () => { }, icon, showIcon = false, cols = "", rows = "", iconClass = "top-10",onclickFunction=() => { }
}) => {

    return (
        <div className={`input__control ${controlClassName}`}>
            <div className={`field__block relative ${fieldClassName}`}>
                {lable && <span className={`label ${labelClassName}`} htmlFor={inputId} onClick={onclickFunction}>{lable}</span>}
                {
                    element === "input" ?
                        <input
                            type={type}
                            className={`form__types ${inputClassName} ${errorMessage ? 'error__border' : ''}`}
                            id={inputId}
                            placeholder={placeHolder}
                            value={value}
                            readOnly={readOnly}
                            name={name}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            onBlur={onBlur}
                            onKeyUp={onKeyUp}
                            onPaste={onPaste}
                            ref={id}
                            checked={checked}
                            aria-label={name}
                        />
                        : <></>
                }
                {
                    element === "textarea" ?
                        <textarea
                            type={type}
                            className={`form__types ${inputClassName} ${errorMessage ? 'error__border' : ''}`}
                            id={inputId}
                            placeholder={placeHolder}
                            value={value}
                            readOnly={readOnly}
                            name={name}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            onBlur={onBlur}
                            ref={id}
                            rows={rows}
                            cols={cols}
                        >
                        </textarea>
                        : <></>
                }
                {showIcon && <span className={`validation__icon absolute ${iconClass} right-5`}>{icon}</span>}
            </div>
            {errorMessage && <div className={`field__error pb-2 ${errorMessage ? 'v-show' : 'v-hide'} ${errorClassName}`}>{errorMessage}</div>}
        </div>
    )
}

export default Input;