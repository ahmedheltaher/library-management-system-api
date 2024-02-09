import { BorrowerApiBuilder } from './borrower';
import { BookApiBuilder } from './book';
import { BooksDefinitions } from './book/book.validation';
import { BorrowerDefinitions } from './borrower/borrower.validation';
import { BorrowingApiBuilder } from './borrowing/borrowing.routes';
import { BorrowingDefinitions } from './borrowing/borrowing.validation';

export const routes = [
	{ prefix: '/books', buildHandler: BookApiBuilder },
	{ prefix: '/borrowers', buildHandler: BorrowerApiBuilder },
	{ prefix: '/borrowings', buildHandler: BorrowingApiBuilder },
];

export const ApiDefinitions = {
	...BooksDefinitions,
	...BorrowerDefinitions,
	...BorrowingDefinitions,
};
