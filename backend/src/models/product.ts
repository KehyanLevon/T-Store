import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './user';

interface ProductAttributes {
  id: string;
  userId: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  description?: string | null;
  photo?: Buffer | null;
  photoMime?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type ProductCreationAttributes = Optional<
  ProductAttributes,
  | 'id'
  | 'discountPrice'
  | 'description'
  | 'photo'
  | 'photoMime'
  | 'createdAt'
  | 'updatedAt'
>;

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public userId!: string;
  public name!: string;
  public price!: number;
  public discountPrice?: number | null;
  public description?: string | null;
  public photo?: Buffer | null;
  public photoMime?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
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
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    discountPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: 'products',
    modelName: 'Product',
  },
);

Product.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

export default Product;
