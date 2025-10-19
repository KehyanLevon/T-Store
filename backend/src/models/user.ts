import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  birthDate?: Date | null;
  photo?: Buffer | null;
  photoMime?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'birthDate' | 'photo' | 'photoMime' | 'createdAt' | 'updatedAt'
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public passwordHash!: string;
  public birthDate?: Date | null;
  public photo?: Buffer | null;
  public photoMime?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    photo: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
    },
    photoMime: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  },
);

export default User;
