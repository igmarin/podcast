"use strict";

const User = use("App/Models/User");

class TestController {
  async index({ view }) {
    const users = await User.all();

    return view.render("welcome", { users: users.toJSON() });
  }
}

module.exports = TestController;
