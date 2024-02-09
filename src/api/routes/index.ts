import { BookApiBuilder, BooksDefinitions } from './book';
import { BorrowerApiBuilder, BorrowerDefinitions } from './borrower';
import { BorrowingApiBuilder, BorrowingDefinitions } from './borrowing';
import { LibrarianApiBuilder, LibrarianDefinitions } from './librarian';

export const routes = [
	{ prefix: '/books', buildHandler: BookApiBuilder },
	{ prefix: '/borrowers', buildHandler: BorrowerApiBuilder },
	{ prefix: '/borrowings', buildHandler: BorrowingApiBuilder },
	{ prefix: '/librarians', buildHandler: LibrarianApiBuilder },
];

export const ApiDefinitions = {
	...BooksDefinitions,
	...BorrowerDefinitions,
	...BorrowingDefinitions,
	...LibrarianDefinitions,
};
