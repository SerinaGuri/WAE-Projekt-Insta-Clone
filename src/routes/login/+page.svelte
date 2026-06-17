<script>
	let { form } = $props();

	let showPassword = $state(false);
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-100 p-4 sm:p-5 antialiased font-sans">

	<div class="relative bg-white px-5 py-8 sm:px-8 sm:py-12 w-full max-w-112,5 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

		<div class="relative z-10 mb-8 sm:mb-10">
			<p class="text-slate-400 text-sm font-medium">
				Please enter your details
			</p>

			<h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
				Welcome Back
			</h1>
		</div>

		{#if form?.error}
			<div class="bg-rose-50 text-rose-600 text-sm font-medium px-4 py-3 rounded-xl mb-6 border border-rose-100 flex items-center gap-2 relative z-10">
				<p>! Falsches Passwort</p>
			</div>
		{/if}

		<form action="?/login" method="POST" class="space-y-6 relative z-10">

			<div class="relative">
				<input
					type="text"
					id="username"
					name="username"
					autocomplete="username"
					required
					placeholder=" "
					class="peer w-full h-12 border border-slate-300 rounded-lg px-3.5 pt-4 pb-1 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
				/>

				<label
					for="username"
					class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 bg-white px-1 pointer-events-none transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-indigo-600 peer-focus:font-medium peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-500"
				>
					Username
				</label>
			</div>

			<div class="relative">
				<input
					type={showPassword ? "text" : "password"}
					id="password"
					name="password"
					autocomplete="new-password"
					required
					placeholder=" "
					class="peer w-full h-12 border border-slate-300 rounded-lg pl-3.5 pr-12 pt-4 pb-1 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
				/>

				<label
					for="password"
					class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 bg-white px-1 pointer-events-none transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-indigo-600 peer-focus:font-medium peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-500"
				>
					Password
				</label>

				<button
					type="button"
					onclick={() => (showPassword = !showPassword)}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
				>
					{#if showPassword}
						Hide
					{:else}
						Show
					{/if}
				</button>
			</div>

			<button
				type="submit"
				class="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
			>
				Sign In
			</button>
		</form>

		<p class="text-slate-500 text-sm text-center mt-6 relative z-10">
			Don't have an account?
			<a
				href="/register"
				class="text-indigo-600 font-bold hover:underline ml-1"
			>
				Sign up
			</a>
		</p>
	</div>
</div>