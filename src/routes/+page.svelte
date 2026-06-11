<script>
	let { data } = $props();
</script>



<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{#each data.images as image}
		<div class="bg-white rounded-lg shadow p-4 hover:shadow-md">
			<img src={image.image} alt={image.description} class="w-full h-56 object-cover rounded-md"/>
			<p class="mt-3 font-medium">{image.description}</p>
			<p class="text-sm text-gray-500">by {image.username}</p>
			<p class="text-sm mt-1">❤️ {image.votes} votes</p>
		</div>
	{/each}
</div>