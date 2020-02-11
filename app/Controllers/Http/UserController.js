"use strict";
const { validateAll } = use("Validator");
class UserController {
  show({ view }) {
    return view.render("users.show");
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
