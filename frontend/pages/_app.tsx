import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ListsHeadsWrapper } from '../context/listHeadsContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ListsHeadsWrapper>
      <Component {...pageProps} />
    </ListsHeadsWrapper>
  )
}
export default MyApp
