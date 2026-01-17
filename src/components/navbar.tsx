"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Satellite, 
  User, 
  LogIn, 
  Menu, 
  X, 
  MapPin, 
  Bell, 
  Settings, 
  BookmarkIcon,
  LogOut
} from "lucide-react";
import { AuthModal } from "./auth-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  isLoggedIn?: boolean;
  transparent?: boolean;
}

export function Navbar({ isLoggedIn = false, transparent = true }: NavbarProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 ${
          transparent ? "bg-transparent" : "glass-strong"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-lg group-hover:bg-cyan-500/40 transition-all" />
                <Satellite className="w-8 h-8 text-cyan-400 relative animate-pulse-glow" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg text-white">SatelliteToStreet</h1>
                <p className="text-xs text-slate-400">Know Before You Go</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/map"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Explore Map
              </Link>
              <Link
                href="#features"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Features
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-50" />
                      <Avatar className="relative w-10 h-10 border-2 border-cyan-500/50">
                        <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-strong border-white/10">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="font-medium text-white">John Doe</p>
                      <p className="text-xs text-slate-400">john@example.com</p>
                    </div>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <BookmarkIcon className="w-4 h-4" />
                      Saved Cities
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Bell className="w-4 h-4" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Settings className="w-4 h-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="gap-2 cursor-pointer text-red-400">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthOpen(true);
                    }}
                    className="hidden sm:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthOpen(true);
                    }}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white text-sm font-medium rounded-xl transition-all btn-ripple"
                  >
                    <User className="w-4 h-4" />
                    Get Started
                  </button>
                </>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-strong border-t border-white/10"
            >
              <div className="px-6 py-4 space-y-4">
                <Link
                  href="/"
                  className="block text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/map"
                  className="block text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Explore Map
                </Link>
                <Link
                  href="#features"
                  className="block text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-center text-slate-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-xl"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
