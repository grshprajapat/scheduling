const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define(
    'Task',
    {
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      requestBody: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      headers: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      retryCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      maxRetries: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false, // Add createdAt and updatedAt fields
    }
  );

  Task.associate = (models) => {
    Task.belongsTo(models.User);
  };

  return Task;
};
