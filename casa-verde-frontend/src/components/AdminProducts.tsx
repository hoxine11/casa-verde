/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, ShieldCheck, Flame, Sliders, ToggleLeft, ToggleRight, Camera, Upload } from 'lucide-react';
import { Product, Category } from '../types';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  refreshProducts: () => Promise<void>;
}

export default function AdminProducts({
  products,
  categories,
  refreshProducts
}: AdminProductsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [variants, setVariants] = useState<
    { name: string; price: number }[]
  >([
    {
      name: "",
      price: 0
    }
  ]);

  const [options, setOptions] = useState<
    { name: string; price: number }[]
  >([
    {
      name: "",
      price: 0
    }
  ]);
  // Photo taking & uploading state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [uploadSource, setUploadSource] = useState<'upload' | 'camera' | 'url'>('upload');

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error(err);
      alert("Impossible d'accéder à la caméra. Veuillez autoriser l'accès.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const snapPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImage(dataUrl);
      }
      stopCamera();
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
  };

  // Clean stream on changes or close
  React.useEffect(() => {
    if (!isEditing || uploadSource !== 'camera') {
      stopCamera();
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isEditing, uploadSource]);

  // Trigger add/edit form open
  const startAddNew = () => {
    setEditProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory(categories[0]?.name || '');
    setImage('');
    setIsActive(true);
    setIsEditing(true);
    setUploadSource('upload');
  };

  const startEdit = (product: Product) => {
    setEditProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setImage(product.image_url);
    setIsActive(product.is_active);
    setVariants(product.variants || []);
    setOptions(product.options || []);
    setIsEditing(true);
    if (product.image_url && (product.image_url.startsWith('http') || product.image_url.startsWith('/'))) {
      setUploadSource('url');
    } else {
      setUploadSource('upload');
    }
  };
  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const selectedCategory = categories.find(
        (c) => c.name === category
      );

      if (!selectedCategory) {
        alert("Veuillez choisir une catégorie");
        return;
      }

      if (!editProduct && !selectedFile) {
        alert("Veuillez choisir une image");
        return;
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append(
        "price",
        category.toLowerCase() === "tacos"
          ? "0"
          : String(price)
      );
      console.log("CATEGORY =", selectedCategory);
      console.log("CATEGORY ID =", selectedCategory?.id);
      formData.append(
        "category_id",
        String(selectedCategory.id)
      );
      formData.append(
        "is_active",
        String(isActive)
      );
      formData.append(
        "variants",
        JSON.stringify(variants)
      );

      formData.append(
        "options",
        JSON.stringify(options)
      );

      if (selectedFile) {
        formData.append(
          "image",
          selectedFile
        );
      }

      if (editProduct) {

        const res = await fetch(
          `https://casa-verde-production-1d5f.up.railway.app/api/products/${editProduct.id}`,
          {
            method: "PUT",
            body: formData
          }
        );

        const data = await res.json();

        console.log("PUT STATUS =", res.status);
        console.log("PUT RESPONSE =", data);

      } else {
        await fetch(
          "https://casa-verde-production-1d5f.up.railway.app/api/products",
          {
            method: "POST",
            body: formData
          }
        );
      }

      await refreshProducts();

      setIsEditing(false);

      setSelectedFile(null);

    } catch (error) {
      console.error(error);

      alert(
        "Erreur lors de l'enregistrement"
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Title Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-green">Gestion des produits</h1>
          <p className="font-sans text-xs font-light text-brand-green/70 mt-1">
            Configurez et enrichissez la carte de votre restaurant Casa Verde.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">

          <button
            onClick={startAddNew}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-brand-green hover:bg-brand-gold text-brand-ivory hover:text-brand-green text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau produit</span>
          </button>
        </div>
      </div>

      {/* Main product listings layout */}
      {isEditing ? (
        /* Form panel */
        <div className="bg-brand-ivory rounded-3xl p-8 border border-brand-green/15 shadow-sm max-w-2xl">
          <h3 className="font-serif text-xl font-bold text-brand-green mb-6 pb-2 border-b border-brand-green/10">
            {editProduct ? 'Modifier le produit' : 'Créer un nouveau plat'}
          </h3>

          <form onSubmit={handleSave} className="space-y-5 font-sans text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Name field */}
              <div className="space-y-2">
                <label className="text-brand-green block">Nom de la création *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Crêpe Bueno Deluxe"
                  className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 px-4 text-brand-green placeholder-brand-green/30 outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
                />
              </div>

              {/* Price field */}

              {category.toLowerCase() !== "tacos" && (
                <div className="space-y-2">
                  <label className="text-brand-green block">
                    Prix (DZD)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value === ""
                          ? ""
                          : Number(e.target.value)
                      )
                    }
                    className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 px-4"
                  />
                </div>
              )}

            </div>

            {/* Category dropdown selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-brand-green block">Catégorie associée</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 px-4 text-brand-green outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all cursor-pointer"
                >
                  {categories.length === 0 ? (
                    <>
                      <option value="Tacos">Tacos</option>
                      <option value="Sandwiches">Sandwiches</option>
                      <option value="Poutine">Poutine</option>
                      <option value="Crêpes Salées">Crêpes Salées</option>
                      <option value="Crêpes Sucrées">Crêpes Sucrées</option>
                      <option value="Boissons">Boissons</option>
                    </>
                  ) : (
                    categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-brand-green block">Statut initial</label>
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="flex items-center text-brand-green select-none cursor-pointer"
                  >
                    {isActive ? (
                      <ToggleRight className="w-10 h-6 text-brand-green stroke-[1.5]" />
                    ) : (
                      <ToggleLeft className="w-10 h-6 text-brand-green/40 stroke-[1.5]" />
                    )}
                    <span className="ml-2 font-semibold">
                      {isActive ? 'Plat actif (visible au menu)' : 'Plat masqué'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description field */}
            <div className="space-y-2">
              <label className="text-brand-green block">Description gourmande</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Une description irrésistible de la garniture et des sauces..."
                rows={3}
                className="w-full bg-brand-green/5 border border-brand-green/10 rounded-xl py-3 px-4 text-brand-green placeholder-brand-green/30 outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
              />
            </div>
            {category === "Tacos" && (
              <div className="space-y-3 border-t border-brand-green/10 pt-4">
                <label className="font-bold text-brand-green">
                  Tailles
                </label>

                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      placeholder="M"
                      value={variant.name}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[index].name = e.target.value;
                        setVariants(copy);
                      }}
                      className="border rounded p-2 flex-1"
                    />

                    <input
                      type="number"
                      placeholder="500"
                      value={variant.price}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[index].price = Number(e.target.value);
                        setVariants(copy);
                      }}
                      className="border rounded p-2 flex-1"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setVariants([
                      ...variants,
                      { name: "", price: 0 }
                    ])
                  }
                  className="text-sm text-blue-600"
                >
                  + Ajouter Taille
                </button>
              </div>
            )}
            {category.toLowerCase() !== "tacos" && (
              <div className="space-y-3">
                <label className="font-bold text-brand-green">
                  Options
                </label>

                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      placeholder="Camembert"
                      value={option.name}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[index].name = e.target.value;
                        setOptions(copy);
                      }}
                      className="border rounded p-2 flex-1"
                    />

                    <input
                      type="number"
                      placeholder="100"
                      value={option.price}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[index].price = Number(e.target.value);
                        setOptions(copy);
                      }}
                      className="border rounded p-2 flex-1"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setOptions([
                      ...options,
                      { name: "", price: 0 }
                    ])
                  }
                  className="text-sm text-blue-600"
                >
                  + Ajouter Option
                </button>
              </div>
            )}
            {/* Image Upload/Capture Panel */}
            <div className="space-y-3 pt-3 border-t border-brand-green/10">
              <label className="text-brand-green font-bold block text-xs">Visuel du produit (Photo ou Image)</label>

              {/* Tab Selector */}
              <div className="flex border border-brand-green/10 p-1 bg-brand-green/[0.02]">
                <button
                  type="button"
                  onClick={() => setUploadSource('upload')}
                  className={`flex-1 py-1.5 text-center text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${uploadSource === 'upload'
                    ? 'bg-brand-green text-brand-ivory'
                    : 'text-brand-green/60 hover:text-brand-green hover:bg-brand-green/[0.04]'
                    }`}
                >
                  <Upload className="w-3.5 h-3.5 inline mr-1" />
                  Télécharger
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadSource('camera');
                    startCamera();
                  }}
                  className={`flex-1 py-1.5 text-center text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${uploadSource === 'camera'
                    ? 'bg-brand-green text-brand-ivory'
                    : 'text-brand-green/60 hover:text-brand-green hover:bg-brand-green/[0.04]'
                    }`}
                >
                  <Camera className="w-3.5 h-3.5 inline mr-1" />
                  Prendre une photo
                </button>
                <button
                  type="button"
                  onClick={() => setUploadSource('url')}
                  className={`flex-1 py-1.5 text-center text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${uploadSource === 'url'
                    ? 'bg-brand-green text-brand-ivory'
                    : 'text-brand-green/60 hover:text-brand-green hover:bg-brand-green/[0.04]'
                    }`}
                >
                  Adresse URL
                </button>
              </div>

              {/* Source panels */}
              {uploadSource === 'upload' && (
                <div className="border border-dashed border-brand-green/30 p-6 text-center bg-white">
                  <Upload className="w-8 h-8 text-brand-gold mx-auto mb-3 stroke-[1.2]" />
                  <p className="text-brand-green text-xs font-semibold">Glissez une image ou cliquez pour ajouter</p>
                  <p className="text-[10px] text-brand-green/50 mt-1">Formats acceptés : PNG, JPG, GIF</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="product-file-upload"
                  />
                  <label
                    htmlFor="product-file-upload"
                    className="mt-3 inline-block px-4 py-2 bg-brand-green/5 border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Choisir un fichier
                  </label>
                </div>
              )}

              {uploadSource === 'camera' && (
                <div className="border border-brand-green/10 p-4 bg-white space-y-4">
                  {isCameraActive ? (
                    <div className="space-y-3">
                      <div className="relative aspect-video max-w-md mx-auto overflow-hidden bg-black border border-brand-green/20">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-center space-x-3">
                        <button
                          type="button"
                          onClick={snapPhoto}
                          className="px-4 py-2 bg-brand-gold hover:bg-brand-gold-dark text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Prendre la photo
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="px-4 py-2 bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-brand-green/[0.02]">
                      <Camera className="w-8 h-8 text-brand-gold mx-auto mb-3 stroke-[1.2]" />
                      <p className="text-brand-green text-xs font-semibold mb-3 font-medium">L'appareil photo n'est pas activé</p>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-4 py-2 bg-brand-green text-white hover:bg-brand-gold hover:text-brand-green transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Allumer la caméra
                      </button>
                    </div>
                  )}
                </div>
              )}

              {uploadSource === 'url' && (
                <div className="space-y-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... ou lien de l'image"
                    className="w-full bg-brand-green/5 border border-brand-green/10 py-3 px-4 text-brand-green placeholder-brand-green/30 outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all text-xs"
                  />
                  <p className="text-[10px] text-brand-green/50 italic leading-snug">
                    Fournissez l'adresse internet de votre image de présentation si vous ne souhaitez pas la téléverser.
                  </p>
                </div>
              )}

              {/* Shared preview of active image */}
              {image && (
                <div className="flex items-center space-x-4 p-3 bg-brand-green/5 border border-brand-green/10 mt-2">
                  <div className="w-14 h-14 bg-white border border-brand-green/10 overflow-hidden shrink-0 flex items-center justify-center">
                    <img src={image} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-brand-green/75">Image sélectionnée</p>
                    <p className="text-[9px] text-brand-green/50 truncate font-mono max-w-[150px] sm:max-w-xs">{image.startsWith('data:') ? 'Photo/Fichier de démo' : image}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="text-[10px] uppercase font-bold text-rose-600 hover:text-rose-800 tracking-wider cursor-pointer border-b border-rose-200 hover:border-transparent transition-colors duration-300"
                  >
                    Supprimer l'image
                  </button>
                </div>
              )}
            </div>

            {/* Form actions flow */}
            <div className="pt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-full border border-brand-green/20 text-brand-green hover:bg-brand-green/5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-brand-green hover:bg-brand-gold text-brand-ivory hover:text-brand-green text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-300 cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Products list grid representation */
        <div>
          {products.length === 0 ? (
            <div className="bg-brand-ivory rounded-3xl p-16 border border-brand-green/15 text-center shadow-sm">
              <Flame className="w-12 h-12 text-brand-gold mx-auto stroke-[1.2] mb-4" />
              <h3 className="font-serif text-lg font-bold text-brand-green">Aucun produit configuré</h3>
              <p className="font-sans text-xs text-brand-green/70 leading-relaxed font-light max-w-sm mx-auto mt-2">
                Le menu est vide pour le moment comme demandé. Cliquez ci-dessous pour ajouter immédiatement des produits de démonstration, ou servez-vous du bouton en haut à droite !
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const minPrice =
                  product.variants && product.variants.length > 0
                    ? Math.min(
                      ...product.variants.map(v =>
                        Number(v.price)
                      )
                    )
                    : Number(product.price);
                return (
                  <div
                    key={product.id}
                    className="bg-brand-ivory rounded-2xl overflow-hidden shadow-sm border border-brand-green/10 flex flex-col justify-between"
                  >
                    {/* Aspect image frame */}
                    <div className="relative aspect-4/3 overflow-hidden bg-brand-green/5">
                      <img
                        src={product.image_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      {/* Active Inactive Badge overlay */}
                      <div className="absolute top-3 left-3 select-none">
                        {product.is_active ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-emerald-300">
                            Actif
                          </span>
                        ) : (
                          <span className="bg-brand-green/60 text-brand-ivory text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-brand-green/30">
                            Inactif
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-brand-green/95 backdrop-blur-md text-brand-gold text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-brand-gold/30">
                        {product.category}
                      </div>
                    </div>

                    {/* Body elements */}
                    <div className="p-5 flex-grow">
                      <h3 className="font-serif text-base font-bold text-brand-green leading-snug">
                        {product.name}
                      </h3>
                      <p className="font-sans text-[11px] text-brand-green/60 mt-1 line-clamp-2 leading-relaxed font-light">
                        {product.description || 'Création culinaire préparée à la commande.'}
                      </p>
                      <p className="font-serif text-lg font-bold text-brand-green mt-4">
                        {minPrice.toLocaleString()}{' '}
                        <span className="font-sans text-xs font-semibold text-brand-gold">DZD</span>
                      </p>
                    </div>

                    {/* Quick toggle list actions Footer */}
                    <div className="px-5 py-3.5 bg-brand-green/5 border-t border-brand-green/10 flex items-center justify-between">
                      {/* Active toggle */}
                      <button
                        onClick={async () => {
                          try {
                            const categoryObj = categories.find(
                              (c) => c.name === product.category
                            );

                            await fetch(
                              `https://casa-verde-production-1d5f.up.railway.app/api/products/${product.id}`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                  name: product.name,
                                  description: product.description,
                                  price: product.price,
                                  category_id: categoryObj?.id,
                                  is_active: !product.is_active
                                })
                              }
                            );

                            await refreshProducts();

                          } catch (error) {
                            console.error(error);
                          }
                        }}
                        className="px-3 py-1 rounded-full border border-brand-green/20 hover:border-brand-green bg-white text-brand-green text-[10px] font-semibold transition-all cursor-pointer"
                      >
                        {product.is_active ? 'Désactiver' : 'Activer'}
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEdit(product)}
                          className="p-1.5 border border-brand-green/10 hover:border-brand-green text-brand-green rounded-full bg-white hover:text-brand-green transition-all cursor-pointer"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm('Supprimer définitivement ce produit ?'))
                              return;

                            try {
                              await fetch(
                                `https://casa-verde-production-1d5f.up.railway.app/api/products/${product.id}`,
                                {
                                  method: "DELETE"
                                }
                              );

                              await refreshProducts();

                            } catch (error) {
                              console.error(error);
                              alert("Erreur lors de la suppression");
                            }
                          }}
                          className="p-1.5 border border-rose-100 text-rose-600 rounded-full bg-rose-50 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
