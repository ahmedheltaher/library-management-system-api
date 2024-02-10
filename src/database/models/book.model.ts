import { Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../server';
import { FieldFactory, IDates, JSONSerializer } from '../utils';

interface BookAttributes {
	id: string;
	title: string;
	author: string;
	ISBN: string;
	availableQuantity: number;
	shelfLocation: string;
}
export interface BookInput
	extends Optional<BookAttributes, 'id'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class Book extends Model<BookAttributes, BookInput> implements BookAttributes {
	declare id: string;
	declare title: string;
	declare author: string;
	declare ISBN: string;
	declare availableQuantity: number;
	declare shelfLocation: string;

	toJSON() {
		return this.jsonSerializer.toJSON(this.dataValues, ['createdAt', 'updatedAt']);
	}

	private jsonSerializer = new JSONSerializer<BookAttributes>();
}

Book.init(
	{
		id: FieldFactory.UUId().Build(),
		title: FieldFactory.String().NotNull().Build(),
		author: FieldFactory.String().NotNull().Build(),
		ISBN: FieldFactory.String().NotNull().Unique().Build(),
		availableQuantity: FieldFactory.Integer().NotNull().Build(),
		shelfLocation: FieldFactory.String().NotNull().Build(),
	},
	{
		...FieldFactory.BasicModelConfig({ sequelize: sequelizeConnection, tableName: 'books', timestamps: true }),
		indexes: [
			{ unique: true, fields: [{ name: 'id' }] },
			{ unique: true, fields: [{ name: 'ISBN' }] },
		],
	}
);
