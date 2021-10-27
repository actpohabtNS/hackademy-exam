import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ListsHeadsWrapper } from '../context/listHeadsContext'
import { CurrListWrapper } from '../context/currListContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ListsHeadsWrapper>
      <CurrListWrapper>
        <Component {...pageProps} />
      </CurrListWrapper>
    </ListsHeadsWrapper>
  )
}
export default MyApp
