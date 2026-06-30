/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, Eye } from 'lucide-react';
import { CrepeFormula, CrepeStepItem, ProductOption } from '../types';
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
  const [selectedOption, setSelectedOption] =
    useState<ProductOption | null>(null);
  const [selectedCrepeSteps, setSelectedCrepeSteps] =
    useState<CrepeStepItem[]>([]);
  const [crepeMode, setCrepeMode] = useState<
    "none" | "steps" | "formula"
  >("none");
  const [selectedFormula, setSelectedFormula] =
    useState<CrepeFormula | null>(null);
  const [selectedStep, setSelectedStep] =
    useState<number | null>(null);
  const finalPrice =
    Number(selectedVariant?.price || product.price) +
    Number(selectedOption?.price || 0) +
    selectedCrepeSteps.reduce(
      (sum, step) => sum + Number(step.price),
      0
    ) +
    Number(selectedFormula?.price || 0);
  const stepNumbers = [
    ...new Set(
      (product.crepeSteps || []).map(
        step => step.step_number
      )
    )
  ];
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

        {/* <p className="font-sans text-xs text-brand-green/70 mb-6 line-clamp-3 leading-relaxed font-light flex-grow">
          {product.description || 'Une délicieuse création artisanale préparée à la commande avec des ingrédients frais.'}
        </p> */}
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
        {product.options && product.options.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2">
              Choisir une option
            </p>

            <div className="flex gap-2 flex-wrap">

              <button
                type="button"
                onClick={() => setSelectedOption(null)}
                className={`px-3 py-1 border rounded text-xs ${selectedOption === null
                  ? "bg-brand-green text-white"
                  : "bg-white"
                  }`}
              >
                Aucune
              </button>

              {product.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option)}
                  className={`px-3 py-1 border rounded text-xs ${selectedOption?.id === option.id
                    ? "bg-brand-green text-white"
                    : "bg-white"
                    }`}
                >
                  {option.name}
                  <span className="ml-1 text-[10px]">
                    +{option.price}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        {product.category?.toLowerCase() === "crepe" && (
          <div className="mb-4">

            <p className="text-xs font-semibold mb-2">
              Personnalisation
            </p>

            <div className="flex gap-2 flex-wrap mb-3">

              <button
                type="button"
                onClick={() => {
                  setCrepeMode("none");
                  setSelectedCrepeSteps([]);
                  setSelectedFormula(null);
                }}
                className={`px-3 py-1 border rounded text-xs ${crepeMode === "none"
                  ? "bg-brand-green text-white"
                  : "bg-white"
                  }`}
              >
                Aucune
              </button>

              <button
                type="button"
                onClick={() => {
                  setCrepeMode("steps");
                  setSelectedFormula(null);
                }}
                className={`px-3 py-1 border rounded text-xs ${crepeMode === "steps"
                  ? "bg-brand-green text-white"
                  : "bg-white"
                  }`}
              >
                Étapes
              </button>

              <button
                type="button"
                onClick={() => {
                  setCrepeMode("formula");
                  setSelectedCrepeSteps([]);
                }}
                className={`px-3 py-1 border rounded text-xs ${crepeMode === "formula"
                  ? "bg-brand-green text-white"
                  : "bg-white"
                  }`}
              >
                Formule
              </button>

            </div>
            {crepeMode === "steps" && (
              <div className="space-y-3">

                {stepNumbers.map(stepNumber => (

                  <div key={stepNumber}>

                    <p className="text-xs font-semibold mb-2">
                      Étape {stepNumber}
                    </p>

                    <div className="flex gap-2 flex-wrap">

                      {product.crepeSteps
                        ?.filter(
                          step =>
                            step.step_number === stepNumber
                        )
                        .map(step => {

                          const isSelected =
                            selectedCrepeSteps.some(
                              s => s.id === step.id
                            );

                          return (
                            <button
                              key={step.id}
                              type="button"
                              onClick={() => {

                                if (isSelected) {
                                  setSelectedCrepeSteps(prev =>
                                    prev.filter(
                                      s => s.id !== step.id
                                    )
                                  );
                                } else {
                                  setSelectedCrepeSteps(prev => [
                                    ...prev,
                                    step
                                  ]);
                                }
                              }}
                              className={`px-3 py-1 border rounded text-xs ${isSelected
                                ? "bg-brand-green text-white"
                                : "bg-white"
                                }`}
                            >
                              {step.name}
                              {" "}
                              +{step.price}
                            </button>
                          );
                        })}

                    </div>

                  </div>

                ))}

              </div>
            )}
            {crepeMode === "formula" && (
              <div className="flex gap-2 flex-wrap">

                {product.crepeFormulas?.map(
                  formula => (
                    <button
                      key={formula.id}
                      type="button"
                      onClick={() =>
                        setSelectedFormula(formula)
                      }
                      className={`px-3 py-1 border rounded text-xs ${selectedFormula?.id === formula.id
                          ? "bg-brand-green text-white"
                          : "bg-white"
                        }`}
                    >
                      {formula.name}
                      {" "}
                      +{formula.price}
                    </button>
                  )
                )}

              </div>
            )}

          </div>
        )}
        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-4 border-t border-brand-green/10 mt-auto">
          <div>
            <span className="font-serif text-lg font-bold text-brand-green">
              {finalPrice.toLocaleString()} DZD
            </span>
            <span className="font-sans text-[10px] font-bold text-brand-gold ml-1 tracking-wider">DZD</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              onAddToCart({
                ...product,
                selectedVariant,
                selectedOption,
                selectedCrepeSteps,
                selectedFormula,
                price: finalPrice
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
