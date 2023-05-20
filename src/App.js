import React, { useEffect, useState } from "react"
import "./styles/main.css"

import { initVenomConnect } from "./venom-connect/configure"
import Main from "./pages/Main"

function App() {
  const [venomConnect, setVenomConnect] = useState()
  const init = async () => {
    const _venomConnect = await initVenomConnect()
    setVenomConnect(_venomConnect)
  }
  useEffect(() => {
    init()
  }, [])

  return <Main venomConnect={venomConnect} />
}

export default App

