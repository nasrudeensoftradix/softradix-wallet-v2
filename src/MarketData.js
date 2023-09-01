import React, { useState, useEffect } from "react";
import axios from "axios";
import ChartModal from "./ChartModal";

const api_url = "https://graphql.coincap.io/";
let response = null;
let body = {
  variables: {
    direction: "ASC",
    first: 20,
    sort: "rank",
  },
  query:
    "query ($after: String, $before: String, $direction: SortDirection, $first: Int, $last: Int, $sort: AssetSortInput) {\n  assets(\n    after: $after\n    before: $before\n    direction: $direction\n    first: $first\n    last: $last\n    sort: $sort\n  ) {\n    pageInfo {\n      startCursor\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      __typename\n    }\n    edges {\n      cursor\n      node {\n        changePercent24Hr\n        name\n        id\n        logo\n        marketCapUsd\n        priceUsd\n        rank\n        supply\n        symbol\n        volumeUsd24Hr\n        vwapUsd24Hr\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
};

export default function MarketData() {
  const [list, setlist] = useState([]);
  const [isShow, setisShow] = useState(false);
  const [selectedChain, setselectedChain] = useState("");
  const [loader, setloader] = useState(false);
  useEffect(() => {
    setloader(true);
    let interval = setInterval(() => {
      new Promise(async (resolve, reject) => {
        try {
          response = await axios.post(api_url, body);
        } catch (ex) {
          response = null;
          // error
          console.log(ex);
          reject(ex);
          setloader(false);
        }
        if (response) {
          // success
          const json = response.data;
          setlist((prev) => {
            let data = [...prev];
            if (data?.length < 1) return json.data?.assets?.edges;
            for (let i = 0; i < json.data?.assets?.edges?.length; i++) {
              if (
                json.data?.assets?.edges[i]?.node?.priceUsd <
                data[i]?.node?.priceUsd
              ) {
                data[i] = {
                  ...json.data?.assets?.edges[i],
                  color: "red",
                };
              } else if (
                json.data?.assets?.edges[i]?.node?.priceUsd >
                data[i]?.node?.priceUsd
              ) {
                data[i] = {
                  ...json.data?.assets?.edges[i],
                  color: "green",
                };
              } else {
                data[i] = {
                  ...data[i],
                  ...json.data?.assets?.edges[i],
                };
              }
            }
            setloader(false);
            return data;
          });
          resolve(json);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ChartModal
        isShow={isShow}
        closeModal={() => setisShow(false)}
        selectedChain={selectedChain}
      />
      {list?.length > 1 ? (
        <table id="customers2">
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>VWAP(24Hr)</th>
            <th>Volume(24Hr)</th>
            <th>Change(24Hr)</th>
          </tr>
          {list?.map((item, idx) => (
            <tr
              onClick={() => {
                setisShow(true);
                setselectedChain(item?.node?.symbol);
              }}
            >
              <td>{idx + 1}</td>
              <td className="name_img">
                <span>
                  <img
                    src={`https://assets.coincap.io/assets/icons/${item?.node?.symbol.toLowerCase()}@2x.png`}
                  />
                </span>
                <span>
                  {item?.node?.name} <br />
                  <span style={{ fontSize: "14px" }}>{item?.node?.symbol}</span>
                </span>
              </td>
              <td style={{ color: item?.color }}>
                ${Number(item?.node?.priceUsd).toFixed(8)}
              </td>
              <td>${Number(item?.node?.marketCapUsd).toFixed(2)}</td>
              <td>${Number(item?.node?.vwapUsd24Hr).toFixed(2)}</td>
              <td>${Number(item?.node?.volumeUsd24Hr).toFixed(2)}</td>
              <td>{Number(item?.node?.changePercent24Hr).toFixed(2)}%</td>
            </tr>
          ))}
        </table>
      ) : loader ? (
        "Fetching data..."
      ) : (
        ""
      )}
    </>
  );
}
