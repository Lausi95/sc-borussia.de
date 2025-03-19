import { getContentful } from "@/contentful";
import Page from "@/templates/page";

export type AbteilungProps = {
  title: string
}

export default function Abteilung({ title }: AbteilungProps) {
  return (
    <Page title={title}>
      Willkommen in der Abteilung {title}.
    </Page>
  );
}

export async function getStaticPaths() {
  const contentful = getContentful();

  const entries = await contentful.getEntries({
    content_type: "department"
  });

  const slugs = entries.items
    .map(item => item.fields.slug)
    .map(slug => '/abteilungen/' + slug);

  return {
    paths: slugs,
    fallback: false
  }
}

export type AbteilungParams = {
  params: {
    abteilung: string,
  },
};

export async function getStaticProps({ params }: AbteilungParams) {
  const slug = params.abteilung;

  const contentful = getContentful();

  const departments = await contentful.getEntries({
    "fields.slug": slug,
    content_type: "department"
  });

  if (departments.items.length !== 1) {
    console.error(`Department with slug ${slug} does not exist!`);
    return;
  }

  const department = departments.items[0];

  return {
    props: {
      title: department.fields.name
    }
  };
}
