<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, DropdownDivider } from "flowbite-svelte";
	import { base } from '$app/paths';
	
	let links = [
		{ name: "Log out", href: "/" },
		// { name: "Home", href: "/home" },
	];
</script>

<!-- <nav>
	<div class="logo">KMITL CreditCount</div>
	<ul>
		{#each links as link}
			<li><a href={link.href}>{link.name}</a></li>
		{/each}
	</ul>
</nav> -->

<Navbar class="sticky top-0 z-50 h-[60px] w-full flex justify-center items-center bg-[#e07b17] py-3 px-6">
	<NavBrand>
		<a href='{base}/home' class="logo text-white text-2xl font-semibold hover:no-underline">CreditCount</a>
	</NavBrand>

	<NavUl>
		<NavLi class="w-30 bg-transparent text-white text-base cursor-pointer">66050000</NavLi>
		<Dropdown simple>
			<DropdownItem href="{base}/" class="text-black text-sm">Sign out</DropdownItem>
		</Dropdown>
	</NavUl>
</Navbar>


<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 24px;
		background-color: #dc7814;
		color: white;
	}

	/* ul {
		list-style: none;
		display: flex;
		gap: 1.5rem;
		margin: 0;
		padding: 0;
	} */

	a {
		text-decoration: none;
		color: white;
		font-weight: 500;
	}
</style>
