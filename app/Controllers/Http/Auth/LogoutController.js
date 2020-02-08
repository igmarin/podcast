"use strict";

class LogoutController {
  async logout({ auth, response, session }) {
    await auth.logout();
    session.flash({
      notification: {
        type: "success",
        message: "See you later!!!!"
      }
    });
    return response.route("home");
  }
}

module.exports = LogoutController;
