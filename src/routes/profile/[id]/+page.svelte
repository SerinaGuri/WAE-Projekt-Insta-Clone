<script>
	let { data } = $props();

	const totalLikes = data.images.reduce(
		(sum, image) => sum + image.votes,
		0
	);
</script>

<div class="max-w-6xl mx-auto">
	<!-- Profile Header -->
<div class="relative overflow-hidden rounded-3xl mb-12">
	<!-- Background -->
	<div class="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-400"></div>

	<!-- Glow -->
	<div class="absolute -top-20 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>

	<!-- Content -->
	<div class="relative p-10 md:p-12 text-white">
		<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
			<div class="flex items-center gap-6">
				<!-- Avatar -->
				<div class="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-5xl font-black shadow-2xl">
					{data.user.username.charAt(0).toUpperCase()}
				</div>

				<div>
					<h1 class="text-5xl font-black mb-2 tracking-tight">
						@{data.user.username}
					</h1>

					<p class="text-white/80 text-lg">
						Sharing creativity through images
					</p>
				</div>
			</div>

			<!-- Stats -->
			<div class="grid grid-cols-2 gap-4">
				<div class="bg-white/15 backdrop-blur-md rounded-2xl px-8 py-5 text-center border border-white/20">
					<p class="text-4xl font-black">
						{data.images.length}
					</p>

					<p class="text-white/80 mt-1">
						Posts
					</p>
				</div>

				<div class="bg-white/15 backdrop-blur-md rounded-2xl px-8 py-5 text-center border border-white/20">
					<p class="text-4xl font-black">
						{totalLikes}
					</p>

					<p class="text-white/80 mt-1">
						Likes
					</p>
				</div>
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
				<a href={`/image/${image.id}?from=profile&user=${data.user.id}`} class="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2">
	<div class="overflow-hidden">
		<img
			src={image.image}
			alt={image.description}
			class="w-full aspect-square object-cover group-hover:scale-110 transition duration-500"
		/>
	</div>

	<!-- Overlay -->
	<div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>

	<!-- Likes Badge -->
	<div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold shadow">
		❤️ {image.votes}
	</div>

	<!-- Bottom Content -->
					<div class="p-5">
						<p class="text-gray-700 line-clamp-2 mb-4">
							{image.description}
						</p>

						<div class="flex items-center justify-between">
							<p class="text-sm text-gray-500">
								{new Date(image.created_at).toLocaleDateString()}
							</p>
							<p class="text-sm font-semibold text-teal-600">
								View →
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>