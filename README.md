# SHERPA Helper

## Installation and development

Checkout suitable branch. Though `master` branch is used for development, it should still be stable enough to use in production. Change the `.env` file and provide configurations for [reCAPTCHA](https://developers.google.com/recaptcha/), Chatbot and KnowledgeBase (KB) services.

Once all the configurations are provided local development can commence or a production package could be built. Built static assets are the ones that should be used on the server.


### Install all the required dependencies

Current stable [Node.js](https://nodejs.org/en/) version should work. Currently used version is 12 (14 is also suitable). Please use an older version if you run into issues while installing the dependencies.

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
