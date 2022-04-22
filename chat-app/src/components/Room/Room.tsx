import React, { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useSocket from '../UseSocket';
import s from './Room.module.css'

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
  setListMessages([...listMessages, messages])
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
    <div className={s.containerChat}>
        <div className={s.chat} /* disabled={true} */ > 
          {
              listMessages?.map((message) => {
                  return (
                      message.writtenByCurrentUser
                          ? <p key={`${Math.random()}${message.id}${message?.text}`} 
                              style={{textAlign: "justify"}} 
                            >
                                {`Yo: ${message?.text}`}
                            </p>
                          : <p key={`${Math.random()}${message.id}${message?.text}`} 
                              style={{textAlign: "justify", wordBreak: "break-word"}} 
                            >
                                {`${message?.id}: ${message?.text}`}
                            </p> 
                      )
                  })
          }
        </div>
        <div className={s.containerSendMessages}>
            <form onSubmit={e => handleSendMessage(e)}>
                <input type="text" placeholder="Escribe un mensaje..." value={newMessage} onChange={(e)=>handleMessage(e)}/>
                <button onClick={e => handleSendMessage(e)} >Enviar</button>
            </form>
        </div>
    </div>
  )
}

export default Room