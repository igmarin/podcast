"use strict";

const Category = use("App/Models/Category");
const { validateAll } = use("Validator");

class PodcastController {
  async create({ view }) {
    const categories = await Category.pair("id", "name");

    return view.render("podcasts.create", { categories });
  }

  async store({ request, response, session }) {
    const rules = {
      title: "required",
      category_id: "required",
      description: "required"
    };

    const validation = await validateAll(request.all(), rules);
    if (validation.fails()) {
      session.withErrors(validation.messages());

      return response.redirect("back");
    }
  }
}

module.exports = PodcastController;
