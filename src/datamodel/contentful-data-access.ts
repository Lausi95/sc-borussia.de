import { type ContentfulClientApi, createClient, type Entry } from "contentful";
import type { DataAccess } from "./data-access";
import type { BlogEntry, Department, MainPage, Menu, MenuItem } from "./model";
import { entryToBlogEntry, entryToDepartment, entryToMainPage } from "./entry-mappers";

// TODO: add in memory caching for efficient use of contentful API

export function createContentfulDataAccess() {
  const contentful = createClient({
    space: process.env.CONTENTFUL_SPACE as string,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  });

  return new ContentfulDataAccess(contentful);
}

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
        href: `/${item.slug}`,
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
        {
          title: "Blog",
          href: "/blog",
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
    return entries.items.map(entryToMainPage);
  }

  async getMainPage(slug: string): Promise<MainPage> {
    const entries = await this.contentful.getEntries({
      content_type: "genericPage",
      "fields.slug": slug,
    });
    const entry = extractExactlyOneItem(entries.items, "MainPages");
    return entryToMainPage(entry);
  }

  async getDepartments(): Promise<Department[]> {
    const entries = await this.contentful.getEntries({
      content_type: "department",
    });
    return entries.items.map(entryToDepartment);
  }

  async getDepartment(slug: string): Promise<Department> {
    const entries = await this.contentful.getEntries({
      content_type: "department",
      "fields.slug": slug,
    });
    const entry = extractExactlyOneItem(entries.items, "Departments");
    return entryToDepartment(entry);
  }

  async getBlogEntries(): Promise<BlogEntry[]> {
    const entries = await this.contentful.getEntries({
      content_type: "blog-entry",
    });
    return entries.items.map(entryToBlogEntry);
  }

  async getPinnedBlogEntries(): Promise<BlogEntry[]> {
    const entries = await this.contentful.getEntries({
      content_type: "blog-entry",
      "fields.pinned": true,
    });
    return entries.items.map(entryToBlogEntry);
  }

  async getBlogEntriesByDepartment(departmentName: string): Promise<BlogEntry[]> {
    const entries = await this.contentful.getEntries({
      content_type: "blog-entry",
      "fields.deparment.name": departmentName,
    });
    return entries.items.map(entryToBlogEntry);
  }

  async getBlogEntry(slug: string): Promise<BlogEntry> {
    const entries = await this.contentful.getEntries({
      content_type: "blog-entry",
      "fields.slug": slug,
    });
    const entry = extractExactlyOneItem(entries.items, "Departments");
    return entryToBlogEntry(entry);
  }
}

function extractExactlyOneItem<T>(items: T[], itemsName = "Items"): T {
  if (items.length === 0) {
    throw new Error(`${itemsName} has no elements. (expected exactly 1 element)`);
  }

  if (items.length > 1) {
    throw new Error(`${itemsName} has more then one element. (expected exactly 1 element)`);
  }

  return items[0];
}
