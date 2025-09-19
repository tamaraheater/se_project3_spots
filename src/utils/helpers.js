import { disableButton } from "../scripts/validation";

export function renderLoading(
  isLoading,
  buttonElement,
  initialText = "Save",
  loadingText = "Saving..."
) {
  if (!buttonElement) {
    console.error("No button element provided to renderLoading");
    return;
  }
  buttonElement.textContent = isLoading ? loadingText : initialText;
}
{
  if (isLoading) {
    button.textContent = data - loadingText;
  } else {
    button.textContent = defaultText;
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  renderLoading(true, submitButton, initialText, loadingText);
  request()
    .then(() => {
      evt.target.reset(disableButton);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}
