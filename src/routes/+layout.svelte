<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="bg-purple-600 text-white shadow">
	<nav class="max-w-6xl mx-auto flex justify-between items-center p-4">
		<a href="/" class="text-2xl font-bold">
			Image Blog
		</a>

		<div class="flex gap-3 items-center">
			<a href="/" class="px-3 py-2 rounded hover:bg-purple-700">
				Home
			</a>

			<a href="/upload" class="px-3 py-2 rounded hover:bg-purple-700">
				Upload
			</a>

			{#if data.user}
				<!-- Logged in -->

				<span class="px-3">
					Hello {data.user.username}
				</span>

				<form method="POST" action="/logout">
					<button
						type="submit"
						class="bg-red-500 px-3 py-2 rounded hover:bg-red-600"
					>
						Logout
					</button>
				</form>

			{:else}
				<!-- Logged out -->

				<a href="/login" class="px-3 py-2 rounded hover:bg-purple-700">
					Login
				</a>
			{/if}
		</div>
	</nav>
</header>

{@render children()}