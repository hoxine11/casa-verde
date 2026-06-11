/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
  cartCount: number;
  restaurantName: string;
}

export default function Header({ activeView, setActiveView, cartCount, restaurantName }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? 'bg-brand-ivory/95 backdrop-blur-md shadow-premium border-b border-brand-green/10 py-4'
          : 'bg-[#F8F5EE]/60 backdrop-blur-xs py-5 border-b border-brand-green/5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo Section */}
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 cursor-pointer group text-left"
          >
            <img
              src="/logo.jpg"
              alt="Casa Verde"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="font-serif text-xl font-bold tracking-[0.05em] leading-none text-brand-green">
                CASA VERDE
              </h1>
              <p className="font-sans text-[9px] uppercase font-bold text-brand-gold tracking-[0.25em] leading-none mt-1">
                CRÊPERIE AS
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-[2.5rem]">
            <button
              onClick={() => setActiveView('home')}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] font-bold transition-all relative py-1 cursor-pointer ${activeView === 'home'
                  ? 'text-brand-green'
                  : 'text-brand-green/60 hover:text-brand-gold'
                }`}
            >
              Accueil
              {activeView === 'home' && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-gold"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveView('menu')}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] font-bold transition-all relative py-1 cursor-pointer ${activeView === 'menu'
                  ? 'text-brand-green'
                  : 'text-brand-green/60 hover:text-brand-gold'
                }`}
            >
              Menu
              {activeView === 'menu' && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-gold"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveView('cart')}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] font-bold transition-all relative py-1 cursor-pointer ${activeView === 'cart'
                  ? 'text-brand-green'
                  : 'text-brand-green/60 hover:text-brand-gold'
                }`}
            >
              Panier
              {activeView === 'cart' && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-gold"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          </nav>

          {/* Icons and Admin Switcher */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Button */}
            <button
              onClick={() => setActiveView('cart')}
              className="relative p-2 text-brand-green hover:text-brand-gold transition-colors duration-300 cursor-pointer"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-5.5 h-5.5 stroke-[1.5]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="absolute -top-1 -right-1 bg-brand-gold text-brand-green-dark text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-brand-ivory shadow-premium"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>


          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Cart Button */}
            <button
              onClick={() => setActiveView('cart')}
              className="relative p-2 text-brand-green hover:text-brand-green-light transition-colors duration-200 cursor-pointer"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-green-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-brand-ivory shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-green hover:text-brand-green-light transition-colors duration-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-brand-ivory border-b border-brand-green/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <button
                onClick={() => {
                  setActiveView('home');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md font-sans text-base font-semibold tracking-wide uppercase ${activeView === 'home' ? 'bg-brand-green/10 text-brand-green' : 'text-brand-green/85'
                  }`}
              >
                Accueil
              </button>
              <button
                onClick={() => {
                  setActiveView('menu');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md font-sans text-base font-semibold tracking-wide uppercase ${activeView === 'menu' ? 'bg-brand-green/10 text-brand-green' : 'text-brand-green/85'
                  }`}
              >
                Menu
              </button>
              <button
                onClick={() => {
                  setActiveView('cart');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md font-sans text-base font-semibold tracking-wide uppercase ${activeView === 'cart' ? 'bg-brand-green/10 text-brand-green' : 'text-brand-green/85'
                  }`}
              >
                Panier ({cartCount})
              </button>

              <div className="pt-4 border-t border-brand-green/15">

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
