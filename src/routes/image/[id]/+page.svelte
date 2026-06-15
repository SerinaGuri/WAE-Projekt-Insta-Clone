<script>
	let { data } = $props();
</script>

<div class="max-w-4xl mx-auto">
	<a
		href={
			data.fromProfile
				? `/profile/${data.profileUserId}`
				: '/'
		}
		class="inline-flex items-center gap-2 mb-6 text-purple-600 hover:text-purple-800 font-semibold"
	>
		← Back
	</a>

	<img
		src={data.image.image}
		alt={data.image.description}
		class="w-full rounded-xl shadow mb-6"
	/>

	<div class="bg-white rounded-xl shadow p-6">
		<h1 class="text-3xl font-bold mb-4">
			{data.image.username}
		</h1>

		<p class="text-lg text-gray-700 mb-6">
			{data.image.description}
		</p>

		<div class="flex items-center gap-4 mt-6">
			{#if data.image.author_id !== data.user?.id}
				<form method="POST" action="?/toggleLike">
					<button
						type="submit"
						class="text-4xl hover:scale-110 transition"
					>
						{#if data.liked}
							❤️
						{:else}
							🤍
						{/if}
					</button>
				</form>
			{/if}

			<span class="text-xl font-bold">
				{data.image.votes} likes
			</span>
		</div>

		<div class="mt-10">
			<h2 class="text-2xl font-bold mb-4">
				Comments
			</h2>

			<form method="POST" action="?/comment" class="mb-8">
				<textarea
					name="text"
					placeholder="Write a comment..."
					required
					class="w-full border rounded-lg p-3 mb-3"
					rows="4"
				></textarea>

				<button
					type="submit"
					class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
				>
					Post Comment
				</button>
			</form>

			<div class="space-y-4">
				{#each data.comments as comment}
					<div class="bg-gray-100 rounded-xl p-4">
						<div class="flex justify-between items-center mb-2">
							<p class="font-bold">
								{comment.username}
							</p>

							<p class="text-sm text-gray-500">
								{new Date(comment.created_at).toLocaleDateString()}
							</p>
						</div>

						<p class="text-gray-700">
							{comment.text}
						</p>
						{#if data.user?.is_admin}
	<form method="POST" action="?/deleteComment" class="mt-3">
		<input
			type="hidden"
			name="commentId"
			value={comment.id}
		/>

		<button
			type="submit"
			class="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
		>
			Delete Comment
		</button>
	</form>
{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>