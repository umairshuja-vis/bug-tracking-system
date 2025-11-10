import { Model } from 'sequelize';
import { UserInterface, UserType } from '../types';
export default ( sequelize, DataTypes ) => {
  class User extends Model implements UserInterface {
    declare id: number;
    declare name: string;
    declare email: string;
    declare phone?: string;
    declare password: string;
    declare user_type: UserType;
    declare access_token: string;
    declare refresh_token: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate( models ) {
      User.hasMany( models.Project, {
        foreignKey: "manager_id",
        as: "projects_managed",
      } ),
        User.belongsToMany( models.Project, {
          through: "project_assignments",
          foreignKey: "user_id",
          otherKey: "project_id",
          as: "assigned_projects",
        } ),
        User.hasMany( models.Bug, {
          foreignKey: "bug_creator",
          as: "created_bugs",
        } ),
        User.hasMany( models.Bug, {
          foreignKey: "bug_assignee",
          as: "assigned_bugs",
        } );
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        unique: true,
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      access_token: {
        type: DataTypes.STRING,
      },
      refresh_token: {
        type: DataTypes.STRING,
      },
      user_type: {
        type: DataTypes.ENUM( "manager", "developer", "qa" ),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      freezeTableName: true
    }
  );
  return User;
};
