/* eslint-disable react/prop-types */
import React from "react";

const NftQa = props => {
  const data = [
    {
      question:
        "How many NFTs will be available? What are the maximum mints per address?",
      answer: [
        "The first Moon Men collection will consist of 807 NFTs. (Footprint went live on August 7, 2021, making 807 an important number for us.",
        "Maximum mint per address: 1.",
      ],
    },
    {
      question: "How can I mint it? What are the mint costs?",
      answer: [
        "Only users on the allow list can mint an NFT.",
        "Minting is free. Of course, you still need to pay a gas fee.",
      ],
    },
  ];
  return (
    <>
      <div className="nft-activity__qa">
        <ul>
          {data.map(item => {
            return (
              <div key={item.question} className="nft-activity__qa-box">
                <h1>{item.question}</h1>
                <div className="nft-activity__qa-answer">
                  {item.answer.map(answer => {
                    return (
                      <li key={answer} className="nft-activity__qa-answer-item">
                        <span>{answer}</span>
                      </li>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default NftQa;
