// define a function for changing the button text. It accepts 4 params (the 2 last are optional with default texts)
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
