import { faCopy } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useState } from "react";

import ReactTooltip from 'react-tooltip';

export const NFTCard = ({ nft }) => {
    const [text, setText] = useState(nft.contract.address);
    const inputHandler = event => {
        setText(event.target.value);
      }

      const copy = async () => {
        await navigator.clipboard.writeText(text);
      }

      
    return (
        <div className="w-auto flex flex-col m-2 ">
            <div className="rounded-md">
                <img className="object-cover h-64 w-full rounded-t-md" src={nft.media[0].gateway ? nft.media[0].gateway : "https://st3.depositphotos.com/1186248/14351/i/950/depositphotos_143511907-stock-photo-not-available-rubber-stamp.jpg"} ></img>
            </div>
            <div className="flex flex-row ">
                <div className="bg-slate-100">
                <button onClick={copy} disabled={!text}>
                    <FontAwesomeIcon 
                    data-tip="Copy to Clipboard" 
                      className="border-solid border-2 border-black hover:border-white hover:text-white hover:bg-black rounded-full p-2 mt-5 mr-3 ml-3" 
                      icon={faCopy} />
 </button>
                </div>
                <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md w-full">
                    <div className="">
                        <h2 className="text-xl text-gray-800 line-clamp-1">{nft.title}</h2>
                        <p className="text-gray-600" >{nft.contract.address.substring(0, 6)}...</p>
                    
                    </div>

                </div>

            </div>
        </div>
    )
}