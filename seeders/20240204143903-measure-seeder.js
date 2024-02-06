'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Measures', [
      {
        title: 'гр',
      },
      {
        title: 'шт',
      },
      {
        title: 'мл',
      },
      {
        title: 'ст.л.',
      },
      {
        title: 'ч.л.',
      },
      {
        title: 'кг',
      },
      {
        title: 'л',
      },
      {
        title: 'пакетик',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Measures', {}, null);
  },
};
