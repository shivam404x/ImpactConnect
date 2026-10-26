import React from 'react';
import { Building2, FolderKanban, Users, Handshake, Info } from 'lucide-react';

export default function ImpactStats({ stats }) {
  const statItems = [
    {
      id: 'ngos',
      label: 'NGOs Registered',
      value: stats?.totalNgos || 6,
      subtext: 'Verified grassroots & national orgs',
      icon: Building2,
      color: 'text-[#16A36A]',
      bg: 'bg-emerald-50'
    },
    {
      id: 'projects',
      label: 'Active Projects',
      value: stats?.totalProjects || 8,
      subtext: 'Addressing 8 critical social causes',
      icon: FolderKanban,
      color: 'text-sky-600',
      bg: 'bg-sky-50'
    },
    {
      id: 'volunteers',
      label: 'Volunteers Connected',
      value: `${stats?.totalVolunteersJoined || 154}+`,
      subtext: 'Pledged hands-on community service',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      id: 'partnerships',
      label: 'Partnerships Created',
      value: stats?.acceptedRequests || 4,
      subtext: 'Active NGO-corporate & donor ties',
      icon: Handshake,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <section className="bg-[#F8FAFC] py-12 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Notice explaining demo metrics */}
        <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-medium mb-6">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Real-time platform activity metrics (Demonstration & Sandbox State)</span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statItems.map(item => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {item.value}
                </div>

                <div className="text-sm font-bold text-slate-800 mt-1">
                  {item.label}
                </div>

                <div className="text-xs text-slate-500 mt-0.5">
                  {item.subtext}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
