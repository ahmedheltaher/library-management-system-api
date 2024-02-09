import { Application, configurations, loggers } from './src/core';
import { BookRepository, BorrowerRepository, BorrowingRepository } from './src/database';
import { Book, Borrowing } from './src/database/models';

async function Main() {
	try {
		const applicationInstance = new Application();
		await applicationInstance.initialize();
		const bookRepository = new BookRepository();
		const borrowingRepository = new BorrowingRepository();
		const borrowerRepository = new BorrowerRepository();
		// const createdBooks = await bookRepository.bulkCreate([
		// 	{
		// 		author: 'Radwa Ashour',
		// 		availableQuantity: 5,
		// 		ISBN: '9770907375',
		// 		shelfLocation: 'arabic novels',
		// 		title: 'ثلاثية غراناطة',
		// 	},
		// 	{
		// 		author: 'Leo Tolstoy',
		// 		availableQuantity: 3,
		// 		ISBN: '9780393096729',
		// 		shelfLocation: 'russian novels',
		// 		title: 'الحرب والسلم',
		// 	},
		// ]);
		// console.log("󱓞 ~ Main ~ createdBooks:", createdBooks)
		// const allBooks = await bookRepository.findAll();
		// console.log(
		// 	'󱓞 ~ Main ~ allBooks:',
		// 	allBooks.map((book) => book.toJSON())
		// );

		// const deletedBorrowingCount = await borrowingRepository.delete({
		// 	where: { book_id: '7531fa0d-e96e-4797-bf32-bfc3562873c4' },
		// });
		// console.log('󱓞 ~ Main ~ deletedBorrowingCount:', deletedBorrowingCount);
		// const deletedBooksCount = await bookRepository.delete({
		// 	where: { id: '7531fa0d-e96e-4797-bf32-bfc3562873c4' },
		// });
		// console.log('󱓞 ~ Main ~ deletedBooksCount:', deletedBooksCount);
		// const borrower = await borrowerRepository.create({
		// 	email: 'borrower@lib.com',
		// 	name: 'Ahmed Eltaher',
		// 	password: 'asdsadsa',
		// });
		// console.log("󱓞 ~ Main ~ borrower:", borrower)
		// const allBorrowers = await borrowerRepository.findAll();
		// console.log(
		// 	'󱓞 ~ Main ~ allBorrowers:',
		// 	allBorrowers.map((borrower) => borrower.toJSON())
		// );

		// await borrowerRepository.update({ password: 'ase' }, { where: { id: '49adc33e-361d-4423-a952-29a658bec54e' } });

		// const allBorrowersUpdated = await borrowerRepository.findAll({
		// 	include: {
		// 		model: Book,
		// 		as: 'books',
		// 	},
		// });
		// console.log(
		// 	'󱓞 ~ Main ~ allBorrowersUpdated:',
		// 	JSON.stringify(
		// 		allBorrowersUpdated.map((borrower) => borrower.toJSON()),
		// 		null,
		// 		4
		// 	)
		// );

		// console.log(
		// 	"󱓞 ~ Main ~ allBorrowers[0].comparePassword('asdsadsa'):",
		// 	allBorrowers[0].comparePassword('asdsadsa')
		// );
		// console.log("󱓞 ~ Main ~ allBorrowers[0].comparePassword('ase'):", allBorrowers[0].comparePassword('ase'));

		// const createdBorrowing = await borrowingRepository.create({
		// 	book_id: '7531fa0d-e96e-4797-bf32-bfc3562873c4',
		// 	borrower_id:'49adc33e-361d-4423-a952-29a658bec54e',
		// 	due_date: new Date("2024-02-9")
		// });
		// console.log("󱓞 ~ Main ~ createdBorrowing:", createdBorrowing)

		applicationInstance.listen({ port: configurations.server.port, host: configurations.server.host });
	} catch (error) {
		loggers.exceptions.error(`Error during application startup: ${error}`);
		process.exit(1);
	}
}

Main();
