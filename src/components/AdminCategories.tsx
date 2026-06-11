/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Tag, UtensilsCrossed } from 'lucide-react';
import { Category, Product } from '../types';

interface AdminCategoriesProps {
  categories: Category[];
  products: Product[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: number) => void;
}

export default function AdminCategories({
  categories,
  products,
  onAddCategory,
  onDeleteCategory
}: AdminCategoriesProps) {
  const [newCatName, setNewCatName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setNewCatName('');
  };

  // Helper to compute products per category
  const getProductCountForCategory = (catName: string): number => {
    return products.filter((p) => p.category.toLowerCase() === catName.toLowerCase()).length;
  };

  return (
    <div className="space-y-8">
      {/* Title Block */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-green">Gestion des catégories</h1>
        <p className="font-sans text-xs font-light text-brand-green/70 mt-1">
          Regroupez vos créations culinaires sous des thèmes élégants.
        </p>
      </div>

      {/* Add New Category Form Input */}
      <div className="bg-brand-ivory rounded-2xl p-6 border border-brand-green/10 shadow-sm max-w-xl">
        <h3 className="font-serif text-sm font-bold text-brand-green mb-4">Nouvelle catégorie</h3>
        <form onSubmit={handleSubmit} className="flex gap-3 font-sans text-xs">
          <input
            type="text"
            required
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="ex: Crêpes Salées, Boissons..."
            className="flex-grow bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 px-4 text-brand-green placeholder-brand-green/30 outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brand-green hover:bg-brand-gold text-brand-ivory hover:text-brand-green font-semibold uppercase tracking-wider shadow-sm transition-all duration-300 flex items-center space-x-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </form>
      </div>

      {/* Categories Cards list representation */}
      <div>
        {categories.length === 0 ? (
          <div className="bg-brand-ivory rounded-3xl p-12 border border-brand-green/15 text-center shadow-sm max-w-xl">
            <Tag className="w-10 h-10 text-brand-gold mx-auto stroke-[1.2] mb-3" />
            <h3 className="font-serif text-base font-bold text-brand-green">Aucune catégorie</h3>
            <p className="font-sans text-xs text-brand-green/60 leading-normal font-light max-w-xs mx-auto mt-2">
              Ajoutez une catégorie ci-dessus pour trier votre carte.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
            {categories.map((category) => {
              const count = getProductCountForCategory(category.name);
              return (
                <div
                  key={category.id}
                  className="bg-brand-ivory rounded-2xl p-5 border border-brand-green/10 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/5 border border-brand-green/10 flex items-center justify-center text-brand-green">
                      <UtensilsCrossed className="w-4 h-4 shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-brand-green">
                        {category.name}
                      </h4>
                      <p className="font-sans text-[11px] text-brand-green/60 font-light mt-0.5">
                        {count} {count > 1 ? 'produits' : 'produit'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (count > 0) {
                        alert(
                          `Attention: Cette catégorie contient ${count} produits. Déplacez-les ou supprimez-les avant de supprimer la catégorie.`
                        );
                        return;
                      }
                      if (confirm(`Supprimer la catégorie "${category.name}" ?`)) {
                        onDeleteCategory(category.id);
                      }
                    }}
                    className="p-2 border border-rose-100 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-brand-ivory rounded-full transition-colors cursor-pointer"
                    title="Supprimer la catégorie"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
