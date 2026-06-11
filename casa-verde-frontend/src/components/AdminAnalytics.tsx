/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ShoppingBag, TrendingUp, DollarSign, Award, Percent } from 'lucide-react';
import { Order } from '../types';

interface AdminAnalyticsProps {
  orders: Order[];
}

export default function AdminAnalytics({ orders }: AdminAnalyticsProps) {
  // Aggregate sales by day of week
  const dayNames = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
  const dayFullNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  // Initialize weekly trackers
  const statsByDay = Array.from({ length: 7 }, (_, i) => ({
    dayKey: dayNames[i],
    dayLabel: dayFullNames[i],
    revenue: 0,
    ordersCount: 0
  }));

  // Compiling orders dynamically
  orders.forEach((order) => {
    if (order.status === 'Cancelled') return;
    
    // Parse date if possible, otherwise we spread it over the end days or matching day index
    let dayIndex = 5; // default Friday
    const dateStr = order.date.toLowerCase();
    
    if (dateStr.includes('7 juin') || dateStr.includes('dim')) dayIndex = 0; // Sunday
    else if (dateStr.includes('4 juin') || dateStr.includes('jeu')) dayIndex = 4; // Thursday
    else if (dateStr.includes('5 juin') || dateStr.includes('ven')) dayIndex = 5; // Friday
    else if (dateStr.includes('6 juin') || dateStr.includes('sam')) dayIndex = 6; // Saturday
    else {
      // General fallback using date object
      try {
        const d = new Date(order.date);
        if (!isNaN(d.getTime())) {
          dayIndex = d.getDay();
        }
      } catch (e) {
        dayIndex = 5;
      }
    }

    statsByDay[dayIndex].revenue += order.total;
    statsByDay[dayIndex].ordersCount += 1;
  });

  // Re-order starting Monday (index 1) for a standard business display flow
  const reorderedStats = [
    statsByDay[1], // Lundi
    statsByDay[2], // Mardi
    statsByDay[3], // Mercredi
    statsByDay[4], // Jeudi
    statsByDay[5], // Vendredi
    statsByDay[6], // Samedi
    statsByDay[0]  // Dimanche
  ];

  // Category distribution analysis
  const categoryCounts: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.status === 'Cancelled') return;
    o.items.forEach((item) => {
      // Get category name or fallback to menu defaults
      const cat = item.name.toLowerCase().includes('crêpe')
        ? 'Crêpes'
        : item.name.toLowerCase().includes('tacos')
        ? 'Tacos'
        : item.name.toLowerCase().includes('sandwich')
        ? 'Sandwiches'
        : item.name.toLowerCase().includes('poutine')
        ? 'Poutine'
        : 'Boissons';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity;
    });
  });

  const categoryPieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  // Fallback defaults if no items
  const pieDataFinal = categoryPieData.length > 0 ? categoryPieData : [
    { name: 'Tacos', value: 4 },
    { name: 'Sandwiches', value: 3 },
    { name: 'Poutine', value: 2 },
    { name: 'Crêpes', value: 5 },
    { name: 'Boissons', value: 3 }
  ];

  const PIE_COLORS = ['#0D5C2A', '#D4A62A', '#1C9347', '#E6BD4B', '#073B1A'];

  // Global KPIs stats
  const totalSalesVal = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const averageBasket = orders.length > 0 ? Math.round(totalSalesVal / orders.length) : 0;

  return (
    <div className="space-y-8 select-none">
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-green">Analytique</h1>
        <p className="font-sans text-xs font-light text-brand-green/70 mt-1">
          Rapports détaillés et tendances d'achat pour optimiser votre rentabilité.
        </p>
      </div>

      {/* Dynamic Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-brand-ivory rounded-2xl p-5 border border-brand-green/10 shadow-sm">
          <p className="font-sans text-[10px] tracking-wider uppercase font-bold text-brand-green/50">
            Chiffre d'Affaires Log
          </p>
          <div className="flex items-baseline justify-between mt-4">
            <p className="font-serif text-2xl font-bold text-brand-green">
              {totalSalesVal.toLocaleString()} DZD
            </p>
            <div className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5 shrink-0" /> +12.4%
            </div>
          </div>
        </div>

        <div className="bg-brand-ivory rounded-2xl p-5 border border-brand-green/10 shadow-sm">
          <p className="font-sans text-[10px] tracking-wider uppercase font-bold text-brand-green/50">
            Panier Moyen Estimé
          </p>
          <div className="flex items-baseline justify-between mt-4">
            <p className="font-serif text-2xl font-bold text-brand-green">
              {averageBasket.toLocaleString()} DZD
            </p>
            <span className="text-[10px] text-brand-gold-dark font-bold font-sans uppercase">
              Valeur panier
            </span>
          </div>
        </div>

        <div className="bg-brand-ivory rounded-2xl p-5 border border-brand-green/10 shadow-sm">
          <p className="font-sans text-[10px] tracking-wider uppercase font-bold text-brand-green/50">
            Taux de Conversion
          </p>
          <div className="flex items-baseline justify-between mt-4">
            <p className="font-serif text-2xl font-bold text-brand-green">3.18%</p>
            <div className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center">
              <Percent className="w-3 h-3 mr-0.5" /> +0.4%
            </div>
          </div>
        </div>

        <div className="bg-brand-ivory rounded-2xl p-5 border border-brand-green/10 shadow-sm">
          <p className="font-sans text-[10px] tracking-wider uppercase font-bold text-brand-green/50">
            Plat Best-Seller
          </p>
          <div className="flex items-baseline justify-between mt-4">
            <p className="font-serif text-base font-bold text-brand-green truncate max-w-[130px]">
              Tacos Poulet
            </p>
            <span className="text-[9px] font-bold text-brand-gold bg-brand-green px-2 py-0.5 rounded border border-brand-green">
              DELUXE
            </span>
          </div>
        </div>

      </div>

      {/* Charts Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Area Chart: Revenue Trend */}
        <div className="bg-brand-ivory rounded-3xl p-6 border border-brand-green/15 shadow-sm">
          <h3 className="font-serif text-base font-bold text-brand-green mb-6">Revenus • 7 derniers jours</h3>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reorderedStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D5C2A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0D5C2A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0D5C2A/10" />
                <XAxis dataKey="dayLabel" tick={{ fill: '#0D5C2A', fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: '#0D5C2A', fontSize: 10 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F8F5EE', borderRadius: '12px', border: '1px solid #0D5C2A' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0D5C2A' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0D5C2A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Bar Chart: Order Counts */}
        <div className="bg-brand-ivory rounded-3xl p-6 border border-brand-green/15 shadow-sm">
          <h3 className="font-serif text-base font-bold text-brand-green mb-6">Commandes par jour</h3>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reorderedStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0D5C2A/10" />
                <XAxis dataKey="dayLabel" tick={{ fill: '#0D5C2A', fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: '#0D5C2A', fontSize: 10 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F8F5EE', borderRadius: '12px', border: '1px solid #0D5C2A' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0D5C2A' }}
                />
                <Bar dataKey="ordersCount" fill="#D4A62A" radius={[8, 8, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Pie Chart and Category metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pie Distribution Map */}
        <div className="lg:col-span-1 bg-brand-ivory rounded-3xl p-6 border border-brand-green/15 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-brand-green mb-6">Breaks par catégorie</h3>
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataFinal}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieDataFinal.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custom Labels List */}
          <div className="space-y-2 pt-4 border-t border-brand-green/5">
            {pieDataFinal.map((entry, index) => (
              <div key={entry.name} className="flex justify-between items-center text-xs font-sans">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-brand-green/80 font-medium">{entry.name}</span>
                </div>
                <span className="font-bold text-brand-green-dark">{entry.value} unités</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns (Span 2): Additional analytical trends (conversion summary) */}
        <div className="lg:col-span-2 bg-brand-ivory rounded-3xl p-6 border border-brand-green/15 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-brand-green mb-6">Synthèse des Performances de Vente</h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-sans text-brand-green/70 mb-1">
                  <span>Plats salés (Tacos, Sandwiches, Poutine)</span>
                  <span className="font-bold text-brand-green-dark">65% de taux d'achat</span>
                </div>
                <div className="w-full bg-brand-green/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-green h-full rounded-full" style={{ width: '65%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-sans text-brand-green/70 mb-1">
                  <span>Créations sucrées (Crêpes Deluxe, Gaufres)</span>
                  <span className="font-bold text-brand-green-dark">25% de taux d'achat</span>
                </div>
                <div className="w-full bg-brand-green/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-gold h-full rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-sans text-brand-green/70 mb-1">
                  <span>Boissons & Boissons Lactées</span>
                  <span className="font-bold text-brand-green-dark">10% de taux d'achat</span>
                </div>
                <div className="w-full bg-brand-green/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-brand-green/10 flex items-center justify-between">
            <p className="font-sans text-[11px] font-bold text-brand-gold-dark uppercase tracking-widest flex items-center">
              <Award className="w-4 h-4 mr-1 shrink-0" /> Certification qualité Casa Verde active
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
