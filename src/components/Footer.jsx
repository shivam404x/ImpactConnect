import React from 'react';
import Logo from './Logo';
import { Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';

export default function Footer({ onNavClick, onOpenAuth }) {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-200/80">
          
          {/* Brand info (2 columns wide) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              ImpactConnect is a centralized social impact partnership platform connecting grassroots non-profits with donors, companies, volunteers, and skilled professionals.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <a href="#" className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition" aria-label="Share">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavClick('explore')} className="hover:text-slate-900 transition">
                  Explore Projects
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('urgent-needs')} className="text-rose-600 hover:text-rose-700 font-semibold transition">
                  Urgent Needs
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('resources')} className="hover:text-slate-900 transition">
                  Resource Exchange Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('grants')} className="hover:text-slate-900 transition">
                  Grant & CSR Discovery
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('feed')} className="hover:text-slate-900 transition">
                  Live Activity Feed
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('for-ngos')} className="hover:text-slate-900 transition">
                  For Non-Profits
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('how-it-works')} className="hover:text-slate-900 transition">
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Stakeholders */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Get Involved</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenAuth('register', 'ngo')} className="hover:text-slate-900 transition">
                  Register Your NGO
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('register', 'supporter')} className="hover:text-slate-900 transition">
                  Corporate CSR Programs
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('register', 'supporter')} className="hover:text-slate-900 transition">
                  Volunteer Your Skills
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('login')} className="hover:text-slate-900 transition">
                  Sign In to Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Contact & Support</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
                <span>support@impactconnect.org</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
                <span>+1 (800) 555-IMPACT</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
                <span>Impact Hub, Global SDG Network</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <span>© {new Date().getFullYear()} ImpactConnect. Built with passion for community impact.</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-slate-900 transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900 transition">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900 transition">NGO Guidelines</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
