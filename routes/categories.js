const express = require('express');
const categoryController = require('../controllers/category.controller');
const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.post(
  '/',
  checkAuthMiddleware.checkAuth,
  categoryController.createCategory
);
router.patch(
  '/:id',
  checkAuthMiddleware.checkAuth,
  categoryController.updateCategory
);
router.delete(
  '/:id',
  checkAuthMiddleware.checkAuth,
  categoryController.deleteCategory
);

module.exports = router;
