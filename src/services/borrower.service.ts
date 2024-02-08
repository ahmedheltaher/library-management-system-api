import { BorrowerRepository, BorrowerInput } from '../database';

export class BorrowerService {
	constructor(private readonly borrowerRepository: BorrowerRepository) {}

	async add(createData: BorrowerInput) {
		return await this.borrowerRepository.create(createData);
	}

	async getAll() {
		return await this.borrowerRepository.findAll();
	}

	async getById(id: string) {
		return await this.borrowerRepository.findOne({ where: { id } });
	}

	async getByEmail(email: string) {
		return await this.borrowerRepository.findOne({ where: { email } });
	}

	async update(id: string, updateData: Partial<BorrowerInput>) {
		return await this.borrowerRepository.update(updateData, { where: { id } });
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.borrowerRepository.delete({ where: { id } });
		return !!result;
	}
}
