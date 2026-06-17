<script>
	// Daten von der Server-Datei übernehmen
	let { data } = $props();
</script>

<div class="max-w-4xl mx-auto">

	<!-- Link zurück zur Startseite oder Profilseite -->
	<a href={data.fromProfile ? `/profile/${data.profileUserId}` : '/'}>
		← Back
	</a>

	<!-- Großes Bild anzeigen -->
	<img
		src={data.image.image}
		alt={data.image.description}
	/>

	<!-- Container für Bildinformationen -->
	<div>

		<!-- Benutzername des Bild-Erstellers -->
		<h1>
			{data.image.username}
		</h1>

		<!-- Beschreibung des Bildes -->
		<p>
			{data.image.description}
		</p>

		<!-- Like-Bereich -->
		<div>

			<!-- Like-Button nur anzeigen wenn das Bild nicht dem Benutzer gehört -->
			{#if data.image.author_id !== data.user?.id}

				<!-- Formular für Likes -->
				<form method="POST" action="?/toggleLike">

					<!-- Like-Button -->
					<button type="submit">

						<!-- Gefülltes Herz wenn bereits geliked -->
						{#if data.liked}
							❤️

						<!-- Leeres Herz wenn noch nicht geliked -->
						{:else}
							🤍
						{/if}

					</button>
				</form>

			{/if}

			<!-- Anzahl der Likes -->
			<span>
				{data.image.votes} likes
			</span>

		</div>

		<!-- Bild löschen wenn Benutzer Besitzer oder Admin ist -->
		{#if data.user && (data.user.id === data.image.author_id || data.user.is_admin)}

			<!-- Formular zum Löschen eines Bildes -->
			<form method="POST" action="?/deleteImage">

				<!-- Button zum Löschen -->
				<button type="submit">
					Delete Image
				</button>

			</form>

		{/if}

		<!-- Kommentarbereich -->
		<div>

			<!-- Überschrift Kommentare -->
			<h2>
				Comments
			</h2>

			<!-- Formular zum Erstellen eines Kommentars -->
			<form method="POST" action="?/comment">

				<!-- Texteingabe für Kommentar -->
				<textarea
					name="text"
					required
					rows="4"
				></textarea>

				<!-- Kommentar absenden -->
				<button type="submit">
					Post Comment
				</button>

			</form>

			<!-- Liste aller Kommentare -->
			<div>

				<!-- Alle Kommentare durchlaufen -->
				{#each data.comments as comment}

					<!-- Einzelner Kommentar -->
					<div>

						<!-- Kopfbereich des Kommentars -->
						<div>

							<!-- Benutzername des Kommentators -->
							<p>
								{comment.username}
							</p>

							<!-- Erstellungsdatum -->
							<p>
								{new Date(comment.created_at).toLocaleDateString()}
							</p>

						</div>

						<!-- Kommentartext -->
						<p>
							{comment.text}
						</p>

						<!-- Kommentar löschen nur für Admin -->
						{#if data.user?.is_admin}

							<form method="POST" action="?/deleteComment">

								<!-- Kommentar-ID versteckt mitsenden -->
								<input
									type="hidden"
									name="commentId"
									value={comment.id}
								/>

								<!-- Kommentar löschen -->
								<button type="submit">
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