/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LayoutDashboard,
  ShoppingBag,
  Grid,
  Settings,
  Users,
  BarChart3,
  Flame,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExit: () => void;
  onLogout?: () => void;
  orderCountWithStatus: {
    pending: number;
    confirmed: number;
    delivered: number;
  };
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onExit,
  onLogout,
  orderCountWithStatus
}: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'orders',
      label: 'Commandes',
      icon: ShoppingBag,
      badge: orderCountWithStatus.pending > 0 ? orderCountWithStatus.pending : null
    },
    {
      id: 'products',
      label: 'Produits',
      icon: Flame,
      badge: null
    },
    {
      id: 'categories',
      label: 'Catégories',
      icon: Grid,
      badge: null
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      badge: null
    },
    {
      id: 'analytics',
      label: 'Analytique',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-brand-green text-brand-ivory flex flex-col h-full shrink-0 border-r border-brand-gold/10 pt-4 pb-8 shadow-xl">
      {/* Brand logo at top of admin sidebar */}
      <div className="px-6 py-4 flex items-center mb-8 justify-between border-b border-brand-ivory/10 pb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-none bg-brand-ivory flex items-center justify-center border border-brand-gold shadow-premium">
            <span className="text-brand-green font-serif font-bold text-sm">Ad</span>
          </div>
          <div>
            <h2 className="font-serif text-sm font-bold tracking-wider leading-none text-brand-ivory">
              ADMINISTRATEUR
            </h2>
            <p className="font-sans text-[9px] uppercase font-semibold text-brand-gold tracking-[0.2em] leading-none mt-1">
              Casa Verde
            </p>
          </div>
        </div>
      </div>

      {/* Main navigation list */}
      <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-none font-sans text-[10px] font-bold tracking-wider uppercase transition-all duration-300 group cursor-pointer border-b border-brand-ivory/5 last:border-0 ${
                isActive
                  ? 'bg-brand-gold text-brand-green-dark shadow-sm'
                  : 'text-brand-ivory/70 hover:text-brand-ivory hover:bg-brand-ivory/5'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <IconComponent
                  className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                    isActive ? 'text-brand-green-dark' : 'text-brand-ivory/50 group-hover:text-brand-ivory'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              
              {/* Optional pending order bubble counter badge */}
              {item.badge !== null && (
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-none border shrink-0 ${
                    isActive
                      ? 'bg-brand-green text-brand-ivory border-brand-green'
                      : 'bg-brand-gold text-brand-green-dark border-brand-gold'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom exit option & Log Out */}
      <div className="px-4 mt-auto pt-6 border-t border-brand-ivory/10 space-y-2">
        <button
          onClick={onExit}
          className="flex items-center space-x-3.5 w-full px-4 py-2.5 text-brand-ivory/65 hover:text-brand-ivory hover:bg-white/5 rounded-none font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 transition-transform lg:group-hover:-translate-x-1" />
          <span>Retour au Site</span>
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center space-x-3.5 w-full px-4 py-2.5 text-rose-300 hover:text-rose-200 hover:bg-rose-950/20 rounded-none font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Déconnexion</span>
          </button>
        )}
      </div>
    </aside>
  );
}
