const { sequelize } = require('../models/index');
const models = require('../models');

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

  const rec = await models.Recipe.findByPk(id, {
    include: [models.Tag, models.Category, models.RecipeIngredients],
  });

  res.status(200).json({
    data: rec,
  });
}

async function createRecipe(req, res) {
  const recipe = {
    title: req.body.title,
    imageUrl: req.body.image_url,
    categoryId: req.body.category_id,
    description: req.body.description,
    time: req.body.time,
  };

  models.Recipe.create(recipe)
    .then(async (result) => {
      const recipe = {};
      const recipeId = result?.dataValues?.id;

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
            console.log(steps);
            async function processArray(array) {
              for (const item of array) {
                const step = {
                  recipeId,
                  stepNumber: item.stepNumber,
                  stepText: item.description,
                };
                console.log('step', step);
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

function updateRecipe(req, res) {
  const id = req.params.id;

  const updatedRecipe = {
    title: req.body.title,
    imageUrl: req.body.image_url,
    categoryId: req.body.category_id,
    description: req.body.description,
    time: req.body.time,
  };

  models.Recipe.update(updatedRecipe, {
    where: { id: id },
  })
    .then((result) => {
      res.status(200).json({
        message: 'Recipe updated successfully',
        recipe: updatedRecipe,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error,
      });
    });
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
