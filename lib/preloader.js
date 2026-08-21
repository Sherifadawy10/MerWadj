/*
 * Shared between the client PreloaderManager and the server layout.
 * It cannot live in PreloaderManager: that module is "use client", and a
 * plain value imported from a client module into a Server Component comes
 * back as a throwing stub, not the string.
 */
export const PRELOADER_SESSION_KEY = "merwadj.preloaded";

/* Keep in sync with the preloader timeline in styles/globals.css. */
export const PRELOADER_MS = 1300;
