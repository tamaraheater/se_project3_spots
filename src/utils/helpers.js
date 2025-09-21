export function setButtonText(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  setButtonText(submitButton, true, initialText, loadingText);
  return request()
    .then((data) => {
      evt.target.reset();
      return data;
    })
    .catch((err) => {
      console.error("Submission failed:", err);
      throw err;
    })
    .finally(() => {
      setButtonText(submitButton, false, initialText, loadingText);
    });
}
