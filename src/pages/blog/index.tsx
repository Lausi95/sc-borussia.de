import { getDataAccess } from "@/datamodel/data-access";
import { BlogEntry } from "@/datamodel/model";
import Page, { PageProps } from "@/templates/page";
import Link from "next/link";

export type BlogProps = PageProps & {
  blogEntries: BlogEntry[];
};

export default function Blog({ menu, blogEntries }: BlogProps) {
  return (
    <Page menu={menu} title="Blog">
      <div className="grid pt-1 gap-6 md:grid-cols-2">
        {blogEntries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/blog/${entry.slug}`}
            className="block shadow rounded overflow-hidden"
          >
            <div className="bg-[url(/default-blog-image.webp)] rounded-t bg-cover bg-center h-20"></div>
            <div className="flex justify-between w-full p-2">
              <div className="font-bold">{entry.title}</div>
              <div className="italic text-sm text-right">
                <div>22.05.1933</div>
                <div>{entry.department?.name ?? "Allgemein"}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  const dataAccess = getDataAccess();
  return {
    props: {
      menu: await dataAccess.getMenu(),
      blogEntries: await dataAccess.getBlogEntries(),
    },
  };
}
