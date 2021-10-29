import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Router from 'next/router'

import Sidebar from '../components/Sidebar'
import ListsBlock from '../components/ListsBlock'
import isAuthenticated from './api/auth'

const Home: NextPage = () => {
  const [isAuth, setAuth] = useState(false);
  
  useEffect(() => {isAuthenticated() ? setAuth(true) : Router.push('/login')}, []);

  return (
    <div>
        {
        isAuth &&
        <div className="flex w-screen">
          <Sidebar />
          <ListsBlock />
        </div>
      }
    </div>
  )
}

export default Home
