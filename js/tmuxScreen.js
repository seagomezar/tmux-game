// tmuxScreen.js
//
// A tiny mock tmux renderer. It keeps a simple model of windows and panes and
// draws them into a container, then animates in response to "effects" emitted
// by challenges. This is purely cosmetic reinforcement - it teaches what each
// shortcut *does* - so it never blocks gameplay.

export class TmuxScreen {
  /** @param {HTMLElement} root Container to render into. */
  constructor(root) {
    this.root = root;
    this.reset();
  }

  reset() {
    this.windows = [
      { name: 'bash', active: true },
      { name: 'vim', active: false },
    ];
    // Pane layout is a small tree-ish list; we only need enough to look real.
    this.panes = [{ id: 1, active: true }];
    this.layout = 'single'; // 'single' | 'lr' | 'tb' | 'grid'
    this.zoomed = false;
    this.copyMode = false;
    this.render();
  }

  /** Apply an effect from a challenge, animating the mock screen. */
  applyEffect(effect) {
    switch (effect) {
      case 'window-add':
        this.windows.forEach((w) => (w.active = false));
        this.windows.push({ name: `sh${this.windows.length}`, active: true });
        break;
      case 'window-kill':
        if (this.windows.length > 1) this.windows.pop();
        this.setActiveWindow(this.windows.length - 1);
        break;
      case 'window-next':
        this.cycleWindow(1);
        break;
      case 'window-prev':
        this.cycleWindow(-1);
        break;
      case 'window-select':
        this.setActiveWindow(0);
        break;
      case 'split-lr':
        this.layout = this.panes.length >= 2 ? 'grid' : 'lr';
        this.addPane();
        break;
      case 'split-tb':
        this.layout = this.panes.length >= 2 ? 'grid' : 'tb';
        this.addPane();
        break;
      case 'pane-kill':
        if (this.panes.length > 1) {
          this.panes.pop();
          if (this.panes.length < 2) this.layout = 'single';
        }
        this.setActivePane(this.panes.length - 1);
        break;
      case 'zoom':
        this.zoomed = !this.zoomed;
        break;
      case 'copy-mode':
        this.copyMode = true;
        break;
      case 'paste':
        this.copyMode = false;
        break;
      case 'focus-left':
      case 'focus-up':
        this.cyclePane(-1);
        break;
      case 'focus-right':
      case 'focus-down':
      case 'focus-cycle':
        this.cyclePane(1);
        break;
      case 'clock':
        this.flashOverlay('CLOCK');
        break;
      case 'numbers':
        this.flashOverlay('PANE #');
        break;
      default:
        // flash/prompt/list/rename/shift/resize/layout/mark/swap:
        this.pulse();
        break;
    }
    this.render();
  }

  addPane() {
    this.panes.forEach((p) => (p.active = false));
    this.panes.push({ id: this.panes.length + 1, active: true });
    this.zoomed = false;
  }

  setActivePane(i) {
    this.panes.forEach((p, idx) => (p.active = idx === i));
  }

  cyclePane(dir) {
    const active = this.panes.findIndex((p) => p.active);
    const next = (active + dir + this.panes.length) % this.panes.length;
    this.setActivePane(next);
  }

  setActiveWindow(i) {
    this.windows.forEach((w, idx) => (w.active = idx === i));
  }

  cycleWindow(dir) {
    const active = this.windows.findIndex((w) => w.active);
    const next = (active + dir + this.windows.length) % this.windows.length;
    this.setActiveWindow(next);
  }

  flashOverlay(text) {
    this._overlay = text;
    // The overlay is cleared on the next render tick via a timeout in render().
  }

  pulse() {
    this._pulse = true;
  }

  render() {
    const statusWindows = this.windows
      .map((w, i) => `${w.active ? '>' : ' '}${i}:${w.name}${w.active ? '*' : ''}`)
      .join('  ');

    const paneCount = this.panes.length;
    const activePane = this.panes.findIndex((p) => p.active) + 1;

    let paneGrid = '';
    const cls = this.zoomed ? 'zoomed' : this.layout;
    for (let i = 0; i < paneCount; i++) {
      const p = this.panes[i];
      paneGrid += `<div class="pane ${p.active ? 'active' : ''}">${
        this.copyMode && p.active ? '<span class="copy">-- COPY --</span>' : `$ pane ${i + 1}`
      }</div>`;
    }

    const overlay = this._overlay
      ? `<div class="tmux-overlay">${this._overlay}</div>`
      : '';

    this.root.innerHTML = `
      <div class="tmux ${this._pulse ? 'pulse' : ''}">
        <div class="tmux-body layout-${cls}" data-panes="${paneCount}">
          ${paneGrid}
          ${overlay}
        </div>
        <div class="tmux-status">
          <span class="status-left">[tmux]</span>
          <span class="status-windows">${statusWindows}</span>
          <span class="status-right">pane ${activePane}/${paneCount}</span>
        </div>
      </div>`;

    // Clear one-shot visual flags after paint.
    this._pulse = false;
    if (this._overlay) {
      const overlayEl = this.root.querySelector('.tmux-overlay');
      this._overlay = null;
      if (overlayEl && typeof requestAnimationFrame === 'function') {
        // Let CSS animate it out; it is regenerated only on the next effect.
      }
    }
  }
}
