import { Model, Optional } from 'sequelize';
import { FieldFactory, IDates, JSONSerializer } from '../utils';
import { sequelizeConnection } from '../server';

interface BookAttributes {
	id: string;
	title: string;
	author: string;
	ISBN: string;
	available_quantity: number;
	shelf_location: string;
}
export interface BookInput
	extends Optional<BookAttributes, 'id'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class Book extends Model<BookAttributes, BookInput> implements BookAttributes {
	public id!: string;
	public title!: string;
	public author!: string;
	public ISBN!: string;
	public available_quantity!: number;
	public shelf_location!: string;


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
		available_quantity: FieldFactory.Integer().NotNull().Build(),
		shelf_location: FieldFactory.String().NotNull().Unique().Build(),
	},
	{
		...FieldFactory.BasicModelConfig({ sequelize: sequelizeConnection, tableName: 'books', timestamps: true }),
		indexes: [
			{ unique: true, fields: [{ name: 'id' }] },
			{ unique: true, fields: [{ name: 'ISBN' }] },
		],
	}
);
