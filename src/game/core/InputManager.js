/**
 * Centralized Input Manager
 * Captures keyboard movement, sprint, interaction, and pause events.
 * Manages clean listener attachment, prevents leakage, and stops inputs when paused or typing.
 */
export class InputManager {
  constructor() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      interact: false,
      pause: false
    };

    this.mouse = {
      dx: 0,
      dy: 0,
      isLocked: false
    };

    this.onInteractCallback = null;
    this.onPauseCallback = null;
    this.enabled = true;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  init(onInteract, onPause) {
    this.onInteractCallback = onInteract;
    this.onPauseCallback = onPause;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    this.reset();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.reset();
    }
  }

  reset() {
    this.keys.forward = false;
    this.keys.backward = false;
    this.keys.left = false;
    this.keys.right = false;
    this.keys.sprint = false;
    this.keys.interact = false;
    this.mouse.dx = 0;
    this.mouse.dy = 0;
  }

  consumeMouseDelta() {
    const dx = this.mouse.dx;
    const dy = this.mouse.dy;
    this.mouse.dx = 0;
    this.mouse.dy = 0;
    return { dx, dy };
  }

  isInputTarget(target) {
    return target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
  }

  handleKeyDown(e) {
    if (this.isInputTarget(e.target)) return;

    // ESC to Pause can trigger even if general gameplay inputs are paused
    if (e.code === 'Escape') {
      e.preventDefault();
      if (this.onPauseCallback) {
        this.onPauseCallback();
      }
      return;
    }

    if (!this.enabled) return;

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = true;
        break;
      case 'KeyE':
        if (!this.keys.interact) {
          this.keys.interact = true;
          if (this.onInteractCallback) {
            this.onInteractCallback();
          }
        }
        break;
      default:
        break;
    }
  }

  handleKeyUp(e) {
    if (this.isInputTarget(e.target)) return;

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = false;
        break;
      case 'KeyE':
        this.keys.interact = false;
        break;
      default:
        break;
    }
  }

  handleMouseMove(e) {
    // If pointer locked or mouse drag enabled
    if (document.pointerLockElement || e.buttons === 1 || e.buttons === 2) {
      this.mouse.dx += e.movementX || 0;
      this.mouse.dy += e.movementY || 0;
    }
  }
}

export const globalInput = new InputManager();
