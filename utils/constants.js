const constants = {
  recipeValidationScheme: {
    title: {
      type: 'string',
      optional: false,
      max: 255,
    },
    imageUrl: {
      type: 'string',
      optional: false,
      max: 255,
    },
    description: {
      type: 'string',
      optional: false,
      max: 3000,
    },
    categoryId: {
      type: 'number',
      optional: false,
    },
    time: {
      type: 'string',
      optional: false,
    },
  },
};

module.exports = constants;
