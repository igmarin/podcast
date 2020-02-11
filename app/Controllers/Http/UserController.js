"use strict";
const { validateAll } = use("Validator");
const Hash = use("Hash");
class UserController {
  show({ view }) {
    return view.render("users.show");
  }

  showPassword({ view }) {
    return view.render("users.show_password");
  }

  async editPassword({ request, session, response, auth }) {
    const data = request.only([
      "current_password",
      "new_password",
      "new_password_confirmation"
    ]);

    const validation = await validateAll(data, {
      new_password: "required|confirmed",
      current_password: "required"
    });

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept([
          "current_password",
          "new_password",
          "new_password_confirmation"
        ]);

      return response.redirect("back");
    }

    const verifyPassword = await Hash.verify(
      data.current_password,
      auth.user.password
    );

    if (!verifyPassword) {
      session.flash({
        notification: {
          type: "danger",
          message: "Password doesn't match"
        }
      });
      return response.redirect("back");
    }

    auth.user.password = data.new_password;
    await auth.user.save();
    session.flash({
      notification: {
        type: "success",
        message: "Password changed"
      }
    });

    return response.redirect("/");
  }

  async edit({ request, session, response, auth }) {
    const data = request.only(["name", "email"]);

    const validation = await validateAll(data, {
      name: "required",
      email: `required|email|unique:users,email,id,${auth.user.id}`
    });

    if (validation.fails()) {
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    session.flash({
      notification: {
        type: "success",
        message: "User updated"
      }
    });

    auth.user.merge(data);
    await auth.user.save();

    return response.redirect("back");
  }
}

module.exports = UserController;
