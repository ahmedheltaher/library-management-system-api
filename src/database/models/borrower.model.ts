import bcrypt from 'bcrypt';
import { Model, Optional } from 'sequelize';
import { configurations } from '../../core';
import { SequelizeSingleton } from '../server';
import { FieldFactory, IDates, JSONSerializer } from '../utils';

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
	declare id: string;
	declare name: string;
	declare email: string;
	declare password: string;

	comparePassword(password: string): boolean {
		return bcrypt.compareSync(password, this.dataValues.password);
	}

	toJSON() {
		return this.jsonSerializer.toJSON({
			modelInstance: this.dataValues,
			keysToDelete: ['updatedAt'],
			keyAliases: { createdAt: 'registrationDate' },
		});
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
		...FieldFactory.BasicModelConfig({
			sequelize: SequelizeSingleton.getInstance().connectionDetails,
			tableName: 'borrowers',
			timestamps: true,
		}),
		indexes: [{ unique: true, fields: [{ name: 'id' }] }],
	}
);
