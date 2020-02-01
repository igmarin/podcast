"use strict";

const Category = use("App/Models/Category");

class TestController {
  async index({ view }) {
    const categories = await Category.all();

    return view.render("welcome", { categories: categories.toJSON() });
  }
}

module.exports = TestController;
