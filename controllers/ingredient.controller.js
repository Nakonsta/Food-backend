const Validator = require('fastest-validator');
const models = require('../models');
const constants = require('../utils/constants');

function getAllingredients(req, res) {
  models.Ingredient.findAll({
    fields: ['id', 'title', 'color', 'image'],
  })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error,
      });
    });
}

async function createIngredient(req, res) {
  const ingredient = {
    title: req.body.title,
    color: req.body.color,
    image: req.body.image,
  };

  const v = new Validator();
  const validationResponse = v.validate(
    ingredient,
    constants.ingredientValidationScheme
  );

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    });
  }

  models.Ingredient.create(ingredient)
    .then(async (result) => {
      const ingredientId = result?.dataValues?.id;

      if (ingredientId) {
        res.status(201).json({
          message: 'Ingredient created successfully',
          ingredient: result,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error,
      });
    });
}

async function updateIngredient(req, res) {
  const ingredientId = req.params.id;

  if (!ingredientId) return;

  const updatedIngredient = {
    id: ingredientId,
    title: req.body.title,
    color: req.body.color,
    image: req.body.image,
  };

  const v = new Validator();
  const validationResponse = v.validate(
    updatedIngredient,
    constants.ingredientValidationScheme
  );

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    });
  }

  try {
    const result = await models.Ingredient.update(updatedIngredient, {
      where: { id: ingredientId },
    });

    if (result && result[0]) {
      res.status(200).json({
        message: 'Ingredient updated successfully',
        ingredient: updatedIngredient,
      });
    } else {
      res.status(404).json({
        message: `Ingredient with id ${ingredientId} doesn't exist`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
  }
}

async function deleteIngredient(req, res) {
  const id = req.params.id;

  if (!id) return;

  try {
    await models.Ingredient.destroy({ where: { id: id } });

    res.status(200).json({
      message: `Ingredient with id ${id} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
  }
}

module.exports = {
  getAllingredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
