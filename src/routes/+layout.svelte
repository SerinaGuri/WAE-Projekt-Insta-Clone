<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="bg-white shadow-sm border-b sticky top-0 z-50">
	<nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
		<!-- Logo -->
		<a
			href="/"
			class="text-2xl font-black text-purple-600 hover:text-purple-700 transition"
		>
			ImageBlog
		</a>

		<!-- Navigation -->
		<div class="flex items-center gap-3">
			<a
				href="/"
				class="px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium"
			>
				Home
			</a>

			{#if data.user}
				<a
					href="/upload"
					class="px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium"
				>
					Upload
				</a>

				<div class="flex items-center gap-2">
					<a
						href={`/profile/${data.user.id}`}
						class="px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium"
					>
						Profile
					</a>

					{#if data.user.is_admin}
						<span class="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
							ADMIN
						</span>
					{/if}
				</div>

				<form method="POST" action="/logout">
					<button
						type="submit"
						class="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition font-medium"
					>
						Logout
					</button>
				</form>
			{:else}
				<a
					href="/login"
					class="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition font-medium"
				>
					Login
				</a>
			{/if}
		</div>
	</nav>
</header>

<main class="max-w-7xl mx-auto px-6 py-8">
	{@render children()}
</main>