/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Users, Phone, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Order } from '../types';

interface AdminClientsProps {
  orders: Order[];
}

interface CustomerCard {
  name: string;
  phone: string;
  address: string;
  neighborhood: string;
  ordersCount: number;
  totalSpent: number;
}

export default function AdminClients({ orders }: AdminClientsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Compound all customers based on orders
  const customerMap: Record<string, CustomerCard> = {};

  orders.forEach((order) => {
    // Standardize client names based on telephone index or clean uppercase names
    const key = order.phone.trim();
    if (!customerMap[key]) {
      customerMap[key] = {
        name: order.customerName,
        phone: order.phone,
        address: order.address,
        neighborhood: order.neighborhood,
        ordersCount: 0,
        totalSpent: 0
      };
    }
    
    customerMap[key].ordersCount += 1;
    if (order.status !== 'cancelled') {
      customerMap[key].totalSpent += order.total;
    }
  });

  const customers = Object.values(customerMap);

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Title info */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-green">Fiche Clients</h1>
        <p className="font-sans text-xs font-light text-brand-green/70 mt-1">
          Suivi relationnel et chiffre d'affaires cumulé par client.
        </p>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-brand-ivory rounded-2xl p-5 border border-brand-green/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-brand-green/55">
              Total Clients Enregistrés
            </span>
            <p className="font-serif text-2xl font-bold text-brand-green mt-2">{customers.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center border border-teal-200">
            <Users className="w-4 h-4 shrink-0" />
          </div>
        </div>

        <div className="bg-brand-ivory rounded-2xl p-5 border border-brand-green/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-brand-green/55">
              Client le plus fidèle
            </span>
            <p className="font-serif text-lg font-bold text-brand-green mt-2 truncate max-w-xs">
              {customers.reduce((max, c) => (c.ordersCount > max.ordersCount ? c : max), { name: 'Aucun', phone: '', address: '', neighborhood: '', ordersCount: 0, totalSpent: 0 }).name}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
            <TrendingUp className="w-4 h-4 shrink-0" />
          </div>
        </div>
      </div>

      {/* CRM search bar filter */}
      <div className="bg-brand-ivory rounded-2xl p-4 border border-brand-green/10 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-green/40 w-4 h-4" />
          <input
            type="search"
            placeholder="Rechercher un client ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-brand-green placeholder-brand-green/40 outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
          />
        </div>
      </div>

      {/* CRM Clients Table List Representation */}
      <div className="bg-brand-ivory rounded-3xl border border-brand-green/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredCustomers.length === 0 ? (
            <div className="py-16 text-center text-brand-green/55 font-sans font-light">
              Aucun client enregistré pour le moment.
            </div>
          ) : (
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-brand-green/5 text-brand-green/60 uppercase tracking-widest font-bold text-[10px] border-b border-brand-green/10">
                  <th className="px-6 py-4">Nom Complet</th>
                  <th className="px-6 py-4">Téléphone</th>
                  <th className="px-6 py-4">Secteur / Quartier</th>
                  <th className="px-6 py-4">Dernière Adresse</th>
                  <th className="px-6 py-4 text-center">Volume Commandes</th>
                  <th className="px-6 py-4 text-right">CA Total Généré</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-green/5 text-brand-green/85 font-semibold">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.phone} className="hover:bg-brand-green/5 transition-colors">
                    <td className="px-6 py-4 text-brand-green-dark">{customer.name}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${customer.phone}`}
                        className="flex items-center space-x-1.5 hover:text-brand-gold transition-colors font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5 text-brand-green/60" />
                        <span>{customer.phone}</span>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-brand-green/5 text-brand-green border border-brand-green/10 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                        {customer.neighborhood}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate font-light text-brand-green/80">
                      {customer.address}
                    </td>
                    <td className="px-6 py-4 text-center font-mono">
                      {customer.ordersCount} {customer.ordersCount > 1 ? 'commandes' : 'commande'}
                    </td>
                    <td className="px-6 py-4 text-right font-serif font-bold text-brand-green-dark text-sm">
                      {customer.totalSpent.toLocaleString()} DZD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
