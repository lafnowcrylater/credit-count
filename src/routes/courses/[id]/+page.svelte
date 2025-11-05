<!-- src/routes/courses/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Navbar from "$lib/Navbar.svelte";
	import { Card } from "flowbite-svelte";
	import { courseGroups } from "$lib/stores/courseStore";
	import { base } from '$app/paths';
	
	$: courseGroup = $courseGroups.find(g => g.id === $page.params.id);
	
	function goBack() {
		goto('${base}/home');
	}
	
	function getStatusColor(completed) {
		return completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
	}
	
	function getProgressPercentage() {
		if (!courseGroup) return 0;
		return Math.round((courseGroup.completed / courseGroup.required) * 100);
	}
</script>

<svelte:head>
	<title>{courseGroup?.name || 'Course Details'}</title>
</svelte:head>

<Navbar/>
<main class="min-h-screen w-full flex flex-col items-center gap-6 bg-gray-100 p-10">
	{#if courseGroup}
		<!-- Header Card -->
		<Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10 mb-4">
			<button 
				on:click={goBack}
				class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2 cursor-pointer"
			>
				← กลับ
			</button>
			
			<h1 class="text-3xl font-bold mb-4">{courseGroup.name}</h1>
			
			<div class="flex flex-col gap-3">
				<div class="flex justify-between items-center">
					<span class="text-gray-600">ความคืบหน้า:</span>
					<span class="font-semibold">{courseGroup.completed}/{courseGroup.required} วิชา ({getProgressPercentage()}%)</span>
				</div>
				
				<!-- Progress Bar -->
				<div class="w-full bg-gray-200 rounded-full h-3">
					<div 
						class="bg-blue-600 h-3 rounded-full transition-all duration-300"
						style="width: {getProgressPercentage()}%"
					></div>
				</div>
			</div>
		</Card>

		<!-- Courses List -->
		<div class="w-6xl max-w-full space-y-4">
			<h2 class="text-xl font-semibold mb-4">รายวิชาทั้งหมด</h2>

            <!-- Summary Card -->
            <Card class="w-6xl max-w-full p-5 sm:p-8 md:p-10">
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <p class="text-gray-600 text-sm">วิชาที่เรียนแล้ว</p>
                        <p class="text-2xl font-bold text-green-600">{courseGroup.completed}</p>
                    </div>
                    <div>
                        <p class="text-gray-600 text-sm">วิชาที่เหลือ</p>
                        <p class="text-2xl font-bold text-orange-600">{courseGroup.required - courseGroup.completed}</p>
                    </div>
                    <div>
                        <p class="text-gray-600 text-sm">รวมทั้งหมด</p>
                        <p class="text-2xl font-bold text-blue-600">{courseGroup.required}</p>
                    </div>
                </div>
            </Card>
			
			{#each courseGroup.courses as course}
				<Card class="max-w-full p-5 transition-all duration-200 hover:shadow-md">
					<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-2">
								<h3 class="text-lg font-semibold">{course.code}</h3>
								<span class="px-3 py-1 rounded-full text-sm {getStatusColor(course.completed)}">
									{course.completed ? 'เรียนแล้ว' : 'ยังไม่ได้เรียน'}
								</span>
							</div>
							<p class="text-gray-700 mb-1">{course.name}</p>
							<p class="text-gray-500 text-sm">หน่วยกิต: {course.credits}</p>
						</div>
						
						{#if course.completed}
							<div class="flex flex-col items-end gap-1">
								<span class="text-lg font-bold text-green-600">{course.grade}</span>
								<span class="text-sm text-gray-500">{course.semester}</span>
							</div>
						{/if}
					</div>
				</Card>
			{/each}
		</div>
	{:else}
		<Card class="w-6xl max-w-full p-10 text-center">
			<h2 class="text-2xl font-semibold mb-4">ไม่พบข้อมูลกลุ่มวิชา</h2>
			<button 
				on:click={goBack}
				class="text-blue-600 hover:text-blue-800"
			>
				กลับสู่หน้าหลัก
			</button>
		</Card>
	{/if}
</main>