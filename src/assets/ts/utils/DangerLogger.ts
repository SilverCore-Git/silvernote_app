
import { dev } from "@/../package.json";

const log = () => {
    console.log(
      '%cSTOP!',
      'color: red; font-size: 60px; font-weight: bold; text-shadow: 2px 2px black;'
    )

    console.log(
      '%cCeci est une fonctionnalité du navigateur destinée aux développeurs.\n\n' +
      'Si quelqu’un vous a demandé de copier-coller quelque chose ici, ' +
      'il s’agit probablement d’une tentative de piratage.\n\n' +
      'Ne collez jamais de code que vous ne comprenez pas.',
      'font-size: 16px;'
    )
}


if (dev) {
    log()
    setInterval(() => {
        log();
    }, 10000) // 10s
}