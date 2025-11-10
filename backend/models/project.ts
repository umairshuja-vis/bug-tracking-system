import { Model } from 'sequelize';
import { ProjectInterface } from '../types';

export default (sequelize, DataTypes) => {
  class Project extends Model implements ProjectInterface {
    declare id: number;
    declare name: string;
    declare description: string;
    declare logo?: string;
    declare manager_id: number;

    static associate(models) {
      Project.belongsTo(models.User, {
        foreignKey: "manager_id",
        as: "manager",
      });

      Project.belongsToMany(models.User, {
        through: "project_assignments",
        foreignKey: "project_id",
        otherKey: "user_id",
        as: "assigned_team",
      });

      Project.hasMany(models.Bug, {
        foreignKey: "project_id",
        as: "bugs",
      });
    }
  }
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Project",
      tableName: "projects",
      freezeTableName: true,
    }
  );
  return Project;
};
