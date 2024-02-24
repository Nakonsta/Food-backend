const express = require('express');
const ingredientController = require('../controllers/ingredient.controller');
const tagController = require('../controllers/tag.controller');

const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.get(
  '/',
  checkAuthMiddleware.checkAuth,
  ingredientController.getAllingredients
);
router.post(
  '/',
  checkAuthMiddleware.checkAuth,
  ingredientController.createIngredient
);
router.patch(
  '/:id',
  checkAuthMiddleware.checkAuth,
  ingredientController.updateIngredient
);
router.delete(
  '/:id',
  checkAuthMiddleware.checkAuth,
  ingredientController.deleteIngredient
);

module.exports = router;
