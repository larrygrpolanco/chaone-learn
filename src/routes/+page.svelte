<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/lessons/1/seed');
	});
</script>

<p>Redirecting to Lesson 1…</p>
