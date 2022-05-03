import React from 'react'
import { NavLink } from 'react-router-dom'
import s from './Home.module.css'

function Home() {
  
  return (
    <div className={s.container} >
        <NavLink to="/room/chatroom1" className={s.nav} >
            ROOM 1
        </NavLink>
        <NavLink to="/room/chatroom2" className={s.nav} >
            ROOM 2
        </NavLink>
    </div>
  )
}

export default Home