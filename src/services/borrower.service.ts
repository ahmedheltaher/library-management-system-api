import { configurations } from '../core';
import { BorrowerInput, BorrowerRepository } from '../database';
import { JWTService } from '../utils';

type TLoginInput = {
	email: string;
	password: string;
};

type TChangeEmailInput = {
	id: string;
	newEmail: string;
	currentPassword: string;
};

type TChangePasswordInput = {
	id: string;
	newPassword: string;
	currentPassword: string;
};

type TDeleteAccountInput = {
	id: string;
	currentPassword: string;
};

export class BorrowerService {
	constructor(private readonly borrowerRepository: BorrowerRepository) {}

	async register(createData: BorrowerInput) {
		return await this.borrowerRepository.create(createData);
	}

	async login({ email, password }: TLoginInput) {
		const borrower = await this.getByEmail(email);
		if (!borrower) return { status: false };
		if (!borrower.comparePassword(password)) return { status: false };
		const token = JWTService.generateToken(
			{ UID: borrower.dataValues.id, t: '0xFF' },
			configurations.jwt.secret,
			configurations.jwt.tokenDuration.short
		);
		return { status: true, token };
	}

	async changeEmail({ id, newEmail, currentPassword }: TChangeEmailInput) {
		const borrower = await this.getById(id);
		if (!borrower) return { status: false };
		if (!borrower.comparePassword(currentPassword)) return { status: false };
		await this.update(id, { email: newEmail });
		return { status: true };
	}

	async changePassword({ id, newPassword, currentPassword }: TChangePasswordInput) {
		const borrower = await this.getById(id);
		if (!borrower) return { status: false };
		if (!borrower.comparePassword(currentPassword)) return { status: false };
		await this.update(id, { password: newPassword });
		return { status: true };
	}
	async deleteAccount({ id, currentPassword }: TDeleteAccountInput) {
		const borrower = await this.getById(id);
		if (!borrower) return { status: false };
		if (!borrower.comparePassword(currentPassword)) return { status: false };
		await this.delete(id);
		return { status: true };
	}
	async getAll({ limit, offset }: PaginatedServiceMethod = { limit: -1, offset: 0 }) {
		const options: Record<string, any> = {};
		if (offset) options.offset = offset;
		if (limit && limit > -1) options.limit = limit;

		return await this.borrowerRepository.findAll(options);
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
