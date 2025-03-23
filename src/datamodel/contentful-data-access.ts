import { type ContentfulClientApi, createClient, type Entry } from "contentful";
import type { DataAccess } from "./data-access";
import type { BlogEntry, Department, MainPage, Menu, MenuItem } from "./model";
import {
	documentToHtmlString,
	type Options,
} from "@contentful/rich-text-html-renderer";
import { BLOCKS, type Document } from "@contentful/rich-text-types";

// TODO: add in memory caching for efficient use of contentful API

export function createContentfulDataAccess() {
	const contentful = createClient({
		space: process.env.CONTENTFUL_SPACE as string,
		accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
	});

	return new ContentfulDataAccess(contentful);
}

const HTML_RENDERER_OPTIONS: Partial<Options> = {
	renderNode: {
		[BLOCKS.EMBEDDED_ASSET]: (node) => {
			return `<img src="https://${node.data.target.fields.file.url}" alt="${node.data.target.fields.description}" />`;
		},
	},
};

class ContentfulDataAccess implements DataAccess {
	private contentful: ContentfulClientApi<undefined>;

	constructor(contentful: ContentfulClientApi<undefined>) {
		this.contentful = contentful;
	}

	async getMenu(): Promise<Menu> {
		const mainPages = await this.getMainPages();

		const menuItems: MenuItem[] = mainPages
			.map((item) => ({
				title: item.title,
				href: item.url,
				order: item.order,
			}))
			.sort((a, b) => a.order - b.order);

		return {
			items: [
				{
					title: "Abteilungen",
					href: "/departments",
					order: 0,
				},
				...menuItems,
			],
		};
	}

	async getMainPages(): Promise<MainPage[]> {
		const entries = await this.contentful.getEntries({
			content_type: "genericPage",
		});
		return entries.items.map(this.entryToMainPage);
	}

	async getMainPage(slug: string): Promise<MainPage> {
		const entries = await this.contentful.getEntries({
			content_type: "genericPage",
			"fields.slug": slug,
		});
		const entry = this.extractExactlyOneItem(entries.items, "MainPages");
		return this.entryToMainPage(entry);
	}

	async getDepartments(): Promise<Department[]> {
		const entries = await this.contentful.getEntries({
			content_type: "department",
		});
		return entries.items.map(this.entryToDepartment);
	}

	async getDepartment(slug: string): Promise<Department> {
		const entries = await this.contentful.getEntries({
			content_type: "department",
			"fields.slug": slug,
		});
		const entry = this.extractExactlyOneItem(entries.items, "Departments");
		return this.entryToDepartment(entry);
	}

	async getBlogEntries(): Promise<BlogEntry[]> {
		const entries = await this.contentful.getEntries({
			content_type: "blog-entry",
		});
		return entries.items.map(this.entryToBlogEntry);
	}

	async getPinnedBlogEntries(): Promise<BlogEntry[]> {
		const entries = await this.contentful.getEntries({
			content_type: "blog-entry",
			"fields.pinned": true,
		});
		return entries.items.map(this.entryToBlogEntry);
	}

	async getBlogEntriesByDepartment(
		departmentName: string,
	): Promise<BlogEntry[]> {
		const entries = await this.contentful.getEntries({
			content_type: "blog-entry",
			"fields.deparment.name": departmentName,
		});
		return entries.items.map(this.entryToBlogEntry);
	}

	async getBlogEntry(slug: string): Promise<BlogEntry> {
		const entries = await this.contentful.getEntries({
			content_type: "blog-entry",
			"fields.slug": slug,
		});
		const entry = this.extractExactlyOneItem(entries.items, "Departments");
		return this.entryToBlogEntry(entry);
	}

	private entryToMainPage(entry: Entry): MainPage {
		return {
			url: `/${entry.fields.slug}`,
			title: entry.fields.title as string,
			content: documentToHtmlString(
				entry.fields.inhalt as Document,
				HTML_RENDERER_OPTIONS,
			),
			order: entry.fields.order as number,
		};
	}

	private entryToDepartment(entry: Entry): Department {
		return {
			name: entry.fields.name as string,
			url: `/departments/${entry.fields.slug as string}`,
			icon: "", // TODO map icon URL
		};
	}

	private entryToBlogEntry(entry: Entry): BlogEntry {
		return {
			title: entry.fields.title as string,
			url: `/blog/${entry.fields.slug as string}`,
			pinned: entry.fields.pinned as boolean,
			department: null, // TODO map (nested) department
			content: documentToHtmlString(
				entry.fields.content as Document,
				HTML_RENDERER_OPTIONS,
			),
		};
	}

	private extractExactlyOneItem<T>(items: T[], itemsName = "Items"): T {
		if (items.length === 0) {
			throw new Error(`${itemsName} have no elements.`);
		}

		if (items.length > 1) {
			throw new Error(`${itemsName} have more then one element.`);
		}

		return items[0];
	}
}
