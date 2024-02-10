import * as fs from 'fs/promises';
import { BookRepository, BorrowerRepository, LibrarianRepository } from '../';
import { loggers } from '../../core';

const seedLogger = loggers.database.child({ module: 'seeder' });

/**
 * Seeds the database with data from a JSON file.
 * @param {string} filePath - The path to the JSON file containing the data to seed the database with.
 * @returns {Promise<void>} - A promise that resolves once the seeding is complete.
 */
export async function seed(filePath: string): Promise<void> {
	const bookRepository = new BookRepository();
	const librarianRepository = new LibrarianRepository();
	const borrowerRepository = new BorrowerRepository();

	try {

		// Check if seeding is necessary
		const alreadySeeded = (await librarianRepository.findAll()).length > 0;
		if (alreadySeeded) {
			seedLogger.info('The database is already seeded.');
			return;
		}

		// Read data from JSON file
		const data = await fs.readFile(filePath, 'utf8');
		const { books, librarians, borrowers } = JSON.parse(data);

		// Seed database with librarians, book, and borrower data concurrently
		await Promise.all([
			librarianRepository.bulkCreate(librarians),
			bookRepository.bulkCreate(books),
			borrowerRepository.bulkCreate(borrowers),
		]);

		seedLogger.info('Database successfully seeded.');
	} catch (error) {
		seedLogger.error(`Error seeding the database: ${error}`);
	}
}
