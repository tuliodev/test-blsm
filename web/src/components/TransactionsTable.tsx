import { Transaction } from "@/helpers/loadTransactions"

interface TransactionsTableProps {
    transactions: Transaction[]
}

export default function TransactionsTable({transactions}: TransactionsTableProps) {

    return (
        <div className="bg-gray-800 shadow-md rounded-lg p-4 mb-6 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Transaction History
        </h2>
        <table className="w-full table-auto text-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Minted</th>
              <th className="px-4 py-2 text-left">Spent</th>
              <th className="px-4 py-2 text-left">Burned</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-t border-gray-600">
                <td className="px-4 py-2">{tx.date}</td>
                <td className="px-4 py-2">{tx.action}</td>
                <td className="px-4 py-2">{tx.minted ?? "N/A"}</td>{" "}
                {/* Show 'N/A' if minted is undefined */}
                <td className="px-4 py-2">{tx.spent ?? "N/A"}</td>{" "}
                {/* Show 'N/A' if spent is undefined */}
                <td className="px-4 py-2">{tx.burned ?? "N/A"}</td>{" "}
                {/* Show 'N/A' if burned is undefined */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}