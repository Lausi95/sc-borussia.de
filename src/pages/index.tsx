import { getMenu } from "@/contentful";
import Page, { Menu } from "@/templates/page";

export type HomeProps = {
  menu: Menu,
};

export default function Home({ menu }: HomeProps) {
  return (
    <Page title="Home" menu={menu}>
      :)
    </Page>
  );
}

export async function getStaticProps() {
  return {
    props: {
      menu: await getMenu(),
    },
  };
}
