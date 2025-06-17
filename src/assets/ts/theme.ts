const prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

function init_theme(): void {

  if (prefersDark) toggle_theme(false)
  else toggle_theme(true)

}

function toggle_theme(light: boolean): void {

  const body = document.body

  if (light) {
    body.classList.add('light');
    body.classList.remove('dark');
  } else {
    body.classList.add('dark');
    body.classList.remove('light');
  }

  localStorage.setItem('theme', light ? 'light' : 'dark');

}

export {
    init_theme,
    toggle_theme
}