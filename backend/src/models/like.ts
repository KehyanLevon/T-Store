import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './user';
import Product from './product';

interface LikeAttributes {
  id: string;
  userId: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type LikeCreationAttributes = Optional<
  LikeAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class Like
  extends Model<LikeAttributes, LikeCreationAttributes>
  implements LikeAttributes
{
  public id!: string;
  public userId!: string;
  public productId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Like.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'likes',
    modelName: 'Like',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'productId'],
        name: 'likes_user_product_unique',
      },
      { fields: ['userId'] },
      { fields: ['productId'] },
    ],
  },
);

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Product, { foreignKey: 'productId' });

export default Like;
