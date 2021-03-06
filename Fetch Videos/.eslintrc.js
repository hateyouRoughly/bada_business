module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "browser": true
    },
    "extends": "eslint:recommended",
    "ecmaFeatures": {
        "jsx": true,
        "experimentalObjectRestSpread": true
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-console": 0,
        "indent": [
            2,
            4
        ],
        "quotes": [
            2,
            "single"
        ],
        "semi": [
            2,
            "always"
        ]
    }
};
