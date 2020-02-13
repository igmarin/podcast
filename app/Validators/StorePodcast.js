"use strict";
const Podcast = use("App/Models/Podcast");

class StorePodcast {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      title: "required",
      category_id: "required",
      description: "required"
    };
  }
}

module.exports = StorePodcast;
