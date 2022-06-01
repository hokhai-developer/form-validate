function Validator(options) {
  let formElement = document.querySelector(options.form);
  let formRules = {};
  let validatorRules = {
    isRequired: function (value) {
      return value.length > 0 ? undefined : "Vui long nhap truong nay";
    },
    isEmail: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Vui long nhap dung email";
    },
    min: function (min) {
      return function (value) {
        return value.length >= min
          ? undefined
          : `Mat khau phai lon hon ${min}  ky tu`;
      };
    },
    password_conformation: function (value) {
      return value === formElement.querySelector("input[name='password']").value
        ? undefined
        : "Mat khau nhap lai khong dung";
    },
  };

  if (!formElement) return;
  let inputs = formElement.querySelectorAll("input[name][rules]");

  function getGroupElement(element) {
    if (element) {
      element = element.closest(options.formGroup);
      return element;
    }
  }

  function handleValidate(input) {
    let erroMessage;
    let rulesInput = formRules[input.name];
    console.log(rulesInput);
    rulesInput.some((rule) => {
      return (erroMessage = rule(input.value));
    });

    if (erroMessage) {
      let groupElement = getGroupElement(input);
      groupElement.classList.add("invalid");
      let erroMessElement = groupElement.querySelector(options.formMess);
      erroMessElement.innerText = erroMessage;
    }
    return erroMessage;
  }

  function handleClearErro(input) {
    let groupElement = getGroupElement(input);
    groupElement.classList.remove("invalid");
    let erroMessElement = groupElement.querySelector(options.formMess);
    erroMessElement.innerText = "";
  }

  Array.from(inputs).forEach((input) => {
    let rules = input.getAttribute("rules").split("|");
    rules.forEach((rule) => {
      let isRule = validatorRules[rule];
      if (rule.includes(":")) {
        let ruleInfo = rule.split(":");
        isRule = validatorRules[ruleInfo[0]](ruleInfo[1]);
      }

      if (Array.isArray(formRules[input.name])) {
        formRules[input.name].push(isRule);
      } else {
        formRules[input.name] = [isRule];
      }
    });

    input.onblur = (e) => {
      handleValidate(e.target);
    };
    input.onfocus = (e) => {
      handleClearErro(e.target);
    };
  });

  formElement.onsubmit = (e) => {
    if (typeof options.onSubmit === "function") {
      e.preventDefault();
      let isvalid = true;
      let inputValue;
      let formValues = {};

      Array.from(inputs).forEach((input) => {
        switch (input.type) {
          case "radio":
            if (input.matches(":checked")) {
              inputValue = input.value;
            }
            break;
          default:
            inputValue = input.value;
        }

        if (handleValidate(input)) {
          isvalid = false;
        }
        formValues[input.name] = inputValue;
      });

      if (isvalid) {
        console.log(formValues);
        options.onSubmit(formValues);
      }
    } else {
      formElement.submit();
    }
  };
}
