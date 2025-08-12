class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "563217bb-cd86-459c-9285-cca63d6f8c1f",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
