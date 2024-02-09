import { BookRepository, BookInput, BorrowingRepository } from '../database';

export class BookService {
	constructor(
		private readonly bookRepository: BookRepository,
		private readonly borrowingRepository: BorrowingRepository
	) {}

	async add(createData: BookInput) {
		return await this.bookRepository.create(createData);
	}

	async getAll({ limit, offset }: PaginatedServiceMethod = { limit: -1, offset: 0 }) {
		const options: Record<string, any> = {};
		if (offset) options.offset = offset;
		if (limit && limit > -1) options.limit = limit;

		return await this.bookRepository.findAll(options);
	}

	async getById(id: string) {
		return await this.bookRepository.findOne({ where: { id } });
	}

	async getByISBN(ISBN: string) {
		return await this.bookRepository.findOne({ where: { ISBN } });
	}

	async getByTitle(title: string) {
		return await this.bookRepository.findAll({
			where: { title: { $like: `%${title}%` } },
		});
	}

	async getByAuthor(author: string) {
		return await this.bookRepository.findAll({
			where: { author: { $like: `%${author}%` } },
		});
	}

	async update(id: string, updateData: Partial<BookInput>) {
		return await this.bookRepository.update(updateData, { where: { id } });
	}

	async delete(id: string): Promise<boolean> {
		const deletedBorrowingCount = await this.borrowingRepository.delete({ where: { bookId: id } });
		const result = await this.bookRepository.delete({ where: { id } });
		return !!result;
	}
}
