<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-100 shadow-sm">
	<nav class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

		<a href="/" class="text-2xl sm:text-3xl font-black text-purple-600 hover:text-purple-700 transition">
			ImageBlog
		</a>

		<div class="flex flex-wrap justify-center md:justify-end items-center gap-2 sm:gap-3 w-full md:w-auto">

			<a
				href="/"
				class="px-3 sm:px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium text-sm sm:text-base"
			>
				Home
			</a>

			{#if data.user}

				<a
					href="/upload"
					class="px-3 sm:px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium text-sm sm:text-base"
				>
					Upload
				</a>

				<a
					href={`/profile/${data.user.id}`}
					class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium text-sm sm:text-base"
				>

					<div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
						{data.user.username.charAt(0).toUpperCase()}
					</div>

					<span>Profile</span>

					{#if data.user.is_admin}
						<span class="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
							ADMIN
						</span>
					{/if}
				</a>

				<form method="POST" action="/logout">
					<button
						type="submit"
						class="bg-red-500 text-white px-4 sm:px-5 py-2 rounded-xl hover:bg-red-600 transition font-semibold text-sm sm:text-base"
					>
						Logout
					</button>
				</form>

			{:else}

				<a
					href="/login"
					class="bg-purple-600 text-white px-4 sm:px-5 py-2 rounded-xl hover:bg-purple-700 transition font-semibold text-sm sm:text-base"
				>
					Login
				</a>

			{/if}
		</div>
	</nav>
</header>

<div class="min-h-screen bg-white">
	<main class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
		{@render children()}
	</main>
</div>

<footer class="mt-16 border-t border-purple-100 bg-white/80 backdrop-blur-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">

		<div class="flex flex-col md:flex-row justify-between items-center gap-4">

			<div class="text-center md:text-left">
				<h3 class="text-xl font-bold text-purple-600">
					ImageBlog
				</h3>

				<p class="text-gray-500 text-sm mt-1">
					Share, discover and enjoy amazing images.
				</p>
			</div>

			<div class="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-600">

				<a href="/" class="hover:text-purple-600 transition">
					Home
				</a>

				{#if data.user}

					<a
						href={`/profile/${data.user.id}`}
						class="hover:text-purple-600 transition"
					>
						Profile
					</a>

					<a
						href="/upload"
						class="hover:text-purple-600 transition"
					>
						Upload
					</a>

				{/if}
			</div>
		</div>

		<div class="mt-6 text-center text-xs text-gray-400">
			© {new Date().getFullYear()} ImageBlog • Jahresprojekt WAE
		</div>
	</div>
</footer>