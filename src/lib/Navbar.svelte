<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from "flowbite-svelte";
	
	let links = [
		{ name: "Login", href: "/" },
		{ name: "Home", href: "/home" },
	];
</script>

<nav>
	<div class="logo">KMITL CreditCount</div>
	<ul>
		{#each links as link}
			<li><a href={link.href}>{link.name}</a></li>
		{/each}
	</ul>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 24px;
		background-color: #dc7814;
		color: white;
	}

	.logo {
		font-size: 1.4rem;
		font-weight: bold;
	}

	ul {
		list-style: none;
		display: flex;
		gap: 1.5rem;
		margin: 0;
		padding: 0;
	}

	a {
		text-decoration: none;
		color: white;
		font-weight: 500;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
