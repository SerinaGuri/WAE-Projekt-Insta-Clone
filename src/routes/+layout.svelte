<script>
	let { children } = $props();
</script>

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

			<a href="/register" class="px-3 py-2 rounded hover:bg-purple-700">
				Register
			</a>

			<a href="/login" class="px-3 py-2 rounded hover:bg-purple-700">
				Login
			</a>

			<form method="POST" action="/logout">
				<button
					type="submit"
					class="bg-red-500 px-3 py-2 rounded hover:bg-red-600"
				>
					Logout
				</button>
			</form>
		</div>
	</nav>
</header>

{@render children()}