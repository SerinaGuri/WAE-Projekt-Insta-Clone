<script>
	let { data } = $props();

	const totalLikes = data.images.reduce(
		(sum, image) => sum + image.votes,
		0
	);
</script>

<div class="max-w-6xl mx-auto">
	<!-- Profile Header -->
	<div class="bg-white rounded-2xl shadow p-8 mb-10">
		<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
			<div>
				<h1 class="text-4xl font-bold mb-2">
					@{data.user.username}
				</h1>

				<p class="text-gray-500">
					Image creator
				</p>
			</div>

			<div class="flex gap-8 text-center">
				<div>
					<p class="text-3xl font-bold">
						{data.images.length}
					</p>

					<p class="text-gray-500">
						Posts
					</p>
				</div>

				<div>
					<p class="text-3xl font-bold">
						{totalLikes}
					</p>

					<p class="text-gray-500">
						Likes
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Gallery -->
	{#if data.images.length === 0}
		<div class="bg-white rounded-2xl shadow p-10 text-center">
			<p class="text-gray-500 text-lg">
				No images uploaded yet.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each data.images as image}
				<a
					href={`/image/${image.id}`}
					class="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition"
				>
					<div class="overflow-hidden">
						<img
							src={image.image}
							alt={image.description}
							class="w-full aspect-square object-cover group-hover:scale-105 transition duration-300"
						/>
					</div>

					<div class="p-4">
						<p class="text-gray-700 line-clamp-2 mb-4">
							{image.description}
						</p>

						<div class="flex justify-between items-center">
							<div class="font-bold">
								❤️ {image.votes}
							</div>

							<div class="text-sm text-gray-500">
								{new Date(image.created_at).toLocaleDateString()}
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>