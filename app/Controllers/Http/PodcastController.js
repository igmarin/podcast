"use strict";

const Category = use("App/Models/Category");
const Podcast = use("App/Models/Podcast");
const { validateAll } = use("Validator");
const Helpers = use("Helpers");
const uuid = require("uuid/v4");

class PodcastController {
  async create({ view }) {
    const categories = await Category.pair("id", "name");

    return view.render("podcasts.create", { categories });
  }

  async store({ request, response, auth, session }) {
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

    const user = auth.user;
    const logo = request.file("logo", {
      types: ["image"],
      size: "2mb"
    });

    await logo.move(Helpers.publicPath("uploads/logos"), {
      name: `${uuid()}.${logo.subtype}`
    });

    if (!logo.moved()) {
      session.flash({
        type: "danger",
        message: logo.error().message
      });

      return response.redirect("back");
    }

    const podcast = new Podcast();
    podcast.title = request.input("title");
    podcast.category_id = request.input("category_id");
    podcast.description = request.input("description");
    podcast.logo = `uploads/logos/${logo.fileName}`;
    await user.podcast().save(podcast);

    session.flash({
      type: "success",
      message: "Podcast created successfully"
    });

    return response.route("myPodcast");
  }
}

module.exports = PodcastController;
