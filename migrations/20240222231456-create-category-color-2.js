'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Categories', 'color', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Tags', 'color', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {},
};
