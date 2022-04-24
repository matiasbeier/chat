import { useEffect, useRef, useState } from "react";
import socketIOClient, { Socket } from 'socket.io-client';

interface Mess {
    text?: string,
    id?: string,
    writtenByCurrentUser?: boolean
}

/* type SocketArgs = {
    idRoom: string,
} */

/* interface SocketConnection {
    current,
} */

function useSocket(idRoom: string) {

    const [messages, setMessages] = useState<Mess>({})
    const socketIoRef = useRef<Socket>() // buscar como hacerlo bien

    useEffect(() =>{
        socketIoRef.current = socketIOClient('http://localhost:3001',{query:{idRoom} } );
            socketIoRef.current.on("NEW_CONNECTION", async () =>{})
            
            //received a new message, differentiating which are from current user and add to message list
            socketIoRef.current.on("NEW_MESSAGE", message =>{
                const incomingMessage = { 
                    ...message,
                    writtenByCurrentUser: message.id === socketIoRef.current?.id
                }
                setMessages(incomingMessage)
            })

            socketIoRef.current.on("DISCONNECT", id =>{
                setMessages({...messages, id: id})
            })

            return () =>{
                socketIoRef.current?.emit("DISCONNECT")
                socketIoRef.current?.disconnect();
            }
    }, [])

    function sendMessage(message: string){
        socketIoRef.current?.emit("NEW_MESSAGE", {
            text: message, 
            id: socketIoRef.current.id
        })
    }

    return { messages, sendMessage }
}

export default useSocket