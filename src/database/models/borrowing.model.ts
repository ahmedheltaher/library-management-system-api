import { Model, Optional } from 'sequelize';
import { FieldFactory, IDates, JSONSerializer } from '../utils';
import { sequelizeConnection } from '../server';

interface BorrowingAttributes {
	bookId: string;
	borrowerId: string;
	checkoutDate: Date;
	dueDate: Date;
	returnDate: Date;
}
export interface BorrowingInput
	extends Optional<BorrowingAttributes, 'checkoutDate' | 'returnDate'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class Borrowing extends Model<BorrowingAttributes, BorrowingInput> implements BorrowingAttributes {
	public bookId!: string;
	public borrowerId!: string;
	public checkoutDate!: Date;
	public dueDate!: Date;
	public returnDate!: Date;

	toJSON() {
		return this.jsonSerializer.toJSON(this.dataValues, ['createdAt', 'updatedAt']);
	}

	private jsonSerializer = new JSONSerializer<BorrowingAttributes>();
}

Borrowing.init(
	{
		bookId: FieldFactory.String().NotNull().References({ model: 'books', key: 'id' }).PrimaryKey().Build(),
		borrowerId: FieldFactory.String().NotNull().References({ model: 'borrowers', key: 'id' }).PrimaryKey().Build(),
		checkoutDate: FieldFactory.Date()
			.NotNull()
			.DefaultValue(() => new Date())
			.Build(),
		dueDate: FieldFactory.Date().NotNull().Build(),
		returnDate: FieldFactory.Date().AllowNull().Build(),
	},
	{
		...FieldFactory.BasicModelConfig({ sequelize: sequelizeConnection, tableName: 'borrowings', timestamps: true }),
		indexes: [{ fields: [{ name: 'bookId' }] }, { fields: [{ name: 'borrowerId' }] }],
	}
);
