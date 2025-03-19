import Link from "next/link";

export type MenuItem = {
  title: string,
  href: string,
  order: number,
};

export type Menu = {
  items: MenuItem[]
}

export type PageProps = {
  title: string,
  children?: any,
  menu: Menu,
};

export default function Page({ title, children, menu }: PageProps) {
  return (
    <div className="p-4">
      <div className="flex flex-row gap-4 items-center">
        <Link href="/"><img className="h-24" src="/logo.png" /></Link>
        <div>
          <h1 className="text-lg font-bold">Borussia Friedrichsfelde 1920 e.V.</h1>
          <h2 className="text-lg">{title}</h2>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        {menu.items.map(item => <Link key={item.href} href={item.href}>{item.title}</Link>)}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
