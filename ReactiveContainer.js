import React from './node_modules/dist/react.min.js';
import DDPClient from './node_modules/ddp-client/index.js';

let
    self,
    ddpClient = new DDPClient({
        //   host: 'localhost',
        host: '192.168.1.6', // If using android use your device IP address
        port: '3000',
        // url: <your websocket url>
    })


export default class ReactiveContainer extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            connected: false,
            reactiveData:{},
            view:{}
        }
    }    

    componentDidMount() {

        self = this

        ddpClient.connect((err, wasReconnect) => {
            let connected = true;

            if (err) {
                connected = false
            } else {
                this.makeSubscription();
                this.observeCollections();
            }
            this.setState({ connected: connected });
        });
    }



    makeSubscription() { 

        let {collections} = this.props

        collections.forEach((collection) => {
            ddpClient.subscribe(collection, [], () => {
                self.updateView(collection);
            });
        })        

    }

    observeCollections() {
        let {collections} = this.props

        collections.forEach((collection) => {
            let observer = ddpClient.observe(collection);
            self.updateView(collection)

            observer.added = (id) => {
                self.updateView(collection)
            }
            observer.changed = (id, oldFields, clearedFields, newFields) => {
                self.updateView(collection)
            }
            observer.removed = (id, oldValue) => {
                self.updateView(collection)
            }
        })        
    }


    updateReactiveData(collectionName){

        let reactiveData = Object.assign({}, this.state.reactiveData)
     
        reactiveData[collectionName] = ddpClient.collections[collectionName]

        this.setState({reactiveData})
        
        return Object.assign({},reactiveData)

    }

    updateView(collectionName) {
     
        let 
            reactiveData = this.updateReactiveData(collectionName)
            viewState = this.props.updateView(reactiveData,ddpClient)

        this.setState({ view: Object.assign({}, viewState) })
        
    }

    render() {

        let 
            component = this.props.component,
            element = React.cloneElement(component, this.state.view)

        return <div className="reactive-container">{element}</div>
    } 
}

var propTypes = React.PropTypes

ReactiveContainer.propTypes = {
    collections: propTypes.array.isRequired,
    component: propTypes.element.isRequired,
    updateView: propTypes.func.isRequired
}

