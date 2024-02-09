import { BookRepository, BorrowerRepository, BorrowingRepository } from '../database';
import { BookService } from './books.service';
import { BorrowerService } from './borrower.service';

export async function GetServices() {
	const bookService = new BookService(new BookRepository(), new BorrowingRepository());
	const borrowerService = new BorrowerService(new BorrowerRepository());

	return { bookService, borrowerService } as const;
}


