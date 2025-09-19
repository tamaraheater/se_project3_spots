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

let selectedCard, selectedCardID;

// Card Variables
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
// Delete Modal
const deleteModal = document.querySelector("#delete-modal");
const deleteFormElement = deleteModal.querySelector(".modal__form");
const cancelDeleteButton = deleteModal.querySelector(".modal__cancel-button");

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

cancelDeleteButton.addEventListener("click", () => {
  closeModal(deleteModal);
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
function handleNewPostFormSubmit(evt) {
  console.log("handleNewPostFormSubmit called");
  function makeRequest() {
    return api
      .addCard({
        name: newPostCaptionInput.value,
        link: newPostImageInput.value,
      })
      .then((newPost) => {
        const cardElement = getCardElement(newPost);
        cardsList.prepend(cardElement);
        closeModal(newPostModal);
        return newPost;
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleProfileFormSubmit(evt) {
  console.log("handleProfileFormSubmit called");
  function makeRequest() {
    return api
      .editUserInfo({
        name: editModalNameInput.value,
        about: editModalDescriptionInput.value,
      })
      .then((userData) => {
        profileName.textContent = userData.name;
        profileDescription.textContent = userData.about;
        closeModal(editModal);
        return userData;
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleAvatarFormSubmit(evt) {
  console.log("handleAvatarFormSubmit called");
  function makeRequest() {
    return api
      .updateAvatar({
        avatar: avatarInput.value,
      })
      .then((data) => {
        profileAvatar.src = data.avatar;
        closeModal(avatarModal);
        return data;
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleDeleteFormSubmit(evt) {
  console.log("handleDeleteFormSubmit called");
  function makeRequest() {
    return api.deleteCard(selectedCardID).then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    });
  }
  handleSubmit(makeRequest, evt);
}

newPostFormElement.addEventListener("submit", handleNewPostFormSubmit);
editFormElement.addEventListener("submit", handleProfileFormSubmit);
avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);
deleteFormElement.addEventListener("submit", handleDeleteFormSubmit);

enableValidation(validationConfig);
