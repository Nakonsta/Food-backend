'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecipeIngredients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RecipeIngredients.belongsTo(models.Recipe);
    }
  }
  RecipeIngredients.init(
    {
      recipeId: DataTypes.INTEGER,
      ingredientId: DataTypes.INTEGER,
      measureId: DataTypes.INTEGER,
      amount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'RecipeIngredients',
    }
  );
  return RecipeIngredients;
};
