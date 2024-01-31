'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecipeStep extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RecipeStep.init({
    recipeId: DataTypes.INTEGER,
    stepId: DataTypes.INTEGER,
    stepNumber: DataTypes.INTEGER,
    stepText: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'RecipeStep',
  });
  return RecipeStep;
};