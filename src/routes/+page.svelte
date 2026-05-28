<script>
	let { data } = $props();
</script>

<h1 class="text-4xl font-bold mb-5">
	Image Blog
</h1>

{#each data.users as user}
	<p>{user.username}</p>
{/each}