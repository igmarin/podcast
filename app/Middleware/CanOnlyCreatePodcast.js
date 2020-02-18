"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CanOnlyCreatePodcast {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, auth, session }, next) {
    const userPodcast = await auth.user.podcast().fetch();

    if (userPodcast) {
      session.flash({
        notification: {
          type: "danger",
          message: "You already have a podcast"
        }
      });

      return response.redirect("/myPodcast");
    } else {
      await next();
    }
  }
}

module.exports = CanOnlyCreatePodcast;
