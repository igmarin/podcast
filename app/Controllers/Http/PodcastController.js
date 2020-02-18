"use strict";

const Category = use("App/Models/Category");
const Podcast = use("App/Models/Podcast");
const { validateAll } = use("Validator");
const Helpers = use("Helpers");
const uuid = require("uuid/v4");
const UnauthorizedException = use("App/Exceptions/UnauthorizedException");
const Database = use("Database");
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
    const logo = await this._processLogoUpload(request);

    if (!logo.moved()) {
      session.flash({
        notification: {
          type: "danger",
          message: logo.error().message
        }
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

  async edit({ view, params }) {
    const podcast = await Podcast.findOrFail(params.id);
    const categories = await Category.pair("id", "name");

    return view.render("podcasts/edit", { podcast, categories });
  }

  async update({ params, request, response, session, auth }) {
    const data = request.only([
      "title",
      "category_id",
      "description",
      "user_id"
    ]);
    const podcast = await Podcast.findOrFail(params.id);

    const rules = {
      title: "required",
      category_id: "required",
      description: "required"
    };

    const validation = await validateAll(data, rules);

    if (auth.user.id !== podcast.user_id) {
      throw new UnauthorizedException("You can only edit your podcast", 403);
    }

    if (validation.fails()) {
      session.withErrors(validation.messages());

      return response.redirect("back");
    }

    if (request.file("logo").size > 0) {
      const logo = await this._processLogoUpload(request);

      if (!logo.moved()) {
        session.flash({
          notification: {
            type: danger,
            message: logo.error().message
          }
        });

        return response.redirect("back");
      }

      podcast.logo = `uploads/logos/${logo.fileName}`;
    }

    podcast.title = data.title;
    podcast.category_id = data.category_id;
    podcast.description = data.description;

    await podcast.save();

    session.flash({
      notification: {
        type: "success",
        message: "Podcast updated!"
      }
    });

    return response.route("myPodcast");
  }

  async _processLogoUpload(request) {
    const logo = request.file("logo", {
      types: ["image"],
      size: "2mb"
    });

    await logo.move(Helpers.publicPath("uploads/logos"), {
      name: `${uuid()}.${logo.subtype}`
    });

    return logo;
  }

  async destroy({ params, auth, response, session }) {
    const podcast = await Podcast.findOrFail(params.id);

    if (auth.user.id !== podcast.user_id) {
      throw new UnauthorizedException("You can only delete your podcast", 403);
    }

    await podcast.delete();
    session.flash({
      notification: {
        type: "success",
        message: "Podcast deleted succesfully"
      }
    });
    return response.route("myPodcast");
  }

  async show({ params, view, request, auth }) {
    const podcast = await Podcast.query()
      .where("slug", params.slug)
      .with("podcaster")
      .first();

    const subscriptions = await Database.table("subscriptions")
      .where("podcast_id", podcast.id)
      .pluck("user_id");

    const subscribed = subscriptions.includes(auth.user.id);
    const episodes = await podcast
      .episodes()
      .orderBy("id", "desc")
      .fetch();

    return view.render("podcasts.show", {
      podcast: podcast.toJSON(),
      subscriptions: subscriptions,
      subscribed: subscribed,
      episodes: episodes.toJSON()
    });
  }
}

module.exports = PodcastController;
