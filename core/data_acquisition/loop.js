function createAcquisitionLoop({ intervalMs = 30000, acquireFn = null, onTick = null } = {}) {
  let timer = null;
  let running = false;

  async function tick() {
    if (typeof acquireFn !== 'function') {
      return null;
    }

    const result = await acquireFn();
    if (typeof onTick === 'function') {
      await onTick(result);
    }
    return result;
  }

  async function start() {
    if (running) {
      return timer;
    }

    running = true;
    await tick();
    timer = setInterval(() => {
      tick().catch(() => null);
    }, Math.max(1000, Number(intervalMs) || 30000));
    return timer;
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    running = false;
  }

  return {
    start,
    stop,
    tick,
    isRunning: () => running,
  };
}

module.exports = {
  createAcquisitionLoop,
};
