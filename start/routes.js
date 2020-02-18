"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", "HomeController.index").as("home");
Route.get("register", "Auth/RegisterController.showRegister");
Route.post("register", "Auth/RegisterController.register").as("register");
Route.post("logout", "Auth/LogoutController.logout").as("logout");
Route.get("login", "Auth/LoginController.showLogin");
Route.post("login", "Auth/LoginController.login").as("login");
Route.get("password/reset", "Auth/PasswordResetController.showLinkRequestForm");
Route.post("password/email", "Auth/PasswordResetController.sendResetLinkEmail");
Route.get(
  "password/reset/:token",
  "Auth/PasswordResetController.showResetForm"
);
Route.post("password/reset", "Auth/PasswordResetController/reset");
Route.group(() => {
  Route.get("/account", "UserController.show").as("settings.account");
  Route.put("/account", "UserController.edit");
  Route.get("/password", "UserController.showPassword").as("settings.password");
  Route.put("/password", "UserController.editPassword");
})
  .prefix("settings")
  .middleware(["auth"]);
Route.resource("podcasts", "PodcastController").except(["index", "show"]);
// .validator(new Map([["podcasts.store"], ["StorePodcast"]]));
Route.get("my-podcast", "UserController.myPodcast").as("myPodcast");
Route.get("/subscriptions", "UserController.subscriptions").as("subscriptions");
Route.group(() => {
  Route.post("/", "SubscriptionController.subscribe").as("subscriptions.store");
  Route.delete("/:id", "SubscriptionController.destroy").as(
    "subscriptions.destroy"
  );
})
  .prefix("subscriptions")
  .middleware(["auth"]);
Route.get("/:slug/episodes/create", "EpisodeController.create")
  .as("episodes.create")
  .middleware(["auth"]);
Route.post("/:slug/episodes", "EpisodeController.store")
  .as("episodes.store")
  .middleware(["auth"]);
Route.post("/:slug/episodes/:id", "EpisodeController.download").as(
  "episodes.download"
);
Route.get("/categories/:slug", "CategoryController.show").as("categories.show");
Route.get("/:slug", "PodcastController.show").as("podcasts.show");
