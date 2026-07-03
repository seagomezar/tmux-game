// levels.js
//
// All game content. Supports bilingual content (English and Spanish) via objects.

export const DEFAULT_LIMIT_MS = 6000;

const key = (ref, prompt, effect, limitMs = DEFAULT_LIMIT_MS) => ({
  type: 'key',
  ref,
  prompt,
  effect,
  limitMs,
});

const command = (ref, prompt, effect, limitMs = 9000) => ({
  type: 'command',
  ref,
  prompt,
  effect,
  limitMs,
});

const terminal = (ref, prompt, limitMs = 7000) => ({
  type: 'terminal',
  ref,
  prompt,
  limitMs,
});

export const LEVELS = [
  // 1 -----------------------------------------------------------------------
  {
    id: 'prefix',
    title: {
      en: 'The Prefix',
      es: 'El Prefijo',
    },
    concept: {
      en: `tmux listens for one special key combination called the **prefix**, then interprets the next key as a command. The default prefix is **Ctrl-b**.

Almost every tmux shortcut is: press **Ctrl-b**, release, then press one more key. This is the same on macOS, Linux and Windows - tmux runs inside your terminal, so there is no Cmd-b.

Two commands unlock everything else: the built-in key list, and the command prompt.`,
      es: `tmux escucha una combinación de teclas especial llamada **prefijo**, luego interpreta la siguiente tecla como un comando. El prefijo predeterminado es **Ctrl-b**.

Casi todos los atajos de tmux son: presionar **Ctrl-b**, soltar y luego presionar una tecla más. Esto es igual en macOS, Linux y Windows - tmux se ejecuta dentro de tu terminal, por lo que no existe Cmd-b.

Dos comandos desbloquean todo lo demás: la lista de teclas integrada y la línea de comandos.`,
    },
    diagram: {
      en: `Ctrl-b  then  ?     ->  show every binding
Ctrl-b  then  :     ->  type a command`,
      es: `Ctrl-b  luego ?     ->  mostrar todos los atajos
Ctrl-b  luego :     ->  escribir un comando`,
    },
    challenges: [
      key('list-keys', {
        en: 'Open the built-in list of all key bindings.',
        es: 'Abre la lista integrada de todas las combinaciones de teclas.',
      }, 'flash'),
      key('command-prompt', {
        en: 'Open the tmux command prompt.',
        es: 'Abre la línea de comandos de tmux.',
      }, 'prompt'),
      key('list-keys', {
        en: 'Show the key bindings again - build the habit.',
        es: 'Muestra las combinaciones de teclas de nuevo - crea el hábito.',
      }, 'flash'),
    ],
  },

  // 2 -----------------------------------------------------------------------
  {
    id: 'sessions',
    title: {
      en: 'Sessions',
      es: 'Sesiones',
    },
    concept: {
      en: `A **session** is a collection of windows that keeps running even after you disconnect. Detach, close your laptop, reconnect later, and everything is exactly as you left it.

You can run many named sessions and jump between them.`,
      es: `Una **sesión** es una colección de ventanas que sigue ejecutándose incluso después de desconectarte. Desconéctate, cierra tu laptop, vuelve a conectarte más tarde, y todo estará exactamente como lo dejaste.

Puedes ejecutar muchas sesiones nombradas y saltar entre ellas.`,
    },
    diagram: {
      en: `session: work  [detached]  ->  reattach anytime
Ctrl-b d  detach     Ctrl-b s  switch     Ctrl-b $  rename`,
      es: `sesión: trabajo  [desconectada] ->  reconectar en cualquier momento
Ctrl-b d  desconectar Ctrl-b s  cambiar     Ctrl-b $  renombrar`,
    },
    challenges: [
      key('session-detach', {
        en: 'Detach from this session (leave it running).',
        es: 'Desconéctate de esta sesión (déjala ejecutándose).',
      }, 'detach'),
      key('session-list', {
        en: 'Open the interactive session switcher.',
        es: 'Abre el selector interactivo de sesiones.',
      }, 'list'),
      key('session-rename', {
        en: 'Rename the current session.',
        es: 'Renombra la sesión actual.',
      }, 'rename'),
      key('session-next', {
        en: 'Jump to the next session.',
        es: 'Salta a la siguiente sesión.',
      }, 'shift'),
      key('session-prev', {
        en: 'Jump to the previous session.',
        es: 'Salta a la sesión anterior.',
      }, 'shift'),
    ],
  },

  // 3 -----------------------------------------------------------------------
  {
    id: 'windows-basics',
    title: {
      en: 'Windows: Basics',
      es: 'Ventanas: Aspectos Básicos',
    },
    concept: {
      en: `A **window** is like a tab inside a session - it fills the whole terminal and appears in the status bar at the bottom. Each session can hold many windows.`,
      es: `Una **ventana** es como una pestaña dentro de una sesión - ocupa toda la terminal y aparece en la barra de estado en la parte inferior. Cada sesión puede contener muchas ventanas.`,
    },
    diagram: {
      en: `[0:vim] [1:shell] [2:logs]      <- status bar (windows)
Ctrl-b c  create   Ctrl-b ,  rename   Ctrl-b & kill`,
      es: `[0:vim] [1:shell] [2:logs]      <- barra de estado (ventanas)
Ctrl-b c  crear    Ctrl-b ,  renombrar  Ctrl-b & cerrar`,
    },
    challenges: [
      key('window-create', {
        en: 'Create a new window.',
        es: 'Crea una nueva ventana.',
      }, 'window-add'),
      key('window-rename', {
        en: 'Rename the current window.',
        es: 'Renombra la ventana actual.',
      }, 'rename'),
      key('window-next', {
        en: 'Move to the next window.',
        es: 'Ve a la siguiente ventana.',
      }, 'window-next'),
      key('window-prev', {
        en: 'Move to the previous window.',
        es: 'Ve a la ventana anterior.',
      }, 'window-prev'),
      key('window-select-1', {
        en: 'Jump straight to window number 1.',
        es: 'Salta directamente a la ventana número 1.',
      }, 'window-select'),
      key('window-kill', {
        en: 'Kill (close) the current window.',
        es: 'Cierra (mata) la ventana actual.',
      }, 'window-kill'),
    ],
  },

  // 4 -----------------------------------------------------------------------
  {
    id: 'windows-navigation',
    title: {
      en: 'Windows: Navigation',
      es: 'Ventanas: Navegación',
    },
    concept: {
      en: `When you have many windows, you need faster ways to find them than stepping one at a time. tmux gives you an interactive list, a jump-to-last toggle, and name search.`,
      es: `Cuando tienes muchas ventanas, necesitas formas más rápidas de encontrarlas que ir de una en una. tmux te ofrece una lista interactiva, un atajo para alternar a la última ventana usada y búsqueda por nombre.`,
    },
    diagram: {
      en: `Ctrl-b w  choose from list
Ctrl-b l  last window (toggle)      Ctrl-b f  find by name`,
      es: `Ctrl-b w  elegir de la lista
Ctrl-b l  última ventana (alternar)  Ctrl-b f  buscar por nombre`,
    },
    challenges: [
      key('window-list', {
        en: 'Open the interactive window chooser.',
        es: 'Abre el selector interactivo de ventanas.',
      }, 'list'),
      key('window-last', {
        en: 'Toggle back to the last window you used.',
        es: 'Alterna de regreso a la última ventana que usaste.',
      }, 'window-next'),
      key('window-find', {
        en: 'Search for a window by name.',
        es: 'Busca una ventana por nombre.',
      }, 'prompt'),
    ],
  },

  // 5 -----------------------------------------------------------------------
  {
    id: 'panes-splitting',
    title: {
      en: 'Panes: Splitting',
      es: 'Paneles: División',
    },
    concept: {
      en: `A **pane** is a split of a window - multiple shells side by side in the same view.

A tip on tmux's naming: **Ctrl-b %** makes a **left/right** split (tmux calls this -h), and **Ctrl-b "** makes a **top/bottom** split (tmux calls this -v). Learn them by the picture, not the flag.`,
      es: `Un **panel** es una división de una ventana - múltiples terminales lado a lado en la misma vista.

Un consejo sobre la nomenclatura de tmux: **Ctrl-b %** realiza una división **izquierda/derecha** (tmux llama a esto -h), y **Ctrl-b "** realiza una división **superior/inferior** (tmux llama a esto -v). Aprende por la imagen, no por la bandera.`,
    },
    diagram: {
      en: `Ctrl-b %            Ctrl-b "
+------+------+      +-------------+
|      |      |      |             |
|      |      |      +-------------+
+------+------+      |             |
 left / right         top / bottom`,
      es: `Ctrl-b %            Ctrl-b "
+------+------+      +-------------+
|      |      |      |             |
|      |      |      +-------------+
+------+------+      |             |
 izq / der            sup / inf`,
    },
    challenges: [
      key('pane-split-vertical', {
        en: 'Split into LEFT and RIGHT panes.',
        es: 'Divide en paneles IZQUIERDO y DERECHO.',
      }, 'split-lr'),
      key('pane-split-horizontal', {
        en: 'Split into TOP and BOTTOM panes.',
        es: 'Divide en paneles SUPERIOR e INFERIOR.',
      }, 'split-tb'),
      key('pane-split-vertical', {
        en: 'Split left/right again.',
        es: 'Divide de nuevo a la izquierda/derecha.',
      }, 'split-lr'),
      key('pane-split-horizontal', {
        en: 'Split top/bottom again.',
        es: 'Divide de nuevo arriba/abajo.',
      }, 'split-tb'),
    ],
  },

  // 6 -----------------------------------------------------------------------
  {
    id: 'panes-navigation',
    title: {
      en: 'Panes: Navigation',
      es: 'Paneles: Navegación',
    },
    concept: {
      en: `Once a window has several panes, move between them with the arrow keys after the prefix. You can also cycle, jump to the last pane, or flash the pane numbers.`,
      es: `Una vez que una ventana tiene varios paneles, muévete entre ellos con las teclas de flecha después del prefijo. También puedes ciclar, saltar al último panel o parpadear los números de los paneles.`,
    },
    diagram: {
      en: `Ctrl-b <arrow>  move by direction
Ctrl-b o  cycle    Ctrl-b ;  last pane    Ctrl-b q  show numbers`,
      es: `Ctrl-b <flecha> mover por dirección
Ctrl-b o  ciclar    Ctrl-b ;  último panel Ctrl-b q  mostrar números`,
    },
    challenges: [
      key('pane-left', {
        en: 'Move to the pane on the LEFT.',
        es: 'Muévete al panel de la IZQUIERDA.',
      }, 'focus-left'),
      key('pane-right', {
        en: 'Move to the pane on the RIGHT.',
        es: 'Muévete al panel de la DERECHA.',
      }, 'focus-right'),
      key('pane-up', {
        en: 'Move to the pane ABOVE.',
        es: 'Muévete al panel de ARRIBA.',
      }, 'focus-up'),
      key('pane-down', {
        en: 'Move to the pane BELOW.',
        es: 'Muévete al panel de ABAJO.',
      }, 'focus-down'),
      key('pane-cycle', {
        en: 'Cycle to the next pane.',
        es: 'Cicla al siguiente panel.',
      }, 'focus-cycle'),
      key('pane-last', {
        en: 'Jump to the last active pane.',
        es: 'Salta al último panel activo.',
      }, 'focus-cycle'),
      key('pane-numbers', {
        en: 'Flash the pane numbers on screen.',
        es: 'Muestra brevemente los números de panel en pantalla.',
      }, 'numbers'),
    ],
  },

  // 7 -----------------------------------------------------------------------
  {
    id: 'panes-management',
    title: {
      en: 'Panes: Management',
      es: 'Paneles: Gestión',
    },
    concept: {
      en: `Panes can be zoomed to fill the window, swapped around, killed, or broken out into their own window. **Ctrl-b z** zoom is the one you'll reach for constantly.`,
      es: `Los paneles se pueden maximizar para llenar la ventana, intercambiar de lugar, cerrar o separar en su propia ventana. El zoom con **Ctrl-b z** es el que usarás constantemente.`,
    },
    diagram: {
      en: `Ctrl-b z  zoom/unzoom     Ctrl-b x  kill pane
Ctrl-b { / }  swap prev/next    Ctrl-b !  break to window`,
      es: `Ctrl-b z  zoom/unzoom     Ctrl-b x  cerrar panel
Ctrl-b { / }  intercambiar ant/sig  Ctrl-b !  separar a ventana`,
    },
    challenges: [
      key('pane-zoom', {
        en: 'Zoom the current pane to fill the window.',
        es: 'Maximiza (zoom) el panel actual para llenar la ventana.',
      }, 'zoom'),
      key('pane-swap-right', {
        en: 'Swap this pane with the next one.',
        es: 'Intercambia este panel con el siguiente.',
      }, 'swap'),
      key('pane-swap-left', {
        en: 'Swap this pane with the previous one.',
        es: 'Intercambia este panel con el anterior.',
      }, 'swap'),
      key('pane-break', {
        en: 'Break this pane out into its own window.',
        es: 'Separa este panel en su propia ventana.',
      }, 'window-add'),
      key('pane-kill', {
        en: 'Kill (close) the current pane.',
        es: 'Cierra (mata) el panel actual.',
      }, 'pane-kill'),
    ],
  },

  // 8 -----------------------------------------------------------------------
  {
    id: 'resize-layouts',
    title: {
      en: 'Resizing & Layouts',
      es: 'Redimensionamiento y Diseños',
    },
    concept: {
      en: `Fine-tune pane sizes by holding a modifier with the arrows after the prefix: **Ctrl** for one cell, **Alt** for five. Or press **Space** to cycle through tmux's preset layouts.`,
      es: `Ajusta el tamaño de los paneles manteniendo presionado un modificador con las flechas después del prefijo: **Ctrl** para una celda, **Alt** para cinco. O presiona **Espacio** para ciclar a través de los diseños preestablecidos de tmux.`,
    },
    diagram: {
      en: `Ctrl-b Ctrl-<arrow>  resize by 1
Ctrl-b Alt-<arrow>   resize by 5      Ctrl-b Space  cycle layouts`,
      es: `Ctrl-b Ctrl-<flecha> redimensionar por 1
Ctrl-b Alt-<flecha>  redimensionar por 5   Ctrl-b Espacio ciclar diseños`,
    },
    challenges: [
      key('resize-right', {
        en: 'Resize the pane one cell to the RIGHT.',
        es: 'Redimensiona el panel una celda a la DERECHA.',
      }, 'resize'),
      key('resize-left', {
        en: 'Resize the pane one cell to the LEFT.',
        es: 'Redimensiona el panel una celda a la IZQUIERDA.',
      }, 'resize'),
      key('resize-left-big', {
        en: 'Resize the pane FIVE cells to the left.',
        es: 'Redimensiona el panel CINCO celdas a la izquierda.',
      }, 'resize'),
      key('layout-cycle', {
        en: 'Cycle to the next preset layout.',
        es: 'Cicla al siguiente diseño preestablecido.',
      }, 'layout'),
    ],
  },

  // 9 -----------------------------------------------------------------------
  {
    id: 'copy-mode',
    title: {
      en: 'Copy Mode & Buffers',
      es: 'Modo de Copia y Búferes',
    },
    concept: {
      en: `**Copy mode** lets you scroll back through output and select text with the keyboard - no mouse needed. Copied text goes into paste **buffers** you can reuse.`,
      es: `El **modo de copia** te permite desplazarte hacia atrás por la salida y seleccionar texto con el teclado, sin necesidad de ratón. El texto copiado va a **búferes** de pegado que puedes reutilizar.`,
    },
    diagram: {
      en: `Ctrl-b [  enter copy mode (scroll/select)
Ctrl-b ]  paste     Ctrl-b =  choose buffer     Ctrl-b #  list buffers`,
      es: `Ctrl-b [  entrar a modo copia (desplazar/seleccionar)
Ctrl-b ]  pegar     Ctrl-b =  elegir búfer      Ctrl-b #  listar búferes`,
    },
    challenges: [
      key('copy-enter', {
        en: 'Enter copy mode to scroll and select.',
        es: 'Entra en modo de copia para desplazarte y seleccionar.',
      }, 'copy-mode'),
      key('copy-paste', {
        en: 'Paste the most recent buffer.',
        es: 'Pega el búfer más reciente.',
      }, 'paste'),
      key('buffer-choose', {
        en: 'Choose which buffer to paste from.',
        es: 'Elige de qué búfer pegar.',
      }, 'list'),
      key('buffer-list', {
        en: 'List all paste buffers.',
        es: 'Lista todos los búferes de pegado.',
      }, 'list'),
    ],
  },

  // 10 ----------------------------------------------------------------------
  {
    id: 'config-command',
    title: {
      en: 'Config & Command Mode',
      es: 'Configuración y Modo Comando',
    },
    concept: {
      en: `The command prompt (**Ctrl-b :**) runs tmux commands directly - the same commands you'd put in **~/.tmux.conf**. Two favorites: enabling the mouse, and synchronizing typing across every pane.

You'll also mark panes and pop up a clock.`,
      es: `La línea de comandos (**Ctrl-b :**) ejecuta comandos de tmux directamente - los mismos comandos que pondrías en **~/.tmux.conf**. Dos favoritos: habilitar el ratón y sincronizar la escritura en todos los paneles.

También marcarás paneles y abrirás un reloj.`,
    },
    diagram: {
      en: `Ctrl-b :  then type a command
  set -g mouse on
  setw synchronize-panes
Ctrl-b m / M  mark / clear      Ctrl-b t  clock`,
      es: `Ctrl-b :  luego escribe un comando
  set -g mouse on
  setw synchronize-panes
Ctrl-b m / M  marcar / limpiar  Ctrl-b t  reloj`,
    },
    challenges: [
      command('cmd-mouse-on', {
        en: 'Open the prompt and enable mouse support.',
        es: 'Abre la línea de comandos y habilita el soporte para ratón.',
      }, 'prompt'),
      command('cmd-synchronize', {
        en: 'Open the prompt and toggle synchronize-panes.',
        es: 'Abre la línea de comandos e intercambia la sincronización de paneles.',
      }, 'prompt'),
      key('mark-pane', {
        en: 'Mark the current pane.',
        es: 'Marca el panel actual.',
      }, 'mark'),
      key('mark-clear', {
        en: 'Clear the marked pane.',
        es: 'Limpia el panel marcado.',
      }, 'mark'),
      key('clock', {
        en: 'Show the big clock.',
        es: 'Muestra el reloj grande.',
      }, 'clock'),
    ],
  },

  // 11 ----------------------------------------------------------------------
  {
    id: 'terminal-and-boss',
    title: {
      en: 'Terminal Shortcuts & Expert Boss Round',
      es: 'Atajos de Terminal y Ronda del Jefe Experto',
    },
    concept: {
      en: `One thing that DOES change per OS: your **terminal emulator's** own copy/paste/new-tab shortcuts, which live outside tmux. On macOS they use **Cmd**; on Linux/Windows they use **Ctrl-Shift**.

Then it's the boss round - a fast mixed drill of everything you've learned. Clear it and you're a tmux expert.`,
      es: `Una cosa que SÍ cambia por sistema operativo: los atajos de copiar/pegar/nueva pestaña de tu **emulador de terminal**, que viven fuera de tmux. En macOS usan **Cmd**; en Linux/Windows usan **Ctrl-Shift**.

Luego viene la ronda del jefe: una práctica rápida mixta de todo lo que has aprendido. ¡Supérala y serás un experto en tmux!`,
    },
    diagram: {
      en: `Terminal (NOT tmux):
  macOS: Cmd-C / Cmd-V / Cmd-T
  Linux/Win: Ctrl-Shift-C / Ctrl-Shift-V / Ctrl-Shift-T
Then: rapid-fire mixed tmux drill`,
      es: `Terminal (NO tmux):
  macOS: Cmd-C / Cmd-V / Cmd-T
  Linux/Win: Ctrl-Shift-C / Ctrl-Shift-V / Ctrl-Shift-T
Luego: práctica rápida de tmux mixto`,
    },
    challenges: [
      terminal('term-copy', {
        en: 'Copy selected text in your terminal (OS-specific).',
        es: 'Copia texto seleccionado en tu terminal (específico del SO).',
      }),
      terminal('term-paste', {
        en: 'Paste in your terminal (OS-specific).',
        es: 'Pega en tu terminal (específico del SO).',
      }),
      terminal('term-new-tab', {
        en: 'Open a new terminal tab (OS-specific).',
        es: 'Abre una nueva pestaña de terminal (específico del SO).',
      }),
      // Boss round: fast mixed tmux recall (tighter limits).
      key('window-create', {
        en: 'BOSS: new window.',
        es: 'JEFE: nueva ventana.',
      }, 'window-add', 4000),
      key('pane-split-vertical', {
        en: 'BOSS: split left/right.',
        es: 'JEFE: dividir izquierda/derecha.',
      }, 'split-lr', 4000),
      key('pane-split-horizontal', {
        en: 'BOSS: split top/bottom.',
        es: 'JEFE: dividir arriba/abajo.',
      }, 'split-tb', 4000),
      key('pane-zoom', {
        en: 'BOSS: zoom the pane.',
        es: 'JEFE: maximizar panel (zoom).',
      }, 'zoom', 4000),
      key('session-detach', {
        en: 'BOSS: detach the session.',
        es: 'JEFE: desconectar sesión.',
      }, 'detach', 4000),
      key('copy-enter', {
        en: 'BOSS: enter copy mode.',
        es: 'JEFE: entrar a modo copia.',
      }, 'copy-mode', 4000),
      key('command-prompt', {
        en: 'BOSS: open the command prompt.',
        es: 'JEFE: abrir línea de comandos.',
      }, 'prompt', 4000),
    ],
  },
];
