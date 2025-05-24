const showInputError = (formElement, inputElement, errorMessage) => {
  console.log(errorMsgID);
  const errorMsgID = inputElement.id + "error-msg";
  const errorMessageElement = formElement.querySelector("#" + errorMsgID);
  inputElement.classList.add("modal__input_type_error");
  errorMessageElement.textContent = errorMessage;
  errorMessageElement.classList.add("modal__error_visible");
};

const hideInputError = (formElement, inputElement) => {
  const errorMsgID = inputElement.id + "error-msg";
  const errorMessageElement = formElement.querySelector("#" + errorMsgID);
  inputElement.classList.remove("modal__input_type_error");
  errorMessageElement.classList.remove("modal__error_visible");
  errorMessageElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement);
  } else {
    buttonElement.disabled = false;
    inputElement.classList.remove(".modal__submit-button_disabled");
  }
};

const disableButton = (buttonElement) => {
  buttonElement.disabled = true;
  inputElement.classList.add(".modal__submit-button_disabled");
};

const setEventListeners = (formElement) => {
  console.log(formElement);
  const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
  const buttonElement = formElement.querySelector("modal__submit-button");
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

enableValidation();
