'use strict'

module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define("Todo", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    details: {
      type: DataTypes.STRING,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    due_date: {
      type: DataTypes.DATE
    }
  })

  Todo.associate = (models) => {
    Todo.belongsTo(models['User'], {foreignKey: 'userId'})
  }

  return Todo
}
