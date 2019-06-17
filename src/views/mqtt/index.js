import React from 'react';
import { Input, InputNumber, Button, Select, Icon} from 'antd';
import './style.css'
import Script from 'react-load-script'

class Mqtt extends React.Component {
    constructor(props) {
        super(props);
        if (!this.GlobalEnvParams.DEMO_MQTT) {
            this.state.host = "127.0.0.1";
        }
    }

    state = {
       btnOpenDisabled: false
        ,btnCloseDisabled: true
        ,btnSendDisabled: true
        ,btnSubDisabled: true
        ,host: "192.168.136.148"
        ,port: 9000
        ,clientId: "webMqttClient"
        ,ssl: "0"
        ,mqttTopic: "World"
        ,mqttMessage: "Hello"
        ,mqttQos: "0"
        ,mqttRetain: "0"
        ,subTopic: "World"
        ,subQos: "0"
    };

    client = null;

    dispalyMesage(msg) {
        let isServer = arguments[1] ? arguments[1] : false;
        let ta = document.getElementById('log');
        let cssName = "msgClient";
        if (isServer) {
            cssName = "msgServer"
        }
         ta.innerHTML =
            "<div class='logitem'>" + new Date().format('hh:mm:ss S: ') + "<span class='"+cssName+"'> " + msg + "</span></div>" + ta.innerHTML;
    }

    clearMessage() {
        document.getElementById('log').innerHTML = "";
    }

     controlBtn() {
        let isOpen = false;
        if ((this.client != null && (this.client.isConnected()))) {
            isOpen = true;
        }
        this.setState({btnOpenDisabled: isOpen});
        this.setState({btnCloseDisabled: !isOpen});
        this.setState({btnSendDisabled: !isOpen});
        this.setState({btnSubDisabled: !isOpen});

    }

    publish() {
        if ((this.client == null) || (!this.client.isConnected())) {
            return;
        }

        let topic = this.state.mqttTopic;
        let content = this.state.mqttMessage;
        let qos = this.state.mqttQos;
        let retain =  Boolean(Number(this.state.mqttRetain));

        let message = new window.Paho.MQTT.Message(content);
        message.destinationName = topic;
        message.qos = Number(qos);
        message.retained = retain;

        this.client.send(message);
    }

    subscribe() {
        if ((this.client == null) || (!this.client.isConnected())) {
            return;
        }

        let subQos = Number(this.state.subQos);
        let subTopic = this.state.subTopic;
        let subOptions =  { qos: subQos };

        this.client.subscribe(subTopic, subOptions);

        let msg = "subscribe - topic:"  + subTopic + " qos" + subQos;
        this.dispalyMesage(msg);
    }
     close() {
        if ((this.client != null) && (this.client.isConnected())) {
            this.client.disconnect();
            this.controlBtn();
        }
    }

     open() {
        this.controlBtn();
        if (this.client != null && (this.client.isConnected())) {
            this.close();
        }
        if (window.WebSocket) {
            let host = this.state.host;
            let port = Number(this.state.port);
            let clientId = this.state.clientId;
            let bSSL = Boolean(Number(this.state.ssl));
            this.client = new window.Paho.MQTT.Client(host, port, "/mqtt", clientId);
            this.client.onConnectionLost = this.onConnectionLost.bind(this);
            this.client.onMessageArrived = this.onMessageArrived.bind(this);
            // connect the client
            this.client.connect({onSuccess: this.onConnect.bind(this), useSSL: bSSL});
            this.dispalyMesage("connect init...");
        } else {
            alert("browse not support WebSocket！");
        }
    }

     onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        this.dispalyMesage("onConnect - " + this.client.clientId);
        this.controlBtn();

         if (this.GlobalEnvParams.DEMO_MQTT) {
             this.subscribe();
             this.publish();
         }
    }

     onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
           this.dispalyMesage("onConnectionLost -"+responseObject.errorMessage);
        }
    }

     onMessageArrived(message) {
         let sMsg = "<span>message - topic: "+ message.topic +"</span><span> qos"+ message.qos +"</span>";
         sMsg +="<div class='msgContent'>"+message.payloadString+"</div>";
        this.dispalyMesage(sMsg, true);
    }


    handleScriptCreate() {
        console.log("handleScriptCreate");
        this.setState({scriptLoaded: false});
    }

    handleScriptError() {
        console.log("handleScriptError");
        this.setState({scriptError: true});
    }

    handleScriptLoad() {
        console.log("handleScriptLoad");
        this.setState({scriptLoaded: true});

        if (this.GlobalEnvParams.DEMO_MQTT) {
           this.open();
        }
    }

    componentDidMount() {

    }

    handleInputChange(name, event) {
         let value = null;
         if ((typeof event === "string") || (typeof event === "number")) {
            value = event;
         } else if (typeof event.target == "object") {
            value = event.target.value;
         } else {
             alert("handleInputChange: " + typeof event );
         }

         if ((name) && (value != null)) {
             this.setState({[name]: value});
         }
    }

    render() {
        return (
            <div className="">
            <Script
                url={process.env.PUBLIC_URL + '/paho-mqtt.js'}
                onCreate={this.handleScriptCreate.bind(this)}
                onError={this.handleScriptError.bind(this)}
                onLoad={this.handleScriptLoad.bind(this)}
            />

            <h2>MQTT WebSocket Client</h2>

                <div className="connect">
                    <h3>connect</h3>

                    <span><label>client:</label><Input style={{width: 120}} onChange={this.handleInputChange.bind(this, "clientId")} defaultValue={this.state.clientId} /></span>
                    <span>host:<Input style={{width: 160}} onChange={this.handleInputChange.bind(this, "host")}  defaultValue={this.state.host}/></span>

                    <span>port:<InputNumber style={{width: 100}} onChange={this.handleInputChange.bind(this, "port")} defaultValue={this.state.port}/></span>

                    <span>ssl:
                    <Select defaultValue={this.state.ssl} onChange={this.handleInputChange.bind(this, "ssl")}>
                        <Select.Option value="0">false</Select.Option>
                        <Select.Option value="1">true</Select.Option>
                    </Select>
                    </span>
                    <span className="btnContainer">
                        <Button type="" disabled={this.state.btnOpenDisabled}
                            onClick={this.open.bind(this)}>open</Button>
                        <Button type="" disabled={this.state.btnCloseDisabled}
                            onClick={this.close.bind(this)}>close</Button>
                    </span>
                </div>


                <div className="publish">
                    <h3>publish</h3>
                    <span>topic:<Input style={{width: 120}} type="text" defaultValue={this.state.mqttTopic} onChange={this.handleInputChange.bind(this, "mqttTopic")} /></span>
                    <span>msg:<Input  style={{width: 120}} type="text" defaultValue={this.state.mqttMessage} onChange={this.handleInputChange.bind(this, "mqttMessage")} /></span>
                    <span>
                    qos:
                    <Select defaultValue={this.state.mqttQos} style={{width: 60}} onChange={this.handleInputChange.bind(this, "mqttQos")}>
                        <Select.Option value="0">0</Select.Option>
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="2">2</Select.Option>
                    </Select></span>

                    <span>
                    retain:
                    <Select defaultValue={this.state.mqttRetain} onChange={this.handleInputChange.bind(this, "mqttRetain")}>
                        <Select.Option value="0">false</Select.Option>
                        <Select.Option value="1">true</Select.Option>
                    </Select></span>


                    <span className="btnContainer">
                        <Button type="" disabled={this.state.btnSendDisabled}
                        onClick={this.publish.bind(this)}>publish</Button>
                    </span>

                </div>

                <div className="subscribe">
                    <h3>subscribe</h3>

                    <span>topic:<Input style={{width: 120}} type="text" defaultValue={this.state.subTopic} onChange={this.handleInputChange.bind(this, "subTopic")}/></span>
                    <span>
                    qos:
                    <Select style={{width: 60}}  defaultValue={this.state.subQos} onChange={this.handleInputChange.bind(this, "subQos")}>
                        <Select.Option value="0">0</Select.Option>
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="2">2</Select.Option>
                    </Select></span>

                    <span className="btnContainer"><Button disabled={this.state.btnSubDisabled}
                                  onClick={this.subscribe.bind(this)}>subscribe</Button></span>
                </div>


                <div>
                    <div><span className="msgHeader"> Message</span>
                        <Icon type="delete"  onClick={this.clearMessage.bind(this)} />
                    </div>

                    <div id="log" className="log"/>
                </div>
            </div>
        );
    }
}

export default Mqtt;
