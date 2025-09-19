export function renderLoading(
  isLoading,
  buttonElement,
  initialText,
  loadingText = "Saving..."
) {
  if (!buttonElement) {
    console.error("No button element provided to renderLoading");
    return;
  }
  console.log("renderLoading:", {
    isLoading,
    buttonElement,
    initialText,
    loadingText,
  });
  buttonElement.textContent = isLoading ? loadingText : initialText;
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton =
    evt.submitter || evt.target.querySelector(".modal__submit-button");
  if (!submitButton) {
    console.error("No submit button found for form:", evt.target);
    return;
  }
  const initialText = submitButton.textContent || "Save";
  console.log("handleSubmit calling renderLoading with:", {
    isLoading: true,
    submitButton,
    initialText,
    loadingText,
  });
  renderLoading(true, submitButton, initialText, loadingText);
  return request()
    .then(() => {
      evt.target.reset();
    })
    .catch((err) => {
      console.error("Request failed:", err);
      throw err;
    })
    .finally(() => {
      console.log("handleSubmit calling renderLoading with:", {
        isLoading: false,
        submitButton,
        initialText,
      });
      renderLoading(false, submitButton, initialText);
    });
}
