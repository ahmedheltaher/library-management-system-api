import { Admin, AdminInput } from '../models';
import { BaseRepository } from './base';

export class AdminRepository extends BaseRepository<Admin, AdminInput> {
	constructor() {
		super(Admin);
	}
}
