// index.js
import "../pages/index.css";
import Api from "../utils/Api.js";
import {
  setButtonText,
  renderLoading,
  handleSubmit,
} from "../utils/helpers.js";
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
  toggleButtonState,
} from "../scripts/validation.js";

// Instantiate Api with correct Authorization header
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json",
  },
});

let selectedCard, selectedCardID;

// Card Variables
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Profile Variables
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector("#profile-avatar");
const avatarEditButton = document.querySelector(".profile__avatar-button");

// Edit Modal Variables
const editModal = document.querySelector("#edit-open-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// New Post Variables
const newPostButton = document.querySelector(".profile__add-post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostFormElement = newPostModal.querySelector(".modal__form");
const newPostImageInput = newPostFormElement.querySelector("#card-image-input");
const newPostCaptionInput = newPostFormElement.querySelector(
  "#card-caption-input"
);
const newPostSubmitButton = newPostFormElement.querySelector(
  ".modal__submit-button"
);

// Avatar Modal Variables
const avatarModal = document.querySelector("#avatar-open-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarSubmitButton = avatarFormElement.querySelector(
  ".modal__submit-button"
);

// Preview Modal Variables
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);
const modalPreviewImageEl = previewModal.querySelector(".modal__preview-image");
const modalPreviewCaptionEl = previewModal.querySelector(
  ".modal__preview-caption"
);

api
  .getAppInfo()
  .then(([cards, data]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileName.textContent = data.name;
    profileDescription.textContent = data.about;
    profileAvatar.src = data.avatar;
  })
  .catch((err) => {
    console.error("Failed to fetch app info:", err);
  });

// Handle like button clicks
function handleLike(evt, id) {
  const cardLikeButtonEl = evt.target;
  const cardIsLiked = cardLikeButtonEl.classList.contains(
    "card__like-button_active"
  );

  api
    .changeLikeStatus(id, cardIsLiked)
    .then((updatedCard) => {
      cardLikeButtonEl.classList.toggle(
        "card__like-button_active",
        updatedCard.isLiked
      );
    })
    .catch((err) => {
      console.error("Failed to toggle like:", err);
    });
}

// Card Element Functions
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  if (data.isLiked) {
    cardLikeButtonEl.classList.add("card__like-button_active");
  }

  cardLikeButtonEl.addEventListener("click", (evt) =>
    handleLike(evt, data._id)
  );

  cardImageElement.addEventListener("click", () => {
    modalPreviewImageEl.src = data.link;
    modalPreviewImageEl.alt = data.name;
    modalPreviewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// Modal Functions
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
  }
}

// Button Event Listeners
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
});

newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
  resetValidation(
    newPostFormElement,
    [newPostImageInput, newPostCaptionInput],
    validationConfig
  );
  toggleButtonState(
    [newPostImageInput, newPostCaptionInput],
    newPostFormElement.querySelector(".modal__submit-button"),
    validationConfig
  );
});

avatarEditButton.addEventListener("click", () => {
  openModal(avatarModal);
  resetValidation(avatarFormElement, [avatarInput], validationConfig);
  toggleButtonState(
    [avatarInput],
    avatarFormElement.querySelector(".modal__submit-button"),
    validationConfig
  );
});

editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

newPostCloseButton.addEventListener("click", () => {
  closeModal(newPostModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

// Close Modal
const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (
      evt.target === modal ||
      evt.target.classList.contains("modal__close-button")
    ) {
      closeModal(modal);
    }
  });
});

// Form Functions
function handleNewPostFormSubmit(event) {
  console.log("handleNewPostFormSubmit called");
  event.preventDefault();
  const form = event.target;
  const imageInput = form.querySelector("#card-image-input").value;
  const captionInput = form.querySelector("#card-caption-input").value;

  renderLoading(true, form);

  if (!imageInput) {
    renderLoading(false, form, "Please enter an image URL");
    console.log("Empty image URL");
    return;
  }
  if (!captionInput) {
    renderLoading(false, form, "Please enter a caption");
    console.log("Empty caption");
    return;
  }

  const request = function () {
    return api.addCard({ name: captionInput, link: imageInput });
  };

  handleSubmit(request, event, "Saving...")
    .then(function () {
      closeModal(document.querySelector("#new-post-modal"));
      renderCards();
    })
    .catch(function (error) {
      console.log("Post error:", error);
      renderLoading(false, form, "Cannot save post. Try again.");
    });
}

// Profile Form
function handleProfileFormSubmit(event) {
  console.log("handleProfileFormSubmit called");
  event.preventDefault();
  const form = event.target;
  const submitButton = form.querySelector(".modal__submit-button");
  const nameInput = form.querySelector("#profile-name-input");
  const descriptionInput = form.querySelector("#profile-description-input");

  if (!nameInput || !descriptionInput) {
    console.log("Profile inputs not found");
    renderLoading(false, form, "Form error. Check input IDs.");
    return;
  }

  renderLoading(true, form);

  if (!nameInput.value || !descriptionInput.value) {
    renderLoading(false, form, "Please fill out all fields");
    console.log("Empty profile fields");
    return;
  }

  setButtonText(submitButton, true, "Save", "Saving...");
  const request = function () {
    return api.editUserInfo({
      name: nameInput.value,
      about: descriptionInput.value,
    });
  };

  handleSubmit(request, event, "Saving...")
    .then(function ({ data }) {
      document.querySelector(".profile__name").textContent = data.name;
      document.querySelector(".profile__description").textContent = data.about;
      closeModal(document.querySelector("#edit-open-modal"));
    })
    .catch(function (error) {
      console.log("Profile error:", error);
      renderLoading(false, form, "Cannot save profile. Try again.");
    });
}

// Avatar Form
function handleAvatarFormSubmit(event) {
  console.log("handleAvatarFormSubmit called");
  event.preventDefault();
  const form = event.target;
  const submitButton = form.querySelector(".modal__submit-button");
  const avatarInput = form.querySelector("#profile-avatar-input");

  if (!avatarInput) {
    console.log("Avatar input not found");
    renderLoading(false, form, "Form error. Check input ID.");
    return;
  }

  renderLoading(true, form);

  if (!avatarInput.value) {
    renderLoading(false, form, "Please enter an avatar URL");
    console.log("Empty avatar URL");
    return;
  }

  setButtonText(submitButton, true, "Save", "Saving...");
  const request = function () {
    return api.updateAvatar({ avatar: avatarInput.value });
  };

  handleSubmit(request, event, "Saving...")
    .then(function ({ data }) {
      document.querySelector("#profile-avatar").src = data.avatar;
      closeModal(document.querySelector("#avatar-open-modal"));
    })
    .catch(function (error) {
      console.log("Avatar error:", error);
      renderLoading(false, form, "Cannot save avatar. Try again.");
    });
}

// Event Listeners
document
  .querySelector("#new-post-form-modal")
  .addEventListener("submit", handleNewPostFormSubmit);
document
  .querySelector("#edit-open-modal")
  .addEventListener("submit", handleProfileFormSubmit);
document
  .querySelector("#avatar-open-modal")
  .addEventListener("submit", handleAvatarFormSubmit);

enableValidation(validationConfig);
