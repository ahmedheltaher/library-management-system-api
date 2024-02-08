import { Model, Optional } from 'sequelize';
import { FieldFactory, IDates, JSONSerializer } from '../utils';
import { sequelizeConnection } from '../server';

interface BorrowingAttributes {
	book_id: string;
	borrower_id: string;
	checkout_date: Date;
	due_date: Date;
	return_date: Date;
}
export interface BorrowingInput
	extends Optional<BorrowingAttributes, 'checkout_date' | 'return_date'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class Borrowing extends Model<BorrowingAttributes, BorrowingInput> implements BorrowingAttributes {
	public book_id!: string;
	public borrower_id!: string;
	public checkout_date!: Date;
	public due_date!: Date;
	public return_date!: Date;

	toJSON() {
		return this.jsonSerializer.toJSON(this.dataValues, ['createdAt', 'updatedAt']);
	}

	private jsonSerializer = new JSONSerializer<BorrowingAttributes>();
}

Borrowing.init(
	{
		book_id: FieldFactory.String().NotNull().References({ model: 'books', key: 'id' }).PrimaryKey().Build(),
		borrower_id: FieldFactory.String().NotNull().References({ model: 'borrowers', key: 'id' }).PrimaryKey().Build(),
		checkout_date: FieldFactory.Date()
			.NotNull()
			.DefaultValue(() => new Date())
			.Build(),
		due_date: FieldFactory.Date().NotNull().Build(),
		return_date: FieldFactory.Date().AllowNull().Build(),
	},
	{
		...FieldFactory.BasicModelConfig({ sequelize: sequelizeConnection, tableName: 'borrowings', timestamps: true }),
		indexes: [
			{ unique: true, fields: [{ name: 'book_id' }] },
			{ unique: true, fields: [{ name: 'borrower_id' }] },
		],
	}
);
