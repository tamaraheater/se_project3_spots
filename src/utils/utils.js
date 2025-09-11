import {
  resetValidation,
  disableButton,
  validationConfig,
} from "../scripts/validation.js";

// // Close modal function
// export function closeModal(modal) {
//   modal.classList.remove("modal_opened");
//   document.removeEventListener("keydown", (evt) => {
//     if (evt.key === "Escape") {
//       closeModal(modal);
//     }
//   });
// }

// Toggles button text between loading and default states
export function renderLoading(
  isLoading,
  button,
  buttonText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
}

// Universal submit handler for forms
export function handleSubmit({
  request,
  evt,
  modalElement,
  inputList,
  resetForm = true,
  errorMessage = "An error occurred. Please try again.",
  loadingText = "Saving...",
}) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  renderLoading(true, submitButton, initialText, loadingText);

  request()
    .then(() => {
      if (resetForm) {
        evt.target.reset();
      }
      resetValidation(evt.target, inputList, validationConfig);
      disableButton(submitButton, validationConfig);
      closeModal(modalElement);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      alert(errorMessage);
    })
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}
