const { sequelize } = require("./connection");
const User = require("./user");

const db = {};

db.sequelize = sequelize;

db.User = User;

User.init(sequelize);

User.associate(db);

module.exports = db;
