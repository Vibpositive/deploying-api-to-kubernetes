# Deploying your first microservice into Docker Desktop Kubernetes Cluster

## Prerequisites

Please follow this in order

- 1. [Installing NodeJs](documentation/Installing-NodeJS.md)
- 2. [Login to Docker Hub](documentation/Logging-in-to-Docker-hub.md)
- 3. [Kubernetes Environment](documentation/Local-Kubernetes.md)
- 4. [OpenAPI Generator](documentation/Installing-OpenAPIGenerator.md)
- 5. [Installing Postman](documentation/Installing-Postman.md)
***

## Goals

- [OpenAPI specification file](#OpenAPI-specification-file)
- [Generating an API Using the OpenAPI generator client](#Generating-an-API-Using-the-OpenAPI-generator-client)
- [Building a Docker image with generated API](#Building-a-Docker-image-with-generated-API)
- [Deploying your API into Kubernetes](#Deploying-your-API-into-Kubernetes)
- [Changing the Default API Response](#Changing the Default API Response)

***
## Recommended

- [Visual Studio Code](https://code.visualstudio.com/)
***

### OpenAPI specification file
Save the following contents into a file called openapi.yaml
Ideally have a new folder for this file, you can create it under your git projects folder for example:

```shell
mkdir ~/git/my-first-api
cd ~/git/my-first-api
# This will create an empty file into ~/git/my-first-api
touch openapi.yaml
```

```yaml
openapi: 3.0.0
info:
  title: Simple API overview
  version: 2.0.0
servers:
  - url: /
paths:
  /myinfo:
    get:
      operationId: listMyInfo
      requestBody:
        description: 'Process your info from API'
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/personDetails'
      responses:
        "200":
          content:
            application/json:
              examples:
                MyInfo:
                  value:
                    name: "Your Name"
                    age: 22
                    age_in_months: "264 Months"
                    nationality: "Geek"
                    visited_countries:
                      - "Japan"
                      - "Australia"
                ExtraTerrestrialInfo:
                  value:
                    name: "Aayala"
                    age: 4827
                    age_in_months: "57.924 Months"
                    nationality: "Venusian"
                    visited_countries:
                      - "USA, Earth"
          description: 200 response
      summary: List My Info
      x-eov-operation-handler: controllers/DefaultController
components:
  schemas:
    personDetails:
      type: object
      description: 'Your personal info'
      properties:
        name:
          type: string
          description: 'Your First and Last name'
        age:
          type: integer
          description: 'Your Age'
        nationality:
          type: string
          description: 'Your Nationality'
        visited_countries:
          type: array
          items:
            type: string
          description: "List of Countries you have visited"
```
***
### Generating an API Using the OpenAPI generator client
In your terminal application, cd into the directory where the openapi.yaml is located

Use the following command to generate your api

```shell
openapi-generator-cli generate -g nodejs-express-server -i ./openapi.yaml -o ./yourname-api-client
```
This command will parse your openapi.yaml file and will generate boilerplate code for your api

This api works out of the box, however it does not implement any business logic

You can test your API locally, running on WSL via NodeJS

Make sure you are inside the generated directory, this directory can be found at the same level of your openapi.yaml file

```shell
cd yourname-api-client
npm start
```
If you see in the output the following message: **Listening on port 8080**, it means it works

In your browser, navigate to http://localhost:8080/api-docs

This is the Swagger editor, it describes your API specification

You can use curl or Postman to send requests to your endpoint: http://localhost:8080/myinfo

CTRL+c will stop the npm command

***

### Building a Docker image with generated API

In this step, we want to make a Docker image available for Kubernetes to run

We have to copy our files into a Docker image

Save the following into a file 'Dockerfile' inside your api folder i.e. yourname-api-client/Dockerfile


```shell
cd ~/git/my-first-api/yourname-api-client
touch Dockerfile
```

Open Dockerfile in a text editor/IDE and save it with the following contents

```docker
FROM node:14
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD [ "node", "index.js" ]
```

Next we will build this image, docker engine will parse Dockerfile and create an image based off it

```shell
docker build --tag <YOUR DOCKER REPOSITORY NAME>/my_first_microservice:1.0.0 .
```

Check the output of docker images:

```shell
docker images
```
You should see your image in the list of images

We'll push your image to your Docker repository

*****************

***
### Deploying your API into Kubernetes


```shell
cd ~/git/my-first-api/yourname-api-client
touch pod.yaml
```

Open pod.yaml in a text editor/IDE and save it with the following contents

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-microservice
spec:
  containers:
    - name: my-microservice
      image: <YOUR DOCKER REPOSITORY NAME>/my_first_microservice:1.0.0
      ports:
        - containerPort: 8080
      resources:
        requests:
          cpu: "1"
          memory: "200Mi"
        limits:
          cpu: "1"
          memory: "200Mi"
```

After deploying this to Kubernetes, we need to redirect requests from Kubernetes to localhost

This is done by using kubectl port-forward -n <NAMESPACE> <LOCAL PORT>:<REMOTE PORT>

In this case, we expose containerPort 8080, this is the REMOVE PORT

LOCAL PORT is the port that we want to send the requests to

.i.e
```shell
kubectl port-forward my-microservice -n default 8080:8080
```
***

### Changing the Default API Response
To make things a bit more interesting, we will change the default response from our microservice

In your API directory, open the Controller.js file under controllers folder

i.e.

yourname-api-client/controllers/Controller.js

Replace the method handleRequest with the following:

```js
static async handleRequest(request, response, serviceOperation) {
    try {
        const serviceResponse = await serviceOperation(this.collectRequestParams(request));
        this.populatePayLoad(request, serviceResponse);
        Controller.sendResponse(response, serviceResponse);
    } catch (error) {
        Controller.sendError(response, error);
    }
}
```

And add the following method after handleRequest

```js
static populatePayLoad(request, serviceResponse){
    serviceResponse.payload.personDetails.name = request.body.name;
    serviceResponse.payload.personDetails.age = request.body.age;
    serviceResponse.payload.personDetails.age_years_in_months = request.body.age * 12;
    serviceResponse.payload.personDetails.nationality = request.body.nationality;
    serviceResponse.payload.personDetails.visited_countries = request.body.visited_countries;
}
```

You can test this again by running:
```shell
npm start
```

In order to update your kubernetes deployment, we need to build image again:

```shell
docker build --tag <YOUR DOCKER REPOSITORY NAME>/my_first_microservice:1.0.0 .
```

Then delete your pod:

```shell
kubectl delete -f pod.yaml
```
And recreate the pod after it is deleted
```shell
kubectl apply -f pod.yaml
```
Check if your pod is running:
```shell
kubectl get pods
```
If so, you can port forward your pod to localhost:

```shell
kubectl port-forward -n default <YOUR POD NAME> 8080:8080
```

Send a curl request:

```shell
curl -X GET \
  -H "Content-type: application/json" \
  -H "Accept: application/json" \
  -d '{"name": "YOURNAME","age": 20,"nationality": "Martian","visited_countries": ["USA, Earth"]}' \
  "http://localhost:8080/myinfo"
```

### Sending requests from Postman

When sending requests from Postman, add the following header:
KEY: Content-Type, VALUE: application/json