import { loggers } from '../core';
import { BookRepository, BorrowerRepository, BorrowingRepository, DBOperators, transactionManager } from '../database';
import { Book, Borrower } from '../database/models';

type TReturnBook = {
	bookId: string;
	borrowerId: string;
};
type TBorrowABook = {
	bookId: string;
	borrowerId: string;
	dueDate: Date;
};

type TReportStatus = {
	startDate: Date;
	endDate: Date;
	onlyOverDue?: boolean;
};

function isAfterNow(date: Date) {
	return new Date(date).valueOf() > new Date().valueOf();
}

type TBorrowingProcessLastNDays = {
	days: number;
	onlyOverDue?: boolean;
};

export class BorrowingService {
	constructor(
		private readonly borrowingRepository: BorrowingRepository,
		private readonly bookRepository: BookRepository,
		private readonly borrowerRepository: BorrowerRepository
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

	async getByBorrowerId(borrowerId: string) {
		return await this.borrowingRepository.findAll({
			where: { borrowerId },
			include: { model: Book, as: 'book', attributes: ['id', 'title', 'author', 'ISBN'] },
		});
	}

	async getOverDueBorrowings() {
		return await this.borrowingRepository.findAll({
			where: { returnDate: { [DBOperators.is]: null }, dueDate: { [DBOperators.lt]: new Date() } },
			include: [
				{ model: Borrower, as: 'borrower', attributes: ['id', 'name'] },
				{ model: Book, as: 'book', attributes: ['id', 'title', 'author', 'ISBN'] },
			],
			attributes: ['checkoutDate', 'dueDate', 'returnDate'],
		});
	}

	async getUserOverDueBorrowings(borrowerId: string) {
		return await this.borrowingRepository.findAll({
			where: { returnDate: { [DBOperators.is]: null }, dueDate: { [DBOperators.lt]: new Date() }, borrowerId },
			include: [
				{ model: Borrower, as: 'borrower', attributes: ['id', 'name'] },
				{ model: Book, as: 'book', attributes: ['id', 'title', 'author', 'ISBN'] },
			],
			attributes: ['checkoutDate', 'dueDate', 'returnDate'],
		});
	}

	async borrowABook({ bookId, borrowerId, dueDate }: TBorrowABook) {
		const borrower = await this.borrowerRepository.findOne({ where: { id: borrowerId } });
		if (!borrower) return { status: false, message: 'This user is not allowed to borrow a book.' };

		const existingBorrowing = await this.borrowingRepository.findOne({ where: { borrowerId, bookId } });
		if (existingBorrowing) return { status: false, message: 'You are already borrowing a copy of this book.' };

		const book = await this.bookRepository.findOne({ where: { id: bookId } });
		if (!book) return { status: false, message: 'The requested book does not exist or may have been deleted.' };

		if (!book.isBorrowable())
			return { status: false, message: 'There are no more copies left to borrow of this book.' };

		if (!isAfterNow(new Date(dueDate))) return { status: false, message: 'The due date must be in the future.' };

		const transaction = await transactionManager.startTransaction();
		try {
			await this.borrowingRepository.create({ bookId, borrowerId, dueDate }, { transaction });
			const isBorrowed = await book.borrow(transaction);
			if (!isBorrowed) throw new Error("Can't Borrow this book no more copies left");

			await transactionManager.commitTransaction(transaction);
		} catch (error) {
			loggers.database.error(
				`An error occurred while borrowing the book with ID ${bookId} for borrower ${borrowerId}: ${error}`
			);
			await transactionManager.rollbackTransaction(transaction);
			return { status: false, message: 'An error occurred while borrowing the book. Please try again later.' };
		}

		return { status: true, message: 'You have successfully borrowed this book.' };
	}

	async returnBook({ bookId, borrowerId }: TReturnBook) {
		const existingBorrowing = await this.borrowingRepository.findOne({
			where: { borrowerId, bookId, returnDate: { [DBOperators.is]: null } },
		});
		if (!existingBorrowing) return { status: false, message: 'You have not borrowed this book.' };

		const book = await this.bookRepository.findOne({ where: { id: bookId } });
		if (!book) return { status: false, message: 'The requested book does not exist or may have been deleted.' };

		const transaction = await transactionManager.startTransaction();
		try {
			await existingBorrowing.return(transaction);
			await book.return(transaction);

			await transactionManager.commitTransaction(transaction);
		} catch (error) {
			loggers.database.error(
				`An error occurred while returning the book with ID ${bookId} for borrower ${borrowerId}: ${error}`
			);
			await transactionManager.rollbackTransaction(transaction);
			return { status: false, message: 'An error occurred while returning the book. Please try again later.' };
		}

		return { status: true, message: 'You have successfully returned the book.' };
	}

	async reportStatus({ startDate, endDate, onlyOverDue }: TReportStatus) {
		return await this.borrowingRepository.findAll({
			include: [
				{ model: Borrower, as: 'borrower', attributes: ['id', 'name'] },
				{ model: Book, as: 'book', attributes: ['id', 'title', 'author', 'ISBN'] },
			],
			attributes: ['checkoutDate', 'dueDate', 'returnDate'],
			where: {
				checkoutDate: { [DBOperators.and]: { [DBOperators.gte]: startDate, [DBOperators.lte]: endDate } },
				...(onlyOverDue && {
					returnDate: { [DBOperators.is]: null },
					dueDate: { [DBOperators.lt]: new Date() },
				}),
			},
		});
	}

	async borrowingProcessesLastNDays({ days, onlyOverDue = false }: TBorrowingProcessLastNDays) {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);
		return await this.reportStatus({ startDate, endDate, onlyOverDue });
	}
}
