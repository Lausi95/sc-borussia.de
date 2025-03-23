import { getDataAccess } from "@/datamodel/data-access";
import Page, { PageProps } from "@/templates/page";

export type HomeProps = PageProps;

export default function Home({ menu }: HomeProps) {
  return (
    <Page title="Home" menu={menu}>
      Willkommen!
    </Page>
  );
}

export async function getStaticProps() {
  const dataAccess = getDataAccess();
  return {
    props: {
      menu: await dataAccess.getMenu(),
    },
  };
}
