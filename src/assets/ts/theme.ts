import type { Appearance } from '@clerk/types'

const mediaQuery: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

// Vérifie si le système préfère le thème sombre
function prefersDark(): boolean {
  return !mediaQuery.matches;
}

// Initialise le thème selon préférence stockée ou OS
function init_theme(): void {
  const storedTheme: string | null = localStorage.getItem("theme");

  if (storedTheme === "light") {
    toggle_theme(true);
  } else if (storedTheme === "dark") {
    toggle_theme(false);
  } else {
    toggle_theme(prefersDark(), true);
  }
}

// Applique un thème : true = light, false = dark
function toggle_theme(light: boolean, privat?: boolean): void {
  const body: HTMLElement = document.body;

  if (light) {
    body.classList.add("light");
    body.classList.remove("dark");
  } else {
    body.classList.add("dark");
    body.classList.remove("light");
  }

  if (!privat) localStorage.setItem('theme', light ? 'light' : 'dark');

}

// Change la préférence utilisateur
function setThemePreference(theme: "light" | "dark" | "default"): void {
  localStorage.setItem("theme", theme);

  if (theme === "light") {
    toggle_theme(true);
  } else if (theme === "dark") {
    toggle_theme(false);
  } else {
    toggle_theme(prefersDark(), true);
  }
}


mediaQuery.addEventListener("change", () => {
  if (localStorage.getItem("theme") === "default" || !localStorage.getItem("theme")) {
    toggle_theme(prefersDark(), true);
  }
});


const clerkAppearanceSettings: Appearance = {

  variables: {

    colorPrimary: "var(--btn)",

    colorTextSecondary: "var(--text)",
    colorText: "var(--text)",
    colorTextOnPrimaryBackground: "var(--text)",
    colorInputText: 'var(--text)',
    colorNeutral: "var(--text)",

    colorForeground: "var(--text)",
    colorPrimaryForeground: "var(--text-strong)",

    colorMutedForeground: "var(--text-little)",
    colorMuted: "var(--bg)",

    colorBackground: "var(--bg)",
    colorInputForeground: "var(--text-little)",
    colorInput: "var(--bg2)",

    colorRing: "var(--btn)",

  }

}



export {
  init_theme,
  toggle_theme,
  setThemePreference,
  clerkAppearanceSettings
};
