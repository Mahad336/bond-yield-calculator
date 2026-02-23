import type { CashFlow } from '../types/bond.types';

interface CashFlowTableProps {
  cashFlows: CashFlow[];
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function CashFlowTable({ cashFlows }: CashFlowTableProps) {
  if (cashFlows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <table className="w-full min-w-[500px]">
        <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
              Period
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
              Payment Date
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
              Coupon Payment
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
              Cumulative Interest
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
              Principal
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
              Face Returned
            </th>
          </tr>
        </thead>
        <tbody>
          {cashFlows.map((flow, index) => (
            <tr
              key={flow.period}
              className={`${
                index === cashFlows.length - 1
                  ? 'bg-teal-500/10 border-t-2 border-teal-500/50'
                  : index % 2 === 0
                    ? 'bg-white/5'
                    : 'bg-white/[0.02]'
              }`}
            >
              <td className="px-4 py-3 text-white tabular-nums">{flow.period}</td>
              <td className="px-4 py-3 text-slate-300">{flow.date}</td>
              <td className="px-4 py-3 text-right text-white tabular-nums">
                {formatCurrency(flow.coupon)}
              </td>
              <td className="px-4 py-3 text-right text-white tabular-nums">
                {formatCurrency(flow.cumulative)}
              </td>
              <td className="px-4 py-3 text-right text-slate-300 tabular-nums">
                {flow.principal > 0 ? formatCurrency(flow.principal) : '—'}
              </td>
              <td className="px-4 py-3 text-right text-slate-300 tabular-nums">
                {flow.faceReturned != null
                  ? formatCurrency(flow.faceReturned)
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
