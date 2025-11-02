/* eslint-env node */
/* eslint-disable no-global-assign, no-undef */
/* global global */

// Only apply polyfills in CI environment or when globals are missing
const isCI = process.env.CI === 'true';

// Polyfill for ReadableStream if not available
if (!global.ReadableStream && isCI) {
  global.ReadableStream = class ReadableStream {
    constructor() {
      // Minimal implementation for testing
    }
  };
}

// Polyfill for File constructor that testcontainers/undici expects
// Only apply in CI or when File is not defined
if ((!global.File || isCI) && typeof global.File === 'undefined') {
  global.File = class File {
    constructor(fileBits, fileName, options = {}) {
      this.name = fileName;
      this.type = options.type || '';
      this.lastModified = options.lastModified || Date.now();
      this.size = 0;
      
      if (Array.isArray(fileBits)) {
        this.size = fileBits.reduce((acc, bit) => {
          if (typeof bit === 'string') {
            return acc + bit.length;
          }
          return acc + (bit.byteLength || bit.length || 0);
        }, 0);
      }
    }
    
    stream() {
      return new (global.ReadableStream || class ReadableStream {})();
    }
    
    arrayBuffer() {
      return Promise.resolve(new ArrayBuffer(0));
    }
    
    text() {
      return Promise.resolve('');
    }
  };
}

// Polyfill for FormData if needed (only in CI)
if (!global.FormData && isCI) {
  global.FormData = class FormData {
    constructor() {
      this._data = new Map();
    }
    
    append(name, value) {
      this._data.set(name, value);
    }
    
    get(name) {
      return this._data.get(name);
    }
    
    has(name) {
      return this._data.has(name);
    }
  };
}

// Polyfill for Headers if needed (only in CI)
if (!global.Headers && isCI) {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = new Map();
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this._headers.set(key.toLowerCase(), value);
        });
      }
    }
    
    get(name) {
      return this._headers.get(name.toLowerCase());
    }
    
    set(name, value) {
      this._headers.set(name.toLowerCase(), value);
    }
    
    has(name) {
      return this._headers.has(name.toLowerCase());
    }
  };
}
