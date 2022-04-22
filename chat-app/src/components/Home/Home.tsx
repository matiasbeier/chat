import React from 'react'
import { NavLink } from 'react-router-dom'

function Home() {
  
  return (
    <div>
        <NavLink to="/room/chatroom1">
            Room
        </NavLink>
    </div>
  )
}

export default Home