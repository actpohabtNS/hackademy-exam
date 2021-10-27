import type { NextPage } from 'next'
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
