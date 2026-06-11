/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Phone, Clock, Facebook, Instagram } from 'lucide-react';
import { Settings } from '../types';

interface FooterProps {
  settings: Settings;
  setActiveView: (view: string) => void;
}

export default function Footer({ settings, setActiveView }: FooterProps) {
  return (
    <footer className="bg-brand-green text-brand-ivory pt-16 pb-8 border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo Brand column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-brand-ivory flex items-center justify-center border-2 border-brand-gold shadow-md">
                <span className="text-brand-green font-serif font-bold text-lg">CV</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wider leading-none text-brand-ivory">
                  CASA VERDE
                </h3>
                <p className="font-sans text-[10px] uppercase font-semibold text-brand-gold tracking-[0.2em] leading-none mt-1">
                  Crêperie AS
                </p>
              </div>
            </div>
            <p className="font-sans text-sm text-brand-ivory/70 leading-relaxed font-light">
              La saveur authentique livrée chez vous. Burgers, tacos, poutines et crêpes premium préparés avec passion.
            </p>
          </div>

          {/* Navigation links column */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wide text-brand-gold mb-6 relative pb-1">
              Navigation
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-brand-gold"></span>
            </h4>
            <ul className="space-y-3 font-sans text-sm font-medium text-brand-ivory/80">
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-brand-gold transition-colors duration-200 cursor-pointer"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-brand-gold transition-colors duration-200 cursor-pointer"
                >
                  Menu de Crêpes & Plats
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('cart');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-brand-gold transition-colors duration-200 cursor-pointer"
                >
                  Votre Panier
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details column */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wide text-brand-gold mb-6 relative pb-1">
              Contact
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-brand-gold"></span>
            </h4>
            <ul className="space-y-4 font-sans text-sm font-light text-brand-ivory/85">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <span>{settings.address || 'Rue Didouche Mourad, Alger Centre'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                <span>{settings.phone || '+213 5 55 12 34 56'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-brand-gold shrink-0" />
                <span>Tous les jours • 11h00 – 23h30</span>
              </li>
            </ul>
          </div>

          {/* Social Links and Promo column */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wide text-brand-gold mb-6 relative pb-1">
              Suivez-nous
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-brand-gold"></span>
            </h4>
            <p className="font-sans text-sm text-brand-ivory/70 mb-4 font-light">
              Restez connecté pour être informé de nos offres exclusives et nouveautés.
            </p>
            <div className="flex space-x-4">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-brand-ivory/10 hover:bg-brand-gold/20 hover:text-brand-gold flex items-center justify-center border border-brand-ivory/20 transition-all duration-300"
                  aria-label="Notre Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-brand-ivory/10 hover:bg-brand-gold/20 hover:text-brand-gold flex items-center justify-center border border-brand-ivory/20 transition-all duration-300"
                  aria-label="Notre Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Brand Copyright Divider */}
        <div className="pt-8 border-t border-brand-ivory/10 text-center flex flex-col sm:flex-row justify-between items-center text-xs font-sans font-light text-brand-ivory/50">
          <p>© {new Date().getFullYear()} Crêperie AS — Casa Verde. Tous droits réservés.</p>
          <p className="mt-2 sm:mt-0">Gastronomie Algérienne & Crêperie Fine</p>
        </div>
      </div>
    </footer>
  );
}
