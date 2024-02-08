import { Model, ModelStatic, FindOptions, UpdateOptions, DestroyOptions } from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';

type CreationAttributes<M extends Model> = MakeNullishOptional<M['_creationAttributes']>;

interface BaseRepositoryInterface<M extends Model, I extends CreationAttributes<M>> {
	findAll(options?: FindOptions): Promise<Array<M>>;
	findOne(options: FindOptions): Promise<M | null>;
	create(entity: I): Promise<M>;
	bulkCreate(entities: Array<I>): Promise<Array<M>>;
	update(entity: Partial<I>, options?: UpdateOptions<M>): Promise<[affectedCount: number, affectedRows: Array<M>]>;
	delete(options?: DestroyOptions<M>): Promise<number>;
}

export class BaseRepository<M extends Model, I extends CreationAttributes<M>> implements BaseRepositoryInterface<M, I> {
	constructor(private model: ModelStatic<M>) {}

	public async findAll(options?: FindOptions<M>): Promise<Array<M>> {
		return this.model.findAll(options);
	}

	public async findOne(options: FindOptions<M>): Promise<M | null> {
		return await this.model.findOne(options);
	}

	public async create(entity: I): Promise<M> {
		return this.model.create(entity);
	}

	public async bulkCreate(entities: Array<I>): Promise<Array<M>> {
		return this.model.bulkCreate(entities);
	}
	public async update(
		entity: Partial<I>,
		options: UpdateOptions<M> = { where: {} }
	): Promise<[affectedCount: number, affectedRows: Array<M>]> {
		return await this.model.update(entity, { ...options, returning: true });
	}

	public async delete(options?: DestroyOptions<M>): Promise<number> {
		return await this.model.destroy(options);
	}
}
