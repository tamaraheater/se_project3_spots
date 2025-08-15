import "../pages/index.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  validationConfig,
  resetValidation,
} from "../scripts/validation.js";
import { data } from "autoprefixer";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "563217bb-cd86-459c-9285-cca63d6f8c1f",
    "Content-Type": "application/json",
  },
});

//destructure the second item in the callback of the .then()
api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;
  })
  .catch((err) => {
    console.error("Failed to load app data:", err);
  });

// Profile Variables//
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editModal = document.querySelector("#edit-open-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// Card Variables//
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
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
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);
const modalPreviewImageEl = previewModal.querySelector(".modal__preview-image");
const modalPreviewCaptionEl = previewModal.querySelector(
  ".modal__preview-caption"
);

//Card Element Functions//
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");
  cardLikeButtonEl.addEventListener("click", () => {
    cardLikeButtonEl.classList.toggle("card__like-button_active");
  });

  const cardDeleteButtonEl = cardElement.querySelector(".card__delete-button");
  cardDeleteButtonEl.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageElement.addEventListener("click", () => {
    modalPreviewImageEl.src = data.link;
    modalPreviewImageEl.alt = data.name;
    modalPreviewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

//Modal Functions//
//>>Open Modal//
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

profileEditButton.addEventListener("click", function () {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
  openModal(editModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

// Close Modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

editModalCloseButton.addEventListener("click", function () {
  closeModal(editModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseButton.addEventListener("click", function () {
  closeModal(previewModal);
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

//Submit Handlers//
editFormElement.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const userData = {
    name: editModalNameInput.value,
    about: editModalDescriptionInput.value,
  };
  api
    .editUserInfo(userData)
    .then((data) => {
      profileName.textContent = data.name; // Adjust based on API response
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch((err) => {
      console.error("Failed to update user info:", err);
    });
});

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

newPostFormElement.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const name = newPostCaptionInput.value;
  const link = newPostImageInput.value;

  const newPostData = { name: name, link: link };
  const newPost = getCardElement(newPostData);

  cardsList.prepend(newPost);
  evt.target.reset();
  disableButton(newPostSubmitButton, validationConfig);
  closeModal(newPostModal);
});

enableValidation(validationConfig);
