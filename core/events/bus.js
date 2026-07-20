class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, handler) {
    if (typeof handler !== 'function') {
      throw new TypeError('EventBus handler must be a function');
    }

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    this.listeners.get(eventName).add(handler);
    return () => this.off(eventName, handler);
  }

  once(eventName, handler) {
    const off = this.on(eventName, (...args) => {
      off();
      handler(...args);
    });
    return off;
  }

  off(eventName, handler) {
    const bucket = this.listeners.get(eventName);
    if (!bucket) {
      return false;
    }

    const removed = bucket.delete(handler);
    if (bucket.size === 0) {
      this.listeners.delete(eventName);
    }
    return removed;
  }

  emit(eventName, payload) {
    const bucket = this.listeners.get(eventName);
    if (!bucket || bucket.size === 0) {
      return 0;
    }

    let invoked = 0;
    for (const handler of bucket) {
      handler(payload);
      invoked += 1;
    }
    return invoked;
  }

  clear(eventName = null) {
    if (eventName) {
      this.listeners.delete(eventName);
      return;
    }

    this.listeners.clear();
  }
}

module.exports = {
  EventBus,
};
