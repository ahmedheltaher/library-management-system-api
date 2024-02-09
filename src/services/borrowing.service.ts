import { BorrowingRepository, BookRepository } from '../database';
import { Book, Borrower } from '../database/models';
import { loggers } from '../core';

type TReturnBook = {
	bookId: string;
	borrowerId: string;
};
type TBorrowABook = {
	bookId: string;
	borrowerId: string;
	dueDate: Date;
};

function isAfterNow(date: Date) {
	return new Date(date).valueOf() > new Date().valueOf();
}

export class BorrowingService {
	constructor(
		private readonly borrowingRepository: BorrowingRepository,
		private readonly bookRepository: BookRepository
	) {}

	async getAll({ limit, offset }: PaginatedServiceMethod = { limit: -1, offset: 0 }) {
		const options: Record<string, any> = {};
		if (offset) options.offset = offset;
		if (limit && limit > -1) options.limit = limit;

		return await this.borrowingRepository.findAll({
			...options,
			include: [
				{ model: Borrower, as: 'borrower', attributes: ['id', 'name'] },
				{ model: Book, as: 'book', attributes: ['id', 'title', 'author', 'ISBN'] },
			],
			attributes: ['checkoutDate', 'dueDate', 'returnDate'],
		});
	}

	async getByBookId(bookId: string) {
		return await this.borrowingRepository.findAll({ where: { bookId } });
	}

	async getByBorrowerId(borrowerId: string) {
		return await this.borrowingRepository.findAll({
			where: { borrowerId },
			include: { model: Book, as: 'book', attributes: ['id', 'title', 'author', 'ISBN'] },
		});
	}

	async getOverDueBorrowings() {
		return await this.borrowingRepository.findAll({
			where: { returnDate: { $eq: null }, dueDate: { $lt: new Date() } },
			include: [
				{ model: Borrower, as: 'borrower', attributes: ['id', 'name'] },
				{ model: Book, as: 'book', attributes: ['id', 'title', 'author', 'ISBN'] },
			],
			attributes: ['checkoutDate', 'dueDate', 'returnDate'],
		});
	}

	async getUserOverDueBorrowings(borrowerId: string) {
		return await this.borrowingRepository.findAll({
			where: { returnDate: { $eq: null }, dueDate: { $lt: new Date() }, borrowerId },
			include: [
				{ model: Borrower, as: 'borrower', attributes: ['id', 'name'] },
				{ model: Book, as: 'book', attributes: ['id', 'title', 'author', 'ISBN'] },
			],
			attributes: ['checkoutDate', 'dueDate', 'returnDate'],
		});
	}

	async borrowABook({ bookId, borrowerId, dueDate }: TBorrowABook) {
		const existingBorrowing = await this.borrowingRepository.findOne({ where: { borrowerId, bookId } });
		if (existingBorrowing) return { status: false, message: 'You are already borrowing a copy of this book.' };

		const book = await this.bookRepository.findOne({ where: { id: bookId } });
		if (!book) return { status: false, message: 'The requested book does not exist or may have been deleted.' };

		if (book.dataValues.availableQuantity <= 0)
			return { status: false, message: 'There are no more copies left to borrow of this book.' };

		if (!isAfterNow(new Date(dueDate))) return { status: false, message: 'The due date must be in the future.' };

		const transaction = await this.bookRepository.startTransaction();
		try {
			await this.borrowingRepository.create({ bookId, borrowerId, dueDate }, { transaction });

			await this.bookRepository.update(
				{ availableQuantity: book.dataValues.availableQuantity - 1 },
				{ where: { id: bookId }, transaction }
			);

			await this.bookRepository.commitTransaction(transaction);
		} catch (error) {
			loggers.database.error(
				`An error occurred while borrowing the book with ID ${bookId} for borrower ${borrowerId}: ${error}`
			);
			await this.bookRepository.rollbackTransaction(transaction);
			return { status: false, message: 'An error occurred while borrowing the book. Please try again later.' };
		}

		return { status: true, message: 'You have successfully borrowed this book.' };
	}

	async returnBook({ bookId, borrowerId }: TReturnBook) {
		const existingBorrowing = await this.borrowingRepository.findOne({
			where: { borrowerId, bookId, returnDate: { $eq: null } },
		});
		console.log('󱓞 ~ BorrowingService ~ returnBook ~ existingBorrowing:', existingBorrowing);
		if (!existingBorrowing) return { status: false, message: 'You have not borrowed this book.' };

		const book = await this.bookRepository.findOne({ where: { id: bookId } });
		if (!book) return { status: false, message: 'The requested book does not exist or may have been deleted.' };

		const transaction = await this.bookRepository.startTransaction();
		try {
			await this.borrowingRepository.update(
				{ returnDate: new Date() },
				{ where: { borrowerId, bookId }, transaction }
			);

			await this.bookRepository.update(
				{ availableQuantity: book.dataValues.availableQuantity + 1 },
				{ where: { id: bookId }, transaction }
			);
			await this.bookRepository.commitTransaction(transaction);
		} catch (error) {
			loggers.database.error(
				`An error occurred while returning the book with ID ${bookId} for borrower ${borrowerId}: ${error}`
			);
			await this.bookRepository.rollbackTransaction(transaction);
			return { status: false, message: 'An error occurred while returning the book. Please try again later.' };
		}

		return { status: true, message: 'You have successfully returned the book.' };
	}
}
