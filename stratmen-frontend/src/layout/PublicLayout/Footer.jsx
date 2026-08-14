import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Shield, Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-surface-dark border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Logo />
            <p className="text-xs text-text-muted leading-relaxed">
              Building tomorrow's strategic leaders through weekly sessions, industry visits, and a vibrant community network.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/activities" className="hover:text-accent transition-colors">Activities</Link></li>
              <li><Link to="/journey" className="hover:text-accent transition-colors">Journey</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/stratchat" className="hover:text-accent transition-colors">StratChat Portal</Link></li>
            </ul>
          </div>

          {/* Col 3: Community */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/stratchat" className="hover:text-accent transition-colors">Apply to Join</Link></li>
              <li><Link to="/stratchat" className="hover:text-accent transition-colors">Member Log In</Link></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors inline-flex items-center gap-1">LinkedIn <ExternalLink className="h-3 w-3" /></a></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span>contact@stratmen.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <span>Pune / Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© {new Date().getFullYear()} StratMen Foundation. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for strategic leaders.
          </p>
        </div>
      </div>
    </footer>
  );
};
