import type { Entry } from "contentful";
import type { BlogEntry, Department, MainPage } from "./model";
import { BLOCKS, type Document } from "@contentful/rich-text-types";
import {
	documentToHtmlString,
	type Options,
} from "@contentful/rich-text-html-renderer";

const HTML_RENDERER_OPTIONS: Partial<Options> = {
	renderNode: {
		[BLOCKS.EMBEDDED_ASSET]: (node) => {
			return `<img src="https://${node.data.target.fields.file.url}" alt="${node.data.target.fields.description}" />`;
		},
	},
};

export function entryToDepartment(entry: Entry): Department {
	return {
		name: entry.fields.name as string,
		url: `/departments/${entry.fields.slug as string}`,
		icon: "", // TODO map icon URL
	};
}

export function entryToMainPage(entry: Entry): MainPage {
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

export function entryToBlogEntry(entry: Entry): BlogEntry {
	return {
		title: entry.fields.title as string,
		url: `/blog/${entry.fields.slug as string}`,
		pinned: entry.fields.pinned as boolean,
		department:
			entry.fields.department !== null
				? entryToDepartment(entry.fields.department as Entry)
				: null, // TODO map (nested) department
		content: documentToHtmlString(
			entry.fields.content as Document,
			HTML_RENDERER_OPTIONS,
		),
	};
}
