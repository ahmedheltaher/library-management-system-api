import * as fs from 'fs/promises';
import * as path from 'node:path';
import { BookRepository, BorrowerRepository, LibrarianRepository, syncDatabase } from '../src/database';

/**
 * Creates folder structure at the specified path.
 * @param {string} folderPath - The path where folder structure will be created.
 * @returns {Promise<void>} - A promise that resolves once the folder structure is created.
 */
async function createFolderStructure(folderPath: string): Promise<void> {
	try {
		await fs.mkdir(folderPath, { recursive: true });
		console.info(`Folder structure created successfully at ${folderPath}!`);
	} catch (error) {
		console.error(`Error creating folder structure at ${folderPath}:`, error);
	}
}

/**
 * Seeds the database with data from a JSON file.
 * @returns {Promise<void>} - A promise that resolves once the seeding is complete.
 */
async function seed(): Promise<void> {
	const filePath = '/seed.json';
	const bookRepository = new BookRepository();
	const librarianRepository = new LibrarianRepository();
	const borrowerRepository = new BorrowerRepository();

	try {
		await syncDatabase();

		// Check if seeding is necessary
		const alreadySeeded = (await librarianRepository.findAll()).length > 0;
		if (alreadySeeded) {
			console.info('The database is already seeded.');
			return;
		}

		// Read data from JSON file
		const data = await fs.readFile(path.join(__dirname, filePath), 'utf8');
		const { books, librarians, borrowers } = JSON.parse(data);

		// Seed database with librarians, book, and borrower data concurrently
		await Promise.all([
			librarianRepository.bulkCreate(librarians),
			bookRepository.bulkCreate(books),
			borrowerRepository.bulkCreate(borrowers),
		]);

		console.info('Database successfully seeded.');
	} catch (error) {
		console.error('Error seeding the database:', error);
	}
}

/**
 * Main function that orchestrates the seeding process.
 */
async function main(): Promise<void> {
	// Create folder structure for logs
	await createFolderStructure('logs');
	// Seed the database
	await seed();
}

// Run the main function and handle any errors
main().catch((error) => {
	console.error('An error occurred:', error);
});
