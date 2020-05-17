module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true,
  },
	"extends": "eslint:recommended",
	"parser": "babel-eslint",
  "rules": {
      // enable additional rules
      "indent": ["error", "tab"],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],

      // override default options for rules from base configurations
      "comma-dangle": ["error", "never"],
      "no-cond-assign": ["error", "always"],

      // disable rules from base configurations
      "no-console": "off",
  }
};
