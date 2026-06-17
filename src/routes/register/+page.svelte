<script>
    // Formulardaten vom Server (z.B. Fehlermeldungen)
    let { form } = $props();

    // State für das Anzeigen/Verstecken des Passworts
    let showPassword = $state(false);
</script>

<!-- Gesamter Container, zentriert das Formular auf der Seite -->
<div class="min-h-screen flex items-center justify-center bg-slate-100 p-5 antialiased font-sans">

    <!-- Registrierungsbox -->
    <div class="relative bg-white px-8 py-12 sm:px-10 w-full max-w-[450px] rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

        <!-- Dekorative Kreise für das Design -->
        <div class="absolute w-[200px] h-[200px] top-0 right-0 z-0 pointer-events-none opacity-20">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500 rounded-full blur-2xl animate-pulse"></div>
            <div class="absolute -top-20 -right-16 w-36 h-36 bg-purple-500 rounded-full blur-2xl animate-pulse delay-75"></div>
        </div>

        <!-- Überschrift der Registrierungsseite -->
        <div class="relative z-10 mb-10">
            <p class="text-slate-400 text-sm font-medium">Erstelle dein kostenloses Konto</p>
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Registrieren</h1>
        </div>

        <!-- Fehlermeldung anzeigen, falls Registrierung fehlschlägt -->
        {#if form?.error}
            <div class="bg-rose-50 text-rose-600 text-sm font-medium px-4 py-3 rounded-xl mb-6 border border-rose-100 flex items-center gap-2 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 flex-shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span>{form.error}</span>
            </div>
        {/if}

        <!-- Registrierungsformular -->
        <form action="?/register" method="POST" class="space-y-6 relative z-10">

            <!-- Eingabefeld für den Benutzernamen -->
            <div class="relative">
                <input
                    type="text"
                    id="username"
                    name="username"
                    autocomplete="username"
                    required
                    placeholder=" "
                    class="peer w-full h-12 border border-slate-300 rounded-lg px-3.5 pt-4 pb-1 text-sm text-slate-900 bg-white
                           focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                />
                <label
                    for="username"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 bg-white px-1 pointer-events-none transition-all duration-200
                           peer-focus:top-0 peer-focus:text-xs peer-focus:text-indigo-600 peer-focus:font-medium
                           peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-500"
                >
                    Username
                </label>
            </div>

            <!-- Passwort-Eingabefeld -->
            <div class="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autocomplete="new-password"
                    required
                    placeholder=" "
                    class="peer w-full h-12 border border-slate-300 rounded-lg pl-3.5 pr-12 pt-4 pb-1 text-sm text-slate-900 bg-white
                           focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                />

                <!-- Beschriftung des Passwortfeldes -->
                <label
                    for="password"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 bg-white px-1 pointer-events-none transition-all duration-200
                           peer-focus:top-0 peer-focus:text-xs peer-focus:text-indigo-600 peer-focus:font-medium
                           peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-500"
                >
                    Password
                </label>

                <!-- Button zum Anzeigen oder Verstecken des Passworts -->
                <button
                    type="button"
                    onclick={() => showPassword = !showPassword}
                    class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    aria-label="Passwort anzeigen/verstecken"
                >
                    {#if showPassword}
                        <!-- Auge durchgestrichen = Passwort sichtbar -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                            <line x1="2" y1="2" x2="22" y2="22"/>
                        </svg>
                    {:else}
                        <!-- Normales Auge = Passwort versteckt -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    {/if}
                </button>
            </div>

            <!-- Registrierungsbutton -->
            <button
                type="submit"
                class="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
                Sign Up
            </button>
        </form>

        <!-- Link zur Login-Seite -->
        <p class="text-slate-500 text-sm text-center mt-6 relative z-10">
            Already have an account?
            <a href="/login" class="text-indigo-600 font-bold hover:underline ml-1">Sign in</a>
        </p>
    </div>
</div>