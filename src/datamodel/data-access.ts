import { createContentfulDataAccess } from "./contentful-data-access";
import type { BlogEntry, Department, MainPage, Menu } from "./model";

export interface DataAccess {
	getMenu(): Promise<Menu>;

	getMainPages(): Promise<MainPage[]>;
	getMainPage(slug: string): Promise<MainPage>;

	getDepartments(): Promise<Department[]>;
	getDepartment(slug: string): Promise<Department>;

	getBlogEntries(): Promise<BlogEntry[]>;
	getPinnedBlogEntries(): Promise<BlogEntry[]>;
	getBlogEntriesByDepartment(name: string): Promise<BlogEntry[]>;
	getBlogEntry(slog: string): Promise<BlogEntry>;
}

let dataAccessInstance: DataAccess | null = null;

export function getDataAccess(): DataAccess {
	if (!dataAccessInstance) {
		dataAccessInstance = createContentfulDataAccess();
	}

	return dataAccessInstance;
}
