<script>
	import { goto } from '$app/navigation';
	import Navbar from "$lib/Navbar.svelte";
	import { Card } from "flowbite-svelte";
	import { courseGroups } from "$lib/stores/courseStore";

	let id = '66050000', name = "John Doe", faculty = "วิทยาศาสตร์", major = "วิทยาการคอมพิวเตอร์", year = 3;

	// function navigateToCourseGroup(groupId) {
	// 	console.log("navigating to: " + groupId);
	// 	goto(`/courses/${groupId}`);
	// }
	
	function getCompletionColor(completed, required) {
		const percentage = (completed / required) * 100;
		if (percentage >= 80) return 'border-green-500 text-green-700';
		if (percentage >= 50) return 'border-yellow-500 text-yellow-700';
		return 'border-red-500 text-red-700';
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<Navbar class="sticky top-0 z-50 h-[60px] w-full flex justify-between items-center bg-[#e07b17] py-3 px-6">
	<NavBrand>
		<span class="logo text-white text-2xl font-semibold">CreditCount</span>
	</NavBrand>

	<NavUl class="flex items-center space-x-4">
		<NavLi class="text-white text-base cursor-pointer">66050000</NavLi>
		<Dropdown simple>
			<DropdownItem href="/" class="text-black text-sm">Sign out</DropdownItem>
		</Dropdown>
	</NavUl>
</Navbar>
<main class="min-h-screen w-full flex flex-col items-center gap-6 bg-gray-100 p-10">
	<Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 mb-8 justify-center">
		<h2 class="text-2xl font-semibold mb-2">{name}</h2>
		<p class="text-gray-600">รหัสประจำตัว: {id}</p>
		<p class="text-gray-600">คณะ: {faculty}</p>
		<p class="text-gray-600">สาขาวิชา: {major}</p>
		<p class="text-gray-600">ปีที่เข้าศึกษา: {year}</p>
	</Card>

	<div class="w-6xl max-w-full space-y-4">
		<h2 class="text-2xl font-semibold mb-4">กลุ่มวิชา</h2>

		<!-- bg-gradient-to-r from-blue-50 to-indigo-50 -->
		<Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 "> 
			<h3 class="text-lg font-semibold mb-4">สรุปภาพรวม</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				{#each $courseGroups as group}
					<div class="text-center">
						<p class="text-gray-600 mb-2">{group.name}</p>
						<p class="text-3xl font-bold text-blue-600">
							{Math.round((group.completed / group.required) * 100)}%
						</p>
					</div>
				{/each}
			</div>
		</Card>

	<!-- <Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 justify-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-101">
        <div class="flex justify-between items-center">
            <h2 class="text-xl">กลุ่มศึกษาทั่วไป</h2>
            <p class="px-3 rounded-3xl border border-red-500">1/10</p>
        </div>
    </Card> -->
		
		{#each $courseGroups as group}
			<Card class="max-w-full p-5 sm:p-8 md:p-10 justify-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-101 hover:bg-white"
				href='/courses/{group.id}'
				tabindex="0"
				role="button"
			>
				<div class="flex justify-between items-center">
					<div class="flex-1">
						<h2 class="text-xl font-semibold mb-2">{group.name}</h2>
						<div class="w-full max-w-md bg-gray-200 rounded-full h-2 mt-3">
							<div 
								class="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style="width: {(group.completed / group.required) * 100}%"
							></div>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<p class="px-4 py-1 rounded-3xl border-2 font-semibold {getCompletionColor(group.completed, group.required)}">
							{group.completed}/{group.required}
						</p>
						<span class="text-gray-400 text-2xl">→</span>
					</div>
				</div>
			</Card>
		{/each}
	</div>
</main>