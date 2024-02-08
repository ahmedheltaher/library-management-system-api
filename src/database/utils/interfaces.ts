export interface IDates {
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}

interface Attributes {
	[key: string]: any;
}

export class JSONSerializer<T extends Attributes> {
	toJSON(modelInstance: T, keysToDelete?: string[]): T {
		const values = Object.assign({}, modelInstance);
		if (keysToDelete && keysToDelete.length > 0) {
			keysToDelete.forEach((key) => {
				delete values[key];
			});
		}
		return values;
	}
}
