'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecipeSteps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RecipeSteps.belongsTo(models.Recipe);
    }
  }
  RecipeSteps.init(
    {
      recipeId: DataTypes.INTEGER,
      stepId: DataTypes.INTEGER,
      stepNumber: DataTypes.INTEGER,
      stepText: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'RecipeSteps',
    }
  );
  return RecipeSteps;
};
