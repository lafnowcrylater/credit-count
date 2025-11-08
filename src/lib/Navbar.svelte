<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, Dropdown, DropdownItem } from "flowbite-svelte";
	
	export const user = null;

	console.log('Navbar user:', user);
	
	let loading = false;

	async function handleLogout() {
		loading = true;
		
		try {
			await fetch('/api/auth/logout', {
				method: 'POST'
			});
			
			goto('/');
		} catch (err) {
			console.error('Logout failed:', err);
			loading = false;
		}
	}
</script>

<Navbar class="sticky top-0 z-50 h-[60px] w-full flex justify-center items-center bg-[#e07b17] py-3 px-6">
	<NavBrand>
		<a href='/home' class="logo text-white text-2xl font-semibold hover:no-underline">CreditCount</a>
	</NavBrand>

	<NavUl>
		<NavLi class="w-30 bg-transparent text-white text-base cursor-pointer">
			{user.id || 'Unknown ID'}
		</NavLi>
		<Dropdown simple>
			<!-- <DropdownItem class="text-black text-sm">
				<div class="px-2 py-1">
					<p class="font-semibold">{user.name}</p>
					<p class="text-xs text-gray-500">{user.email}</p>
				</div>
			</DropdownItem>
			<DropdownItem href="/home" class="text-black text-sm">หน้าหลัก</DropdownItem> -->
			<DropdownItem 
				onclick={handleLogout} 
				class="text-red-600 text-sm cursor-pointer"
				disabled={loading}
			>
				{loading ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
			</DropdownItem>
		</Dropdown>
	</NavUl>
</Navbar>

<style>
	:global(.logo) {
		text-decoration: none;
		color: white;
		font-weight: 600;
	}
</style>


<!-- <style>
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
</style> -->
