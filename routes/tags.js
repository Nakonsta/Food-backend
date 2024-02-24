const express = require('express');
const tagController = require('../controllers/tag.controller');
const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.get('/', checkAuthMiddleware.checkAuth, tagController.getAllTags);
router.post('/', checkAuthMiddleware.checkAuth, tagController.createTag);
router.patch('/:id', checkAuthMiddleware.checkAuth, tagController.updateTag);
router.delete('/:id', checkAuthMiddleware.checkAuth, tagController.deleteTag);

module.exports = router;
