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
	url: string;
	content: string;
	order: number;
};

export type Department = {
	name: string;
	url: string;
	icon: string;
};

export type BlogEntry = {
	title: string;
	url: string;
	department: Department | null;
	pinned: boolean;
	content: string;
};
