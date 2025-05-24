const showInputError = (formElement, inputElement, errorMessage) => {
  const errorMsgID = inputElement.id + "-error-msg";
  const errorMessageElement = formElement.querySelector("#" + errorMsgID);
  errorMessageElement.textContent = errorMessage;
  inputElement.classList.add("modal__input_type_error");
  errorMessageElement.classList.add("modal__error_visible");
  console.log(errorMsgID);
};

//On the site you must physically click on container sometimes to see red border, after causing error, and must type to
// remove as autoform fill works on some dialoge boxes and not others
const hideInputError = (formElement, inputElement) => {
  const errorMsgID = inputElement.id + "-error-msg";
  const errorMessageElement = formElement.querySelector("#" + errorMsgID);
  inputElement.classList.remove("modal__input_type_error");
  errorMessageElement.classList.remove("modal__error_visible");
  errorMessageElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement) => {
  console.log(inputElement.validity.valid);
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

//On the site you must physicaly type to see the disable button change, autoform fill works on some dialoge boxes and not others
const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add("modal__submit-button_disabled");
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove("modal__submit-button_disabled");
  }
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
  const buttonElement = formElement.querySelector(".modal__submit-button");

  // toggleButtonState(inputList, buttonElement);

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
