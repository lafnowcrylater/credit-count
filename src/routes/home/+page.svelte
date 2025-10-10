<script>
	import Navbar from "$lib/Navbar.svelte";
	import { Card } from "flowbite-svelte";

	let id = '66050000', name = "John Doe", faculty = "Science", major = "Computer Science", year = 3;

</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<Navbar/>
<main class="min-h-screen w-full flex flex-col items-center gap-6 bg-gray-100 p-10">
	<Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 mb-8 justify-center">
		<h2 class="text-2xl font-semibold mb-2">{name}</h2>
		<p class="text-gray-600">ID: {id}</p>
		<p class="text-gray-600">Faculty: {faculty}</p>
		<p class="text-gray-600">Department: {major}</p>
		<p class="text-gray-600">Year: {year}</p>
	</Card>

	<Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 justify-center cursor-pointer 
	transition-all duration-300 hover:shadow-lg hover:scale-101">
		<div class="flex justify-between items-center">
			<h2 class="text-xl">กลุ่มศึกษาทั่วไป</h2>
			<p class="px-3 rounded-3xl border border-red-500">1/10</p>
		</div>
	</Card>
	<Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 justify-center cursor-pointer 
	transition-all duration-300 hover:shadow-lg hover:scale-101">
		<div class="flex justify-between items-center">
			<h2 class="text-xl">กลุ่มวิชาหลัก</h2>
			<p>2/7</p>
		</div>
	</Card>
</main>

<!-- <div class="min-h-screen w-full flex flex-col items-center justify-center gap-6 bg-gray-100 p-4">
	<Card class="w-full max-w-md p-5 sm:p-8 md:p-10">
		<h2 class="text-xl font-semibold mb-2">{name}</h2>
		<p class="text-gray-600">ID: {id}</p>
		<p class="text-gray-600">Department: {major}</p>
		<p class="text-gray-600">Year: {year}</p>
	</Card>
	
	<Card class="w-full max-w-md p-5 sm:p-8 md:p-10">
		<h2 class="text-xl font-semibold mb-2">{name}</h2>
		<p class="text-gray-600">ID: {id}</p>
		<p class="text-gray-600">Department: {major}</p>
		<p class="text-gray-600">Year: {year}</p>
	</Card>
</div> -->