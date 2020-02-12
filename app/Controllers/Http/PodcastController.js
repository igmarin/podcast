"use strict";

const Category = use("App/Models/Category");

class PodcastController {
  async create({ view }) {
    const categories = await Category.pair("id", "name");

    return view.render("podcasts.create", { categories });
  }

  async store({ request, response }) {}
}

module.exports = PodcastController;
