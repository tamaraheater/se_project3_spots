export const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorMsgID = inputElement.id + "-error-msg";
  const errorMessageElement = formElement.querySelector("#" + errorMsgID);
  errorMessageElement.textContent = errorMessage;
  inputElement.classList.add(config.inputErrorClass);
  errorMessageElement.classList.add(config.errorClass);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorMsgID = inputElement.id + "-error-msg";
  const errorMessageElement = formElement.querySelector("#" + errorMsgID);
  inputElement.classList.remove(config.inputErrorClass);
  errorMessageElement.classList.remove(config.errorClass);
  errorMessageElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

export const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

export const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

export function disableButton(buttonElement, config) {
  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.disabled = true;
}

export const resetValidation = (formElement, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input, config);
  });
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  }
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, config);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

export const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};
