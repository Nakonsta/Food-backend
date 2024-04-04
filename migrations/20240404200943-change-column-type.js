'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Recipes', 'isPopular', {
      type: Sequelize.BOOLEAN,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Recipes', 'isPopular', {
      type: Sequelize.STRING,
    });
  },
};
