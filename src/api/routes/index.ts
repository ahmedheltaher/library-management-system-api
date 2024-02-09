import { BorrowerApiBuilder } from './borrower';
import { BookApiBuilder } from './book';
import { BooksDefinitions } from './book/book.validation';
import { BorrowerDefinitions } from './borrower/borrower.validation';

export const routes = [
	{ prefix: '/books', buildHandler: BookApiBuilder },
	{ prefix: '/borrowers', buildHandler: BorrowerApiBuilder },
];

export const ApiDefinitions = {
	...BooksDefinitions,
	...BorrowerDefinitions,
};
