# lambda-jwt-auth-demo

A POC for an auth service powered by lambda functions and MongoDB.
~~Ready~~ In testing to be deployed to Netlify functions.

## Local development

Make sure you've got the dependencies installed, e.g. by

```sh
yarn install
```

Provide _your own_ `.env` file at the root of the project in the following format:

```
MONGODB_URL=XXX
JWT_SECRET=XXX
JWT_EXP=XXX
```

To run locally, run

```sh
yarn start:lambda
```

## Issues

[File an issue](https://github.com/mrozilla/lambda-jwt-auth-demo/issues) if you see I've borked something up!

## License

[MIT (c) Jan Hrubý](https://github.com/mrozilla/mrozilla.cz/blob/master/LICENSE)
