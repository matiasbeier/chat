import React, { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useSocket from '../UseSocket';
import s from './Room.module.css'
import { BiSend } from "react-icons/bi";

interface Mess {
    text?: string,
    id?: string,
    writtenByCurrentUser?: boolean
}
type ParamsId = {
    idRoom: string
}

const Room = () => {
    const {idRoom}: ParamsId = useParams()
    const {messages, sendMessage} = useSocket(idRoom)

    const [listMessages, setListMessages] = useState<Mess[]>([])
    const [newMessage, setNewMessage] = useState<string>("");

    useEffect(() =>{
        messages.text &&
    setListMessages([messages, ...listMessages])
    }, [messages])

    function handleMessage(e: ChangeEvent<HTMLInputElement>){
        setNewMessage(e.target.value)
    }

    function handleSendMessage(e: React.FormEvent){
        e.preventDefault()
        sendMessage(newMessage);
        setNewMessage("");
    }
    return (
        <div className={s.container}>
            <div className={s.containerChat}>
                <div className={s.chat} > 
                {
                    listMessages?.map((message) => {
                        return (
                            message.writtenByCurrentUser
                                ? <p className={s.messageMe} key={`${Math.random()}${message.id}${message?.text}`} 
                                    style={{textAlign: "justify", wordBreak: "break-word"}} 
                                    >
                                        {`Me: ${message?.text}`}
                                    </p>
                                : <p className={s.message} key={`${Math.random()}${message.id}${message?.text}`} 
                                    style={{textAlign: "justify", wordBreak: "break-word"}} 
                                    >
                                        {`User${message?.id?.substring(0, 5)}: ${message?.text}`}
                                    </p> 
                            )
                        })
                }
                </div>
                <div className={s.containerSendMessages}>
                    <form onSubmit={e => handleSendMessage(e)} className={s.form} >
                        <input type="text" placeholder="message..." value={newMessage} onChange={(e)=>handleMessage(e)} className={s.input} />
                        <button onClick={e => handleSendMessage(e)} className={s.button}><BiSend/></button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Room