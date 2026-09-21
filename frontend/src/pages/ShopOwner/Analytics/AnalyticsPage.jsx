import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Download, Users, Clock, Award, Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Legend, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { analyticsAPI } from '../../../services/api';
import GlassCard from '../../../components/GlassCard';
import { ChartSkeleton } from '../../../components/LoadingSkeleton';
import { useToast } from '../../../context/NotificationContext';

const COLORS = ['#D97706', '#15803D', '#64748B', '#0F172A', '#1E293B'];

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const { addToast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getSales();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setData({
        monthly_breakdown: [
          { month: 'Jan', revenue: 14200, profit: 4800, orders: 310 },
          { month: 'Feb', revenue: 16800, profit: 5600, orders: 340 },
          { month: 'Mar', revenue: 19500, profit: 6900, orders: 410 },
          { month: 'Apr', revenue: 21000, profit: 7400, orders: 450 },
          { month: 'May', revenue: 24800, profit: 8900, orders: 520 },
          { month: 'Jun', revenue: 28400, profit: 10200, orders: 590 },
        ],
        daily_breakdown: [
          { date: 'Mon', revenue: 1200, profit: 360, orders: 18 },
          { date: 'Tue', revenue: 1450, profit: 435, orders: 22 },
          { date: 'Wed', revenue: 1100, profit: 330, orders: 15 },
          { date: 'Thu', revenue: 1890, profit: 567, orders: 28 },
          { date: 'Fri', revenue: 2400, profit: 720, orders: 35 },
          { date: 'Sat', revenue: 3100, profit: 930, orders: 42 },
          { date: 'Sun', revenue: 2750, profit: 825, orders: 38 },
        ],
        weekly_breakdown: [
          { week: 'Week 1', revenue: 8900, profit: 2670, orders: 142 },
          { week: 'Week 2', revenue: 9500, profit: 2850, orders: 155 },
          { week: 'Week 3', revenue: 10200, profit: 3060, orders: 168 },
          { week: 'Week 4', revenue: 9800, profit: 2940, orders: 155 },
        ],
        peak_hours: [
          { hour: '09 AM', traffic: 35, sales: 450 },
          { hour: '11 AM', traffic: 78, sales: 1200 },
          { hour: '01 PM', traffic: 92, sales: 1850 },
          { hour: '03 PM', traffic: 64, sales: 980 },
          { hour: '05 PM', traffic: 110, sales: 2400 },
          { hour: '07 PM', traffic: 85, sales: 1600 },
        ],
        customer_metrics: {
          repeat_customer_rate: '68.4%',
          average_order_value: '$42.50',
          customer_satisfaction_score: '4.8 / 5.0'
        },
        best_selling: [
          { name: 'Organic Almond Milk', sales: 45, revenue: 135.00 },
          { name: 'Fresh Bread Loaf', sales: 38, revenue: 114.00 },
          { name: 'Organic Eggs (12pk)', sales: 32, revenue: 96.00 },
          { name: 'Local Honey', sales: 28, revenue: 140.00 },
        ],
        slow_moving: [
          { name: 'Artisan Cheese', sales: 5, revenue: 37.50, stock: 45 },
          { name: 'Organic Tea', sales: 8, revenue: 48.00, stock: 32 },
          { name: 'Premium Olive Oil', sales: 3, revenue: 45.00, stock: 18 },
        ],
        category_performance: [
          { name: 'Beverages', revenue: 4200, profit: 1260 },
          { name: 'Dairy', revenue: 3100, profit: 930 },
          { name: 'Produce', revenue: 2800, profit: 840 },
          { name: 'Snacks', revenue: 1900, profit: 570 },
        ],
        stock_movement: [
          { product: 'Almond Milk', in: 120, out: 95, balance: 25 },
          { product: 'Bread Loaf', in: 80, out: 72, balance: 8 },
          { product: 'Organic Eggs', in: 200, out: 180, balance: 20 },
          { product: 'Local Honey', in: 50, out: 30, balance: 20 },
        ]
      });
      addToast('Using demo data - Please check backend connection', 'warning');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ChartSkeleton />;

  const { monthly_breakdown, daily_breakdown, weekly_breakdown, peak_hours, customer_metrics, best_selling, slow_moving, category_performance, stock_movement } = data;

  const currentData = timeRange === 'daily' ? daily_breakdown : timeRange === 'weekly' ? weekly_breakdown : monthly_breakdown;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
            Business Analytics
          </h1>
          <p className="text-slate/60 dark:text-slate/60 text-xs mt-1">
            Deep insights into revenue, profit, sales trends, and product performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={() => addToast('Exporting Analytics Report...', 'success')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber/90 transition-all"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="bg-warmwhite/60 dark:bg-charcoal/60 border-warmwhite/60 dark:border-charcoal flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber/10 text-amber flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate/60 dark:text-slate/60">Repeat Customer Rate</p>
            <h3 className="text-2xl font-extrabold text-navy dark:text-white font-mono">{customer_metrics.repeat_customer_rate}</h3>
          </div>
        </GlassCard>

        <GlassCard className="bg-warmwhite/60 dark:bg-charcoal/60 border-warmwhite/60 dark:border-charcoal flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber/10 text-amber flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate/60 dark:text-slate/60">Average Order Value</p>
            <h3 className="text-2xl font-extrabold text-navy dark:text-white font-mono">{customer_metrics.average_order_value}</h3>
          </div>
        </GlassCard>

        <GlassCard className="bg-warmwhite/60 dark:bg-charcoal/60 border-warmwhite/60 dark:border-charcoal flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-mutedgreen/10 text-mutedgreen flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate/60 dark:text-slate/60">Customer Satisfaction</p>
            <h3 className="text-2xl font-extrabold text-navy dark:text-white font-mono">{customer_metrics.customer_satisfaction_score}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Revenue vs Profit Chart */}
      <GlassCard className="space-y-6">
        <h3 className="text-lg font-bold text-navy dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber" /> Revenue vs Gross Profit
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData}>
              <XAxis dataKey={timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : 'month'} stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="revenue" fill="#D97706" radius={[6, 6, 0, 0]} name="Revenue ($)" />
              <Bar dataKey="profit" fill="#15803D" radius={[6, 6, 0, 0]} name="Net Profit ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Sales Trends & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="space-y-6">
          <h3 className="text-lg font-bold text-navy dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber" /> Sales Trends
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData}>
                <XAxis dataKey={timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : 'month'} stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#D97706" strokeWidth={3} name="Revenue ($)" />
                <Line type="monotone" dataKey="profit" stroke="#15803D" strokeWidth={2} name="Profit ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="space-y-6">
          <h3 className="text-lg font-bold text-navy dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber" /> Peak Store Hours
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peak_hours}>
                <XAxis dataKey="hour" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="sales" fill="#D97706" radius={[6, 6, 0, 0]} name="Sales ($)" />
                <Bar dataKey="traffic" fill="#64748B" radius={[6, 6, 0, 0]} name="Foot Traffic" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Best Selling & Slow Moving Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="space-y-6">
          <h3 className="text-lg font-bold text-navy dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-mutedgreen" /> Best Selling Products
          </h3>
          <div className="space-y-3">
            {best_selling.map((product, idx) => (
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
                <span className="text-sm font-bold text-navy dark:text-white font-mono">${product.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="space-y-6">
          <h3 className="text-lg font-bold text-navy dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red" /> Slow Moving Products
          </h3>
          <div className="space-y-3">
            {slow_moving.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
                <div>
                  <p className="text-sm font-bold text-navy dark:text-white">{product.name}</p>
                  <p className="text-xs text-slate/60 dark:text-slate/60">{product.sales} sold &bull; {product.stock} in stock</p>
                </div>
                <span className="text-sm font-bold text-red font-mono">${product.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Category Performance & Stock Movement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="space-y-6">
          <h3 className="text-lg font-bold text-navy dark:text-white">Category Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            {category_performance.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-sm font-bold text-navy dark:text-white">{item.name}</span>
                </div>
                <p className="text-xs text-slate/60 dark:text-slate/60">Revenue: <span className="font-mono font-bold text-navy dark:text-white">${item.revenue.toLocaleString()}</span></p>
                <p className="text-xs text-slate/60 dark:text-slate/60">Profit: <span className="font-mono font-bold text-mutedgreen">${item.profit.toLocaleString()}</span></p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="space-y-6">
          <h3 className="text-lg font-bold text-navy dark:text-white">Stock Movement</h3>
          <div className="space-y-3">
            {stock_movement.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
                <div>
                  <p className="text-sm font-bold text-navy dark:text-white">{item.product}</p>
                  <p className="text-xs text-slate/60 dark:text-slate/60">In: {item.in} &bull; Out: {item.out}</p>
                </div>
                <span className={`text-sm font-bold font-mono ${item.balance < 10 ? 'text-red' : 'text-mutedgreen'}`}>
                  {item.balance} remaining
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;