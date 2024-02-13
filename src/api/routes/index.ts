import { BookApiBuilder, BooksDefinitions } from './book';
import { BorrowerApiBuilder, BorrowerDefinitions } from './borrower';
import { BorrowingApiBuilder, BorrowingDefinitions } from './borrowing';
import { LibrarianApiBuilder, LibrarianDefinitions } from './librarian';

export const routes = [
	{ prefix: '/books', buildHandler: BookApiBuilder, version: 'v1' },
	{ prefix: '/borrowers', buildHandler: BorrowerApiBuilder, version: 'v1' },
	{ prefix: '/borrowings', buildHandler: BorrowingApiBuilder, version: 'v1' },
	{ prefix: '/librarians', buildHandler: LibrarianApiBuilder, version: 'v1' },
];

export const ApiDefinitions = {
	...BooksDefinitions,
	...BorrowerDefinitions,
	...BorrowingDefinitions,
	...LibrarianDefinitions,
};
