import * as contentful_1 from "contentful";
import { Menu, MenuItem } from "./templates/page";

let contentful: contentful_1.ContentfulClientApi<undefined> | null = null;

export function getContentful(): contentful_1.ContentfulClientApi<undefined> {
	if (contentful) {
		return contentful;
	}

	contentful = contentful_1.createClient({
		space: process.env.CONTENTFUL_SPACE as string,
		accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
	});

	return contentful;
}

export async function getMenu(): Promise<Menu> {
	const contentful = getContentful();

	const sites = await contentful.getEntries({
		content_type: "genericPage",
	});

	const menuItems: MenuItem[] = sites.items
		.map((item) => ({
			title: item.fields.title as string,
			href: item.fields.slug as string,
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
}
