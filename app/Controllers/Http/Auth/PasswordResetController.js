"use strict";

const { validate, validateAll } = use("Validator");
const User = use("App/Models/User");
const Token = use("App/Models/Token");
const randToken = require("rand-token");
const Encryption = use("Encryption");
const Event = use("Event");

class PasswordResetController {
  showLinkRequestForm({ view }) {
    return view.render("auth.passwords.email");
  }
  async sendResetLinkEmail({ request, session, response }) {
    const validation = await validate(request.input("email"), {
      email: "required|email"
    });

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();

      return response.redirect("back");
    }

    try {
      const user = await User.findBy("email", request.input("email"));

      await Token.query()
        .where("user_id", user.id)
        .where("type", "password")
        .delete();

      const token = new Token();
      token.token = Encryption.encrypt(randToken.generate(16));
      token.type = "password";

      await user.tokens().save(token);

      Event.fire("forgot::password", {
        user: user.toJSON(),
        token: token.token
      });

      session.flash({
        notification: {
          type: "success",
          message: "The password reset link has been sent to the email provided"
        }
      });

      return response.redirect("back");
    } catch (error) {
      session.flash({
        notification: {
          type: "danger",
          message: "No user found with that email"
        }
      });

      return response.redirect("back");
    }
  }
}

module.exports = PasswordResetController;
