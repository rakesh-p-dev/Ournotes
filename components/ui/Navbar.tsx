import { Link } from "next-view-transitions";
import Profile from "./Profile";

import Logo from "./Logo";

const navItems = [
	{
		label: "About",
		href: "/about",
	},
	{
		label: "Notes",
		href: "/notes",
	},

	{
		label: "Pricing",
		href: "/premium",
	},
];

export default async function MainNav() {
	return (
		<>
			<nav className="sticky top-0 z-50 flex items-center justify-between bg-gradient-to-b from-white via-white to-white/20 px-10 py-8 hover:cursor-pointer dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900/20">
				<div className="flex items-center gap-30">
					<Link href="/" className="flex items-center">
						<Logo className="size-10 md:size-12 lg:size-16" />
						<h3
							data-umami-event="nav-brand-text-click"
							className="font-excon text-xl font-bold md:text-2xl"
						>
							Our Notes
						</h3>
					</Link>
				</div>
				<div className="flex items-center justify-center gap-2 md:gap-4">
					<Profile />
				</div>
			</nav>
		</>
	);
}
