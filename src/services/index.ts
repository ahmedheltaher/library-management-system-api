import { configurations } from '../core';
import { BookRepository, BorrowingRepository } from '../database';
import { BookService } from './books.service';

// TODO: Septate Type
export async function GetServices(config: typeof configurations) {
	const bookService = new BookService(new BookRepository(), new BorrowingRepository());

	return { bookService } as const;
}
export type AvailableServices = Awaited<ReturnType<typeof GetServices>>;
