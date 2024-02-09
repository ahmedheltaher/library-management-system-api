import { BookRepository, BorrowerRepository, BorrowingRepository } from '../database';
import { BookService } from './books.service';
import { BorrowerService } from './borrower.service';
import { BorrowingService } from './borrowing.service';

export async function GetServices() {
	const bookRepository = new BookRepository();

	const bookService = new BookService(bookRepository, new BorrowingRepository());
	const borrowerService = new BorrowerService(new BorrowerRepository());
	const borrowingService = new BorrowingService(new BorrowingRepository(), bookRepository);

	return { bookService, borrowerService, borrowingService } as const;
}
