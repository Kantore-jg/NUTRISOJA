import React, { useEffect } from 'react';
import { Leaf, Target, Award, Users, Heart, CheckCircle2, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'À Propos de NUTRI SOJA | Notre Histoire & Engagements au Burundi';
  }, []);

  const values = [
    {
      title: 'Nutrition Santé Accessible',
      description: 'Démocratiser l’accès à des protéines végétales de très haute valeur biologique à un prix juste pour chaque foyer burundais.',
      icon: Heart,
    },
    {
      title: 'Filière Équitable & Solidaire',
      description: 'Assurer des revenus prévisibles et dignes à plus de 350 producteurs et coopératives paysannes sur nos collines.',
      icon: Users,
    },
    {
      title: 'Salubrité & Rigueur Normative',
      description: 'Transformation hygiénique, pasteurisation contrôlée et analyses physico-chimiques régulières garantissant une qualité zéro compromis.',
      icon: Award,
    },
    {
      title: 'Agro-Écologie & Souveraineté',
      description: 'Réduire la dépendance aux importations et régénérer naturellement la fertilité des sols burundais grâce aux vertus fixatrices du soja.',
      icon: Leaf,
    },
  ];

  const team = [
    {
      name: 'Dr. Chantal Nibizi',
      role: 'Directrice Nutrition & Développement Produit',
      bio: 'Diplômée en Santé Publique, 12 ans d’expérience dans la formulation d’aliments de sevrage et la lutte contre la malnutrition infantile.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Aimé Ndikumana',
      role: 'Directeur des Opérations & Transformation',
      bio: 'Spécialiste agroalimentaire formé à l’Université du Burundi, passionné par les techniques de fabrication du tofu et des laits végétaux.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Pacifique Mugisha',
      role: 'Responsable Agronomie & Relations Coopératives',
      bio: 'Agronome de terrain coordonnant les formations techniques et l’approvisionnement auprès de 12 coopératives à Kirundo et Gitega.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-[#F5F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* HERO INTRO */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#2E7D32]/10 text-[#2E7D32]">
            Notre Raison d'Être
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1C1C1C]">
            Nourrir le Burundi avec la force de ses propres récoltes.
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Fondée à Bujumbura, <strong>NUTRI SOJA</strong> est née d'une conviction profonde : 
            le soja cultivé sur les collines du Burundi est la réponse la plus durable, 
            saine et économique aux défis nutritionnels de notre région.
          </p>
        </section>

        {/* HISTOIRE & VISION */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-[#2E7D32] font-semibold text-sm">
                <Target className="w-5 h-5 text-[#D4A017]" />
                <span>Notre Histoire</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1C1C1C]">
                De l'atelier artisanal à l'unité moderne de référence
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Tout a commencé en 2018 avec une petite presse manuelle et le désir d'offrir 
                une alternative sans lactose et abordable aux enfants intolérants au lait de vache. 
                Face à l'engouement des familles et à l'appui des nutritionnistes locaux, 
                l'atelier s'est développé pour devenir une véritable unité de transformation semi-industrielle.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Aujourd’hui, NUTRI SOJA produit quotidiennement plus de 2 000 litres de boissons végétales, 
                des tonnes de farine enrichie TotoFort et approvisionne tant les foyers que les cliniques et programmes d’urgence nutritionnelle.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <div className="p-4 rounded-xl bg-[#F5F1E8] border border-[#2E7D32]/10">
                  <span className="font-heading font-black text-2xl text-[#2E7D32]">100%</span>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">Matière première nationale</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F5F1E8] border border-[#2E7D32]/10">
                  <span className="font-heading font-black text-2xl text-[#D4A017]">0%</span>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">Produits chimiques ou OGM</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80"
                  alt="Champs de soja et agriculteurs au Burundi"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white text-sm">
                    <p className="font-bold">Champs de soja partenaires à Ngozi</p>
                    <p className="text-xs text-gray-300">Récolte biologique respectant le cycle naturel des sols</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NOS VALEURS */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32]">
              Éthique & Principes
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1C1C1C]">
              Les 4 piliers de notre engagement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 hover:border-[#2E7D32]/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                      {val.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ENGAGEMENT LOCAL & COOPÉRATIVES */}
        <section className="rounded-3xl bg-[#2E7D32] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-amber-200 uppercase tracking-wider">
              Ancrage Communautaire
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight">
              Un pacte de confiance durable avec 350 familles d'agriculteurs.
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed">
              Nous refusons la spéculation sur les cours agricoles. En signant des contrats de préfinancement et d'achat garanti à prix fixe, nous permettons aux petits producteurs de planifier leurs semences, d'envoyer leurs enfants à l'école et d'investir dans leurs outils de travail.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0" />
                <span>Kirundo (Nord)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0" />
                <span>Ngozi & Kayanza</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0" />
                <span>Plateaux de Gitega</span>
              </div>
            </div>
          </div>
        </section>

        {/* ÉQUIPE */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32]">
              Experts & Passionnés
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1C1C1C]">
              L'équipe à vos côtés
            </h2>
            <p className="text-sm text-gray-600">
              Des compétences multidisciplinaires unies pour l'excellence agroalimentaire du Burundi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100 p-6 flex flex-col items-center text-center space-y-4"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#2E7D32]/20 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">{member.name}</h3>
                  <p className="text-xs font-bold text-[#2E7D32] mt-0.5">{member.role}</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
