<script>
	import { goto } from '$app/navigation';
	import { Card, Button, Input, Label, Alert } from 'flowbite-svelte';
	
	let studentId = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleLogin(e) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ studentId, password })
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.error || 'Login failed';
				loading = false;
				return;
			}

			// Redirect to home on success
			goto('/home');
		} catch (err) {
			error = 'An error occurred. Please try again.';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - Credit Count</title>
</svelte:head>

<main class="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
	<Card class="w-full max-w-md p-8">
		<div class="text-center mb-6">
			<h1 class="text-3xl font-bold text-gray-800 mb-2">เข้าสู่ระบบ</h1>
			<p class="text-gray-600">Credit Count</p>
		</div>

		{#if error}
			<Alert color="red" class="mb-4">
				{error}
			</Alert>
		{/if}

		<form on:submit={handleLogin} class="space-y-4">
			<div>
				<Label for="studentId" class="mb-2">รหัสนักศึกษา</Label>
				<Input
					id="studentId"
					type="text"
					bind:value={studentId}
					required
					disabled={loading}
				/>
			</div>

			<div>
				<Label for="password" class="mb-2">รหัสผ่าน</Label>
				<Input
					id="password"
					type="password"
					bind:value={password}
					required
					disabled={loading}
				/>
			</div>

			<Button type="submit" class="w-full cursor-pointer bg-[#e07b17]" disabled={loading}>
				{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
			</Button>
		</form>

		<div class="text-center mt-6">
			<p class="text-gray-600 text-sm">
				หากลืมรหัสผ่าน กรุณาติดต่อเจ้าหน้าที่
			</p>
		</div>
	</Card>
</main>