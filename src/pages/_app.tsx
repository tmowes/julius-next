import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'

import GlobalStyle from '~/styles/GlobalStyles'
import * as themes from '~/styles/themes'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={themes.dark}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
