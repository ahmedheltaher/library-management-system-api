import bcrypt from 'bcrypt';
import { Model, Optional } from 'sequelize';
import { FieldFactory, IDates, JSONSerializer } from '../utils';
import { sequelizeConnection } from '../server';
import { configurations } from '../../core';
import { Borrowing } from './borrowings.model';
import { Book } from './book.model';

interface BorrowerAttributes {
	id: string;
	name: string;
	email: string;
	password: string;
}
export interface BorrowerInput
	extends Optional<BorrowerAttributes, 'id'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class Borrower extends Model<BorrowerAttributes, BorrowerInput> implements BorrowerAttributes {
	public id!: string;
	public name!: string;
	public email!: string;
	public password!: string;

	comparePassword(password: string): boolean {
		return bcrypt.compareSync(password, this.dataValues.password);
	}

	toJSON() {
		return this.jsonSerializer.toJSON(this.dataValues, ['createdAt', 'updatedAt']);
	}

	private jsonSerializer = new JSONSerializer<BorrowerAttributes>();
}

Borrower.init(
	{
		id: FieldFactory.UUId().Build(),
		name: FieldFactory.String().NotNull().Build(),
		email: FieldFactory.String().NotNull().Unique().Build(),

		password: {
			...FieldFactory.String().NotNull().Build(),
			set(rowPassword: string): void {
				this.setDataValue('password', bcrypt.hashSync(rowPassword, configurations.bcrypt.saltOrRounds));
			},
		},
	},
	{
		...FieldFactory.BasicModelConfig({ sequelize: sequelizeConnection, tableName: 'borrowers', timestamps: true }),
		indexes: [{ unique: true, fields: [{ name: 'id' }] }],
	}
);

Borrower.belongsToMany(Book, {
	through: Borrowing,
	foreignKey: 'borrower_id',
	as: 'books',
	onDelete: 'cascade',
	hooks: true,
});
Book.belongsToMany(Borrower, {
	through: Borrowing,
	foreignKey: 'book_id',
	hooks: true,
	onDelete: 'cascade',
	as: 'borrowers',
});