import bcrypt from 'bcrypt';
import { Model, Optional } from 'sequelize';
import { FieldFactory, IDates, JSONSerializer } from '../utils';
import { sequelizeConnection } from '../server';
import { configurations } from '../../core';

interface AdminAttributes {
	id: string;
	name: string;
	password: string;
	email: string;
	is_super_admin: boolean;
}
export interface AdminInput
	extends Optional<AdminAttributes, 'id'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class Admin extends Model<AdminAttributes, AdminInput> implements AdminAttributes {
	public id!: string;
	public name!: string;
	public password!: string;
	public email!: string;
	public is_super_admin!: boolean;

	comparePassword(password: string): boolean {
		return bcrypt.compareSync(password, this.dataValues.password);
	}

	toJSON() {
		return this.jsonSerializer.toJSON(this.dataValues, ['createdAt', 'updatedAt']);
	}

	private jsonSerializer = new JSONSerializer<AdminAttributes>();
}

Admin.init(
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
		is_super_admin: FieldFactory.Boolean().DefaultValue(false).Build(),
	},
	{
		...FieldFactory.BasicModelConfig({ sequelize: sequelizeConnection, tableName: 'admins', timestamps: true }),
		indexes: [{ unique: true, fields: [{ name: 'id' }] }],
	}
);
