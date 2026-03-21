"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, ShieldCheck } from "lucide-react";

const INITIAL_POSTS = [
  {
    id: 1,
    author: "TransCita",
    content: "¡Bienvenidos a nuestro nuevo Hub de Colaboradores! 🚀 Aquí estaremos compartiendo noticias y momentos especiales del equipo.",
    likes: 24,
    liked: false,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
    time: "2h",
  },
  {
    id: 2,
    author: "Recursos Humanos",
    content: "Celebrando el cumpleaños de nuestro compañero del mes. ¡Felicidades! 🎉",
    likes: 15,
    liked: true,
    image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1000&auto=format&fit=crop",
    time: "5h",
  },
  {
    id: 3,
    author: "Operaciones",
    content: "Gran jornada hoy en el área Metro. Gracias a todos por su compromiso con el servicio al paciente. 🚑",
    likes: 31,
    liked: false,
    image: "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?q=80&w=1000&auto=format&fit=crop",
    time: "1d",
  },
];

export function SocialWallTab() {
  const [wallPosts, setWallPosts] = useState(INITIAL_POSTS);

  const handleLike = (id: number) => {
    setWallPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-5 space-y-6">
      <header className="mb-4">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Comunidad HuB</h2>
        <p className="text-sm text-gray-500 font-medium">Conecta con tus compañeros.</p>
      </header>

      <div className="space-y-6">
        {wallPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500"
          >
            <div className="p-5 flex items-center gap-3">
              <div className="size-10 bg-green-50 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                {post.author.substring(0, 2)}
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-sm leading-tight">{post.author}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{post.time} • Público</p>
              </div>
            </div>
            <div className="px-5 pb-4">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{post.content}</p>
            </div>
            {post.image && (
              <div className="w-full aspect-video bg-gray-100 overflow-hidden px-4 mb-2">
                <img src={post.image} alt="Post content" className="w-full h-full object-cover rounded-3xl" />
              </div>
            )}
            <div className="p-4 px-6 bg-gray-50/50 flex items-center gap-6">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 group transition-all ${post.liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
              >
                <Heart className={`transition-all ${post.liked ? "fill-current scale-110" : "group-hover:scale-110"}`} size={20} />
                <span className="text-xs font-black">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                <MessageCircle size={20} />
                <span className="text-xs font-black">Comentar</span>
              </button>
              <div className="flex-1" />
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center">
        <div className="size-20 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-600 mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">TransCita</h2>
        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
          Líderes en transportación médica en Puerto Rico. Comprometidos con la excelencia y el servicio al paciente.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-3xl">
            <p className="text-2xl font-black text-gray-900 leading-tight">2008</p>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fundado</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-3xl">
            <p className="text-2xl font-black text-gray-900 leading-tight">100%</p>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Local</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Información de Contacto</p>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <p className="text-sm font-black text-gray-900">Alexis Roman</p>
              <a
                href="https://cabuyacreativa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold hover:underline"
              >
                CabuyaCreativa.com
              </a>
            </div>
            <div className="bg-green-50 py-3 px-6 rounded-2xl inline-block border border-green-100">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Para más información</p>
              <p className="text-lg font-black text-primary">787-222-1044</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
