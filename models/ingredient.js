'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ingredient.belongsToMany(models.Recipe, { through: 'RecipeIngredients' });
      // Ingredient.hasMany(models.RecipeIngredients);
    }
  }
  Ingredient.init(
    {
      title: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Ingredient',
    }
  );
  return Ingredient;
};
