'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Recipes', 'isPopular');
  },

  async down(queryInterface, Sequelize) {},
};
