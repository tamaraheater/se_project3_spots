class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _request(endpoint, options = {}) {
    const finalOptions = {
      headers: this._headers,
      ...options,
    };
    const url = `${this._baseUrl}${endpoint}`;
    return fetch(url, finalOptions).then(this._checkResponse);
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  getAppInfo() {
    return Promise.all([this.getCards(), this.getUserInfo()]);
  }

  getCards() {
    return this._request("/cards", { method: "GET" });
  }

  addCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, { method: "DELETE" });
  }

  getUserInfo() {
    return this._request("/users/me", { method: "GET" });
  }

  editUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  updateAvatar({ avatar }) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
  }

  changeLikeStatus(cardId, isLiked) {
    return this._request(`/cards/${cardId}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
    });
  }
}

export default Api;
