# createContainer

It creates a container component to use with ddp-client package.

## setup

- in the terminal do npm install     

- Inside `ReactiveContainer.js` setup 

```javascript
ddpClient = new DDPClient({
        //   host: 'localhost',
        host: '192.168.1.6', // Your IP address. To use when running locally  
        port: '3000', // port used by meteor
        // url: <your websocket url>
    });
```

## example of use 

```javascript
    import React, {Component} from 'react'
    import App from './both/components/App/App'

    import createContainer from './createContainer'

    class RNApp extends Component {  
        render() {
            return createContainer(['posts'], (reactiveData, meteor)=>{
                return{
                    meteor, 
                    posts: reactiveData.posts
                }
            }, <App/>)
        
        }
    }
```

### arguments of createContainer

- `['posts']` is the array of metor collections I want to observe 
- `reactiveData` a object literal containing the reactive data of the data base; 
- `meteor` a instance to call meteor methods.  