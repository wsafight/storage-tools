import moduleTools, { defineConfig } from '@modern-js/module-tools';
import testPlugin from '@modern-js/plugin-testing';

export default defineConfig({
  plugins: [moduleTools(), testPlugin()],
  buildPreset({ preset }) {
    return preset.NPM_LIBRARY.map(config => {
      return { ...config, minify: 'terser' };
    });
  },
});
