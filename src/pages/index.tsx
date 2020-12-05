/* eslint-disable react/button-has-type */
import { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/client'

import Landing from './Landing'

const Home: NextPage = () => {
  const [session, loading] = useSession()

  if (loading) {
    return (
      <div>
        <h1>LOADING...</h1>
      </div>
    )
  }

  return (
    <div>
      {!session && (
        <>
          Not signed in
          <button onClick={() => signIn('auth0')}>Sign in</button>
        </>
      )}
      {session && (
        <>
          {`Signed in as ${session.user.email}`}
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
      <Landing />
    </div>
  )
}

export default Home
