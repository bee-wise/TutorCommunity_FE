"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  ClipboardList,
  Briefcase,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useCommunityStore } from "../store/community-store";

export function CommunityBottomBar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const { currentUser } = useCommunityStore();

  const navItems = [
    {
      label: "Trang chủ",
      href: "/community",
      icon: <Home className="w-5 h-5" />,
      show: true,
    },
    {
      label: "Bài đăng của tôi",
      href: "/community/my-posts",
      icon: <ClipboardList className="w-5 h-5" />,
      show: currentUser.role === "LEARNER",
    },
    {
      label: "Quản lý kết nối",
      href: "/community/applications",
      icon: <Briefcase className="w-5 h-5" />,
      show: currentUser.role === "LEARNER" || currentUser.role === "TUTOR",
    },
  ].filter((item) => item.show);

  if (currentUser.role === "GUEST") {
    return null; // Do not show bottom bar for guests
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center gap-1 bg-white/60 backdrop-blur-xl p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/40"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-slate-600 hover:text-primary hover:bg-white/50"
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => setIsExpanded(false)}
              className="ml-1 p-2.5 text-slate-500 hover:text-primary hover:bg-white/50 rounded-full transition-colors"
              title="Thu gọn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => setIsExpanded(true)}
            className="bg-white/60 backdrop-blur-xl text-primary border border-white/40 p-4 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform"
            title="Mở menu cộng đồng"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
