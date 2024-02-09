import { Librarian, LibrarianInput } from '../models';
import { BaseRepository } from './base';

export class LibrarianRepository extends BaseRepository<Librarian, LibrarianInput> {
	constructor() {
		super(Librarian);
	}
}
