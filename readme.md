## NodeJS Rabbitmq Demo app
This is a node app created for some demo purposes

You need to have a running rabbitmq instance to make it work.

Can easily spin up a instance with docker. Use following:

`docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management` 

For Rabbitmq management UI visit: `localhost:15672`
Default username and password is `guest`

### How to run the app

```
yarn
yarn run start
```