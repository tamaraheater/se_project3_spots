export function setButtonText(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (!button) {
    console.log("No button for setButtonText");
    return;
  }
  console.log("setButtonText:", {
    isLoading,
    button,
    defaultText,
    loadingText,
  });
  button.textContent = isLoading ? loadingText : defaultText;
  button.disabled = isLoading;
}

export function renderLoading(isLoading, formElement, errorMessage = "") {
  if (!formElement) {
    console.log("No form for renderLoading");
    return;
  }
  const errorSpans = formElement.querySelectorAll(".modal__error_visible");
  console.log("renderLoading:", { isLoading, errorMessage });
  errorSpans.forEach((span) => {
    span.textContent = isLoading ? "" : errorMessage;
  });
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton =
    evt.submitter || evt.target.querySelector(".modal__submit-button");
  if (!submitButton) {
    console.log("No submit button found");
    return;
  }
  const initialText = submitButton.textContent || "Save";
  console.log("handleSubmit calling setButtonText:", {
    isLoading: true,
    submitButton,
    initialText,
    loadingText,
  });
  setButtonText(submitButton, true, initialText, loadingText);
  renderLoading(true, evt.target);

  return request()
    .then(function (response) {
      if (!response.ok) {
        console.log("Server error: HTTP", response.status);
        throw new Error();
      }
      return response.json();
    })
    .then(function (data) {
      evt.target.reset();
      return data;
    })
    .catch(function (err) {
      console.log("Request failed:", err);
      renderLoading(false, evt.target, "Cannot save. Try again.");
      throw err;
    })
    .finally(function () {
      console.log("handleSubmit calling setButtonText:", {
        isLoading: false,
        submitButton,
        initialText,
      });
      setButtonText(submitButton, false, initialText);
    });
}
