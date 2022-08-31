import Head from 'next/head'
import Image from 'next/image'
import { NFTCard } from "../components/nftCard"


import { useState, useReducer, useEffect } from 'react'

const Home = () => {

  const [Wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [byCollect, setByCollect] = useState(false);
  const [NFTs, setNFTs] = useState([])

  const [activeNFTs, setActiveNFTs] = useState([])

  const [pages, setpages] = useState();



  useEffect(() => {
    setActiveNFTs(NFTs?.filter((_, y) => y < 11 && y > 0))
    setpages(Math.floor(NFTs?.length / 10) + 1);
  }, [NFTs])

  const fetchNFTs = async () => {
    setNFTs();
    setActiveNFTs();
    let nfts;
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}/getNFTs/`;
    var requestOptions = {
      method: 'GET'
    }

    if (Wallet?.includes('.eth')) {
      const res = await fetch(`https://api.ensideas.com/ens/resolve/{Wallet}`).then(data => data.json)
      setWalletAddress(res.address);
    }

    if (!byCollect) {
      const fetchURL = `${baseURL}?owner=${Wallet}&filters%5B%5D=AIRDROPS`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    }
    else {
      const fetchURL = `${baseURL}?owner=${Wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {

      setNFTs(nfts.ownedNfts.filter(nft => nft.title!=''))
      setActiveNFTs(NFTs?.filter((_, i) => i < 10));
      console.log("NFTs in collection:", activeNFTs)

    }
    setpages(Math.floor(NFTs?.length / 10) + 1);
  }
  const fetchNFTsForCollection = async () => {
    setNFTs([]);
    setActiveNFTs([]);
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };

      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {

        setNFTs(nfts.nfts);
        setActiveNFTs(NFTs?.filter((_, i) => i < 10));


        console.log("NFTs in collection:", activeNFTs)
      }
    }
    setpages(Math.floor(NFTs?.length / 10) + 1);
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-9">
      <p className='mb-3'>
        Only works for ethereum mainnet NFTs!
      </p>

   
      <hr></hr>
      <div className="flex mt-5 flex-col w-full justify-center items-center gap-y-2">

        <input id="setwallet" onChange={e => setWalletAddress(e.target.value)} value={Wallet} className='p-4 w-2/4 border' disabled={byCollect}  placeholder="Add your wallet address"></input>
    
        <input id="setcollect" onChange={e => setCollectionAddress(e.target.value)} value={collection} className='p-4 w-2/4 border' type={"text"} placeholder="Add the collection address"></input>
      </div>
      <div className="flex flex-col w-full justify-center items-center gap-y-2 mt-3">
        <label className="text-gray-600 ">
          {byCollect}
          <input value={byCollect} onClick={e => setByCollect(!byCollect)} type={"checkbox"} className="mr-2">
          </input>Fetch By Collection Only
        </label>
      </div>
      <div className="flex space-x-2 flex-col sm:flex-row ">
        
        <button onClick={() => { setWalletAddress(`vitalik.eth`); }} className="bg-transparent w-40 mt-4 hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded">
          1. Populate Wallet Address
        </button>
        <button onClick={() => { setCollectionAddress(`0x23581767a106ae21c074b2276D25e5C3e136a68b`); }} className="bg-transparent w-40 mt-4 hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded">
          1. Populate Collection Address
        </button>
        <button onClick={() => byCollect ? fetchNFTsForCollection() : fetchNFTs()} className="bg-transparent w-40 mt-4 hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded">
          2. Fetch NFTs
        </button>
        <button onClick={() => { setWalletAddress(''); setCollectionAddress(''); setNFTs([]);}} className="bg-transparent w-40 mt-4 hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded">
          3. Clear
        </button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-6 mx-2'>

        {activeNFTs ? activeNFTs.map(nft =>
        
          <NFTCard nft={nft} />) : <p className='text-center'>Loading..</p>}
      </div>


      {activeNFTs && <div className="flex justify-center mt-4">
        <nav aria-label="Navigation">
          <ul class="flex list-style-none">
            {pages && Array.from(Array(pages)).length > 1 && Array.from(Array(pages + 1)).map((_, i) =>
              i != 0 && <li className="page-item">
                <a class="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                  onClick={() => {
                    setActiveNFTs(NFTs?.filter((_, y) => y < (i * 10) + 1 && y > (i - 1) * 10))
                  }}>{i}</a>
              </li>)}
          </ul>
        </nav>
      </div>}



    </div>
  )
}

export default Home
