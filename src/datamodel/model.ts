export type MenuItem = {
  title: string;
  href: string;
  order: number;
};

export type Menu = {
  items: MenuItem[];
};

export type MainPage = {
  title: string;
  slug: string;
  content: string;
  order: number;
};

export type Department = {
  name: string;
  slug: string;
  icon: string;
};

export type BlogEntry = {
  title: string;
  slug: string;
  department: Department | null;
  pinned: boolean;
  content: string;
};
