import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Sidebar from '../components/Sidebar'
import ListsBlock from '../components/ListsBlock'

const Home: NextPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <ListsBlock />
    </div>
  )
}

export default Home
