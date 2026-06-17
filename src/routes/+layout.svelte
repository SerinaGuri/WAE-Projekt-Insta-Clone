<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-100 shadow-sm">
	<nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
		<!-- Logo -->
		<a href="/" class="text-3xl font-black text-purple-600 hover:text-purple-700 transition">
			ImageBlog
		</a>
		<!-- Navigation -->
		<div class="flex items-center gap-3">
			<a href="/" class="px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium"
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

				<a
					href={`/profile/${data.user.id}`}
					class="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium"
				>
					<div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
						{data.user.username.charAt(0).toUpperCase()}
					</div>

					<span>
						Profile
					</span>

					{#if data.user.is_admin}
						<span class="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
							ADMIN
						</span>
					{/if}
				</a>

				<form method="POST" action="/logout">
					<button
						type="submit"
						class="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition font-semibold"
					>
						Logout
					</button>
				</form>
			{:else}
				<a
					href="/login"
					class="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition font-semibold"
				>
					Login
				</a>
			{/if}
		</div>
	</nav>
</header>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
	<main class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
		{@render children()}
	</main>
</div>