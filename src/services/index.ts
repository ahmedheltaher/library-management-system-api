import { BookRepository, BorrowerRepository, BorrowingRepository, LibrarianRepository } from '../database';
import { BookService } from './books.service';
import { BorrowerService } from './borrower.service';
import { BorrowingService } from './borrowing.service';
import { LibrarianService } from './librarian.service';

export async function GetServices() {
	const bookRepository = new BookRepository();
	const borrowerRepository = new BorrowerRepository();
	const borrowingRepository = new BorrowingRepository();

	const bookService = new BookService(bookRepository, borrowingRepository);
	const borrowerService = new BorrowerService(borrowerRepository);
	const borrowingService = new BorrowingService(borrowingRepository, bookRepository, borrowerRepository);
	const librarianService = new LibrarianService(new LibrarianRepository());

	return { bookService, borrowerService, borrowingService, librarianService } as const;
}
