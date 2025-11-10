import { Model } from 'sequelize';
import { BugInterface, BugType, BugStatus } from '../types';

export default (sequelize: any, DataTypes: any) => {
  class Bug extends Model implements BugInterface{

    declare id: number;
    declare description: string;
    declare title: string;
    declare screenshot?: string;
    declare type: BugType;
    declare status: BugStatus;
    declare bug_creator: number;
    declare project_id: number;
    declare deadline: Date;
    declare bug_assignee: number;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Bug.belongsTo(models.User, {
        foreignKey: "bug_creator",
        as: "creator",
      }),
      Bug.belongsTo(models.Project, {
        foreignKey: "project_id",
        as: "project",
      }),
      Bug.belongsTo(models.User, {
        foreignKey: "bug_assignee",
        as: "assignee",
      });
    }
  }
  Bug.init(
    {
      
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      screenshot: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("feature", "bug"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("new", "started", "completed", "resolved"),
        allowNull: false,
        defaultValue: "new",
      },
      bug_creator: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      bug_assignee: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Bug",
      tableName: "bugs",
      freezeTableName: true,
    }
  );
  return Bug;
};
