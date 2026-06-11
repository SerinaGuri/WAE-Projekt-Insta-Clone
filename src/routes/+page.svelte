<script>
	let { data } = $props();
</script>

<h1 class="text-4xl font-bold mb-8">
	Top Images
</h1>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
	{#each data.images as image}
		<a
			href={`/image/${image.id}`}
			class="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
		>
			<img
				src={image.image}
				alt={image.description}
				class="w-full h-64 object-cover"
			/>

			<div class="p-4">
				<p class="font-semibold mb-2">
					{image.username}
				</p>

				<p class="text-gray-700 line-clamp-2">
					{image.description}
				</p>

				<div class="mt-4 font-bold">
					❤️ {image.votes}
				</div>
			</div>
		</a>
	{/each}
</div>