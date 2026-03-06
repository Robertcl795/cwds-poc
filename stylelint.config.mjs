export default {
  ignoreFiles: ['**/dist/**', '**/storybook-static/**', '**/coverage/**'],
  rules: {
    'at-rule-no-unknown': [true, { ignoreAtRules: ['layer', 'property'] }],
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': true,
    'declaration-no-important': true,
    'font-family-no-duplicate-names': true,
    'function-calc-no-unspaced-operator': true,
    'media-feature-name-no-unknown': true,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'property-no-unknown': true,
    'selector-type-no-unknown': [true, { ignore: ['custom-elements'] }]
  }
};
