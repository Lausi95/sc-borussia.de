import { getDataAccess } from "@/datamodel/data-access";
import { Department, Menu } from "@/datamodel/model";
import Page from "@/components/Page";
import Link from "next/link";

export type AbteilungenProps = {
  menu: Menu;
  abteilungen: [Department];
};

export default function Abteilungen({ menu, abteilungen }: AbteilungenProps) {
  return (
    <Page title="Abteilungen" menu={menu}>
      {abteilungen.map((abteilung) => (
        <Link href={`/departments/${abteilung.slug}`} className="block">
          <img alt={"departement-logo"} src={abteilung.icon} />
          {abteilung.name}
        </Link>
      ))}
    </Page>
  );
}

export async function getStaticProps() {
  const dataAccess = getDataAccess();
  return {
    props: {
      menu: await dataAccess.getMenu(),
      abteilungen: await dataAccess.getDepartments(),
    },
  };
}
