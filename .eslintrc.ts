module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
    // other extends...
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'off' // Disable the rule globally
    // other rules...
  }
}
