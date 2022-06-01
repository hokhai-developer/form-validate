let formElement = document.querySelector("#form-1");
let fullnameElement = formElement.querySelector("input[name=fullname]");
let emailElement = formElement.querySelector("input[name=email]");
let passwordElement = formElement.querySelector("input[name=password]");
let passwordConform = formElement.querySelector(
  "input[name=password_confirmation]"
);
let btnElement = formElement.querySelector(".form-submit");
let formValue = [];
let erroMess = "";
let parentElements;

function formValueHadle(element, value = null) {
  let key = element.name;
  if (formValue == []) {
    formValue.push({
      [key]:
        element.type == "password" && element.name == "password_confirmation"
          ? element.value
          : value,
      isSuccess: !!value,
    });
  } else {
    let index = formValue.findIndex((item) => {
      return Object.keys(item).includes(key, 0) == true;
    });
    if (index !== -1) {
      formValue[index][key] =
        element.type == "password" && element.name == "password_confirmation"
          ? element.value
          : value;
      formValue[index].isSuccess = !!value;
    } else {
      formValue.push({
        [key]:
          element.type == "password" && element.name == "password_confirmation"
            ? element.value
            : value,
        isSuccess: !!value,
      });
    }
  }
}
function getErroMess(element, itemPassword) {
  if (element.value == "") {
    erroMess = "Vui long nhap truong nay";
    return erroMess;
  }
  if (element.type == "text" && element.name == "fullname") {
    if (element.value.length < 6 || element.value.length > 12) {
      erroMess = "Truong nay phai lon hon 4 va nho hon 12 ky tu";
      return erroMess;
    }
  }
  if (element.type == "text" && element.name == "email") {
    return (erroMess = "Vui long nhap dung email");
  }
  if (element.type == "password" && element.name == "password") {
    return (erroMess = "Mat khau phai loen hon 8 va it hon 32 ki tu");
  }
  if (element.type == "password" && element.name == "password_confirmation") {
    if (!itemPassword) {
      return (erroMess = "Vui long nhap mat khau cua ban truoc");
    }
    if (itemPassword.isSuccess == false) {
      return (erroMess = "Mat khau dang de trong hoac khong hop le");
    } else {
      if (itemPassword[element.type] !== element.value) {
        return (erroMess = "Mat khau nhap lai khong dung");
      }
    }
  }
}

function getParent(element) {
  while (element.parentElement) {
    if (element.parentElement.matches(".form-group")) {
      parentElements = element.parentElement;
      break;
    } else {
      element = element.parentElement;
    }
  }
  return parentElements;
}

function afterFocus(e) {
  if ((erroMess = "")) return;
  getParent(e.target);
  if (parentElements.classList.contains("invalid")) {
    parentElements.classList.remove("invalid");
  }
  parentElements.querySelector(".form-message").innerText = erroMess;
}

fullnameElement.addEventListener("focus", function (e) {
  afterFocus(e);
});

fullnameElement.addEventListener("blur", (e) => {
  let value = e.target.value.trim();
  if (value == "") {
    formValueHadle(e.target);
    getParent(e.target);
    getErroMess(e.target);
    parentElements.classList.add("invalid");
    parentElements.querySelector(".form-message").innerText = erroMess;
  } else if (value.length < 4 || value.length > 12) {
    formValueHadle(e.target);
    getParent(e.target);
    getErroMess(e.target);
    parentElements.classList.add("invalid");
    parentElements.querySelector(".form-message").innerText = erroMess;
  } else {
    formValueHadle(e.target, value);
  }
});
emailElement.addEventListener("focus", function (e) {
  afterFocus(e);
});
emailElement.addEventListener("blur", function (e) {
  let value = e.target.value.trim();
  if (value == "") {
    formValueHadle(e.target);
    getParent(e.target); // co parentElement
    getErroMess(e.target); // co erroMess
    parentElements.classList.add("invalid");
    parentElements.querySelector(".form-message").innerText = erroMess;
  } else if (
    String(value).match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    formValueHadle(e.target, value);
  } else {
    formValueHadle(e.target);
    getParent(e.target); // co parentElement
    getErroMess(e.target); //co erroMess
    parentElements.classList.add("invalid");
    parentElements.querySelector(".form-message").innerText = erroMess;
  }
});

passwordElement.addEventListener("focus", (e) => {
  afterFocus(e);
});
passwordElement.addEventListener("blur", (e) => {
  let value = e.target.value.trim();
  if (value == "") {
    formValueHadle(e.target);
    getErroMess(e.target);
    getParent(e.target);
    parentElements.classList.add("invalid");
    parentElements.querySelector(".form-message").innerText = erroMess;
  } else if (value.length <= 8 || value.length >= 32) {
    formValueHadle(e.target);
    getErroMess(e.target);
    getParent(e.target);
    parentElements.classList.add("invalid");
    parentElements.querySelector(".form-message").innerText = erroMess;
  } else {
    formValueHadle(e.target, value);
    return (valuePassword = value);
  }
});

passwordConform.addEventListener("focus", (e) => {
  afterFocus(e);
});

passwordConform.addEventListener("blur", (e) => {
  let value = e.target.value.trim();
  if (value == "") {
    formValueHadle(e.target, value);
    getErroMess(e.target);
    getParent(e.target);
    parentElements.classList.add("invalid");
    parentElements.querySelector(".form-message").innerText = erroMess;
  } else {
    let itemPassword = formValue.find((item) => {
      return Object.keys(item).includes(e.target.type, 0);
    });
    if (!itemPassword) {
      formValueHadle(e.target, value);
      getErroMess(e.target);
      getParent(e.target);
      parentElements.classList.add("invalid");
      parentElements.querySelector(".form-message").innerText = erroMess;
    } else {
      if (itemPassword.isSuccess == false) {
        console.log("password dang trong hoac la chua hop le");
        formValueHadle(e.target, value);
        getErroMess(e.target, itemPassword);
        getParent(e.target);
        parentElements.classList.add("invalid");
        parentElements.querySelector(".form-message").innerText = erroMess;
      } else {
        if (itemPassword[e.target.type] == value) {
          formValueHadle(e.target, value);
        } else {
          console.log("password nhap lai khong dung");
          formValueHadle(e.target, value);
          getErroMess(e.target, itemPassword);
          getParent(e.target);
          parentElements.classList.add("invalid");
          parentElements.querySelector(".form-message").innerText = erroMess;
        }
      }
    }
  }
});
btnElement.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(formValue);
});
