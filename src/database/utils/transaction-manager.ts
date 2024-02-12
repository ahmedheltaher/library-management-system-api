import { Sequelize, Transaction } from 'sequelize';

export class TransactionManager {
	constructor(private sequelizeConnection: Sequelize) {}
	private openTransactions: Transaction[] = [];

	public async startTransaction(): Promise<Transaction> {
		const transaction = await this.sequelizeConnection.transaction();
		this.openTransactions.push(transaction);
		return transaction;
	}

	public async commitTransaction(transaction: Transaction): Promise<void> {
		await transaction.commit();
		this.removeTransaction(transaction);
	}

	public async rollbackTransaction(transaction: Transaction): Promise<void> {
		await transaction.rollback();
		this.removeTransaction(transaction);
	}

	private removeTransaction(transaction: Transaction): void {
		const index = this.openTransactions.indexOf(transaction);
		if (index !== -1) {
			this.openTransactions.splice(index, 1);
		}
	}
}
