import { AbstractDataTypeConstructor, DataTypes, Sequelize } from 'sequelize';
import { ToArrayOfValues, generateUUID } from './helper-functions';

interface SingleFieldFactoryInterface<T = any> {
	type: AbstractDataTypeConstructor;
	allowNull: boolean;
	primaryKey?: boolean;
	foreignKey?: boolean;
	autoIncrement?: boolean;
	references?: ReferencesType;
	defaultValue?: () => T;
}

interface BasicModelConfigInterface {
	sequelize: Sequelize;
	timestamps?: boolean;
	paranoid?: boolean;
	tableName: string;
}

type ReferencesType = {
	model: string;
	key: string;
};

class FieldFactoryBuilder<T = any> {
	DefaultValue(defaultValueCallback: () => T) {
		this.field.defaultValue = defaultValueCallback;
		return this;
	}
	PrimaryKey({ autoIncrement }: { autoIncrement?: boolean }) {
		this.field.primaryKey = true;
		if (autoIncrement) this.field.autoIncrement = autoIncrement;
		return this;
	}

	private field: SingleFieldFactoryInterface<T> = {
		type: DataTypes.STRING,
		allowNull: false,
	};

	private constructor(type: AbstractDataTypeConstructor) {
		this.field.type = type;
	}

	static create<T>(type: AbstractDataTypeConstructor): FieldFactoryBuilder<T> {
		return new FieldFactoryBuilder<T>(type);
	}

	AllowNull(allowNull: boolean = true): this {
		this.field.allowNull = allowNull;
		return this;
	}

	References({ model, key }: ReferencesType) {
		this.field.references = { model, key };
		return this;
	}

	Build(): SingleFieldFactoryInterface<T> {
		return { ...this.field };
	}
}

export class FieldFactory {
	static BasicModelConfig({
		sequelize,
		tableName,
		timestamps = true,
		paranoid = true,
	}: BasicModelConfigInterface): BasicModelConfigInterface {
		return { sequelize, timestamps, paranoid, tableName };
	}

	static Id() {
		return FieldFactoryBuilder.create<number>(DataTypes.INTEGER).PrimaryKey({ autoIncrement: true });
	}
	static UUId() {
		return FieldFactoryBuilder.create<string>(DataTypes.STRING)
			.PrimaryKey({})
			.DefaultValue(generateUUID);
	}

	static Enum<T extends Record<string, any>>(targetedEnum: T) {
		return FieldFactoryBuilder.create<T[]>(
			DataTypes.ENUM(...ToArrayOfValues(targetedEnum)) as unknown as AbstractDataTypeConstructor
		);
	}

	static String() {
		return FieldFactoryBuilder.create<string>(DataTypes.STRING);
	}

	static Text() {
		return FieldFactoryBuilder.create<string>(DataTypes.TEXT);
	}

	static Boolean() {
		return FieldFactoryBuilder.create<boolean>(DataTypes.BOOLEAN);
	}

	static Integer() {
		return FieldFactoryBuilder.create<number>(DataTypes.INTEGER);
	}

	static Decimal() {
		return FieldFactoryBuilder.create<number>(DataTypes.DECIMAL);
	}

	static Date() {
		return FieldFactoryBuilder.create<Date>(DataTypes.DATE);
	}

	static Time() {
		return FieldFactoryBuilder.create<string>(DataTypes.TIME);
	}
}
