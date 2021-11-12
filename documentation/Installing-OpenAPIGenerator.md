#Installing OpenAPI Generator Client

We'll be installing the OpenAPI Generator client from: https://github.com/openapitools/openapi-generator-cli

https://github.com/openapitools/openapi-generator-cli

## Install command

```shell
npm install -g @openapitools/openapi-generator-cli
```

## Usage

```shell
openapi-generator-cli generate -g nodejs-express-server -i ./openapi.yaml -o ./yourname-api-client
```