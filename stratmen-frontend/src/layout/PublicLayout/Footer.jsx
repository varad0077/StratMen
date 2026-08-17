import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-bg-white border-t border-border-subtle mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Logo showSubtitle />
            <p className="text-sm text-text-mid leading-relaxed max-w-[220px]">
              Building tomorrow's strategic leaders through weekly sessions, industry visits, and a vibrant community network.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-5">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm text-text-mid">
              <li><Link to="/" className="hover:text-green-deep transition-colors">Home</Link></li>
              <li><Link to="/activities" className="hover:text-green-deep transition-colors">Activities</Link></li>
              <li><Link to="/journey" className="hover:text-green-deep transition-colors">Journey</Link></li>
              <li><Link to="/about" className="hover:text-green-deep transition-colors">About Us</Link></li>
              <li><Link to="/stratchat" className="hover:text-green-deep transition-colors">StratChat Portal</Link></li>
            </ul>
          </div>

          {/* Col 3: Community */}
          <div>
            <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-5">
              Community
            </h4>
            <ul className="space-y-3 text-sm text-text-mid">
              <li><Link to="/stratchat" className="hover:text-green-deep transition-colors">Apply to Join</Link></li>
              <li><Link to="/stratchat" className="hover:text-green-deep transition-colors">Member Log In</Link></li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-deep transition-colors inline-flex items-center gap-1"
                >
                  LinkedIn <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-5">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-text-mid">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-green-deep shrink-0" />
                <span>contact@stratmen.org</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-green-deep shrink-0" />
                <span>Pune / Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border-subtle mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-3">
          <p>© {new Date().getFullYear()} StratMen Foundation. All rights reserved.</p>
          <p>Built for strategic leaders.</p>
        </div>
      </div>
    </footer>
  );
};
