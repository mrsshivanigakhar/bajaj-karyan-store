export function register() {
  if (typeof process !== 'undefined') {
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Node.js 20 and below are deprecated')
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };
  }
}
