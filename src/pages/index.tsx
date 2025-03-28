import { getDataAccess } from "@/datamodel/data-access";
import { BlogEntry } from "@/datamodel/model";
import Page, { PageProps } from "@/templates/page";

export type HomeProps = PageProps & {
  pinnedBlogEntries: BlogEntry[];
};

export default function Home({ menu, pinnedBlogEntries }: HomeProps) {
  return (
    <Page title="Home" menu={menu}>
      {pinnedBlogEntries.map((blogEntry) => (
        <div key={blogEntry.title}>
          <h3 className="font-bold pb-2">{blogEntry.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: blogEntry.content }}></div>
        </div>
      ))}
    </Page>
  );
}

export async function getStaticProps() {
  const dataAccess = getDataAccess();
  return {
    props: {
      menu: await dataAccess.getMenu(),
      pinnedBlogEntries: await dataAccess.getPinnedBlogEntries(),
    },
  };
}
