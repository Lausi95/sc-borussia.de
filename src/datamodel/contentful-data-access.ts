import { createClient } from "contentful";
import type { DataAccess } from "./data-access";
import type { MenuItem } from "./model";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import type { Document } from "@contentful/rich-text-types";

// TODO: add in memory caching for efficient use of contentful API

export async function createContentfulDataAccess(): Promise<DataAccess> {
	const contentful = createClient({
		space: process.env.CONTENTFUL_SPACE as string,
		accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
	});

	return {
		getMenu: async () => {
			const sites = await contentful.getEntries({
				content_type: "genericPage",
			});

			const menuItems: MenuItem[] = sites.items
				.map((item) => ({
					title: item.fields.title as string,
					href: `/${item.fields.slug}`,
					order: item.fields.order as number,
				}))
				.sort((a, b) => a.order - b.order);

			return {
				items: [
					{
						title: "Abteilungen",
						href: "/abteilungen",
						order: 0,
					},
					...menuItems,
				],
			};
		},
		getMainMenuPaths: async () => {
			const entries = await contentful.getEntries({
				content_type: "genericPage",
			});

			return entries.items
				.map((item) => item.fields.slug)
				.map((slug) => `/${slug}`);
		},
		getDepartment: async (slug) => {
			const entries = await contentful.getEntries({
				content_type: "department",
				"fields.slug": slug,
			});

			if (entries.items.length === 0) {
				throw new Error(`No department with slug ${slug}`);
			}

			if (entries.items.length >= 2) {
				throw new Error(`More than one department with slug ${slug}`);
			}

			const entry = entries.items[0];

			return {
				name: entry.fields.name as string,
				url: `/abteilung/${entry.fields.slug as string}`,
				icon: "",
			};
		},
		getDepartments: async () => {
			const entries = await contentful.getEntries({
				content_type: "department",
			});
			return entries.items.map((entry) => ({
				name: entry.fields.name as string,
				url: `/abteilungen/${entry.fields.slug}`,
				icon: "",
			}));
		},
		getDepartmentPaths: async () => {
			const entries = await contentful.getEntries({
				content_type: "department",
			});

			return entries.items
				.map((item) => item.fields.slug)
				.map((slug) => `/abteilungen/${slug}`);
		},
		getGenericPage: async (slug) => {
			const entries = await contentful.getEntries({
				"fields.slug": slug,
				content_type: "genericPage",
			});

			if (entries.items.length === 0) {
				throw new Error(`No generic page with slug ${slug}`);
			}

			if (entries.items.length >= 2) {
				throw new Error(`Multiple pages with slug ${slug}`);
			}

			const entry = entries.items[0];

			return {
				title: entry.fields.title as string,
				content: documentToHtmlString(entry.fields.inhalt as Document),
			};
		},
	};
}
