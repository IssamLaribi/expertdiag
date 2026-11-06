'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
    ArrowRight,
    ArrowUpRight,
    Calendar,
    MapPin,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Truck,
    Headset,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Static content                                                            */
/* -------------------------------------------------------------------------- */

const HERO_IMAGE =
    'https://quantum-x.sk/__l5e/assets-v1/5355e229-bb33-4b15-bdd3-26501a6a8104/equipment-range.webp';

const TRUST_POINTS = [
    { icon: Truck, label: 'Livraison sur 58 wilayas' },
    { icon: Headset, label: 'Support & SAV 24/7' },
    { icon: ShieldCheck, label: 'Produits certifiés' },
];

const STATS = [
    { value: '58 Wilayas', label: 'Couverture logistique nationale', accent: true },
    { value: '< 1 min', label: 'Mise à jour des stocks en temps réel', accent: false },
    { value: '24 / 7', label: 'Support technique & SAV qualifié', accent: true },
    { value: '100%', label: 'Garantie conformité & traçabilité', accent: false },
];

/* The one featured event. Replace the `photos` entries with your own images
   (e.g. '/events/simem-1.jpg' placed in /public/events). */
const FEATURED_EVENT = {
    title: 'Healthcare Expo International Health CARE Meeting 2022',
    location: "Eshra-ain benian",
    date: 'Novembre 2022',
    intro:
        "Pendant trois jours, Expert Diagnostic a accueilli professionnels de santé, biologistes et responsables de laboratoires sur son stand pour échanger autour des technologies qui transforment le diagnostic en Algérie.",
    details:
        "Nos ingénieurs d'application ont présenté en conditions réelles les dernières générations d'automates de biochimie et d'immuno-analyse, ainsi que notre gamme de réactifs et nos services de maintenance.",
    highlights: [
        "Démonstrations en direct d'automates de biochimie",
        "Rencontres avec nos ingénieurs d'application",
        "Nouveaux réactifs d'immuno-analyse présentés",
        'Devis personnalisés et accompagnement sur place',
    ],
    photos: [
        {
            src: 'https://scontent.falg3-2.fna.fbcdn.net/v/t39.30808-6/472717157_593836823247848_6376730591966505030_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x895&ctp=s2048x895&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHAfBMOetKo0oxnm7d9vFhT-iyMg3OCu3z6LIyDc4K7fGXYK6NJy0ujUAOxCnTQdCrYsCFzrkVSXJMaUjqaqidS&_nc_ohc=iS6BfaE9Y1QQ7kNvwEBlODy&_nc_oc=Adog4RMFhO9Cc2E-5d2n7QZOuazSr_vu8dqUx_TAZa21Q5jPicHotxSH05MEECBJiWQ&_nc_zt=23&_nc_ht=scontent.falg3-2.fna&_nc_gid=ettEZYHTdaNJGdFzJ3v8bw&_nc_ss=7b2a8&oh=00_AQQDI-F823NfYHDcrwRSfUedj-WGcSjEunZCpW9B8SMl1A&oe=6B0831B7',
            alt: 'Stand Expert Diagnostic',
        },
        {
            src: 'https://scontent.falg3-2.fna.fbcdn.net/v/t39.30808-6/472737995_593836816581182_6733896158593331784_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x895&ctp=s2048x895&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGivQJ54aa-ShbBjeAbnLK_SUjAjgVIgUtJSMCOBUiBS3gURQqVE7d3iS9YdBOLe43uj3XBN70ooNEZ8W_D78JY&_nc_ohc=myPhpoH59igQ7kNvwG9xtPH&_nc_oc=AdpYDP6r_fa8OMmwwDS3sLT-dtrrTbsmTS-xUGRL6xUzmixrn3flh57571UTU5tvkCs&_nc_zt=23&_nc_ht=scontent.falg3-2.fna&_nc_gid=X5aS9mRZt7PtGZYW9JsBFA&_nc_ss=7b2a8&oh=00_AQQ_3f_Dzlt-TgTuMHxQ1cU1f9wFOtphSwLOBXOVIF9fKA&oe=6B081EBB',
            alt: 'Conférence scientifique lors du salon',
        },
    ],
};

/* -------------------------------------------------------------------------- */
/*  Shared building blocks                                                    */
/* -------------------------------------------------------------------------- */

const CONTAINER = 'max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20';
const FOCUS =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

function SectionHeader({
    eyebrow,
    title,
    highlight,
    description,
    action,
}: {
    eyebrow: string;
    title: string;
    highlight?: string;
    description?: string;
    action?: { href: string; label: string };
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-[2px] bg-blue-600" />
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">
                        {eyebrow}
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {title} {highlight && <span className="text-blue-600">{highlight}</span>}
                </h2>
                {description && (
                    <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <Link
                    href={action.href}
                    className={`inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition group shrink-0 rounded-lg ${FOCUS}`}
                >
                    {action.label}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            )}
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center text-sm text-slate-500">
            {message}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Event photo slider                                                        */
/* -------------------------------------------------------------------------- */

function PhotoSlider({ photos }: { photos: { src: string; alt: string }[] }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const count = photos.length;

    const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

    useEffect(() => {
        if (paused || count < 2) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
        return () => clearInterval(timer);
    }, [paused, count]);

    return (
        <div
            className="space-y-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Photos de l'événement"
        >
            <div className="overflow-hidden rounded-3xl shadow-xl border border-slate-200 bg-slate-100">
                <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {photos.map((photo, i) => (
                        <img
                            key={photo.src}
                            src={photo.src}
                            alt={photo.alt}
                            aria-hidden={i !== index}
                            className="w-full shrink-0 h-[280px] sm:h-[420px] lg:h-[460px] object-cover"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {photos.map((photo, i) => (
                        <button
                            key={photo.src}
                            type="button"
                            onClick={() => go(i)}
                            aria-label={`Photo ${i + 1} sur ${count}`}
                            aria-current={i === index}
                            className={`h-2 rounded-full transition-all duration-300 ${FOCUS} ${i === index ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                                }`}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => go(index - 1)}
                        aria-label="Photo précédente"
                        className={`w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center ${FOCUS}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => go(index + 1)}
                        aria-label="Photo suivante"
                        className={`w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center ${FOCUS}`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
    const { products, domains } = useApp();

    const featuredProducts = products.filter((p) => p.visible).slice(0, 4);

    return (
        <div className="bg-white selection:bg-blue-600 selection:text-white">
            {/* ------------------------------------------------------------------ */}
            {/*  HERO - image fills the right half and fades into the text half    */}
            {/* ------------------------------------------------------------------ */}
            <section className="relative bg-slate-50 overflow-hidden lg:min-h-[max(620px,calc(100svh-7rem))] flex flex-col lg:flex-row lg:items-center">
                {/* Subtle technical grid on the pale background */}
                <div className="absolute inset-0 pointer-events-none opacity-60 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:48px_48px]" />

                {/* Image: top block on mobile, wide right-hand area on desktop */}
                <div className="relative h-72 sm:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[68%] order-first">
                    <img
                        src={HERO_IMAGE}
                        alt="Laboratoire clinique automatisé"
                        className="absolute inset-0 w-full h-full object-cover object-right"
                    />
                    {/* Long, soft wash: the photo emerges slowly from the background colour */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 from-[2%] via-slate-50/40 via-[35%] to-transparent to-[75%] lg:bg-gradient-to-r lg:from-slate-50 lg:from-[3%] lg:via-slate-50/75 lg:via-[28%] lg:to-transparent lg:to-[78%]" />
                </div>

                {/* Text */}
                <div className={`${CONTAINER} relative z-10 w-full py-12 lg:py-24`}>
                    <div className="lg:w-1/2 lg:pr-12 space-y-8">
                        <h1 className="text-5xl sm:text-6xl xl:text-7xl 2xl:text-[5.5rem] font-extrabold tracking-tighter text-slate-900 leading-[1.05]">
                            La précision commence par le bon{' '}
                            <span className="text-blue-600">partenaire.</span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                            Réactifs de haute performance, analyseurs de pointe et consommables
                            essentiels pour votre laboratoire. Accompagnés par une expertise
                            technique certifiée.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <Link
                                href="/catalogue"
                                className={`px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-3 group ${FOCUS}`}
                            >
                                <span>Explorer le catalogue</span>
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                            </Link>

                            <Link
                                href="/a-propos"
                                className={`px-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200 text-slate-800 font-bold text-sm hover:bg-white hover:border-slate-300 transition rounded-xl flex items-center justify-center gap-2 ${FOCUS}`}
                            >
                                <span>Découvrir Expert Diagnostic</span>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </Link>
                        </div>

                        <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                            {TRUST_POINTS.map(({ icon: Icon, label }) => (
                                <li key={label} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <Icon className="w-4 h-4 text-blue-600" />
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------------ */}
            {/*  STATS                                                             */}
            {/* ------------------------------------------------------------------ */}
            <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                <dl className={`${CONTAINER} grid grid-cols-2 md:grid-cols-4 gap-y-10 text-center relative z-10`}>
                    {STATS.map((stat, i) => (
                        <div
                            key={stat.label}
                            className={`space-y-2 px-4 ${i > 0 ? 'md:border-l md:border-slate-800' : ''}`}
                        >
                            <dt className={`text-3xl lg:text-5xl font-black ${stat.accent ? 'text-blue-400' : 'text-white'}`}>
                                {stat.value}
                            </dt>
                            <dd className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
                                {stat.label}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>


            {/* ------------------------------------------------------------------ */}
            {/*  DOMAINS                                                           */}
            {/* ------------------------------------------------------------------ */}
            <section className={`${CONTAINER} py-24`}>
                <SectionHeader
                    eyebrow="Spécialités analytiques"
                    title="Explorez nos domaines"
                    highlight="de biologie médicale."
                    description="Des solutions complètes adaptées à chaque discipline de votre laboratoire."
                    action={{ href: '/catalogue', label: 'Explorer tout le catalogue' }}
                />

                {domains.length === 0 ? (
                    <EmptyState message="Les domaines de spécialité seront bientôt disponibles." />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                        {domains.map((dom) => (
                            <Link
                                key={dom.id}
                                href={`/catalogue?domain=${encodeURIComponent(dom.name)}`}
                                className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 ${FOCUS}`}
                            >
                                <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100">
                                    <img
                                        src={dom.image}
                                        alt={dom.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                                </div>

                                <div className="p-4 flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {dom.name}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">Équipements & réactifs</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* ------------------------------------------------------------------ */}
            {/*  FEATURED EVENT - photo slider + description                       */}
            {/* ------------------------------------------------------------------ */}
            <section className={`${CONTAINER} py-24`}>
                <SectionHeader
                    eyebrow="Présence sur le terrain"
                    title="Nous étions"
                    highlight="au salon."
                    description="Expert Diagnostic s'engage auprès de la communauté scientifique en participant aux grands rendez-vous de la santé."
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    <div className="lg:col-span-7">
                        <PhotoSlider photos={FEATURED_EVENT.photos} />
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-slate-600">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                {FEATURED_EVENT.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                {FEATURED_EVENT.location}
                            </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                            {FEATURED_EVENT.title}
                        </h3>

                        <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                            <p>{FEATURED_EVENT.intro}</p>
                            <p>{FEATURED_EVENT.details}</p>
                        </div>

                        <ul className="space-y-3 pt-1">
                            {FEATURED_EVENT.highlights.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-px" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/contact"
                            className={`inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition group rounded-lg ${FOCUS}`}
                        >
                            Nous rencontrer lors du prochain salon
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>


            {/* ------------------------------------------------------------------ */}
            {/*  FEATURED PRODUCTS                                                 */}
            {/* ------------------------------------------------------------------ */}
            <section className="bg-slate-50/70 border-y border-slate-200/60 py-24">
                <div className={CONTAINER}>
                    <SectionHeader
                        eyebrow="Matériel haut de gamme"
                        title="Produits en"
                        highlight="vedette"
                        description="Une sélection de nos équipements et réactifs les plus demandés par les laboratoires."
                        action={{ href: '/catalogue', label: 'Catalogue complet' }}
                    />

                    {featuredProducts.length === 0 ? (
                        <EmptyState message="Aucun produit en vedette pour le moment." />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product) => {
                                const available = product.status === 'available';
                                return (
                                    <article
                                        key={product.id}
                                        className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col group"
                                    >
                                        <Link href={`/catalogue/${product.id}`} className={`block h-56 overflow-hidden bg-slate-100 ${FOCUS}`}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                        </Link>

                                        <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                                            <div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider line-clamp-1">
                                                        {product.domain}
                                                    </span>
                                                    <span
                                                        className={`flex items-center gap-1.5 text-[11px] font-semibold shrink-0 ${available ? 'text-emerald-700' : 'text-rose-700'
                                                            }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                        {available ? 'Disponible' : 'Indisponible'}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">
                                                    <Link href={`/catalogue/${product.id}`} className="hover:text-blue-600 transition">
                                                        {product.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                                    {product.description}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                                                        Tarif indicatif
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-900">
                                                        {product.priceEstimate || 'Sur devis'}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={`/catalogue/${product.id}`}
                                                    className={`px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition ${FOCUS}`}
                                                >
                                                    Détails
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ------------------------------------------------------------------ */}
            {/*  FINAL CALL TO ACTION                                              */}
            {/* ------------------------------------------------------------------ */}
            <section className={`${CONTAINER} pb-28`}>
                <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 rounded-3xl p-10 sm:p-16 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-2xl space-y-6">
                        <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">
                            Prêt à équiper votre laboratoire ?
                        </p>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                            Optimisez les performances de votre plateau technique dès aujourd'hui.
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            Contactez nos conseillers commerciaux pour recevoir un devis personnalisé
                            ou planifier une démonstration de nos analyseurs.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href="/catalogue"
                                className={`px-8 py-4 bg-white text-slate-900 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2 ${FOCUS}`}
                            >
                                <span>Voir le catalogue</span>
                                <ArrowRight className="w-4 h-4 text-blue-600" />
                            </Link>
                            <Link
                                href="/contact"
                                className={`px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition ${FOCUS}`}
                            >
                                Nous contacter
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}