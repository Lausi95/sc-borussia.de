import type { Entry } from "contentful";
import type { BlogEntry, Department, MainPage } from "./model";
import { BLOCKS, type Document } from "@contentful/rich-text-types";
import { documentToHtmlString, type Options } from "@contentful/rich-text-html-renderer";

const HTML_RENDERER_OPTIONS: Partial<Options> = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      return `<img src="https://${node.data.target.fields.file.url}" alt="${node.data.target.fields.description}" />`;
    },
  },
};

export function entryToDepartment(entry: Entry): Department {
  const icon = entry.fields.icon as any;
  return {
    name: entry.fields.name as string,
    slug: `${entry.fields.slug}`,
    icon: `https://${icon.fields?.file?.url}`,
  };
}

export function entryToMainPage(entry: Entry): MainPage {
  return {
    slug: `${entry.fields.slug}`,
    title: entry.fields.title as string,
    content: documentToHtmlString(entry.fields.inhalt as Document, HTML_RENDERER_OPTIONS),
    order: entry.fields.order as number,
  };
}

export function entryToBlogEntry(entry: Entry): BlogEntry {
  return {
    title: entry.fields.title as string,
    slug: `${entry.fields.slug as string}`,
    pinned: entry.fields.pinned as boolean,
    department: entry.fields.department
      ? entryToDepartment(entry.fields.department as Entry)
      : null, // TODO map (nested) department
    content: documentToHtmlString(entry.fields.content as Document, HTML_RENDERER_OPTIONS),
  };
}
