const Validator = require('fastest-validator');
const models = require('../models');
const constants = require('../utils/constants');

function getAllTags(req, res) {
  models.Tag.findAll({
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

async function createTag(req, res) {
  const tag = {
    title: req.body.title,
    color: req.body.color,
  };

  const v = new Validator();
  const validationResponse = v.validate(tag, constants.tagValidationScheme);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    });
  }

  models.Tag.create(tag)
    .then(async (result) => {
      const tagId = result?.dataValues?.id;

      if (tagId) {
        res.status(201).json({
          message: 'Tag created successfully',
          tag: result,
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

async function updateTag(req, res) {
  const tagId = req.params.id;

  if (!tagId) return;

  const updatedTag = {
    id: tagId,
    title: req.body.title,
    color: req.body.color,
  };

  const v = new Validator();
  const validationResponse = v.validate(
    updatedTag,
    constants.tagValidationScheme
  );

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    });
  }

  try {
    const result = await models.Tag.update(updatedTag, {
      where: { id: tagId },
    });

    if (result && result[0]) {
      res.status(200).json({
        message: 'Tag updated successfully',
        tag: updatedTag,
      });
    } else {
      res.status(404).json({
        message: `Tag with id ${tagId} doesn't exist`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
  }
}

async function deleteTag(req, res) {
  const id = req.params.id;

  if (!id) return;

  try {
    await models.Tag.destroy({ where: { id: id } });

    res.status(200).json({
      message: `Tag with id ${id} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
  }
}

module.exports = {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
};
