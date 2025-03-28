import { getDataAccess } from "@/datamodel/data-access";
import { Department, Menu } from "@/datamodel/model";
import Page from "@/components/Page";

export type AbteilungProps = {
  menu: Menu;
  department: Department;
};

export default function Abteilung({ menu, department }: AbteilungProps) {
  return (
    <Page title={department.name} menu={menu}>
      Willkommen in der Abteilung {department.name}.
    </Page>
  );
}

export async function getStaticPaths() {
  const departments = await getDataAccess().getDepartments();
  const paths = departments.map((department) => ({
    params: {
      department: department.slug,
    },
  }));

  return {
    paths: paths,
    fallback: false,
  };
}

export type AbteilungParams = {
  params: {
    department: string;
  };
};

export async function getStaticProps({ params }: AbteilungParams) {
  const dataAcces = getDataAccess();
  return {
    props: {
      menu: await dataAcces.getMenu(),
      department: await dataAcces.getDepartment(params.department),
    },
  };
}
