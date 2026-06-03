<form
	method="POST"
	action="?/add"
	enctype="multipart/form-data"
	class="flex flex-col gap-4 max-w-md"
>
	<h1 class="text-2xl font-bold">Upload Image</h1>

	<input
		type="file"
		name="image"
		accept="image/*"
		required
	/>

	<input
		type="text"
		name="description"
		placeholder="Description"
		class="border p-2 rounded"
	/>

	<button
		type="submit"
		class="bg-purple-600 text-white p-2 rounded"
	>
		Upload
	</button>
</form>