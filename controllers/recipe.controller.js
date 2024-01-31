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
    include: [models.Tag, models.Category, models.RecipeIngredient],
  });

  res.status(200).json({
    data: rec,
  });

  // models.Recipe.findOne({
  //   where: {
  //     id: id,
  //   },
  //   include: {
  //     model: models.Tag,
  //   },
  // })
  //   .then((result) => {
  //     if (result) {
  //       res.status(200).json(result);
  //     } else {
  //       res.status(500).json({
  //         message: 'Recipe not found',
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(500).json({
  //       message: 'Something went wrong',
  //       error: error,
  //     });
  //   });
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

          if (req.body.ingredientsIds) {
            const ingredientsIds = JSON.parse(req.body.ingredientsIds);

            async function processArray(array) {
              for (const item of array) {
                const ingredient = {
                  recipeId,
                  ingredientId: item.ingredientId,
                  measureId: item.measureId,
                  amount: item.amount,
                };
                await models.RecipeIngredient.create(ingredient, {
                  fields: ['recipeId', 'ingredientId', 'measureId', 'amount'],
                  transaction: t,
                });
              }
            }

            await processArray(ingredientsIds);
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

      // if (recipeId) {
      //   if (req.body.tags) {
      //     const recipeTagsIds = JSON.parse(req.body.tagsIds);
      //     const tag = {
      //       recipeId,
      //       tagId: recipeTagsIds[0],
      //     };
      //     models.RecipeTags.create(tag, {
      //       fields: ['recipeId', 'tagId'],
      //     });
      //   }
      // }
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

function deleteRecipe(req, res) {
  const id = req.params.id;

  models.Recipe.destroy({ where: { id: id } })
    .then((result) => {
      res.status(200).json({
        message: 'Recipe deleted successfully',
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error,
      });
    });
}

module.exports = {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
