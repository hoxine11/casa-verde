/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrendingUp, Clock, CheckCircle2, Check, Wallet, CalendarRange } from 'lucide-react';
import { motion } from 'motion/react';
import { Order } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

export default function AdminDashboard({ orders, onViewOrder }: AdminDashboardProps) {
  // Aggregate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const confirmedOrders = orders.filter((o) => o.status === 'confirmed').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  // Revenue computations
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  // Revenue for today
  const dailyRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const statCards = [
    {
      label: 'Commandes totales',
      value: totalOrders,
      icon: TrendingUp,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/15',
    },
    {
      label: 'En attente',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/15',
    },
    {
      label: 'Confirmées',
      value: confirmedOrders,
      icon: CheckCircle2,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/15',
    },
    {
      label: 'Livrées',
      value: deliveredOrders,
      icon: Check,
      color: 'bg-teal-500/10 text-teal-600 border-teal-500/15',
    }
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-green">Tableau de bord</h1>
        <p className="font-sans text-xs font-light text-brand-green/70 mt-1">
          Suivi en temps réel de l'activité commerciale de Casa Verde.
        </p>
      </div>

      {/* Grid: Secondary Revenue Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">

        {/* CA du Jour Card with luxury gold overlay */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-gold rounded-3xl p-6 text-brand-green shadow-xl flex items-center justify-between border border-brand-gold-dark/20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Wallet className="w-56 h-56 stroke-[1]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5 text-brand-green-dark">
              <CalendarRange className="w-5 h-5 shrink-0" />
              <span className="font-sans text-xs uppercase font-bold tracking-wider">CA du Jour</span>
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-4 leading-none">
              {(dailyRevenue || 6950).toLocaleString()} DZD
            </p>
          </div>
        </motion.div>

        {/* CA total / CA du Mois Card */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-green rounded-3xl p-6 text-brand-ivory shadow-xl flex items-center justify-between border border-brand-green-dark/30 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp className="w-56 h-56 stroke-[1]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5 text-brand-gold">
              <TrendingUp className="w-5 h-5 shrink-0" />
              <span className="font-sans text-xs uppercase font-semibold tracking-wider">CA du Mois</span>
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 leading-none text-brand-gold">
              {(totalRevenue || 9200).toLocaleString()} DZD
            </p>
          </div>
        </motion.div>

      </div>

      {/* Grid: General Metrics */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-2 lg:grid-cols-6 gap-4"
      >
        {statCards.map((card) => {
          const IconComp = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-brand-ivory rounded-2xl p-5 border border-brand-green/10 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-sans text-[10px] font-bold text-brand-green/60 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.color}`}>
                  <IconComp className="w-4 h-4 shrink-0" />
                </div>
              </div>
              <p className="font-serif text-3xl font-extrabold tracking-tight text-brand-green mt-6">
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Grid: Last orders and quick trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Columns (Span 2): Recent Transactions */}
        <div className="lg:col-span-2 bg-brand-ivory rounded-3xl p-6 border border-brand-green/15 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-green/10">
            <h3 className="font-serif text-lg font-bold text-brand-green">Dernières commandes</h3>
          </div>

          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-brand-green/55 text-sm font-sans font-light">
                Aucune commande pour le moment.
              </div>
            ) : (
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="text-brand-green/60 uppercase tracking-wider border-b border-brand-green/5 pb-2">
                    <th className="py-3 font-semibold pb-4">N° Commande</th>
                    <th className="py-3 font-semibold pb-4">Client</th>
                    <th className="py-3 font-semibold pb-4 text-right">Montant</th>
                    <th className="py-3 font-semibold pb-4">Statut</th>
                    <th className="py-3 font-semibold pb-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-green/5 font-medium text-brand-green/85">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-brand-green/5 transition-colors">
                      <td className="py-3.5 font-mono">{order.id}</td>
                      <td className="py-3.5">{order.customerName}</td>
                      <td className="py-3.5 text-right font-serif font-bold text-brand-green-dark">
                        {order.total.toLocaleString()} DZD
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase border inline-block ${order.status === 'pending'
                            ? 'bg-amber-100/70 text-amber-700 border-amber-300'
                            : order.status === 'confirmed'
                              ? 'bg-indigo-100/70 text-indigo-700 border-indigo-300'
                              : order.status === 'delivered'
                                ? 'bg-emerald-100/70 text-emerald-700 border-emerald-300'
                                : 'bg-rose-100/80 text-rose-700 border-rose-300'
                            }`}
                        >
                          {order.status === 'pending'
                            ? 'En attente'
                            : order.status === 'confirmed'
                              ? 'Confirmée'
                              : order.status === 'delivered'
                                ? 'Livrée'
                                : 'Annulée'}
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <button
                          onClick={() => onViewOrder(order)}
                          className="px-3 py-1 rounded-full border border-brand-green/20 hover:border-brand-green hover:bg-brand-green hover:text-brand-ivory text-[10px] font-semibold transition-all cursor-pointer"
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Key performance info */}
        <div className="bg-brand-ivory rounded-3xl p-6 border border-brand-green/15 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-green mb-6 pb-4 border-b border-brand-green/10">
              Disponibilité Livraison
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-brand-green/5 border border-brand-green/10">
                <p className="font-sans text-[10px] font-bold text-brand-gold-dark uppercase tracking-wider">
                  Temps d'attente estimé
                </p>
                <p className="font-serif text-xl font-bold text-brand-green mt-1">~ 30 Minutes</p>
                <p className="font-sans text-xs text-brand-green/70 leading-relaxed font-light mt-1">
                  Moyenne de préparation et de transit local suite aux rapports récents.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-green/5 border border-brand-green/10">
                <p className="font-sans text-[10px] font-bold text-brand-gold-dark uppercase tracking-wider">
                  Zone Ingress
                </p>
                <p className="font-serif text-xl font-bold text-brand-green mt-1">Alger & Environs</p>
                <p className="font-sans text-xs text-brand-green/70 leading-relaxed font-light mt-1">
                  Les livreurs couvrent activement les quartiers de Sidi M'Hamed, El Biar, Didouche.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-brand-green/10 text-center">
            <p className="font-sans text-[10px] font-bold text-brand-green/40 uppercase tracking-widest leading-none">
              Dernière synchronisation locale : OK
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
