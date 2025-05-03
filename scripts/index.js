const initialCards = [
  {
    name: "Val Thorens",
    link: "./images/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "./images/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "./images/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "./images/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "./images/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "./images/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

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
const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

//Card Functions//
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;
  return cardElement;
}

for (let i = 0; i < initialCards.length; i++) {
  const cardElement = getCardElement(initialCards[i]);
  cardsList.append(cardElement);
}

//Modal Functions//
function openModal(modal) {
  modal.classList.add("modal_opened");
}

profileEditButton.addEventListener("click", function () {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

editModalCloseButton.addEventListener("click", function () {
  closeModal(editModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

//Submit Handlers//

editFormElement.addEventListener("submit", function (evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
});

newPostFormElement.addEventListener("submit", function (evt) {
  evt.preventDefault();

  // 1.need link and name for new post
  // 2.get name and link from form inputs
  const name = newPostCaptionInput.value;
  const link = newPostImageInput.value;

  // 3.generate post
  const newPostData = { name: name, link: link };
  const newPost = getCardElement(newPostData);

  // 4. add to cards page section
  cardsList.prepend(newPost);

  closeModal(newPostModal);
  // 4.newPostFormElement.reset();
  evt.target.reset();
});
