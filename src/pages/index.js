import "../pages/index.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "563217bb-cd86-459c-9285-cca63d6f8c1f",
    "Content-Type": "application/json",
  },
});

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
    console.error("Failed to update user info:", err);
  });

// Card Variables//
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
//Delete Card
const deleteModal = document.querySelector("#delete-modal");
const deleteFormElement = deleteModal.querySelector(".modal__form");

let selectedCard, selectedCardID;

// Profile Variables//
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector("#profile-avatar");
const avatarEditButton = document.querySelector(".profile__avatar-button");

//Edit Modal Variables
const editModal = document.querySelector("#edit-open-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//New Post Variables
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

//Avatar Modal Variables
const avatarModal = document.querySelector("#avatar-open-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarSubmitButton = avatarFormElement.querySelector(
  ".modal__submit-button"
);

//Preview Mode Variables
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
  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");
  const cardDeleteButtonEl = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButtonEl.addEventListener("click", () => {
    cardLikeButtonEl.classList.toggle("card__like-button_active");
  });

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

avatarEditButton.addEventListener("click", function () {
  openModal(avatarModal);
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

avatarModalCloseButton.addEventListener("click", function () {
  closeModal(avatarModal);
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

//Submit Handlers//
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

avatarFormElement.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const submitButton = avatarFormElement.querySelector(".modal__submit-button");
  const avatarData = { avatar: avatarInput.value };
  api
    .updateAvatar(avatarData)
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .finally(() => {
      submitButton.textContent = "Save";
    });
});

//Event Listener - API data return

editFormElement.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const data = {
    name: editModalNameInput.value,
    about: editModalDescriptionInput.value,
  };
  api
    .editUserInfo(data)
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch((err) => {
      console.error("API error in editUserInfo:", err);
      throw err;
    });
});

newPostFormElement.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const name = newPostCaptionInput.value;
  const link = newPostImageInput.value;
  const newPostData = { name: name, link: link };

  api
    .addCard(newPostData)
    .then((newPost) => {
      const cardElement = getCardElement(newPost);
      cardsList.prepend(cardElement);
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error("Failed to addCard:", err);
    });

  evt.target.reset();
  disableButton(newPostSubmitButton, validationConfig);
});

deleteFormElement.addEventListener("submit", function (evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardID)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error("API error in deleteCard:", err);
      throw err;
    });
});

enableValidation(validationConfig);
