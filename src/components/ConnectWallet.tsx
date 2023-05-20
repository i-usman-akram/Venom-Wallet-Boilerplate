import React from "react"

function ConnectWallet({ venomConnect }) {
  const login = async () => {
    if (!venomConnect) return
    await venomConnect.connect()
  }
  return (
    <div>
      <>
        <h1>Venom Wallet Boilerplate</h1>
        <p>Connect Wallet to continue</p>
        <a className="btn" onClick={login}>
          Connect wallet
        </a>
      </>
    </div>
  )
}

export default ConnectWallet

