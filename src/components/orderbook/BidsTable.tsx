import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// Define types for bid and the getTrend function
interface Bid {
  price: string;
  quantity: string;
}

interface BidsTableProps {
  bids: Bid[];
  label: string;
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
}) => {
  return (
    <div className="w-full md:w-1/2">
      <h3
        className={
          "text-2xl font-semibold  mb-4 text-center " +
          (label === "Asks" ? "text-red-500/80 " : " text-green-600/80")
        }
      >
        {label}
      </h3>
      <div className="overflow-hidden rounded-lg shadow-lg border border-deselect">
        <table className="min-w-full divide-y divide-select text-sm">
          <thead className="bg-deselect text-white font-bold">
            <tr>
              <th className="px-6 py-3 text-left text-xs   uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs   uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deselect bg-select text-white/60 font-bold">
            {bids.length > 0 ? (
              bids.map((bid, index) => (
                <tr
                  key={bid.price + index}
                  className="hover:bg-deselect cursor-pointer transition ease-in-out duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <span className=" font-medium">
                      $ {parseFloat(bid.price).toFixed(4)}
                    </span>
                    {getTrend(bid.price, previousBids, index) === "up" ? (
                      <span className="text-green-500 ml-2 font-bold">
                        {<FaArrowUp />}
                      </span>
                    ) : getTrend(bid.price, previousBids, index) === "down" ? (
                      <span className="text-red-500 ml-2 font-bold">
                        {" "}
                        {<FaArrowDown />}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  font-medium">
                    {parseFloat(bid.quantity).toFixed(4)}
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
