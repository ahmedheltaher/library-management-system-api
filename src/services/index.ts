import { BookRepository, BorrowerRepository, BorrowingRepository, LibrarianRepository } from '../database';
import { BookService } from './books.service';
import { BorrowerService } from './borrower.service';
import { BorrowingService } from './borrowing.service';
import { LibrarianService } from './librarian.service';

export async function GetServices() {
	const bookRepository = new BookRepository();

	const bookService = new BookService(bookRepository, new BorrowingRepository());
	const borrowerService = new BorrowerService(new BorrowerRepository());
	const borrowingService = new BorrowingService(new BorrowingRepository(), bookRepository);
	const librarianService = new LibrarianService(new LibrarianRepository());

	return { bookService, borrowerService, borrowingService, librarianService } as const;
}
