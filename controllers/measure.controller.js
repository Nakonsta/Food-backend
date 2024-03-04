const Validator = require('fastest-validator');
const models = require('../models');
const constants = require('../utils/constants');

function getAllMeasures(req, res) {
  models.Measure.findAll({
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

async function createMeasure(req, res) {
  const measure = {
    title: req.body.title,
    color: req.body.color,
  };

  const v = new Validator();
  const validationResponse = v.validate(
    measure,
    constants.measureValidationScheme
  );

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    });
  }

  models.Measure.create(measure)
    .then(async (result) => {
      const measureId = result?.dataValues?.id;

      if (measureId) {
        res.status(201).json({
          message: 'Measure created successfully',
          measure: result,
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

async function updateMeasure(req, res) {
  const measureId = req.params.id;

  if (!measureId) return;

  const updatedMeasure = {
    id: measureId,
    title: req.body.title,
    color: req.body.color,
  };

  const v = new Validator();
  const validationResponse = v.validate(
    updatedMeasure,
    constants.measureValidationScheme
  );

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    });
  }

  try {
    const result = await models.Measure.update(updatedMeasure, {
      where: { id: measureId },
    });

    if (result && result[0]) {
      res.status(200).json({
        message: 'Measure updated successfully',
        measure: updatedMeasure,
      });
    } else {
      res.status(404).json({
        message: `Measure with id ${measureId} doesn't exist`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
  }
}

async function deleteMeasure(req, res) {
  const id = req.params.id;

  if (!id) return;

  try {
    await models.Measure.destroy({ where: { id: id } });

    res.status(200).json({
      message: `Measure with id ${id} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
  }
}

module.exports = {
  getAllMeasures,
  createMeasure,
  updateMeasure,
  deleteMeasure,
};
