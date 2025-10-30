import { Link } from "next-view-transitions";
import Profile from "./Profile";
import ClickToggle from "./ClickToggle";

import Logo from "./Logo";



export default async function MainNav() {
	return (
		<>
		
			<nav className="sticky top-0 z-50 flex items-center justify-between bg-white dark:bg-neutral-900 px-10 py-8 hover:cursor-pointer">
				
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
					<ClickToggle />
					<Profile />
				</div>
			</nav>
		</>
	);
}
