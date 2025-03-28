import { getDataAccess } from "@/datamodel/data-access";
import { MainPage, Menu } from "@/datamodel/model";
import Page from "@/components/Page";

export type MainPageProps = {
  menu: Menu;
  page: MainPage;
};

export default function _MainPage({ menu, page }: MainPageProps) {
  return (
    <Page title={page.title} menu={menu}>
      <div dangerouslySetInnerHTML={{ __html: page.content }}></div>
    </Page>
  );
}

export async function getStaticPaths() {
  const mainPages = await getDataAccess().getMainPages();
  const paths = mainPages.map((mainPage) => ({
    params: {
      mainPageId: mainPage.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export type MainPageParams = {
  params: {
    mainPageId: string;
  };
};

export async function getStaticProps({ params }: MainPageParams) {
  const dataAccess = getDataAccess();
  return {
    props: {
      menu: await dataAccess.getMenu(),
      page: await dataAccess.getMainPage(params.mainPageId),
    },
  };
}
