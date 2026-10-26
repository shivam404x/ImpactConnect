import React from 'react';
import { Quote, Star, Info } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "ImpactConnect allowed our rural education trust to connect with a CSR partner who provided 50 tablets for our offline classrooms. The collaboration process was completely transparent.",
    author: "Elena Mwangi",
    role: "Program Lead, Rural Literacy Project",
    organization: "BrightPath Initiative (Sample Demo Testimonial)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    quote: "As a corporate social responsibility director, finding verified grassroots projects that matched our clean water focus used to take months. With ImpactConnect, we deployed matching grants in 2 weeks.",
    author: "David Zhao",
    role: "Head of Corporate Social Impact",
    organization: "Global Tech Foundation (Sample Demo Testimonial)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    quote: "I am a radiologist and wanted to volunteer pro-bono hours. ImpactConnect paired me directly with a maternal telemedicine van in remote tribal hamlets. It’s technology used for pure good.",
    author: "Dr. Ananya Roy",
    role: "Consultant Medical Volunteer",
    organization: "Tele-Health Volunteer Network (Sample Demo Testimonial)",
    avatar: "https://images.unsplash.com/photo-1594824813511-c934526b7ee8?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="bg-[#F8FAFC] py-16 lg:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mb-2">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Developer Sandbox: Illustrative Stakeholder Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Voices of Impact & Collaboration
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            How changemakers, corporate supporters, and medical volunteers partner to transform communities.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author info */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center space-x-3.5">
                <img 
                  src={t.avatar} 
                  alt={t.author} 
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.author}</div>
                  <div className="text-xs text-[#16A36A] font-semibold">{t.role}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{t.organization}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
