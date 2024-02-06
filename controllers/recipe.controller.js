const Validator = require('fastest-validator');
const { sequelize } = require('../models/index');
const models = require('../models');
const constants = require('../utils/constants');

function getAllRecipes(req, res) {
  models.Recipe.findAll()
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

async function getRecipe(req, res) {
  const id = req.params.id;

  try {
    const result = await models.Recipe.findByPk(id, {
      include: [
        models.RecipeIngredients,
        models.RecipeSteps,
        models.Tag,
        models.Category,
      ],
    });

    if (result) {
      res.status(200).json({
        data: result,
      });
    } else {
      res.status(404).json({
        message: `Recipe with id ${id} doesn't exist`,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
}

async function createRecipe(req, res) {
  const recipe = {
    title: req.body.title,
    imageUrl: req.body.image_url,
    categoryId: req.body.category_id,
    description: req.body.description,
    time: req.body.time,
  };

  const v = new Validator();
  const validationResponse = v.validate(
    recipe,
    constants.recipeValidationScheme
  );

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    });
  }

  const category = await models.Category.findByPk(req.body.category_id);

  if (!category) {
    return res.status(400).json({
      message: 'Please, choose the existing category',
    });
  }

  models.Recipe.create(recipe)
    .then(async (result) => {
      const recipe = {};
      const recipeId = result?.dataValues?.id;

      console.log('recipeId', recipeId);

      if (recipeId) {
        const t = await sequelize.transaction();

        try {
          if (req.body.tagsIds) {
            const recipeTagsIds = JSON.parse(req.body.tagsIds);

            async function processArray(array) {
              for (const item of array) {
                const tag = {
                  recipeId,
                  tagId: item,
                };
                await models.RecipeTags.create(tag, {
                  fields: ['recipeId', 'tagId'],
                  transaction: t,
                });
              }
            }

            await processArray(recipeTagsIds);
          }

          if (req.body.ingredients) {
            const ingredients = JSON.parse(req.body.ingredients);

            async function processArray(array) {
              for (const item of array) {
                const ingredient = {
                  recipeId,
                  ingredientId: item.ingredientId,
                  measureId: item.measureId,
                  amount: item.amount,
                };
                await models.RecipeIngredients.create(ingredient, {
                  fields: ['recipeId', 'ingredientId', 'measureId', 'amount'],
                  transaction: t,
                });
              }
            }

            await processArray(ingredients);
          }

          if (req.body.steps) {
            const steps = JSON.parse(req.body.steps);

            async function processArray(array) {
              for (const item of array) {
                const step = {
                  recipeId,
                  stepNumber: item.stepNumber,
                  stepText: item.description,
                };
                await models.RecipeSteps.create(step, {
                  fields: ['recipeId', 'stepNumber', 'stepText'],
                  transaction: t,
                });
              }
            }

            await processArray(steps);
          }

          res.status(201).json({
            message: 'Recipe created successfully',
            recipe: result,
          });

          await t.commit();
        } catch (err) {
          console.log('err', err);
          await t.rollback();
        }
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error,
      });
    });
}

async function updateRecipe(req, res) {
  const recipeId = req.params.id;

  if (!recipeId) return;

  const updatedRecipe = {
    title: req.body.title,
    imageUrl: req.body.image_url,
    categoryId: req.body.category_id,
    description: req.body.description,
    time: req.body.time,
  };

  const v = new Validator();
  const validationResponse = v.validate(
    updatedRecipe,
    constants.recipeValidationScheme
  );

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    });
  }

  const category = await models.Category.findByPk(req.body.category_id);

  if (!category) {
    return res.status(400).json({
      message: 'Please, choose the existing category',
    });
  }

  const t = await sequelize.transaction();

  try {
    const result = await models.Recipe.update(updatedRecipe, {
      where: { id: recipeId },
      transaction: t,
    });

    if (result && result[0]) {
      if (req.body.tagsIds) {
        const recipeTagsIds = JSON.parse(req.body.tagsIds);

        if (recipeTagsIds?.length) {
          await models.RecipeTags.destroy({
            where: { recipeId },
            transaction: t,
          });

          async function processArray(array) {
            for (const item of array) {
              const tag = {
                recipeId,
                tagId: item,
              };
              await models.RecipeTags.create(tag, {
                fields: ['recipeId', 'tagId'],
                transaction: t,
              });
            }
          }

          await processArray(recipeTagsIds);
        }
      }

      if (req.body.ingredients) {
        const ingredients = JSON.parse(req.body.ingredients);

        if (ingredients?.length) {
          await models.RecipeIngredients.destroy({
            where: { recipeId },
            transaction: t,
          });

          async function processArray(array) {
            for (const item of array) {
              const ingredient = {
                recipeId,
                ingredientId: item.ingredientId,
                measureId: item.measureId,
                amount: item.amount,
              };
              await models.RecipeIngredients.create(ingredient, {
                fields: ['recipeId', 'ingredientId', 'measureId', 'amount'],
                transaction: t,
              });
            }
          }

          await processArray(ingredients);
        }
      }

      if (req.body.steps) {
        const steps = JSON.parse(req.body.steps);

        if (steps?.length) {
          await models.RecipeSteps.destroy({
            where: { recipeId },
            transaction: t,
          });

          async function processArray(array) {
            for (const item of array) {
              const step = {
                recipeId,
                stepNumber: item.stepNumber,
                stepText: item.description,
              };
              await models.RecipeSteps.create(step, {
                fields: ['recipeId', 'stepNumber', 'stepText'],
                transaction: t,
              });
            }
          }

          await processArray(steps);
        }
      }

      res.status(200).json({
        message: 'Recipe updated successfully',
        recipe: updatedRecipe,
      });
    } else {
      res.status(404).json({
        message: `Recipe with id ${recipeId} doesn't exist`,
      });
    }

    await t.commit();
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
    await t.rollback();
  }
}

async function deleteRecipe(req, res) {
  const id = req.params.id;

  if (!id) return;

  const t = await sequelize.transaction();

  try {
    await models.Recipe.destroy({ where: { id: id }, transaction: t });
    await models.RecipeTags.destroy({
      where: { recipeId: id },
      transaction: t,
    });
    await models.RecipeIngredients.destroy({
      where: { recipeId: id },
      transaction: t,
    });
    await models.RecipeSteps.destroy({
      where: { recipeId: id },
      transaction: t,
    });

    res.status(200).json({
      message: `Recipe with id ${id} deleted successfully`,
    });

    await t.commit();
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
    await t.rollback();
  }
}

module.exports = {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
