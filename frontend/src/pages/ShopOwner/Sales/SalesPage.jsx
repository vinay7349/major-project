import React, { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, TrendingUp, TrendingDown, Package, Clock, CheckCircle, XCircle, RefreshCw, Download, Filter, Search } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area } from 'recharts';
import GlassCard from '../../../components/GlassCard';
import { useToast } from '../../../context/NotificationContext';

const SalesPage = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');
  const { addToast } = useToast();

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/shop-owner/sales?range=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const result = await response.json();
        setSalesData(result.data);
      } else {
        throw new Error('Failed to fetch sales data');
      }
    } catch (err) {
      console.error('Failed to load sales:', err);
      setSalesData({
        overview: {
          today_sales: 1485.50,
          today_orders: 24,
          week_sales: 8950.00,
          week_orders: 142,
          month_sales: 28450.00,
          month_orders: 520,
          total_revenue: 125000.00,
          total_orders: 2450,
          avg_order_value: 51.02,
          refund_rate: 2.3
        },
        daily_sales: [
          { date: 'Mon', sales: 1200, orders: 18 },
          { date: 'Tue', sales: 1450, orders: 22 },
          { date: 'Wed', sales: 1100, orders: 15 },
          { date: 'Thu', sales: 1890, orders: 28 },
          { date: 'Fri', sales: 2400, orders: 35 },
          { date: 'Sat', sales: 3100, orders: 42 },
          { date: 'Sun', sales: 2750, orders: 38 },
        ],
        recent_orders: [
          { id: 'ORD-001', customer: 'John D.', amount: 45.99, status: 'completed', date: '2024-01-15 14:30' },
          { id: 'ORD-002', customer: 'Sarah M.', amount: 128.50, status: 'completed', date: '2024-01-15 13:45' },
          { id: 'ORD-003', customer: 'Mike R.', amount: 23.75, status: 'pending', date: '2024-01-15 12:20' },
          { id: 'ORD-004', customer: 'Emily K.', amount: 89.99, status: 'completed', date: '2024-01-15 11:15' },
          { id: 'ORD-005', customer: 'David L.', amount: 156.00, status: 'refunded', date: '2024-01-15 10:30' },
        ]
      });
      addToast('Using demo data - Please check backend connection', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 bg-charcoal/20 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-charcoal/20 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const { overview, daily_sales, recent_orders } = salesData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
            Sales Overview
          </h1>
          <p className="text-slate/60 dark:text-slate/60 text-xs mt-1">
            Track revenue, orders, and sales performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={fetchSalesData}
            className="p-2.5 rounded-xl bg-white dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-slate/60 dark:text-slate/60 hover:text-navy dark:hover:text-white transition-all text-sm font-semibold flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Today's Sales</p>
              <h2 className="text-3xl font-extrabold text-navy dark:text-white mt-2 font-mono">
                ${overview.today_sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-mutedgreen mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+14.2% vs yesterday ({overview.today_orders} orders)</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Week Sales</p>
              <h2 className="text-3xl font-extrabold text-navy dark:text-white mt-2 font-mono">
                ${overview.week_sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-mutedgreen mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{overview.week_orders} orders this week</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Month Revenue</p>
              <h2 className="text-3xl font-extrabold text-navy dark:text-white mt-2 font-mono">
                ${overview.month_sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-mutedgreen mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{overview.month_orders} orders this month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Avg Order Value</p>
              <h2 className="text-3xl font-extrabold text-navy dark:text-white mt-2 font-mono">
                ${overview.avg_order_value.toFixed(2)}
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-red mt-2">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{overview.refund_rate}% refund rate</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Sales Trend Chart */}
      <GlassCard className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-navy dark:text-white">Sales Trend</h3>
            <p className="text-xs text-slate/60 dark:text-slate/60">Daily sales performance over the past 7 days</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber text-xs font-semibold">
            Live Feed
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily_sales}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              />
              <Legend />
              <Area type="monotone" dataKey="sales" stroke="#D97706" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" name="Sales ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Recent Orders Table */}
      <GlassCard className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-navy dark:text-white">Recent Orders</h3>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber text-white text-xs font-semibold hover:bg-amber/90 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warmwhite dark:bg-charcoal/80 border-b border-warmwhite/60 dark:border-charcoal text-slate/60 dark:text-slate/60 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmwhite/60 dark:divide-charcoal text-navy dark:text-warmwhite">
              {recent_orders.map((order) => (
                <tr key={order.id} className="hover:bg-warmwhite/60 dark:hover:bg-charcoal/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-navy dark:text-warmwhite">{order.id}</td>
                  <td className="p-4 text-slate/60 dark:text-slate/60">{order.customer}</td>
                  <td className="p-4 font-mono font-bold text-navy dark:text-warmwhite">${order.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      order.status === 'completed'
                        ? 'bg-mutedgreen/10 border border-mutedgreen/30 text-mutedgreen'
                        : order.status === 'pending'
                        ? 'bg-amber/10 border border-amber/30 text-amber'
                        : 'bg-red/10 border border-red/30 text-red'
                    }`}>
                      {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {order.status === 'pending' && <Clock className="w-3 h-3" />}
                      {order.status === 'refunded' && <XCircle className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate/60 dark:text-slate/60">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default SalesPage;