<!-- Zentriert den Upload-Bereich auf der Seite -->
<div class="max-w-2xl mx-auto px-4 sm:px-6">

	<!-- Upload-Karte mit Schatten und abgerundeten Ecken -->
	<div class="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 border border-slate-100">

		<!-- Überschrift und Beschreibung -->
		<div class="mb-6 sm:mb-8">
			<h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-purple-600 mb-2">
				Upload an Image
			</h1>

			<p class="text-sm sm:text-base text-slate-500">
				Share your best images with the community.
			</p>
		</div>

		<!-- Formular zum Hochladen eines Bildes -->
		<form
			method="POST"
			action="?/add"
			enctype="multipart/form-data"
			class="space-y-6"
		>

			<!-- Dateiauswahl für das Bild -->
			<div>
				<label for="image" class="block text-sm font-semibold text-slate-700 mb-2">
					Image
				</label>

				<input
					id="image"
					type="file"
					name="image"
					accept="image/*"
					required
					class="w-full border border-slate-200 rounded-2xl p-3 sm:p-4 file:mr-2 sm:file:mr-4 file:rounded-xl file:border-0 file:bg-purple-600 file:px-3 sm:file:px-4 file:py-2 file:text-white hover:file:bg-purple-700"
				/>
			</div>

			<!-- Eingabefeld für die Bildbeschreibung -->
			<div>
				<label for="description" class="block text-sm font-semibold text-slate-700 mb-2">
						Description
					</label>

					<textarea
					id="description"
					rows="4"
					class="w-full border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
				></textarea>
			</div>

			<!-- Button zum Absenden des Formulars -->
			<button
				type="submit"
				class="w-full bg-purple-600 text-white py-3 rounded-2xl font-bold hover:bg-purple-700 transition duration-200 shadow-lg hover:shadow-xl"
			>
				Upload Image
			</button>

		</form>
	</div>
</div>