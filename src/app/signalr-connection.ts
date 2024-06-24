import * as signalR from "@microsoft/signalr";

const URL = process.env.HUB_ADDRESS ?? "https://localhost:44305/NotificationHub"; //or whatever your backend port is

class Connector {
    private connection: signalR.HubConnection;
    public recieverEventMarkers: string[] = [];    
    static instance: Connector;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL)
            .withAutomaticReconnect()
            .build();
        
        this.connection.start().catch(err => console.log(err));    
    }

    public transmitSenderEvent = (senderEventName: string, ...args: any[]) => {             
        this.connection.send(senderEventName, ...args).then(x => console.log("sent"))
    }

    public addMessageRecieverEvent = (recieverName: string, callbackEvent: (...args: any[]) => void) => {             
        if(this.recieverEventMarkers.indexOf(recieverName) >= 0)
            return;

        this.connection.on(recieverName, (...args: any[]) => {
            console.log(...args)
            callbackEvent(...args);            
        });

        this.recieverEventMarkers.push(recieverName)
    }

    public static getInstance(): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector();
        
        return Connector.instance;
    }
}

export default Connector.getInstance;