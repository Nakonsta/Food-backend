'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Categories', 'color', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Tags', 'color', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Categories', 'color');
    await queryInterface.removeColumn('Tags', 'color');
  },
};
