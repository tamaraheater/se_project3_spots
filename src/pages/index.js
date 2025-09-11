import "../pages/index.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import { handleSubmit, renderLoading } from "../utils/Utils.js";

// API setup
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "563217bb-cd86-459c-9285-cca63d6f8c1f",
    "Content-Type": "application/json",
  },
});

// Card Variables
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
// Delete Modal
const deleteModal = document.querySelector("#delete-modal");
const deleteFormElement = deleteModal.querySelector(".modal__form");
const cancelDeleteButton = deleteModal.querySelector(".modal__cancel-button");
let selectedCard, selectedCardID;
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
const previewModalCloseButton = document.querySelector(".modal__close-button");
const modalPreviewImageEl = document.querySelector(".modal__preview-image");
const modalPreviewCaptionEl = document.querySelector(".modal__preview-caption");

// Enable validation for all forms
enableValidation(validationConfig);

// Initial data loading
api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    profileAvatar.src = user.avatar;
  })
  .catch((err) => {
    console.error("Failed to load app info:", err);
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

// Card Element Function
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

// Modal Functions
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function toggleButtonState(inputList, buttonElement, config) {
  const hasInvalidInput = inputList.some(
    (inputElement) => !inputElement.validity.valid
  );
  if (hasInvalidInput) {
    disableButton(buttonElement, config);
  } else {
    buttonElement.removeAttribute("disabled");
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

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

// Modal open handlers
profileEditButton.addEventListener("click", function () {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
  toggleButtonState(
    [editModalNameInput, editModalDescriptionInput],
    editFormElement.querySelector(".modal__submit-button"),
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
    newPostFormElement.querySelector(".modal__submit-button"),
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

// Close modal handlers
editModalCloseButton.addEventListener("click", function () {
  closeModal(editModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseButton.addEventListener("click", function () {
  closeModal(previewModal);
});

avatarModalCloseButton.addEventListener("click", function () {
  closeModal(avatarModal);
});

cancelDeleteButton.addEventListener("click", function () {
  closeModal(deleteModal);
});

// Form submissions
newPostFormElement.addEventListener("submit", function (evt) {
  function makeRequest() {
    const name = newPostCaptionInput.value;
    const link = newPostImageInput.value;
    const newPostData = { name, link };
    return api.addCard(newPostData).then((newPost) => {
      const cardElement = getCardElement(newPost);
      cardsList.prepend(cardElement);
    });
  }

  handleSubmit({
    request: makeRequest,
    evt,
    modalElement: newPostModal,
    inputList: [newPostImageInput, newPostCaptionInput],
    resetForm: true,
    errorMessage: "Failed to create post. Please try again.",
  });
});

avatarFormElement.addEventListener("submit", function (evt) {
  function makeRequest() {
    const avatarData = { avatar: avatarInput.value };
    return api.updateAvatar(avatarData).then((data) => {
      profileAvatar.src = data.avatar;
    });
  }

  handleSubmit({
    request: makeRequest,
    evt,
    modalElement: avatarModal,
    inputList: [avatarInput],
    resetForm: true,
    errorMessage: "Failed to update avatar. Please try again.",
  });
});

editFormElement.addEventListener("submit", function (evt) {
  function makeRequest() {
    const userData = {
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    };
    return api.editUserInfo(userData).then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
    });
  }

  handleSubmit({
    request: makeRequest,
    evt,
    modalElement: editModal,
    inputList: [editModalNameInput, editModalDescriptionInput],
    resetForm: false,
    errorMessage: "Failed to update profile. Please try again.",
  });
});

deleteFormElement.addEventListener("submit", function (evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardID).then(() => {
      selectedCard.remove();
    });
  }

  handleSubmit({
    request: makeRequest,
    evt,
    modalElement: deleteModal,
    inputList: [], // No inputs for delete form
    resetForm: false,
    errorMessage: "Failed to delete card. Please try again.",
    loadingText: "Deleting...",
  });
});
