/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useState } from 'react';
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  key?: number;
}

export default function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );
  console.log(product);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-none overflow-hidden shadow-premium border border-brand-green/10 hover:border-brand-gold/40 transition-all duration-500 flex flex-col h-full"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-brand-ivory select-none border-b border-brand-green/5">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Dark subtle overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-brand-ivory/95 backdrop-blur-xs text-brand-green text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 border border-brand-green/10">
          {product.category}
        </div>

        {/* Quick View Interactive Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">

        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="font-serif text-lg font-bold text-brand-green group-hover:text-brand-gold-dark transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        <p className="font-sans text-xs text-brand-green/70 mb-6 line-clamp-3 leading-relaxed font-light flex-grow">
          {product.description || 'Une délicieuse création artisanale préparée à la commande avec des ingrédients frais.'}
        </p>
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2">
              Choisir la taille
            </p>

            <div className="flex gap-2 flex-wrap">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-3 py-1 border rounded text-xs ${selectedVariant?.id === variant.id
                    ? "bg-brand-green text-white"
                    : "bg-white"
                    }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-4 border-t border-brand-green/10 mt-auto">
          <div>
            <span className="font-serif text-lg font-bold text-brand-green">
              {(
                selectedVariant?.price ||
                product.price
              ).toLocaleString()} DZD
            </span>
            <span className="font-sans text-[10px] font-bold text-brand-gold ml-1 tracking-wider">DZD</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              onAddToCart({
                ...product,
                selectedVariant
              })
            } className="px-5 py-2 bg-brand-green hover:bg-brand-gold text-brand-ivory hover:text-brand-green text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 border border-brand-green/20 hover:border-brand-gold/30 cursor-pointer"
          >
            Ajouter
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
