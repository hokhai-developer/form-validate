function Validator(options) {
  let formElement = document.querySelector(options.form);
  let formRules = {};
  let rules = {
    isRequired: (value) => {
      return value.length > 0 ? undefined : "Truong nay khong duoc de trong";
    },
    isEmail: (value) => {
      regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Truong nay phai la email";
    },
    min: (min) => {
      return (value) => {
        return value.length >= min
          ? undefined
          : `Mat khau phai lon hon ${min} ki tu`;
      };
    },
    max: (max) => {
      return (value) => {
        return value.length <= max
          ? undefined
          : `Truong nay khong vuo qua ${max} ky tu`;
      };
    },
    password_conform: (value) => {
      return value === formElement.querySelector('input[type="password"]').value
        ? undefined
        : "Mat khau nhap lai khong dung";
    },
    file: (file) => {
      return (value) => {
        if (file.includes("-")) {
          let result;
          for (element of file.split("-")) {
            result = value.endsWith(element);
            if (result) break;
          }
          return result ? undefined : `Avatar phai co duoi ${file}`;
        } else {
          return value.endsWith(file)
            ? undefined
            : `'Vui long chon file co dinh dang ${file}'`;
        }
      };
    },
  };

  if (!formElement) return;
  let inputs = formElement.querySelectorAll("[name][rules]");

  Array.from(inputs).forEach((input) => {
    let inputRules = [];
    if (input.getAttribute("rules").includes("|")) {
      let rule = input.getAttribute("rules").split("|");
      inputRules.push(...rule);
    } else {
      inputRules.push(input.getAttribute("rules"));
    }
    //xu ly formRules la cac input.name = function(value)
    inputRules.forEach((inputRule) => {
      let isRule;
      if (inputRule.includes(":")) {
        let arr = inputRule.split(":");
        isRule = rules[arr[0]](arr[1]);
      } else {
        isRule = rules[inputRule];
      }

      if (formRules[input.name]) {
        let isSave = formRules[input.name].some((rule) => {
          return isRule == rule;
        });
        if (!isSave) {
          formRules[input.name].push(isRule);
        }
      } else {
        formRules[input.name] = [isRule];
      }
    });

    input.onblur = () => {
      handleBlur(input);
    };

    input.onfocus = () => {
      handleClear(input);
    };
  });

  formElement.onsubmit = (e) => {
    e.preventDefault();
    let isSubmit = true;
    let formValues;
    let inputs = formElement.querySelectorAll("[name][rules]");
    formValues = Array.from(inputs).reduce((values, input) => {
      if (handleBlur(input)) {
        isSubmit = false;
      }
      switch (input.type) {
        case "radio":
          if (values[input.name] === undefined) {
            values[input.name] = "";
          }
          if (input.checked) {
            values[input.name] = input.value;
          }
          break;
        case "checkbox":
          if (values[input.name] === undefined) {
            values[input.name] = [];
          }
          if (input.checked) {
            values[input.name].push(input.value);
          }
          break;
        case "file":
          if (input.files[0]) {
            values[input.name] = input.files[0].name;
          }
          break;
        default:
          values[input.name] = input.value;
      }
      return values;
    }, {});

    if (isSubmit) {
      options.onSubmit(formValues);
    }
  };

  function getParent(input) {
    return input.closest(options.formGroup);
  }

  function handleClear(input) {
    let element = getParent(input);
    element.classList.remove("invalid");
    element.querySelector(options.formMess).innerText = "";
  }

  function handleBlur(input) {
    let erroMessage;
    let inputRules = formRules[input.name];
    for (const inputRule of inputRules) {
      //tung input thi xuly value khac nhau
      switch (input.tagName) {
        case "INPUT":
          switch (input.type) {
            case "radio":
            case "checkbox":
              let inputsName = formElement.querySelectorAll(
                `[name=${input.name}]`
              );
              let inputChecked = Array.from(inputsName).find((input) => {
                return input.checked;
              });
              if (inputChecked) {
                erroMessage = inputRule(input.value);
              } else {
                erroMessage = inputRule("");
              }
              break;
            case "file":
              if (input.files[0]) {
                erroMessage = inputRule(input.files[0].name);
              } else {
                erroMessage = inputRule("");
              }
              break;
            default:
              //input.type =text text password
              erroMessage = inputRule(input.value);
          }
          break;
        default:
          erroMessage = inputRule(input.value);
      }
      if (erroMessage) break;
    }

    if (erroMessage) {
      let element = getParent(input);
      element.classList.add("invalid");
      element.querySelector(options.formMess).innerText = erroMessage;
    }
    return !!erroMessage;
  }
}
