import { Borrower, BorrowerInput } from '../models';
import { BaseRepository } from './base';

export class BorrowerRepository extends BaseRepository<Borrower, BorrowerInput> {
	constructor() {
		super(Borrower);
	}
}
