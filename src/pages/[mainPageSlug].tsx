import { getDataAccess } from "@/datamodel/data-access";
import { Department, GenericPage, Menu } from "@/datamodel/model";
import Page from "@/templates/page";

export type MainPageProps = {
  menu: Menu,
  page: GenericPage,
}

export default function MainPage({ menu, page }: MainPageProps) {
  return (
    <Page title={page.title} menu={menu}>
      <div dangerouslySetInnerHTML={{ __html: page.content }}></div>
    </Page>
  );
}

export async function getStaticPaths() {
  const dataAccess = await getDataAccess();
  return {
    paths: await dataAccess.getMainMenuPaths(),
    fallback: false,
  };
}

export type MainPageParams = {
  params: {
    mainPageSlug: string,
  },
};

export async function getStaticProps({ params }: MainPageParams) {
  const dataAccess = await getDataAccess();
  return {
    props: {
      menu: await dataAccess.getMenu(),
      page: await dataAccess.getGenericPage(params.mainPageSlug),
    },
  };
}

