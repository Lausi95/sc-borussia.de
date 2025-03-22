export type MenuItem = {
	title: string;
	href: string;
	order: number;
};

export type Menu = {
	items: MenuItem[];
};

export type GenericPage = {
	title: string;
	content: string;
};

export type Department = {
	name: string;
	url: string;
	icon: string;
};
