import { Book, BookInput } from '../models';
import { BaseRepository } from './base';

export class BookRepository extends BaseRepository<Book, BookInput> {
	constructor() {
		super(Book);
	}
}
