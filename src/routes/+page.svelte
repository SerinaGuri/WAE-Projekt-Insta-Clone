<script>
	let { data } = $props();
</script>

<h1 class="text-4xl font-bold mb-6">
	Image Blog
</h1>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{#each data.images as image}
		<div class="border rounded-xl p-4 shadow hover:shadow-lg transition">
			<img src={image.image} alt={image.description} class="w-64 h-64 object-cover rounded-lg"/>
			<p class="font-semibold">{image.description}</p>
			<p class="text-sm text-gray-500">by {image.username}</p>
			<p class="text-sm">❤️ {image.votes} votes</p>
		</div>
	{/each}
</div>