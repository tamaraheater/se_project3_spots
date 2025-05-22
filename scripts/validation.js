const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgID = inputEl.id + "-error";
  const errorMsgEL = formEl.querySelector("#" + errorMsgID);
  errorMsgEL.textContent = errorMsg;
  inputEl.classList.add("modal__input_type_error");
  console.log(errorMsgID);
};

const hideInputError = (formEl, inputEl) => {
  const errorMsgID = inputEl.id + "-error";
  const errorMsgEL = formEl.querySelector("#" + errorMsgID);
  errorMsgEL.textContent = "";
  inputEl.classList.remove("modal__input_type_error");
};

const checkInputValidity = (formEl, inputEl) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const setEventListeners = (formEl) => {
  const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
  const buttonElement = formEl.querySelectorAll("modal__submit-button");

  console.log(inputList);
  console.log(buttonElement);

  //TODO: handle initial states
  //toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement);
      //toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formEl) => {
    setEventListeners(formEl);
  });
};

enableValidation();
