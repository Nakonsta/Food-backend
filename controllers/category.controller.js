const Validator = require('fastest-validator');
const models = require('../models');
const constants = require('../utils/constants');

function getAllCategories(req, res) {
  models.Category.findAll({
    fields: ['id', 'title', 'color'],
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

async function createCategory(req, res) {
  const category = {
    title: req.body.title,
    color: req.body.color,
  };

  const v = new Validator();
  const validationResponse = v.validate(
    category,
    constants.categoryValidationScheme
  );

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    });
  }

  models.Category.create(category)
    .then(async (result) => {
      const categoryId = result?.dataValues?.id;

      if (categoryId) {
        res.status(201).json({
          message: 'Category created successfully',
          category: result,
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

async function updateCategory(req, res) {
  const categoryId = req.params.id;

  if (!categoryId) return;

  const updatedCategory = {
    id: categoryId,
    title: req.body.title,
    color: req.body.color,
  };

  const v = new Validator();
  const validationResponse = v.validate(
    updatedCategory,
    constants.categoryValidationScheme
  );

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    });
  }

  try {
    const result = await models.Category.update(updatedCategory, {
      where: { id: categoryId },
    });

    if (result && result[0]) {
      res.status(200).json({
        message: 'Category updated successfully',
        category: updatedCategory,
      });
    } else {
      res.status(404).json({
        message: `Category with id ${categoryId} doesn't exist`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
  }
}

async function deleteCategory(req, res) {
  const id = req.params.id;

  if (!id) return;

  try {
    await models.Category.destroy({ where: { id: id } });

    res.status(200).json({
      message: `Category with id ${id} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
