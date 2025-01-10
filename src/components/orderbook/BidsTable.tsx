import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// Define types for bid and the getTrend function
interface Bid {
  price: string;
  quantity: string;
}

interface BidsTableProps {
  bids: Bid[];
  label?: string;
  showHead?: boolean;
  previousBids: Bid[];
  getTrend: (
    price: string,
    previousBids: Bid[],
    index: number
  ) => "up" | "down" | "neutral" | null;
}

const BidsTable: React.FC<BidsTableProps> = ({
  bids,
  previousBids,
  label,
  getTrend,
  showHead,
}) => {
  return (
    <div className="w-full ">
      <h3 className={"text-2xl font-semibold  text-center "}>{label}</h3>
      <div className="overflow-hidden rounded-lg shadow-lg  ">
        <table className="min-w-full divide-y divide-select text-sm">
          {showHead && (
            <thead className="bg-black/60 text-white font-bold">
              <tr>
                <th className="px-6 py-3 text-left text-xs   uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs   uppercase tracking-wider">
                  Quantity
                </th>
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-deselect/75 bg-select/75 text-white/60 font-bold">
            {bids.length > 0 ? (
              bids.map((bid, index) => (
                <tr
                  key={bid.price + index}
                  className="hover:bg-deselect/75 cursor-pointer transition ease-in-out duration-200"
                >
                  <td className="px-6 py-2 whitespace-nowrap flex items-center font-bold">
                    <div className=" font-bold">
                      $ {parseFloat(bid.price).toFixed(4)}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap  font-medium">
                    {getTrend(bid.price, previousBids, index) === "up" ? (
                      <div className="flex relative w-full h-full text-green-500">
                        {parseFloat(bid.quantity).toFixed(4)}

                        <div className="text-green-500 ml-2 font-bold">
                          {<FaArrowUp />}
                        </div>
                      </div>
                    ) : getTrend(bid.price, previousBids, index) === "down" ? (
                      <div className="flex relative w-full h-full text-red-500">
                        {parseFloat(bid.quantity).toFixed(4)}

                        <span className="text-red-500 ml-2 font-bold">
                          {" "}
                          {<FaArrowDown />}
                        </span>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-4 text-center text-gray-500 font-medium"
                >
                  No bids available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BidsTable;
