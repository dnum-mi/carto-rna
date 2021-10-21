module.exports = {
  globals: {
    defineEmits: 'readonly',
    defineProps: 'readonly',
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'standard',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'comma-dangle': [2, 'always-multiline'],
  },
}
