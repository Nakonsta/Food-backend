const express = require('express');
const measureController = require('../controllers/measure.controller');
const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.get('/', measureController.getAllMeasures);
router.post(
  '/',
  checkAuthMiddleware.checkAuth,
  measureController.createMeasure
);
router.patch(
  '/:id',
  checkAuthMiddleware.checkAuth,
  measureController.updateMeasure
);
router.delete(
  '/:id',
  checkAuthMiddleware.checkAuth,
  measureController.deleteMeasure
);

module.exports = router;
