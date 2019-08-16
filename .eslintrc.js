const path = require('path');

module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "env": {
    "browser": true
  },
  "globals": {
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": path.join(__dirname, 'webpack.config.babel.js')
      },
    }
  },
  "rules": {
    "react/jsx-filename-extension": 0,
    "react/no-multi-comp": 0,
    "arrow-parens": 0,
    "react/destructuring-assignment": 0,
    "operator-linebreak": 0,
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "react/prefer-stateless-function": 0,
    "arrow-body-style": 0,
    "import/prefer-default-export": 0,
    "prefer-template": 0,
    "no-param-reassign": 0,
    "react/jsx-wrap-multilines": 0,
    "react/forbid-prop-types": 0,
    "react/jsx-one-expression-per-line": 0,
    "import/no-duplicates": 0,
    "class-methods-use-this": 0,
    "no-await-in-loop": 0,
    "prefer-destructuring": 1,
    "react/button-has-type": 0,
    "object-curly-newline": 0,
    "no-confusing-arrow": 0,
    "spaced-comment": 1,
    "comma-dangle": 1,
  }
};
