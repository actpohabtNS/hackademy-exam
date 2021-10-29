import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Router from 'next/router'

import Sidebar from '../components/Sidebar'
import ListsBlock from '../components/ListsBlock'
import isAuthenticated, { signOut } from './api/auth'
import { loadListHeads } from './api/lists'
import { ListHeadsContext } from '../context/listHeadsContext'

const Home: NextPage = () => {
  const [isAuth, setAuth] = useState(false);
  const { dispatch } = useContext(ListHeadsContext);
  
  // component did mount
  useEffect(() => {
    async function fetchData() {
      const response = await loadListHeads();
      if (response.status === 200) {
        setAuth(true);
        dispatch({ type: 'set', listHeads: response.data })
      } else {
        if (response.status === 401) {
          console.log("Unauthorized! Removing jwt from memory.");
          signOut();
          Router.push('/login')
        }
      }
    }
    fetchData();
  }, [dispatch]);

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
