const target = process.env.NODE_ENV;

let obj = {};

if (target === 'development') {
     obj = {
        DEMO_MQTT: true
        ,IS_BrowserRouter: false
    }
} else if (target === 'test') {
     obj = {
        DEMO_MQTT: false
        ,IS_BrowserRouter: false
    }
} else {
     obj = {
        DEMO_MQTT: false
        ,IS_BrowserRouter: false
    }
}

export const GlobalEnvParams = obj;