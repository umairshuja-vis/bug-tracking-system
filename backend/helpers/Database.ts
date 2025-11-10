import fs from "fs"
import path from "path"
import config from "config"
import { Sequelize, DataTypes } from "sequelize"

const db: any = {};

const sequelize = new Sequelize(
  (config as any).database.name,
  (config as any).database.username,
  (config as any).database.password,
  {
    sync: { force: false },
    host: (config as any).database.host,
    dialect: (config as any).database.client,
    ssl: true,
    pool: (config as any).database.pool,
    logging: false
  }
)

import UserModel from "../models/user"
import ProjectModel from "../models/project"
import BugModel from "../models/bug"
import ProjectAssignmentModel from "../models/projectassignment"

const models = [
  UserModel,
  ProjectModel,
  BugModel,
  ProjectAssignmentModel
]

models.forEach((modelDefiner) => {
  const model = modelDefiner(sequelize, DataTypes)
  db[model.name] = model
})

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;