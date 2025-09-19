export function renderLoading(
  isLoading,
  button,
  buttonText = "Save",
  loadingText = "Saving..."
) {
  button.textContent = isLoading ? loadingText : buttonText;
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;

  renderLoading(true, submitButton, initialText, loadingText);
  return request()
    .catch((err) => {
      console.error("Form submission failed:", err);
      alert("Failed to save. Please try again.");
      throw err;
    })
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}
