/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Eye, Phone, Trash2, SlidersHorizontal, CheckCircle } from 'lucide-react';
import { Order } from '../types';
import { printOrder } from "../utils/printOrder";
interface AdminOrdersProps {
  orders: Order[];
  onUpdateStatus: (
    id: number,
    status: Order['status']
  ) => void;

  onDeleteOrder: (
    id: number
  ) => void;

  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
}

export default function AdminOrders({
  orders,
  onUpdateStatus,
  onDeleteOrder,
  selectedOrder,
  setSelectedOrder
}: AdminOrdersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.id).includes(searchQuery) ||
      (order.customerName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.phone || "").includes(searchQuery);

    const matchesStatus =
      filterStatus === "all" ||
      order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-green">Gestion des commandes</h1>
          <p className="font-sans text-xs font-light text-brand-green/70 mt-1">
            Traitez, suivez, et mettez à jour l'évolution des livraisons en cours.
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="bg-brand-ivory rounded-2xl p-4 border border-brand-green/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Search Input bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-green/40 w-4 h-4" />
          <input
            type="search"
            placeholder="Rechercher (N°, nom, tél)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-brand-green placeholder-brand-green/40 focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all"
          />
        </div>

        {/* Status Pills Selector */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-[10px] uppercase font-bold text-brand-green/50 tracking-wider flex items-center gap-1.5 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filtrer:
          </span>
          {[

            { id: 'all', label: 'Tous' },
            { id: 'pending', label: 'En attente' },
            { id: 'confirmed', label: 'Confirmée' },
            { id: 'delivered', label: 'Livrées' },
            { id: 'cancelled', label: 'Annulées' }

          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer ${filterStatus === item.id
                ? 'bg-brand-green text-brand-ivory shadow-sm'
                : 'bg-brand-green/5 text-brand-green/75 hover:bg-brand-green/10'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Row */}
      <div className="bg-brand-ivory rounded-3xl border border-brand-green/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-brand-green/50 font-sans font-light">
              Aucune commande trouvée pour vos critères de recherche.
            </div>
          ) : (
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-brand-green/5 text-brand-green/60 uppercase tracking-widest font-semibold text-[10px] border-b border-brand-green/10">
                  <th className="px-6 py-4">N° Commande</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Téléphone</th>
                  <th className="px-6 py-4">Adresse / Quartier</th>
                  <th className="px-6 py-4 text-right">Montant</th>
                  <th className="px-6 py-4 text-center">Date</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-green/5 text-brand-green/85 font-medium">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-green/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold">{order.id}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${order.phone}`}
                        className="flex items-center space-x-1.5 text-brand-green hover:text-brand-gold transition-colors font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{order.phone}</span>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs truncate leading-tight">{order.address}</p>
                      <span className="text-[10px] text-brand-gold-dark font-semibold">
                        {order.neighborhood}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-serif font-bold text-brand-green-dark">
                      {order.total.toLocaleString()} DZD
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-brand-green/70 text-[11px] font-light">
                      {order.date}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateStatus(
                            order.id,
                            e.target.value as Order['status']
                          )
                        }
                        className={`...
${order.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'confirmed'
                              ? 'bg-indigo-100 text-indigo-800'
                              : order.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                          }`}
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 border border-brand-green/10 hover:border-brand-green hover:bg-brand-green hover:text-brand-ivory rounded-full text-brand-green transition-all cursor-pointer"
                          title="Voir le bon de commande"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => printOrder(order)}
                          disabled={order.status !== "confirmed"}
                          className={`p-2 rounded-full transition-all
      ${order.status === "confirmed"
                              ? "border border-blue-200 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 cursor-pointer"
                              : "border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            }
    `}
                          title={
                            order.status === "confirmed"
                              ? "Imprimer"
                              : "Confirmez la commande d'abord"
                          }
                        >
                          🖨
                        </button>

                        <button
                          onClick={() => {
                            if (confirm("Voulez-vous vraiment supprimer cette commande ?")) {
                              onDeleteOrder(order.id);
                            }
                          }}
                          className="p-2 border border-rose-100 bg-rose-50/50 hover:bg-rose-500 hover:text-white rounded-full text-rose-600 transition-all cursor-pointer"
                          title="Supprimer définitivement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Selected Order Detailed Bill Modal overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-100 overflow-y-auto">
          {/* Backdrop overlay */}
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-brand-green/30 backdrop-blur-sm"
          />

          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-3xl bg-brand-ivory text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-brand-green/10 p-8">

              {/* Header Title info */}
              <div className="flex justify-between items-start pb-4 border-b border-brand-green/10">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-green">Bon de commande</h3>
                  <p className="font-sans text-[10px] font-mono mt-1 text-brand-green/60">
                    ID COMMANCHE : {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-3 py-1 text-xs border border-brand-green/10 rounded-full hover:bg-brand-green hover:text-brand-ivory cursor-pointer"
                >
                  Fermer
                </button>
              </div>

              {/* Client Information section */}
              <div className="py-4 space-y-2 border-b border-brand-green/10 font-sans text-xs text-brand-green/80">
                <p>
                  <strong className="text-brand-green">Client :</strong> {selectedOrder.customerName}
                </p>
                <p>
                  <strong className="text-brand-green">Téléphone :</strong> {selectedOrder.phone}
                </p>
                <p>
                  <strong className="text-brand-green">Quartier :</strong> {selectedOrder.neighborhood}
                </p>
                <p>
                  <strong className="text-brand-green">Adresse :</strong> {selectedOrder.address}
                </p>
                {selectedOrder.comment && (
                  <p className="italic bg-yellow-50 text-yellow-800 p-2.5 rounded-xl border border-yellow-100 font-light mt-1">
                    <strong className="not-italic text-yellow-905 font-semibold">Commentaire client :</strong> "{selectedOrder.comment}"
                  </p>
                )}
              </div>

              {/* Ordered Products list */}

              <div className="py-4 border-b border-brand-green/10">

                <h4 className="font-serif text-sm font-semibold text-brand-green mb-3">Détail des plats</h4>
                <pre>
                  {JSON.stringify(selectedOrder.items, null, 2)}
                </pre>
                <ul className="space-y-3 font-sans text-xs">
                  {selectedOrder.items.map((item) => (
                    <li
                      key={item.id}
                      className="border-b border-brand-green/5 pb-3"
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {item.quantity}×{" "}
                          <strong className="font-medium text-brand-green-dark">
                            {item.name}
                          </strong>
                        </span>

                        <span className="font-semibold text-brand-green/80">
                          {(item.price * item.quantity).toLocaleString()} DZD
                        </span>
                      </div>

                      {item.variant_name && (
                        <div className="mt-1 text-[11px] text-brand-gold-dark">
                          Taille : {item.variant_name}
                        </div>
                      )}

                      {item.option_name && (
                        <div className="text-[11px] text-brand-gold-dark">
                          Gratiné : {item.option_name}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order total costs sum */}
              <div className="pt-4 font-sans text-xs space-y-2">
                <div className="flex justify-between text-brand-green/70">
                  <span>Sous-total</span>
                  <span>{selectedOrder.subtotal.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-brand-green/70">
                  <span>Lrais de livraison</span>
                  <span>{selectedOrder.deliveryFee.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between font-serif text-lg font-bold text-brand-green-dark pt-2 border-t border-brand-green/5">
                  <span>Montant Total</span>
                  <span className="text-brand-gold-dark">{selectedOrder.total.toLocaleString()} DZD</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
