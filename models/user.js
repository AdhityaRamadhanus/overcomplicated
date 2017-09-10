'use strict'

'use strict'

module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define("User", {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  })

  return Todo
}
