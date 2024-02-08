const fs = require('fs/promises');

async function createFolderStructure(folderPath) {
	try {
		await fs.mkdir(folderPath, { recursive: true });
		console.info(`Folder structure created successfully at ${folderPath}!`);
	} catch (error) {
		console.error(`Error creating folder structure at ${folderPath}:`, error);
	}
}

// TODO: Seed The Super Admin In DB

async function main() {
	await createFolderStructure('logs');
}

main().catch((error) => {
	console.error('An error occurred:', error);
});