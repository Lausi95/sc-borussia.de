import { getContentful, getMenu } from "@/contentful";
import Page, { Menu } from "@/templates/page";
import Link from "next/link";

export type AbteilungenProps = {
  menu: Menu,
  abteilungen: [{
    name: string,
    slug: string,
  }]
};

export default function Abteilungen({ menu, abteilungen }: AbteilungenProps) {
  return (
    <Page title="Abteilungen" menu={menu}>
      <ul>
        {abteilungen.map(abteilung => (
          <li key={abteilung.slug}><Link href={'/abteilungen/' + abteilung.slug}>{abteilung.name}</Link></li>
        ))}
      </ul>
    </Page>
  );
}

export async function getStaticProps() {
  const contentful = getContentful();

  const entries = await contentful.getEntries({
    content_type: "department"
  });

  const departsments = entries.items.map(item => ({
    name: item.fields.name,
    slug: item.fields.slug,
  }));

  return {
    props: {
      abteilungen: departsments,
      menu: await getMenu(),
    }
  };
}
