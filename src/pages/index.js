import "../pages/index.css";
import Api from "../utils/Api.js";
import { renderLoading, handleSubmit } from "../utils/helpers.js";
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
  toggleButtonState,
} from "../scripts/validation.js";

// API Initialization
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "563217bb-cd86-459c-9285-cca63d6f8c1f",
    "Content-Type": "application/json",
  },
});

// Variables
// Card Variables
let selectedCard, selectedCardID;
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Delete Modal Variables
const deleteModal = document.querySelector("#delete-modal");
const deleteFormElement = deleteModal.querySelector(".modal__form");

// Profile Variables
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector("#profile-avatar");
const avatarEditButton = document.querySelector(".profile__avatar-button");

// Edit Modal Variables
const editModal = document.querySelector("#edit-open-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// New Post Variables
const newPostButton = document.querySelector(".profile__add-post-button");
const newPostModal = document.querySelector("#new-post-modal");
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

// Preview Modal Variables
const previewModal = document.querySelector("#preview-modal");
const modalPreviewImageEl = previewModal.querySelector(".modal__preview-image");
const modalPreviewCaptionEl = previewModal.querySelector(
  ".modal__preview-caption"
);

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
    closeModal(openedModal);
  }
}

// Card Functions
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");
  const cardDeleteButtonEl = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  if (data.isLiked) {
    cardLikeButtonEl.classList.add("card__like-button_active");
  }

  cardLikeButtonEl.addEventListener("click", (evt) =>
    handleLike(evt, data._id)
  );
  cardDeleteButtonEl.addEventListener("click", () => {
    selectedCardID = data._id;
    selectedCard = cardElement;
    openModal(deleteModal);
  });

  cardImageElement.addEventListener("click", () => {
    modalPreviewImageEl.src = data.link;
    modalPreviewImageEl.alt = data.name;
    modalPreviewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

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

// Form Submit Handlers
function handleProfileFormSubmit(evt) {
  function makeRequest() {
    return api
      .editUserInfo({
        name: editModalNameInput.value,
        about: editModalDescriptionInput.value,
      })
      .then((userData) => {
        profileName.textContent = userData.name;
        profileDescription.textContent = userData.about;
        return userData;
      });
  }
  handleSubmit(makeRequest, evt).then(() => {
    evt.target.reset();
    resetValidation(evt.target, validationConfig);
    disableButton(
      evt.target.querySelector(".modal__submit-button"),
      validationConfig
    );
    closeModal(editModal);
  });
}

function handleNewPostFormSubmit(evt) {
  function makeRequest() {
    return api.createCard({
      link: newPostImageInput.value,
      name: newPostCaptionInput.value,
    });
  }
  handleSubmit(makeRequest, evt).then((card) => {
    const cardElement = getCardElement(card);
    cardsList.prepend(cardElement);
    evt.target.reset();
    resetValidation(evt.target, validationConfig);
    disableButton(
      evt.target.querySelector(".modal__submit-button"),
      validationConfig
    );
    closeModal(newPostModal);
  });
}

editFormElement.addEventListener("submit", (evt) => {
  console.log("Profile form submitted");
  handleProfileFormSubmit(evt);
});

newPostFormElement.addEventListener("submit", (evt) => {
  console.log("New post form submitted");
  handleNewPostFormSubmit(evt);
});

avatarFormElement.addEventListener("submit", function (evt) {
  function makeRequest() {
    return api.updateAvatar({ avatar: avatarInput.value });
  }
  handleSubmit(makeRequest, evt).then((data) => {
    profileAvatar.src = data.avatar;
    evt.target.reset();
    resetValidation(avatarFormElement, [avatarInput], validationConfig);
    disableButton(
      evt.target.querySelector(".modal__submit-button"),
      validationConfig
    );
    closeModal(avatarModal);
  });
});

deleteFormElement.addEventListener("submit", function (evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardID);
  }
  handleSubmit(makeRequest, evt).then(() => {
    selectedCard.remove();
    closeModal(deleteModal);
  });
});

// Button Event Listeners
profileEditButton.addEventListener("click", function () {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
  resetValidation(
    newPostFormElement,
    [newPostImageInput, newPostCaptionInput],
    validationConfig
  );
  toggleButtonState(
    [newPostImageInput, newPostCaptionInput],
    newPostSubmitButton,
    validationConfig
  );
});

avatarEditButton.addEventListener("click", function () {
  openModal(avatarModal);
  resetValidation(avatarFormElement, [avatarInput], validationConfig);
  toggleButtonState(
    [avatarInput],
    avatarFormElement.querySelector(".modal__submit-button"),
    validationConfig
  );
});

// Modal Closing Handler
const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (
      evt.target === modal ||
      evt.target.classList.contains("modal__close-button") ||
      evt.target.classList.contains("modal__cancel-button")
    ) {
      closeModal(modal);
    }
  });
});

// Validation
enableValidation(validationConfig);
