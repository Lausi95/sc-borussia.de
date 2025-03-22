import { Menu } from "@/datamodel/model";
import Link from "next/link";

export type PageProps = {
  title: string,
  menu: Menu,
  children?: any,
};

export default function Page({ title, children, menu }: PageProps) {
  return (
    <div>
      <div className="flex w-full justify-center shadow-md">
        <div className="w-4xl p-4">
          <div className="flex flex-row gap-4 items-center pb-4">
            <Link href="/"><img className="h-24" src="/logo.png" /></Link>
            <div>
              <h1 className="text-lg font-bold">Borussia Friedrichsfelde 1920 e.V.</h1>
              <h2 className="text-lg">{title}</h2>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            {menu.items.map(item => <Link key={item.href} href={item.href}>{item.title}</Link>)}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center">
        <div className="w-4xl p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
