
import { CreateOptions, DestroyOptions, FindOptions, Model, Op, UpdateOptions, } from 'sequelize';
import { sequelizeConnection } from '../../server';

type TLanguage = 'EN' | 'AR';

type TranslationEntity<I> = Partial<Record<TLanguage, I>>;

type CreateInput<I extends {}, TI extends {}, M extends Model> = {
	entity: I;
	translationEntities: TranslationEntity<TI>;
	options?: CreateOptions<M>;
};

type UpdateInput<TId, I extends {}, TI extends {}, M extends Model> = {
	id: TId;
	entity: Partial<I>;
	translationEntities?: TranslationEntity<TI>;
	options?: UpdateOptions<M>;
	languagesToRemove?: TLanguage[]; // Array of languages to remove translations for
};

export class BaseRepository<M extends Model, TM extends Model, I extends {}, TI extends {}> {
	m_linkingPropertyName: string;
	constructor(
		private m_model: typeof Model,
		private m_translation_model: typeof Model,
		m_linkingPropertyName: string | null = null
	) {
		this.m_linkingPropertyName =
			m_linkingPropertyName ||
			`${this.m_model.name.replace('Model', '').replace(/^(.)/, ($1) => $1.toLowerCase())}Id`;
	}

	async findAll(options?: FindOptions) {
		// @ts-ignore
		const mainEntities = await this.m_model.findAll(options);

		if (!mainEntities || mainEntities.length === 0) {
			return [];
		}

		// @ts-ignore
		const translations = await this.m_translation_model.findAll({
			where: { [this.m_linkingPropertyName]: { [Op.in]: mainEntities.map((entity) => entity.get('id')) } },
		});

		const result = mainEntities.map((mainEntity) =>
			this.m_formatResult(
				mainEntity,
				translations.filter((translation) => {
					return (
						(translation.dataValues as unknown as any)[this.m_linkingPropertyName] ==
						(mainEntity.dataValues as unknown as any).id
					);
				})
			)
		);
		return result;
	}

	async findOne(options: FindOptions) {
		// @ts-ignore
		const mainEntity = await this.m_model.findOne(options);
		if (!mainEntity) {
			return { found: false };
		}
		// @ts-ignore
		const translations = await this.m_translation_model.findAll({
			where: { [this.m_linkingPropertyName]: mainEntity.get('id') },
		});
		return {
			found: true,
			result: this.m_formatResult(mainEntity, translations),
		};
	}

	async create({ entity, translationEntities, options }: CreateInput<I, TI, M>) {
		const transaction = await sequelizeConnection.transaction();
		try {
			// @ts-ignore
			const mainEntity = await this.m_model.create(entity, options);
			const translations = this.m_constructTranslations(translationEntities, mainEntity);
			// @ts-ignore
			const createdTranslations = await this.m_translation_model.bulkCreate(translations, { transaction });
			await transaction?.commit();
			return this.m_formatResult(mainEntity, createdTranslations);
		} catch (error) {
			await transaction?.rollback();
			throw error;
		}
	}

	private m_constructTranslations(translationEntities: Partial<Record<TLanguage, TI>>, mainEntity: Model<{}, {}>) {
		return Object.keys(translationEntities).map((language) => ({
			language,
			...translationEntities[language as TLanguage],
			[this.m_linkingPropertyName]: mainEntity.get('id'),
		}));
	}

	private m_formatResult(
		mainEntity: Model<{}, {}>,
		translations: Array<Model<{}, {}>>
	): { translations: Record<TLanguage, any> } {
		const formattedTranslation = translations.reduce(
			(obj, item) => {
				const typedItem = item as unknown as { dataValues: { language: TLanguage } };
				return Object.assign(obj, { [typedItem.dataValues.language]: typedItem.dataValues });
			},
			{} as Record<TLanguage, any>
		);
		return {
			...mainEntity.dataValues,
			translations: formattedTranslation,
		};
	}

	async update<TId>({ id, entity, translationEntities, options, languagesToRemove }: UpdateInput<TId, I, TI, M>) {
		const transaction = await sequelizeConnection.transaction();
		try {
			// @ts-ignore
			const existingMainEntity = await this.m_model.findOne({ where: { id }, ...options, transaction });

			if (!existingMainEntity) {
				throw new Error(`No entity with id ${id} found for update.`);
			}
			// Handle removal of translation entities based on language
			if (languagesToRemove && languagesToRemove.length > 0) {
				// @ts-ignore
				await this.m_translation_model.destroy({
					where: { [this.m_linkingPropertyName]: id, language: { [Op.in]: languagesToRemove } },
					transaction,
				});
			}

			await existingMainEntity.update(entity, { transaction });

			if (translationEntities) {

				const translationUpdates = this.m_constructTranslations(translationEntities, existingMainEntity);

				await Promise.all(
					translationUpdates.map(async (translation) => {
						// Check if the translation entity already exists
						// @ts-ignore
						const existingTranslation = await this.m_translation_model.findOne({
							where: {
								[this.m_linkingPropertyName]: (translation as unknown as any)[
									this.m_linkingPropertyName
								],
								language: translation.language,
							},
							transaction,
						});

						if (existingTranslation) {
							await existingTranslation.update(translation, { transaction });
						} else {
							// @ts-ignore
							await this.m_translation_model.create(translation, { transaction });
						}
					})
				);
			}

			await transaction?.commit();
			return await this.findOne({ where: { id } });
		} catch (error) {
			await transaction?.rollback();
			throw error;
		}
	}

	async delete<TId>(id: TId, options?: DestroyOptions<M>): Promise<number> {
		const transaction = await this.m_model.sequelize?.transaction();

		try {
			// @ts-ignore
			await this.m_translation_model.destroy({ where: { [this.m_linkingPropertyName]: id }, transaction });
			// @ts-ignore
			const count = await this.m_model.destroy({ where: { id }, ...options, transaction });

			await transaction?.commit();
			return count;
		} catch (error) {
			await transaction?.rollback();
			throw error;
		}
	}
}
