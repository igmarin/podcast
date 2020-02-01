"use strict";

/*
|--------------------------------------------------------------------------
| CategorySeeder
|--------------------------------------------------------------------------
*/

const Category = use("App/Models/Category");

class CategorySeeder {
  async run() {
    const categories = [
      {
        name: "La Media Inglesa",
        slug: "la-media-inglesa",
        description: "Ostias La Media, wooooo! Me encantan"
      },
      {
        name: "Statsbomb Podcast",
        slug: "statsbomb-podcast",
        description: "Una joya de podcasts"
      },
      {
        name: "El club de los 21",
        slug: "el-club-de-los-21",
        description: "Quejosos pero buen podcast"
      }
    ];

    await Category.createMany(categories);
  }
}

module.exports = CategorySeeder;
