import { BookRepository, BookInput, BorrowingRepository } from '../database';

export class BookService {
	constructor(
		private readonly bookRepository: BookRepository,
		private readonly borrowingRepository: BorrowingRepository
	) {}

	async add(createData: BookInput) {
		return await this.bookRepository.create(createData);
	}

	async getAll() {
		return await this.bookRepository.findAll({});
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
