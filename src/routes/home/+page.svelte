<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Navbar from "$lib/Navbar.svelte";
	import { Card } from "flowbite-svelte";

	export let data;
  	const { user } = data;

	// $: user = data.user;
	console.log('Home page user:', user);

	let progress = null;
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/progress');
			if (!response.ok) throw new Error('Failed to fetch progress');
			progress = await response.json();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	});

	function navigateToCourseGroup(groupId) {
		goto(`/courses/${groupId}`);
	}
	
	function getCompletionColor(completed, required) {
		const percentage = (completed / required) * 100;
		if (percentage >= 100) return 'border-green-500 text-green-700';
		if (percentage >= 80) return 'border-yellow-500 text-yellow-700';
		return 'border-red-500 text-red-700';
	}

	function getCompletionPercentage(completed, required) {
		return Math.min(Math.round((completed / required) * 100), 100);
	}
</script>

<svelte:head>
	<title>Credit Count</title>
</svelte:head>

<Navbar {user} />

<main class="min-h-screen w-full flex flex-col items-center gap-6 bg-gray-100 p-10">
	{#if loading}
		<div class="text-center py-20">
			<p class="text-xl text-gray-600">กำลังโหลดข้อมูล...</p>
		</div>
	{:else if error}
		<Card class="w-6xl max-w-full p-8 text-center">
			<p class="text-red-600 text-lg mb-2">เกิดข้อผิดพลาด</p>
			<p class="text-gray-600">{error}</p>
		</Card>
	{:else if progress}
		<!-- Student Info Card -->
		<Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 justify-center">
			<h2 class="text-2xl font-semibold mb-2">{progress.student.fname} {progress.student.lname}</h2>
			<p class="text-gray-600">รหัสนักศึกษา: {progress.student.id}</p>
			<p class="text-gray-600">ปีที่เข้าศึกษา: {progress.student.yearEnrolled}</p>
			<p class="text-gray-600">ระดับการศึกษา: {progress.student.degree}</p>
			<p class="text-gray-600">คณะ: {progress.student.faculty}</p>
			<p class="text-gray-600">สาขาวิชา: {progress.student.major}</p>
			<p class="text-gray-600">หลักสูตร: {progress.curriculum.name}</p>
		</Card>

		<!-- Overall Progress Summary -->
		<Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 mb-6">
			<h3 class="text-lg font-semibold mb-4">สรุปภาพรวม</h3>
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div class="text-center">
					<p class="text-gray-600 mb-2">วิชาศึกษาทั่วไป</p>
					<!-- <p class="text-3xl font-bold text-blue-600">
						{getCompletionPercentage(progress.progress.genEd.completed, progress.progress.genEd.required)}%
					</p> -->
					<p class="text-3xl font-bold text-green-600">
						{progress.progress.genEd.completed}/{progress.progress.genEd.required}
					</p>
					<p class="text-sm text-gray-500">หน่วยกิต</p>
				</div>
				<div class="text-center">
					<p class="text-gray-600 mb-2">วิชาเฉพาะ</p>
					<p class="text-3xl font-bold text-green-600">
						{progress.progress.core.completed}/{progress.progress.core.required}
					</p>
					<p class="text-sm text-gray-500">หน่วยกิต</p>
				</div>
				<div class="text-center">
					<p class="text-gray-600 mb-2">วิชาเลือกเสรี</p>
					<p class="text-3xl font-bold text-green-600">
						{progress.progress.freeElective.completed}/{progress.progress.freeElective.required}
					</p>
					<p class="text-sm text-gray-500">หน่วยกิต</p>
				</div>
				<div class="text-center">
					<p class="text-gray-600 mb-2">รวมทั้งหมด</p>
					<p class="text-3xl font-bold text-green-600">
						{progress.progress.total.completed}/{progress.progress.total.required}
					</p>
					<p class="text-sm text-gray-500">หน่วยกิต</p>
				</div>
			</div>
		</Card>

		<!-- Course Groups -->
		<div class="w-6xl max-w-full space-y-4">
			<h2 class="text-2xl font-semibold mb-4">หมวดวิชา</h2>
			
			<!-- Gen Ed -->
			<Card 
				class="w-full max-w-full p-5 sm:p-8 md:p-10 justify-center cursor-pointer 
				transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50"
				onclick={() => navigateToCourseGroup('gen_ed')}
				onkeydown={(e) => e.key === 'Enter' && navigateToCourseGroup('gen_ed')}
				tabindex="0"
				role="button"
			>
				<div class="flex justify-between items-center">
					<div class="flex-1">
						<h2 class="text-xl font-semibold mb-2">หมวดวิชาศึกษาทั่วไป</h2>
						<div class="w-full max-w-md bg-gray-200 rounded-full h-2 mt-3">
							<div 
								class="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style="width: {getCompletionPercentage(progress.progress.genEd.completed, progress.progress.genEd.required)}%"
							></div>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<p class="px-4 py-2 rounded-3xl border-2 font-semibold {getCompletionColor(progress.progress.genEd.completed, progress.progress.genEd.required)}">
							{progress.progress.genEd.completed}/{progress.progress.genEd.required}
						</p>
						<span class="text-gray-400 text-2xl">→</span>
					</div>
				</div>
			</Card>

			<!-- Core -->
			<Card 
				class="w-full max-w-full p-5 sm:p-8 md:p-10 justify-center cursor-pointer 
				transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50"
				onclick={() => navigateToCourseGroup('core')}
				onkeydown={(e) => e.key === 'Enter' && navigateToCourseGroup('core')}
				tabindex="0"
				role="button"
			>
				<div class="flex justify-between items-center">
					<div class="flex-1">
						<h2 class="text-xl font-semibold mb-2">หมวดวิชาเฉพาะ</h2>
						<div class="w-full max-w-md bg-gray-200 rounded-full h-2 mt-3">
							<div 
								class="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style="width: {getCompletionPercentage(progress.progress.core.completed, progress.progress.core.required)}%"
							></div>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<p class="px-4 py-2 rounded-3xl border-2 font-semibold {getCompletionColor(progress.progress.core.completed, progress.progress.core.required)}">
							{progress.progress.core.completed}/{progress.progress.core.required}
						</p>
						<span class="text-gray-400 text-2xl">→</span>
					</div>
				</div>
			</Card>

			<!-- Free Elective -->
			<Card 
				class="w-full max-w-full p-5 sm:p-8 md:p-10 justify-center cursor-pointer 
				transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50"
				onclick={() => navigateToCourseGroup('free_elective')}
				onkeydown={(e) => e.key === 'Enter' && navigateToCourseGroup('free_elective')}
				tabindex="0"
				role="button"
			>
				<div class="flex justify-between items-center">
					<div class="flex-1">
						<h2 class="text-xl font-semibold mb-2">หมวดวิชาเลือกเสรี</h2>
						<div class="w-full max-w-md bg-gray-200 rounded-full h-2 mt-3">
							<div 
								class="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style="width: {getCompletionPercentage(progress.progress.freeElective.completed, progress.progress.freeElective.required)}%"
							></div>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<p class="px-4 py-2 rounded-3xl border-2 font-semibold {getCompletionColor(progress.progress.freeElective.completed, progress.progress.freeElective.required)}">
							{progress.progress.freeElective.completed}/{progress.progress.freeElective.required}
						</p>
						<span class="text-gray-400 text-2xl">→</span>
					</div>
				</div>
			</Card>
		</div>
	{/if}
</main>