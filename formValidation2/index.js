function Validator(options) {
  const formElement = document.querySelector(options.form);
  if (!formElement) return;
  let selectorRules = {}; // luu rules cho moi input.. 1 input co the co nhieu rule

  //tim cha co class options.formGroup cua input
  function getParent(element) {
    let parenElement = element.closest(options.formGroup);
    return parenElement;
  }

  //ham thuc hien validate
  function validate(element, rule) {
    let parentElement = getParent(element);
    let erroMessage;
    let rules = selectorRules[rule.selector];

    for (let i = 0; i < rules.length; i++) {
      switch (element.type) {
        case "radio":
        case "checkbox":
          erroMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          erroMessage = rules[i](element.value);
      }
      if (erroMessage) break;
    }

    if (erroMessage) {
      parentElement.classList.add("invalid");
      parentElement.querySelector(options.formMessage).innerText = erroMessage;
    } else {
      parentElement.classList.remove("invalid");
      parentElement.querySelector(options.formMessage).innerText = "";
    }
    return !erroMessage;
  }

  //submit form e
  formElement.onsubmit = (e) => {
    e.preventDefault();
    let isFormValid = true;
    //khi click submit thi phai loc qua het input va nhan lai value
    options.rules.forEach((rule) => {
      let inputElement = formElement.querySelector(rule.selector);
      if (!inputElement) return;
      let isValid = validate(inputElement, rule);
      if (!isValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      let formValues;
      if (typeof options.onSubmit === "function") {
        let enableInputs = formElement.querySelectorAll("[name]:not(disabled)");
        formValues = Array.from(enableInputs).reduce((acc, input) => {
          switch (input.type) {
            case "radio":
              if (input.matches(":checked")) {
                acc[input.name] = input.value;
              }
              // acc[input.name] = formElement.querySelector(
              //   `input[name=${input.name}]:checked`
              // ).value;
              break;
            case "checkbox":
              if (input.matches(":checked")) {
                acc[input.name] = "";
                return acc;
              }

              if (!Array.isArray(acc[input.name])) {
                acc[input.name] = [];
              }
              acc[input.name].push(input.value);
              break;
            case "file":
              acc[input.name] = input.files[0];
              break;
            default:
              acc[input.name] = input.value;
          }
          return acc;
        }, {});

        options.onSubmit(formValues);
      } else {
        //submit boi trinh duyet khi khong submit bang js
        formElement.submit(formValues);
      }
    }
  };

  //Loc qua cac rule cho moi input
  options.rules.forEach((rule) => {
    let inputElements = formElement.querySelectorAll(rule.selector);
    if (!inputElements) return;

    //luu 1 or nhieu rule cho moi input
    if (Array.isArray(selectorRules[rule.selector])) {
      selectorRules[rule.selector].push(rule.test);
    } else {
      selectorRules[rule.selector] = [rule.test];
    }

    Array.from(inputElements).forEach((inputElement) => {
      //blur ra khoi input
      inputElement.onblur = (e) => {
        validate(e.target, rule);
      };
      //moi khi nguoi dung nhap oninput
      inputElement.onfocus = (e) => {
        let parentElement = getParent(e.target);
        parentElement.classList.remove("invalid");
        parentElement.querySelector(options.formMessage).innerText = "";
      };
    });
  });
}

//quy tac: co loi => hien message || 'loi'
//          khong co loi => undefined

Validator.isRequired = (selector, message) => {
  return {
    selector,
    test: (value) => {
      return value ? undefined : message || "Vui long nhap truong nay";
    },
  };
};

Validator.isEmail = (selector, message) => {
  return {
    selector,
    test: (value) => {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value.trim())
        ? undefined
        : message || "Truong nay phai la email";
    },
  };
};

Validator.minLength = (selector, minLength, message) => {
  return {
    selector,
    test: (value) => {
      return value.trim().length >= minLength
        ? undefined
        : message || "vui long nhap tren 6 ky tu";
    },
  };
};

Validator.isConform = (selector, getConformValue, message) => {
  return {
    selector,
    test: (value) => {
      return value.trim() === getConformValue()
        ? undefined
        : message || "Gia tri nhap vao khong chinh xac";
    },
  };
};
