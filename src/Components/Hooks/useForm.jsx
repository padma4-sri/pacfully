import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const useForm = ({ initialValues, onSubmit, validations }) => {
  const [data, setData] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const changeHandler = (e) => {
    if (e.target.type !== "radio" && e.target.type !== "checkbox") {
      setData({
        ...data,
        [e.target.name]: e.target.name === "mobileNumber" ?  e.target.value?.replace(/\D/g, '') : e.target.value?.trimLeft(),
      });
    }
    if (e.target.type === "checkbox" || e.target.type === "radio") {
      if (e.target.checked) {
        setData({
          ...data,
          [e.target.name]: e.target.value?.trimLeft(),
        });
      } else {
        setData({
          ...data,
          [e.target.name]: "",
        });
      }
    }
    // remove error while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
    setSuccess({ ...success, [e.target.name]: "" });
  };
  const handleFocus = (name) => {
    const input = document.querySelector(`input[name="${name}"]`);
    const textArea = document.querySelector(`textarea[name="${name}"]`);
    if (input) {
      input.focus();
    }
    if (textArea) {
      textArea.focus();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (validations) {
      let valid = true;
      const newErrors = {};
      for (const key in validations) {
        const value = data[key]?.trim();
        const validation = validations[key];
        // required
        if (validation?.required?.value && !value) {
          valid = false;
          newErrors[key] = validation?.required?.message;
          handleFocus(key);
        }
        // emailPattern
        const emailPattern = validation?.emailPattern;
        if (
          key == "email" &&
          emailPattern?.value &&
          value &&
          !RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(value)
        ) {
          valid = false;
          newErrors[key] = emailPattern?.message;
          handleFocus(key);
        }
        const vatPattern = validation?.vatPattern;
if (
  key === "vat" &&
  vatPattern?.value &&
  value &&
  !/^[a-zA-Z0-9]{8,}$/.test(value) // VAT pattern: min 8 characters, allow a-z, A-Z, 0-9
) {
  valid = false;
  newErrors[key] = vatPattern?.message;
  handleFocus(key);
}
        const numberPattern = validation?.numberPattern;
        if (
          key == "mobileNumber" &&
          numberPattern?.value &&
          value &&
          !RegExp(/^[0-9\s\+]{10,15}$/).test(value)
        ) {
          valid = false;
          newErrors[key] = numberPattern?.message;
          handleFocus(key);
        }
        const pattern = validation?.pattern;
        // pattern
        if (pattern?.value && value && !value.match(pattern?.value)) {
          valid = false;
          newErrors[key] = pattern?.message;
          handleFocus(key);
        }
        const min = validation?.min;
        if (value?.length < min?.value && value) {
          valid = false;
          newErrors[key] = min?.message;
          handleFocus(key);
        }
        const max = validation?.max;
        if (value?.length > max?.value && value) {
          valid = false;
          newErrors[key] = max?.message;
          handleFocus(key);
        }
        const passwordPattern = validation?.passwordPattern;
        if (
          passwordPattern?.value &&
          value &&
          value?.length >= min?.value &&
          !RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{6,}$/
          ).test(value)
        ) {
          valid = false;
          newErrors[key] = passwordPattern?.message;
          handleFocus(key);
        }
        const custom = validation?.customChange;
        if (custom?.isValid && custom.isValid(value)) {
          valid = false;
          newErrors[key] = custom?.message;
          handleFocus(key);
        }
      }
      if (!valid) {
        setErrors(newErrors);
        return;
      }
    }
    setErrors({});
    if (onSubmit) {
      onSubmit();
    }

    if ( location?.pathname === '/mijn-account/mijn-adressen' ) {
      if (location?.state?.isBilling){
        navigate('/mijn-account/adressenlijst', { state: { isBilling: true } });
      } else {
        navigate('/mijn-account/adressenlijst', { state: { isBilling: false } });
      }
    }
  };
  const onBlur = async (keyName) => {
    const emailRegex = RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    const vatRegex = RegExp(/^(?=.*[a-zA-Z0-9]).{8,}$/);

    if (validations) {
      let valid = true;
      const newSuccess = {};
      const newErrors = {};
      for (const key in validations) {
        const value = data[key]?.trim();
        const validation = validations[key];
        // required
        if (validation?.required?.value && !value && keyName === key) {
          valid = false;
          newErrors[key] = validation?.required?.message;
          newSuccess[key] = "false";
        } else if (keyName === key && value) {
          newSuccess[key] = "true";
        }
        // emailPattern
        const emailPattern = validation?.emailPattern;
        if (
          keyName === key &&
          emailPattern?.value &&
          value &&
          !emailRegex.test(value)
        ) {
          valid = false;
          newErrors[key] = emailPattern?.message;
          newSuccess[key] = "false";
        } else if (
          keyName === key &&
          value &&
          emailRegex.test(value)
        ) {
          newSuccess[key] = "true";
        }
        const vatPattern = validation?.vatPattern;
        if (
          keyName === key &&
          vatPattern?.value &&
          value &&
          // !vatRegex.test(value)
          !RegExp(/^(?=.*[a-zA-Z0-9]).{8,}$/).test(value)
        ) {
          valid = false;
          newErrors[key] = vatPattern?.message;
          newSuccess[key] = "false";
        } else if (
          keyName === key &&
          value &&
          vatRegex.test(value)
        ) {
          newSuccess[key] = "true";
        }
        const numberPattern = validation?.numberPattern;
        if (
          keyName === key &&
          numberPattern?.value &&
          value &&
          !RegExp(/^[+0-9\s]{10,15}$/).test(value)
        ) {
          valid = false;
          newErrors[key] = numberPattern?.message;
          newSuccess[key] = "false";
        }
        else if (
          keyName === key &&
          value &&
          RegExp(/^[+0-9\s]{10,15}$/).test(value)
        ) {
          newSuccess[key] = "true";
        }
        // pattern
        const pattern = validation?.pattern;
        if (pattern?.value && value && !value.match(pattern?.value)) {
          valid = false;
          newErrors[key] = pattern?.message;
          newSuccess[key] = "false";
        } else if (
          keyName === key &&
          value &&
          pattern?.value &&
          value.match(pattern?.value)
        ) {
          newSuccess[key] = "true";
        }

        const min = validation?.min;
        if (value?.length < min?.value && value) {
          valid = false;
          newErrors[key] = min?.message;
          newSuccess[key] = "false";
        } else if (keyName === key && value && value?.length < min?.value) {
          newSuccess[key] = "true";
        }
        const max = validation?.max;
        if (value?.length > max?.value && value) {
          valid = false;
          newErrors[key] = max?.message;
          newSuccess[key] = "false";
        } else if (keyName === key && value && value?.length > max?.value) {
          newSuccess[key] = "true";
        }
        const passwordPattern = validation?.passwordPattern;
        if (
          passwordPattern?.value &&
          value &&
          value?.length >= min?.value &&
          !RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{6,}$/
          ).test(value)
        ) {
          valid = false;
          newErrors[key] = passwordPattern?.message;
          newSuccess[key] = "false";
        } else if (
          keyName === key &&
          value?.length >= min?.value &&
          passwordPattern?.value &&
          value &&
          RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{6,}$/
          ).test(value)
        ) {
          newSuccess[key] = "true";
        }

        const custom = validation?.customChange;
        if (custom?.isValid && custom.isValid(value)) {
          valid = false;
          newErrors[key] = custom?.message;
          newSuccess[key] = "false";
        } else if (keyName === key && custom?.isValid && value) {
          newSuccess[key] = "true";
        }
      }
      setSuccess({ ...success, ...newSuccess });
      if (!valid) {
        setErrors(newErrors);
        return;
      }
    }
    setErrors({});
  };
  const keyDownHandler = (e) => {
    if (validations) {
      for (const key in validations) {
        const validation = validations[key];
        const custom = validation?.custom;
        if (custom?.isValid && !custom.isValid(e.key)) {
          e.preventDefault();
        }
      }
    }
  };
  return {
    data,
    setData,
    errors,
    setErrors,
    success,
    setSuccess,
    changeHandler,
    submitHandler,
    keyDownHandler,
    onBlur,
  };
};
export default useForm;
