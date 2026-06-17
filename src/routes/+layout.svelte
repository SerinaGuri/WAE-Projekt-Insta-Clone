<script>
	// Importiert globale Styles für das gesamte Projekt
	import './layout.css';

	// Importiert das Favicon der Webseite
	import favicon from '$lib/assets/favicon.svg';

	// Holt die Inhalte der aktuellen Seite (children)
	// und die Daten aus der +layout.server.js (z.B. eingeloggter Benutzer)
	let { children, data } = $props();
</script>

<svelte:head>
	<!-- Setzt das Browser-Tab-Icon -->
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Hauptnavigation, bleibt beim Scrollen oben sichtbar -->
<header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-100 shadow-sm">
	<nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

		<!-- Logo, führt zurück zur Startseite -->
		<a href="/" class="text-3xl font-black text-purple-600 hover:text-purple-700 transition">
			ImageBlog
		</a>

		<div class="flex items-center gap-3">

			<!-- Startseiten-Link -->
			<a href="/" class="px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium">
				Home
			</a>

			<!-- Wird nur angezeigt, wenn ein Benutzer eingeloggt ist -->
			{#if data.user}

				<!-- Link zur Upload-Seite -->
				<a
					href="/upload"
					class="px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium"
				>
					Upload
				</a>

				<!-- Profil-Link des aktuell eingeloggten Benutzers -->
				<a
					href={`/profile/${data.user.id}`}
					class="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-purple-100 transition font-medium"
				>

					<!-- Erstes Zeichen des Benutzernamens als Profilbild-Ersatz -->
					<div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
						{data.user.username.charAt(0).toUpperCase()}
					</div>

					<span>Profile</span>

					<!-- Wird nur angezeigt, wenn der Benutzer Admin ist -->
					{#if data.user.is_admin}
						<span class="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
							ADMIN
						</span>
					{/if}
				</a>

				<!-- Logout-Formular -->
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition font-semibold"
					>
						Logout
					</button>
				</form>

			{:else}

				<!-- Wird nur angezeigt, wenn niemand eingeloggt ist -->
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

<!-- Bereich für den Inhalt der aktuellen Seite -->
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
	<main class="max-w-7xl mx-auto px-4 sm:px-6 py-10">

		<!-- Hier wird die aktuell geöffnete Seite eingefügt -->
		{@render children()}

	</main>
</div>

<!-- Footer -->
<footer class="mt-16 border-t border-purple-100 bg-white/80 backdrop-blur-sm">
	<div class="max-w-7xl mx-auto px-6 py-8">

		<div class="flex flex-col md:flex-row justify-between items-center gap-4">

			<div>
				<h3 class="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
					ImageBlog
				</h3>

				<p class="text-gray-500 text-sm mt-1">
					Share, discover and enjoy amazing images.
				</p>
			</div>

			<div class="flex gap-6 text-sm text-gray-600">

				<a href="/" class="hover:text-purple-600 transition">
					Home
				</a>

				<!-- Zusätzliche Links nur für eingeloggte Benutzer -->
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

		<!-- Dynamisches aktuelles Jahr -->
		<div class="mt-6 text-center text-xs text-gray-400">
			© {new Date().getFullYear()} ImageBlog • Jahresprojekt WAE
		</div>
	</div>
</footer>