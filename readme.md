#Initial Install

Follow this guide for the server or local development.

## System Dependancies

1. node
2. npm
3. bower
4. mongoDB

## App Setup

1. `npm i`
2. `bower install`
3. `node setup.js`
4. `cd signalmaster& npm i`

setup.js should out put something like :

```sh

    response :  null userID_1
    response :  null token_1
    response :  null email_1

```

## Running server locally

If running locally you may need to run with sudo or as admin because the server spins up on port 80.

` npm start `

To run the server as a daemon, you could use commands like this :

` npm run deploy `


If you have users that are in the pending state, you can update them manually via mongo.

1. `mongo`
2. `use webRTCCams`
3. `db.users.updateMany({accountStatus:'0'},{$set:{accountStatus:'1'}})`

## First local run and self signed certs

If you are testing with self signed certs you will need to go to : https://{{your local ip here}}:5309/ and https://{{your local ip here}}:4443/ accept the certificate to allow api access.

You can find your ***local*** IP in the web console it will say something like :

```

    WebSocket connection to 'wss://192.168.1.7:5309/' failed: WebSocket opening handshake was canceled


```

For both URLS, just copy them and change the wss to https if needed and visit the site in your browser to accept the self signed cert.

## Prod certs

Make sure to update the paths in `servermaster/development.json` and `servermaster/production.json` to point to the correct certs.

## Starting Server On the Server

` npm start `

The output of this should look something like :

```sh

    you@BOX:~/git/sp-cams3# npm run deploy


    > sp-cams3@0.0.1 deploy /root/git/sp-cams3
    > screen -dmS mongo mongod& screen -dmS signalmaster node signalmaster/server& screen -dmS api node api& screen -dmS server node server& echo STARTED

    STARTED


```

## Killing the server
Depending on how you started the server you would use the below

` killall node ` ***sudo on local machine***  

or  

` killall screen ` ***sudo on local machine***


## Updating the server

In the live environment you should be using `npm run deploy` so :

1. `git pull`
2. `npm run deploy`