import { getDataAccess } from "@/datamodel/data-access";
import { Department, Menu } from "@/datamodel/model";
import Page from "@/templates/page";

export type AbteilungProps = {
  menu: Menu,
  department: Department,
}

export default function Abteilung({ menu, department }: AbteilungProps) {
  return (
    <Page title={department.name} menu={menu}>
      Willkommen in der Abteilung {department.name}.
    </Page>
  );
}

export async function getStaticPaths() {
  const dataAccess = await getDataAccess();
  return {
    paths: await dataAccess.getDepartmentPaths(),
    fallback: false
  }
}

export type AbteilungParams = {
  params: {
    abteilung: string,
  },
};

export async function getStaticProps({ params }: AbteilungParams) {
  const dataAcces = await getDataAccess();
  return {
    props: {
      menu: await dataAcces.getMenu(),
      department: await dataAcces.getDepartment(params.abteilung),
    },
  };
}
