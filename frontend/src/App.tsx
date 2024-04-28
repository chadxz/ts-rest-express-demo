import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {useCreateLoading, useErrorMessage, useLookupLoading, useUser, useUserActions} from "#frontend/src/user.ts";
import {useEffect} from "react";

function App() {
  const user = useUser();
  const lookupLoading = useLookupLoading();
  const createLoading = useCreateLoading();
  const errorMessage = useErrorMessage();
  const {lookupUser, createUser} = useUserActions();

  useEffect(() => {
    void lookupUser(1);
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo"/>
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo"/>
        </a>
      </div>
      <h1>Vite + React = {lookupLoading ? '...' : user ? user.name : '???'}</h1>
      <div className="card">
        <button onClick={() => createUser({name: 'Bilbo', email: 'bilbo@shire.lotr'})}>
          {createLoading ? 'Creating...' : 'Create a new user.'}
        </button>
        {errorMessage ? (
          <p className={"error"}>
            {errorMessage}
          </p>
        ) : null}
      </div>
    </>
  )
}

export default App
