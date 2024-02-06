const express = require('express');
const recipeController = require('../controllers/recipe.controller');
const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.get('/', checkAuthMiddleware.checkAuth, recipeController.getAllRecipes);
router.get('/:id', checkAuthMiddleware.checkAuth, recipeController.getRecipe);
router.post('/', checkAuthMiddleware.checkAuth, recipeController.createRecipe);
router.patch(
  '/:id',
  checkAuthMiddleware.checkAuth,
  recipeController.updateRecipe
);
router.delete(
  '/:id',
  checkAuthMiddleware.checkAuth,
  recipeController.deleteRecipe
);

module.exports = router;
