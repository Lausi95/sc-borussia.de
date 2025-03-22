import { createContentfulDataAccess } from "./contentful-data-access";
import type { Department, GenericPage, Menu } from "./model";

export type DataAccess = {
	getMenu(): Promise<Menu>;
	getMainMenuPaths(): Promise<string[]>;
	getGenericPage(slug: string): Promise<GenericPage>;
	getDepartment(slug: string): Promise<Department>;
	getDepartments(): Promise<Department[]>;
	getDepartmentPaths(): Promise<string[]>;
};

let dataAccessInstance: DataAccess | null = null;

export async function getDataAccess(): Promise<DataAccess> {
	if (!dataAccessInstance) {
		dataAccessInstance = await createContentfulDataAccess();
	}

	return dataAccessInstance;
}
