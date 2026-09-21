import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Package, AlertTriangle, ShoppingBag, ArrowUpRight, RefreshCw, PlusCircle, ArrowRight, Clock, CheckCircle, XCircle, Search, Filter, Download, BarChart3, PieChart as PieChartIcon, LineChart } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import GlassCard from '../../components/GlassCard';
import { CardSkeleton, ChartSkeleton } from '../../components/LoadingSkeleton';
import { useToast } from '../../context/NotificationContext';

const COLORS = ['#D97706', '#15803D', '#64748B', '#0F172A', '#1E293B'];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/shop-owner/dashboard?range=${dateRange}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.message);
      setData(null);
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <XCircle className="w-16 h-16 text-red mb-4" />
        <h2 className="text-xl font-bold text-navy dark:text-white mb-2">Failed to load dashboard</h2>
        <p className="text-slate/60 dark:text-slate/60 text-sm mb-6">{error}</p>
        <button onClick={fetchDashboardData} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber text-white text-sm font-bold hover:bg-amber/90 transition-all">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="w-16 h-16 text-slate/60 dark:text-slate/60 mb-4" />
        <h2 className="text-xl font-bold text-navy dark:text-white mb-2">No data available</h2>
        <p className="text-slate/60 dark:text-slate/60 text-sm mb-6">Start by adding products and processing sales.</p>
        <button onClick={fetchDashboardData} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber text-white text-sm font-bold hover:bg-amber/90 transition-all">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
    );
  }

  const { overview, trend_data, top_products, recent_sales, inventory_alerts, category_performance } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate/60 dark:text-slate/60 text-xs mt-1">
            Overview of your shop's performance
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm font-semibold text-navy dark:text-white hover:bg-warmwhite/80 dark:hover:bg-charcoal/80 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={() => addToast('Exporting report...', 'success')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber text-white text-sm font-bold hover:bg-amber/90 transition-all"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <button className="text-left p-6 rounded-2xl bg-white dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Today's Revenue</p>
              <h2 className="text-2xl font-extrabold text-navy dark:text-white mt-2 font-mono">
                {formatCurrency(overview.today_revenue)}
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-mutedgreen mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+14.2% vs yesterday</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center group-hover:bg-amber/20 transition-colors">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </button>

        <button className="text-left p-6 rounded-2xl bg-white dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Today's Profit</p>
              <h2 className="text-2xl font-extrabold text-navy dark:text-white mt-2 font-mono">
                {formatCurrency(overview.today_profit)}
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-mutedgreen mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12.5% vs yesterday</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-mutedgreen/10 border border-mutedgreen/30 text-mutedgreen flex items-center justify-center group-hover:bg-mutedgreen/20 transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </button>

        <button className="text-left p-6 rounded-2xl bg-white dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Sales Count</p>
              <h2 className="text-2xl font-extrabold text-navy dark:text-white mt-2 font-mono">
                {overview.today_sales}
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate/60 dark:text-slate/60 mt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Orders today</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center group-hover:bg-amber/20 transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </button>

        <button className="text-left p-6 rounded-2xl bg-white dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Total Products</p>
              <h2 className="text-2xl font-extrabold text-navy dark:text-white mt-2 font-mono">
                {overview.total_products}
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber mt-2">
                <Package className="w-3.5 h-3.5" />
                <span>Manage catalog</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center group-hover:bg-amber/20 transition-colors">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </button>
      </div>

      {/* Inventory Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="text-left p-6 rounded-2xl bg-white dark:bg-charcoal border border-amber/30 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Low Stock</p>
              <h2 className="text-2xl font-extrabold text-amber mt-2 font-mono">
                {overview.low_stock_products} Items
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber mt-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Priority: Medium</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </button>

        <button className="text-left p-6 rounded-2xl bg-white dark:bg-charcoal border border-red/30 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Out of Stock</p>
              <h2 className="text-2xl font-extrabold text-red mt-2 font-mono">
                {overview.out_of_stock_products} Items
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-red mt-2">
                <XCircle className="w-3.5 h-3.5" />
                <span>Priority: High</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red/10 border border-red/30 text-red flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </button>

        <button className="text-left p-6 rounded-2xl bg-white dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate/60 dark:text-slate/60 uppercase tracking-wider">Revenue vs Profit</p>
              <h2 className="text-2xl font-extrabold text-navy dark:text-white mt-2 font-mono">
                {formatCurrency(overview.total_revenue - overview.total_profit)}
              </h2>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-mutedgreen mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Cost of Goods</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-charcoal/10 border border-charcoal/30 text-charcoal flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber text-white text-sm font-bold hover:bg-amber/90 transition-all">
          <PlusCircle className="w-4 h-4" /> Add Product
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm font-semibold text-navy dark:text-white hover:bg-warmwhite/80 dark:hover:bg-charcoal/80 transition-all">
          <RefreshCw className="w-4 h-4" /> Update Stock
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm font-semibold text-navy dark:text-white hover:bg-warmwhite/80 dark:hover:bg-charcoal/80 transition-all">
          <ShoppingBag className="w-4 h-4" /> View Sales
        </button>
      </div>

      {/* Revenue & Profit Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-navy dark:text-white">Revenue Trend</h3>
              <p className="text-xs text-slate/60 dark:text-slate/60">Daily revenue over the selected period</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber text-xs font-semibold">
              {dateRange}
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend_data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#D97706" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-navy dark:text-white">Profit Trend</h3>
              <p className="text-xs text-slate/60 dark:text-slate/60">Daily profit over the selected period</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-mutedgreen/10 border border-mutedgreen/30 text-mutedgreen text-xs font-semibold">
              {dateRange}
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend_data}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803D" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#15803D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="profit" stroke="#15803D" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="Profit ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Top Products & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-navy dark:text-white">Top Products</h3>
              <p className="text-xs text-slate/60 dark:text-slate/60">Best selling products</p>
            </div>
            <button className="text-xs text-amber font-semibold hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {top_products.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber/10 text-amber text-sm font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy dark:text-white">{product.name}</p>
                    <p className="text-xs text-slate/60 dark:text-slate/60">{product.sales} sold</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-navy dark:text-white font-mono">{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-navy dark:text-white">Recent Sales</h3>
              <p className="text-xs text-slate/60 dark:text-slate/60">Latest transactions</p>
            </div>
            <button className="text-xs text-amber font-semibold hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {recent_sales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    sale.status === 'completed'
                      ? 'bg-mutedgreen/10 text-mutedgreen'
                      : 'bg-amber/10 text-amber'
                  }`}>
                    {sale.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy dark:text-white">{sale.customer}</p>
                    <p className="text-xs text-slate/60 dark:text-slate/60">{sale.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-navy dark:text-white font-mono">{formatCurrency(sale.amount)}</p>
                  <p className="text-xs text-slate/60 dark:text-slate/60">{formatDate(sale.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Inventory Alerts */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-navy dark:text-white">Inventory Alerts</h3>
            <p className="text-xs text-slate/60 dark:text-slate/60">Products requiring attention</p>
          </div>
          <button className="text-xs text-amber font-semibold hover:underline">View all</button>
        </div>
        <div className="space-y-3">
          {inventory_alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  alert.priority === 'high'
                    ? 'bg-red/10 text-red'
                    : 'bg-amber/10 text-amber'
                }`}>
                  {alert.priority === 'high' ? <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy dark:text-white">{alert.product}</p>
                  <p className="text-xs text-slate/60 dark:text-slate/60">{alert.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  alert.priority === 'high'
                    ? 'bg-red/10 text-red'
                    : 'bg-amber/10 text-amber'
                }`}>
                  {alert.priority}
                </span>
                <button className="text-xs text-amber font-semibold hover:underline">Restock</button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Category Performance */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-navy dark:text-white">Category Performance</h3>
            <p className="text-xs text-slate/60 dark:text-slate/60">Revenue breakdown by category</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={category_performance}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {category_performance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {category_performance.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-navy dark:text-white font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-navy dark:text-white">{formatCurrency(item.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default DashboardPage;