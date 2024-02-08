import { BorrowingRepository, BorrowingInput, BookRepository } from '../database';

export class BorrowingService {
	constructor(
		private readonly borrowingRepository: BorrowingRepository,
		private readonly bookRepository: BookRepository
	) {}

	async register(createData: BorrowingInput) {
		return await this.borrowingRepository.create(createData);
	}

	async login(email: string, password: string) {}

	async getAll() {
		return await this.borrowingRepository.findAll();
	}

	async getByBookId(bookId: string) {
		return await this.borrowingRepository.findAll({ where: { bookId } });
	}

	async getByBorrowerId(borrowerId: string) {
		return await this.borrowingRepository.findAll({ where: { borrowerId } });
	}

	async Return(bookId: string, borrowerId: string) {
		const result = await this.borrowingRepository.delete({ where: { borrowerId, bookId } });
		if (result <= 0) return false;
		const book = await this.bookRepository.findOne({ where: { id: bookId } });
		if (!book) return false;
		const [affectedCount,] = await this.bookRepository.update(
			{ availableQuantity: book.dataValues.availableQuantity + 1 },
			{ where: { id: bookId } }
		);
		return affectedCount > 0;
	}
}
