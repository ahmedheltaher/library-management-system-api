import { Borrowing, BorrowingInput } from '../models';
import { BaseRepository } from './base';

export class BorrowingRepository extends BaseRepository<Borrowing, BorrowingInput> {
	constructor() {
		super(Borrowing);
	}
}
