'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Recipes', 'isPopular', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Recipes', 'portions', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Recipes', 'isPopular');
    await queryInterface.removeColumn('Recipes', 'portions');
  },
};
