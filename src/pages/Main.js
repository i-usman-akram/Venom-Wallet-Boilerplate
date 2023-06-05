import { Address, ProviderRpcClient  } from "everscale-inpage-provider"
import React, { useEffect, useState } from "react"
import { EverscaleStandaloneClient,EverWalletAccount, SimpleKeystore } from "everscale-standalone-client"
// import {EverWalletAccount} from "@eversdk/core";
import BackImg from "../styles/img/decor.svg"
import LogOutImg from "../styles/img/log_out.svg"

// Importing of our contract ABI from smart-contract build action. Of cource we need ABI for contracts calls.
// import tokenRootAbi from "../abi/TokenRoot.abi.json"
// import tokenWalletAbi from "../abi/TokenWallet.abi.json"

import ConnectWallet from "../components/ConnectWallet"
import Transfer from "../components/Transfer"
import { abi, IR_CONTRACT_ADDRESS } from "../constants";
let keyPair = {
  publicKey: "0eabed4ad0687ede4d103dda14cc582238237362c2d363e28e73c914181d2c7a",
  secretKey: "1552f761f617b7a2cec21ca6bc654fbf2632f9f6cc3ac4c27bbaf8455d8f8239"
}

let eas = await EverWalletAccount.fromPubkey({publicKey:"0eabed4ad0687ede4d103dda14cc582238237362c2d363e28e73c914181d2c7a"})
let easAddress = "0:a3457cb4910926ebbd181a16077951c54ba2bbbe1769da02ff5b5830182de9c5"

eas["getAccount"] = (address) => {
  return eas
}


let sks = new SimpleKeystore()
sks.addKeyPair(keyPair.publicKey, keyPair)

const ever = new ProviderRpcClient({
  fallback: () =>
      EverscaleStandaloneClient.create({
          connection: {
              id: 1, // network id
              type: 'graphql',
              data: {
                  endpoints: ['gql-testnet.venom.foundation'],
              },
          },
          keystore: sks,
          accountsStorage: eas,

      }),
});


await ever.ensureInitialized();

await ever.requestPermissions({
  permissions: ['basic'],
});
function Main({ venomConnect }) {
  const [venomProvider, setVenomProvider] = useState()
  const [address, setAddress] = useState()

  // We will store token balance from contract
  const [balance, setBalance] = useState()
  let tokenWalletAddress // User's TIP-3 TokenWallet address

  // This method allows us to gen a wallet address from inpage provider
  const getAddress = async provider => {
    const providerState = await provider?.getProviderState?.()
    return providerState?.permissions.accountInteraction?.address.toString()
  }

  // Any interaction with venom-wallet (address fetching is included) needs to be authentificated
  const checkAuth = async _venomConnect => {
    const auth = await _venomConnect?.checkAuth()
    if (auth) await getAddress(_venomConnect)
  }

  // This handler will be called after venomConnect.login() action
  // connect method returns provider to interact with wallet, so we just store it in state
  const onConnect = async provider => {
    setVenomProvider(provider)
    await onProviderReady(provider)
  }

  // This handler will be called after venomConnect.disconnect() action
  // By click logout. We need to reset address and balance.
  const onDisconnect = async () => {
    venomProvider?.disconnect()
    setAddress(undefined)
  }

  // When our provider is ready, we need to get address and balance from.
  const onProviderReady = async provider => {
    const venomWalletAddress = provider ? await getAddress(provider) : undefined
    setAddress(venomWalletAddress)
  }

  useEffect(() => {
    // connect event handler
    const off = venomConnect?.on("connect", onConnect)
    if (venomConnect) {
      checkAuth(venomConnect)
    }
    // just an empty callback, cuz we don't need it
    return () => {
      off?.()
    }
  }, [venomConnect])

  const callthis = async ()=>{
    const contr = new ever.Contract(abi, IR_CONTRACT_ADDRESS);
    await contr.methods.transfer({
      amount: 1 * 18,
      recipient: new Address("0:344e58679c5a91513a7ec1dc590c77db1f7becddf818fde42d4dd907ede056bc"),
      deployWalletValue: 0,
      remainingGasTo: new Address("0:a3457cb4910926ebbd181a16077951c54ba2bbbe1769da02ff5b5830182de9c5"),
      notify: false,
      payload: ''
    }).send({
      from: new Address("0:a3457cb4910926ebbd181a16077951c54ba2bbbe1769da02ff5b5830182de9c5"), 
      recipient: new Address("0:344e58679c5a91513a7ec1dc590c77db1f7becddf818fde42d4dd907ede056bc"),
      amount: '1000000000'
    });

  }

  return (
    <div className="box">
      {address && (
        <header>
          <p>{address}</p>
          <a className="logout" onClick={onDisconnect}>
            <img src={LogOutImg} alt="Logout" />
          </a>
        </header>
      )}

      <img className="decor" src={BackImg} alt="back" />
      <div className="card">
        <div className="card__wrap">
          {address ?<Transfer callthis={callthis}/>
           : (
            <>
            <ConnectWallet venomConnect={venomConnect} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Main

