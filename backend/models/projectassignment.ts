import { Model } from 'sequelize';
import { ProjectAssignmentInterface } from '../types';

export default (sequelize, DataTypes) => {
  class ProjectAssignment extends Model implements ProjectAssignmentInterface {
    declare project_id: number;
    declare user_id: number;
    declare type: 'developer' | 'qa'

    static associate(models) {
      ProjectAssignment.belongsTo(models.Project, {
        foreignKey: "project_id",
        as: "project",
      });
    }
  }
  ProjectAssignment.init(
    {
      project_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("developer", "qa"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProjectAssignment",
      tableName: "project_assignments",
      freezeTableName: true,
      timestamps: true,
    }
  );
  return ProjectAssignment;
};
