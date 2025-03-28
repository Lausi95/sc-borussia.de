import { getDataAccess } from "@/datamodel/data-access";
import Page, { PageProps } from "@/components/Page";
import { BlogEntry } from "@/datamodel/model";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";

type BlogDetailProps = PageProps & {
  blogEntry: BlogEntry;
};

export default function BlogDetail({ menu, blogEntry }: BlogDetailProps) {
  return (
    <Page menu={menu} title={blogEntry.title}>
      <article>
        <div className="bg-[url(/default-blog-image.webp)] rounded-t bg-cover bg-center h-40"></div>
        <h1 className="text-3xl font-bold mb-4 mt-6">{blogEntry.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: blogEntry.content }} />
      </article>
    </Page>
  );
}

type Params = { id: string };

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { id } = context.params as Params;
  const dataAccess = getDataAccess();

  return {
    props: {
      menu: await dataAccess.getMenu(),
      blogEntry: await dataAccess.getBlogEntry(id),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const dataAccess = getDataAccess();
  const blogEntries = await dataAccess.getBlogEntries();

  const paths = blogEntries.map((entry) => ({
    params: {
      id: entry.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};
