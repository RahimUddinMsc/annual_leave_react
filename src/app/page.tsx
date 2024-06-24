"use client"

import Image from "next/image";
import styles from "./page.module.css";
import Connector from './signalr-connection'
import { useEffect, useState } from "react";
import signalR from "@microsoft/signalr";


export default function Home() {

  const { transmitSenderEvent, addMessageRecieverEvent } = Connector();
  const [messages, setMessages] = useState<string[]>([])


  useEffect(() => {    
    addMessageRecieverEvent("ReceiveMessage", (...args) => {
      console.log(args)
      const [, receivedMessage] = args;
      
      setMessages(existing => [...existing, receivedMessage]);
        
    })
  },[]);

  return (
    <main className={styles.main}>      
      <div className="App">
        <span>
          message from signalR: 

          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))} 

        </span>
        <br />
        <button onClick={() => transmitSenderEvent("sendMessage", "test", (new Date()).toISOString())}>send date </button>
      </div>      
    </main>
  );
}
