import { configurations } from '../core';
import { LibrarianRepository } from '../database';
import { JWTService } from '../utils';

export type TLibrarianLoginInput = { email: string; password: string };

export class LibrarianService {
	constructor(private readonly librarianRepository: LibrarianRepository) {}

	async login({ email, password }: TLibrarianLoginInput) {
		const librarian = await this.librarianRepository.findOne({ where: { email } });
		if (!librarian) return { status: false };
		if (!librarian.comparePassword(password)) return { status: false };
		const token = JWTService.generateToken(
			{ UID: librarian.dataValues.id, t: '0x00' },
			configurations.jwt.secret,
			configurations.jwt.tokenDuration.short
		);
		return { status: true, token };
	}

	async getById(id: string) {
		return await this.librarianRepository.findOne({ where: { id } });
	}
}
