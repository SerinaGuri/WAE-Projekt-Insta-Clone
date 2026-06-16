<script>
	let { data } = $props();
</script>

<div class="mb-10">
	<h1 class="text-5xl font-black mb-3 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
		Trending Images
	</h1>

	<p class="text-gray-500 text-lg">
		The 25 most liked images from the community
	</p>
</div>

{#if data.images.length === 0}
	<div class="bg-white rounded-3xl shadow p-12 text-center">
		<p class="text-2xl font-bold text-gray-700">
			No images uploaded yet
		</p>

		<p class="text-gray-500 mt-2">
			Be the first one to upload something.
		</p>
	</div>
{:else}
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each data.images as image}
			<a
				href={`/image/${image.id}`}
				class="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2"
			>
				<div class="overflow-hidden">
					<img
						src={image.image}
						alt={image.description}
						class="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
					/>
				</div>

				<div class="p-5">
					<div class="flex items-center justify-between mb-3">
						<p class="font-bold text-lg text-gray-800">
							@{image.username}
						</p>

						<div class="flex items-center gap-1 text-pink-500 font-bold">
							<span>❤️</span>
							<span>{image.votes}</span>
						</div>
					</div>

					<p class="text-gray-600 line-clamp-2">
						{image.description}
					</p>
				</div>
			</a>
		{/each}
	</div>
{/if}