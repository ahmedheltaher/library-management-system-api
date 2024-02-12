import bcrypt from 'bcrypt';
import { Model, Optional } from 'sequelize';
import { configurations } from '../../core';
import { sequelizeConnection } from '../server';
import { FieldFactory, IDates, JSONSerializer } from '../utils';

interface LibrarianAttributes {
	id: string;
	name: string;
	password: string;
	email: string;
	isChefLibrarian: boolean;
}
export interface LibrarianInput
	extends Optional<LibrarianAttributes, 'id'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class Librarian extends Model<LibrarianAttributes, LibrarianInput> implements LibrarianAttributes {
	declare id: string;
	declare name: string;
	declare password: string;
	declare email: string;
	declare isChefLibrarian: boolean;

	comparePassword(password: string): boolean {
		return bcrypt.compareSync(password, this.dataValues.password);
	}

	toJSON() {
		return this.jsonSerializer.toJSON({ modelInstance: this.dataValues, keysToDelete: ['createdAt', 'updatedAt'] });
	}

	private jsonSerializer = new JSONSerializer<LibrarianAttributes>();
}

Librarian.init(
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
		isChefLibrarian: FieldFactory.Boolean().DefaultValue(false).Build(),
	},
	{
		...FieldFactory.BasicModelConfig({ sequelize: sequelizeConnection, tableName: 'librarians', timestamps: true }),
		indexes: [{ unique: true, fields: [{ name: 'id' }] }],
	}
);
