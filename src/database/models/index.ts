import { Book } from './book.model';
import { Borrower } from './borrower.model';
import { Borrowing } from './borrowing.model';

export * from './book.model';
export * from './borrower.model';
export * from './borrowing.model';
export * from './librarian.model';

Borrowing.belongsTo(Borrower, { foreignKey: 'borrowerId', as: 'borrower' });
Borrowing.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

Borrower.hasMany(Borrowing, { foreignKey: 'borrowerId', as: 'borrowings' });
Book.hasMany(Borrowing, { foreignKey: 'bookId', as: 'borrowings' });
