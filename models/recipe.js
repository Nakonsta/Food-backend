'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recipe.belongsToMany(models.Tag, { through: 'RecipeTags' });
      Recipe.belongsToMany(models.Ingredient, { through: 'RecipeIngredients' });
      Recipe.belongsTo(models.Category);
      Recipe.hasMany(models.RecipeSteps);
      Recipe.hasMany(sequelize.define('RecipeIngredients'));
    }
  }
  Recipe.init(
    {
      title: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      time: DataTypes.STRING,
      isPopular: DataTypes.STRING,
      portions: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Recipe',
    }
  );
  return Recipe;
};
