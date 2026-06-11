/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Phone, MapPin, Landmark, Facebook, Instagram } from 'lucide-react';
import { Settings as SettingsType } from '../types';

interface AdminSettingsProps {
  settings: SettingsType;
  onUpdateSettings: (settings: SettingsType) => void;
}

export default function AdminSettings({ settings, onUpdateSettings }: AdminSettingsProps) {
  const [restaurantName, setRestaurantName] = useState(settings.restaurantName);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [deliveryFee, setDeliveryFee] = useState(settings.deliveryFee);
  const [facebook, setFacebook] = useState(settings.facebook);
  const [instagram, setInstagram] = useState(settings.instagram);
  
  const [statusMessage, setStatusMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      restaurantName,
      phone,
      address,
      deliveryFee: Number(deliveryFee),
      facebook,
      instagram
    });

    setStatusMessage('Paramètres enregistrés avec succès !');
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Title info */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-green">Paramètres généraux</h1>
        <p className="font-sans text-xs font-light text-brand-green/70 mt-1">
          Configurez l'identité visuelle et les coordonnées officielles de votre crêperie.
        </p>
      </div>

      <div className="bg-brand-ivory rounded-3xl p-8 border border-brand-green/15 shadow-sm max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6 font-sans text-xs font-medium">
          
          {/* Restaurant identity details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            <div className="space-y-2">
              <label className="text-brand-green block">Nom de l'établissement</label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Crêperie AS — Casa Verde"
                className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 px-4 text-brand-green outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-brand-green block">Téléphone officiel de contact</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-green/40 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+213 5 55 12 34 56"
                  className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 pl-10 pr-4 text-brand-green outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
                />
              </div>
            </div>

          </div>

          {/* Location and delivery settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            <div className="sm:col-span-2 space-y-2">
              <label className="text-brand-green block">Adresse postale de la boutique</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-green/40 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rue Didouche Mourad, Alger Centre"
                  className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 pl-10 pr-4 text-brand-green outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-brand-green block">Frais de livraison standard (DZD)</label>
              <input
                type="number"
                required
                min="0"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                placeholder="200"
                className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 px-4 text-brand-green outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
              />
            </div>

          </div>

          <div className="border-t border-brand-green/10 pt-6">
            <h3 className="font-serif text-sm font-semibold text-brand-green mb-4">Réseaux sociaux</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="space-y-2">
                <label className="text-brand-green block flex items-center">
                  <Facebook className="w-3.5 h-3.5 mr-1 text-[#1877F2]" /> Facebook
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/casaverde"
                  className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 px-4 text-brand-green outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-brand-green block flex items-center">
                  <Instagram className="w-3.5 h-3.5 mr-1 text-[#E1306C]" /> Instagram
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/casaverde"
                  className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 px-4 text-brand-green outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
                />
              </div>

            </div>
          </div>

          {/* Action and feedback row */}
          <div className="pt-6 border-t border-brand-green/10 flex items-center justify-between">
            <div>
              {statusMessage && (
                <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-brand-green hover:bg-brand-gold text-brand-ivory hover:text-brand-green font-semibold uppercase tracking-wider shadow-md hover:shadow-xl transition-all duration-300 flex items-center space-x-2 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 shrink-0" />
              <span>Enregistrer les paramètres</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
