/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Plus, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-green/40 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', duration: 0.45 }}
          className="relative transform overflow-hidden rounded-none bg-white text-left shadow-premium transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-brand-green/15"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-none bg-white/90 text-brand-green hover:bg-brand-gold hover:text-brand-green shadow-premium transition-all cursor-pointer border border-brand-green/10"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Two-Column Responsive Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Product Image */}
            <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px] bg-brand-ivory select-none border-r border-brand-green/5">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop'}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-brand-ivory/95 backdrop-blur-xs text-brand-green text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 border border-brand-green/10">
                {product.category}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="p-8 flex flex-col justify-between bg-white">
              <div>
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] font-bold text-brand-gold-dark mb-2 block">
                  Création Spéciale Casa Verde
                </span>
                
                <h3 className="font-serif text-2xl font-bold text-brand-green mb-4">
                  {product.name}
                </h3>
                
                <p className="font-sans text-xs text-brand-green/80 leading-relaxed font-light mb-6">
                  {product.description || 'Une délicieuse création artisanale préparée à la commande avec des ingrédients frais.'}
                </p>

                {/* Additional metadata features for a authentic premium feel */}
               
              </div>

              {/* Price and Cart Action */}
              <div className="flex items-center justify-between pt-4 border-t border-brand-green/10">
                <div>
                  <span className="font-serif text-2xl font-bold text-brand-green">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="font-sans text-[10px] font-bold text-brand-gold ml-1 tracking-wider">DZD</span>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="px-6 py-3 bg-brand-green hover:bg-brand-gold text-brand-ivory hover:text-brand-green text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 border border-brand-green/20 hover:border-brand-gold/30 cursor-pointer"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
