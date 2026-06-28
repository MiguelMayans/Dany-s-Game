# 🐻 ¡Palabras con TOTO! — El juego de Dani

> Un juego de palabras para aprender, jugar y pitarle el teclado a Toto el osito.

![Hecho con amor para Dani](https://img.shields.io/badge/hecho%20con-%F0%9F%92%9C%20para%20Dani-ff6b6b?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🎮 ¿Qué es esto?

**¡Palabras con TOTO!** es un juego web súper colorido pensado para que Dani practique palabras de una forma divertida. Cada palabra aparece con una ilustración y Dani solo tiene que pulsar las letras en el orden correcto. Si acierta, ¡la letra explota con chispitas y suena una nota musical! Si se equivoca… un simpático "boing" le avisa de que esa no es.

Hay confeti 🎉, logros 🏆, rachas de aciertos 🔥 y hasta un osito animado llamado **Toto** que celebra cada victoria.

---

## ✨ Características principales

- 🐻 **Toto el oso** te da la bienvenida y baila mientras juegas.
- 🖼️ **Imágenes para cada palabra**: coches, animales, frutas, dinosaurios, cohetes…
- 🔊 **Sonidos generados al vuelo**: campanitas cuando aciertas, "boing" cuando fallas y fanfarrias al completar una palabra.
- 🗣️ **Lectura en voz alta**: cada palabra se lee sola y también se puede escuchar de nuevo.
- ⌨️ **Dos formas de jugar**: tocando el teclado en pantalla o usando el teclado real.
- 🏅 **Logros y rachas**: Aprendiz, Experto, Maestro, rachas de 3, 5, 10…
- 💾 **Progreso guardado**: localStorage recuerda cuántas palabras has hecho hoy y tu mejor racha.
- 🌈 **Diseño tipo dibujo animado**: bordes gordos, sombras, colores pastel y mucha alegría.

---

## 🚀 ¿Cómo jugar?

1. Abre la página y saluda a Toto 🐻
2. Elige un nivel:
   - 🟡 **Nivel 1**: palabras cortas y fáciles (`sol`, `gato`, `casa`, `pelota`…)
   - 🔵 **Nivel 2**: palabras un poco más difíciles (`elefante`, `mariposa`, `cohete`, `dinosaurio`…)
3. Mira la imagen y escucha la palabra.
4. Pulsa la primera letra, luego la segunda… ¡hasta completarla toda!
5. Al terminar, Toto celebra con confeti y música 🎊

---

## 🛠️ Tecnologías

| Tecnología | Para qué se usa |
|------------|-----------------|
| ⚛️ **React 19** + **Vite** | La interfaz súper rápida |
| 🔷 **TypeScript** | Para no equivocarnos de letra |
| 🎨 **Tailwind CSS v4** | Todo el colorido y las animaciones |
| 🎊 **canvas-confetti** | ¡Fiesta de confeti! |
| 🎵 **Web Audio API** | Música y efectos sin archivos de sonido |
| 🗣️ **Web Speech API** | Lee las palabras en voz alta |

---

## 📦 Instalación y desarrollo

> Necesitas tener [Node.js](https://nodejs.org/) instalado (recomendado: v20 o superior) y preferiblemente `pnpm`.

```bash
# 1. Instala las dependencias
pnpm install

# 2. Arranca el juego en modo desarrollo
pnpm dev

# 3. Abre el enlace que te aparece (normalmente http://localhost:5173)
```

Otros comandos útiles:

```bash
pnpm build     # Compila la versión de producción en /dist
pnpm preview   # Previsualiza la versión de producción
pnpm lint      # Revisa que todo esté ordenadito
```

---

## 🗂️ Estructura del proyecto

```
dans-game/
├── public/images/          # 🖼️ Dibujitos de cada palabra (SVG)
├── src/
│   ├── components/         # 🧩 Pantallas y botones
│   │   ├── Game.tsx        # Pantalla principal del juego
│   │   ├── StartScreen.tsx # Menú con Toto
│   │   ├── VictoryScreen.tsx # ¡Nivel completado!
│   │   └── ui/             # Botones, tarjetas, letras, teclado y Toto
│   ├── data/words.ts       # 📚 Todas las palabras por nivel
│   ├── hooks/useGame.ts    # 🎮 Lógica del juego + progreso guardado
│   ├── reducers/gameReducer.ts # Reglas de qué pasa al pulsar letras
│   ├── utils/
│   │   ├── sounds.ts       # 🎼 Música y efectos
│   │   ├── speech.ts       # 🗣️ Voz
│   │   └── gameHelpers.ts  # 🔧 Funciones para barajar palabras
│   ├── types/game.ts       # Tipos y logros
│   └── index.css           # 🌈 Colores y animaciones
└── package.json
```

---

## 🎯 Logros que puedes conseguir

| Logro | Cuándo lo ganas |
|-------|-----------------|
| 🥉 Aprendiz | Completar 5 palabras en total |
| 🥈 Experto | Completar 20 palabras en total |
| 🥇 Maestro | Completar 50 palabras en total |
| 🔥 Racha de 3 | 3 palabras seguidas sin fallar |
| ⚡ Racha de 5 | 5 palabras seguidas sin fallar |
| 🌟 Racha de 10 | 10 palabras seguidas sin fallar |
| 🏆 Mejor racha 10 | Llegar a una racha de 10 |

---

## 💡 Notas para los mayores

- El juego guarda el progreso en el navegador (`localStorage`), así que si Dani vuelve mañana, seguirá con sus palabras contadas del día.
- No hay sonidos externos: todo se genera con código, así que no hay que preocuparse por archivos perdidos.
- El juego respeta `prefers-reduced-motion`: si el sistema pide menos movimiento, las animaciones se desactivan solitas.

---

## 🧒 Palabras para Dani

> "¡Hola Dani! Toto ha preparado un montón de palabras para ti. ¿Cuántas logros puedes conseguir hoy? ¡A jugar! 🐻🎉"

---

Hecho con mucho cariño para Dani ❤️
