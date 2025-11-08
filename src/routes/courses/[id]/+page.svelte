<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Navbar from "$lib/Navbar.svelte";
	import { Card } from "flowbite-svelte";
	
	export let data;
	
	$: user = data.user;
	$: groupId = $page.params.id;
	
	let groupData = null;
	let loading = true;
	let error = null;

	onMount(async () => {
		await loadGroupData();
	});

	async function loadGroupData() {
		try {
			const response = await fetch(`/api/progress/${groupId}`);
			if (!response.ok) throw new Error('Failed to fetch group data');
			groupData = await response.json();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function goBack() {
		goto('/home');
	}
	
	function getStatusColor(completed) {
		return completed ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-800 border-gray-300';
	}
	
	function getProgressPercentage() {
		if (!groupData) return 0;
		return Math.min(Math.round((groupData.group.completedCredits / groupData.group.requiredCredits) * 100), 100);
	}
</script>

<svelte:head>
	<title>{groupData?.group.name || 'Course Details'} - Credit Count</title>
</svelte:head>

<Navbar {user} />

<main class="min-h-screen w-full flex flex-col items-center gap-6 bg-gray-100 p-10">
	{#if loading}
		<div class="text-center py-20">
			<p class="text-xl text-gray-600">กำลังโหลดข้อมูล...</p>
		</div>
	{:else if error}
		<Card class="w-6xl max-w-full p-10 text-center">
			<h2 class="text-2xl font-semibold mb-4 text-red-600">เกิดข้อผิดพลาด</h2>
			<p class="text-gray-600 mb-4">{error}</p>
			<button 
				on:click={goBack}
				class="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
			>
				← กลับสู่หน้าหลัก
			</button>
		</Card>
	{:else if groupData}
		<!-- Header Card -->
		<Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 mb-4">
			<button 
				on:click={goBack}
				class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-semibold"
			>
				← กลับ
			</button>
			
			<h1 class="text-3xl font-bold mb-4">{groupData.group.name}</h1>
			
			<div class="flex flex-col gap-3">
				<div class="flex justify-between items-center">
					<span class="text-gray-600">ความคืบหน้า:</span>
					<span class="font-semibold">
						{groupData.group.completedCredits}/{groupData.group.requiredCredits} หน่วยกิต ({getProgressPercentage()}%)
					</span>
				</div>
				
				{#if groupData.group.totalCompleted > groupData.group.requiredCredits}
					<div class="text-sm text-blue-600">
						* เรียนเกินจำนวนที่กำหนด {groupData.group.totalCompleted - groupData.group.requiredCredits} หน่วยกิต (นับเป็นวิชาเลือกเสรี)
					</div>
				{/if}
				
				<!-- Progress Bar -->
				<div class="w-full bg-gray-200 rounded-full h-3">
					<div 
						class="bg-blue-600 h-3 rounded-full transition-all duration-300"
						style="width: {getProgressPercentage()}%"
					></div>
				</div>
			</div>
		</Card>

		<!-- Statistics Card -->
		<!-- <Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 mb-6 bg-blue-50">
			<h3 class="text-lg font-semibold mb-3">สรุปภาพรวม</h3>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div>
					<p class="text-gray-600 text-sm">วิชาที่เรียนแล้ว</p>
					<p class="text-2xl font-bold text-green-600">{groupData.statistics.completedCount}</p>
				</div>
				<div>
					<p class="text-gray-600 text-sm">วิชาบังคับ</p>
					<p class="text-2xl font-bold text-blue-600">{groupData.statistics.requiredCount}</p>
				</div>
				<div>
					<p class="text-gray-600 text-sm">วิชาเลือก</p>
					<p class="text-2xl font-bold text-purple-600">{groupData.statistics.electiveCount}</p>
				</div>
				<div>
					<p class="text-gray-600 text-sm">รวมทั้งหมด</p>
					<p class="text-2xl font-bold text-gray-800">{groupData.statistics.totalCourses}</p>
				</div>
			</div>
		</Card> -->

		<!-- Completed Courses -->
		<div class="w-6xl max-w-full space-y-4 mb-6">
			<h2 class="text-xl font-semibold mb-4 text-green-700">รายวิชาที่เรียนแล้ว ({groupData.completedCourses.length})</h2>
			
			{#if groupData.completedCourses.length === 0}
				<Card class="w-6xl max-w-full p-6 text-center text-gray-500">
					ยังไม่มีวิชาที่เรียนในกลุ่มนี้
				</Card>
			{:else}
				{#each groupData.completedCourses as course}
					<Card class="w-6xl max-w-full p-5 transition-all duration-200 hover:shadow-md">
						<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
							<div class="flex-1">
								<div class="flex items-center gap-3 mb-2">
									<h3 class="text-lg font-semibold">{course.code}</h3>
									<span class="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-300">
										เรียนแล้ว
									</span>
								</div>
									<p class="text-gray-700">{course.nameEn}</p>
									<p class="text-gray-500 text-sm mb-1">{course.name}</p>
									<p class="text-gray-500 text-sm">หน่วยกิต: {course.credits}</p>
							</div>
							
							<div class="flex flex-col items-end gap-1">
								<span class="text-lg font-bold text-green-600">{course.grade}</span>
								<span class="text-sm text-gray-500">{course.semester}</span>
							</div>
						</div>
					</Card>
				{/each}
			{/if}
		</div>

		<!-- Available Courses by Category -->
		<div class="w-6xl max-w-full space-y-6">
			<h2 class="text-xl font-semibold mb-4 text-gray-700">รายวิชาทั้งหมดในหลักสูตร</h2>
			
			{#each Object.entries(groupData.coursesByCategory) as [category, courses]}
				<div class="space-y-3">
					<h3 class="text-lg font-semibold text-gray-800 bg-gray-200 px-4 py-2 rounded">
						{category}
					</h3>
					
					{#each courses.required as course}
						{@const isCompleted = groupData.completedCourses.find(c => c.code === course.code)}
						
						<Card class="w-6xl max-w-full p-5 transition-all duration-200 {isCompleted ? 'opacity-60' : 'hover:shadow-md'}">
							<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-2">
										<h3 class="text-lg font-semibold">{course.code}</h3>
										<span class="px-3 py-1 rounded-full text-sm {getStatusColor(!!isCompleted)}">
											{isCompleted ? 'เรียนแล้ว' : course.isRequired ? 'บังคับ' : 'เลือก'}
										</span>
									</div>
									<p class="text-gray-700">{course.nameEn}</p>
									<p class="text-gray-500 text-sm mb-1">{course.name}</p>
									<p class="text-gray-500 text-sm">หน่วยกิต: {course.credits}</p>
								</div>
								
								{#if isCompleted}
									<div class="flex flex-col items-end gap-1">
										<span class="text-lg font-bold text-green-600">{isCompleted.grade}</span>
										<span class="text-sm text-gray-500">{isCompleted.semester}</span>
									</div>
								{/if}
							</div>
						</Card>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</main>