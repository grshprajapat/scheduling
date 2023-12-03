'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.DATE
      },
      url: {
        type: Sequelize.STRING
      },
      requestBody: {
        type: Sequelize.TEXT
      },
      headers: {
        type: Sequelize.TEXT
      },
      retryCount: {
        type: Sequelize.INTEGER
      },
      maxRetries: {
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
    });

   
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tasks');
  }
};