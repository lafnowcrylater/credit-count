<script>
	import '../app.css';
	import favicon from '$lib/assets/kmitl.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
