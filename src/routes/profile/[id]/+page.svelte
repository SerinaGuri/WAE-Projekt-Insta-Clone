<script>
	let { data } = $props();

	let totalLikes = $derived(
		data.images.reduce(
			(sum, image) => sum + image.votes,
			0
		)
	);
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6">

	<div class="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-8 sm:mb-12">

		<div class="absolute inset-0 bg-purple-600"></div>

		<div class="relative p-6 sm:p-8 md:p-10 lg:p-12 text-white">

			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 sm:gap-10">

				<div class="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">

					<div class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-black shadow-2xl">
						{data.user.username.charAt(0).toUpperCase()}
					</div>

					<div>
						<h1 class="text-3xl sm:text-4xl md:text-5xl font-black mb-2 tracking-tight wrap-break-word">
							@{data.user.username}
						</h1>

						<p class="text-white/80 text-base sm:text-lg">
							Sharing creativity through images
						</p>
					</div>

				</div>

				<div class="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto">

					<div class="bg-white/15 backdrop-blur-md rounded-2xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-center border border-white/20">

						<p class="text-2xl sm:text-3xl md:text-4xl font-black">
							{data.images.length}
						</p>

						<p class="text-white/80 mt-1 text-sm sm:text-base">
							Posts
						</p>

					</div>

					<div class="bg-white/15 backdrop-blur-md rounded-2xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-center border border-white/20">

						<p class="text-2xl sm:text-3xl md:text-4xl font-black">
							{totalLikes}
						</p>

						<p class="text-white/80 mt-1 text-sm sm:text-base">
							Likes
						</p>

					</div>

				</div>

			</div>

		</div>

	</div>

	{#if data.images.length === 0}

		<div class="bg-white rounded-2xl shadow p-6 sm:p-10 text-center">

			<p class="text-gray-500 text-base sm:text-lg">
				No images uploaded yet.
			</p>

		</div>

	{:else}

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

			{#each data.images as image}

				<a
					href={`/image/${image.id}?from=profile&user=${data.user.id}`}
					class="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2"
				>

					<div class="overflow-hidden">

						<img
							src={image.image}
							alt={image.description}
							class="w-full aspect-square object-cover group-hover:scale-110 transition duration-500"
						/>

					</div>

					<div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>

					<div class="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold shadow text-sm">
						❤️ {image.votes}
					</div>

					<div class="p-4 sm:p-5">

						<p class="text-gray-700 line-clamp-2 mb-4 wrap-break-word">
							{image.description}
						</p>

						<div class="flex items-center justify-between">

							<p class="text-xs sm:text-sm text-gray-500">
								{new Date(image.created_at).toLocaleDateString()}
							</p>

							<p class="text-xs sm:text-sm font-semibold text-purple-600">
								View →
							</p>

						</div>

					</div>

				</a>

			{/each}

		</div>

	{/if}
</div>