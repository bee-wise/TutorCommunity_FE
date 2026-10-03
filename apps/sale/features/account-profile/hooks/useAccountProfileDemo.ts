"use client";

import { useEffect, useState } from "react";
import type { MeType } from "@workspace/core/types/auth.type";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { getProfileValues, type NotificationKey, type NotificationPreferences, type ProfileTab, type ProfileValues } from "../types/account-profile";

export function useAccountProfileDemo(user: MeType) {
  const [tab, setTab] = useState<ProfileTab>("profile");
  const [profile, setProfile] = useState(() => getProfileValues(user));
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [twoFactor, setTwoFactor] = useState(false);
  const [otherSession, setOtherSession] = useState(true);
  const [notifications, setNotifications] = useState<NotificationPreferences>({ messages: true, reminders: true, email: false, updates: false });
  const avatar = avatarPreview || user.avatarUrl || "";
  const completion = Math.round([profile.fullName, profile.phoneNumber, profile.location, profile.birthday, profile.bio, avatar].filter(Boolean).length / 6 * 100);

  useEffect(() => {
    return () => { if (avatarPreview) URL.revokeObjectURL(avatarPreview); };
  }, [avatarPreview]);

  const saveProfile = (values: ProfileValues) => {
    setProfile(values);
    setEditing(false);
    toast.success("Đã cập nhật hồ sơ demo", { description: "Thay đổi được giữ trong phiên xem này." });
  };

  const updateAvatar = (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh chưa phù hợp", { description: "Chọn ảnh JPG, PNG hoặc WebP, tối đa 5 MB." });
      return;
    }
    setAvatarPreview(URL.createObjectURL(file));
    toast.success("Đã đổi ảnh trong bản demo");
  };

  const toggleInterest = (interest: string) => {
    if (!interests.includes(interest) && interests.length >= 5) {
      toast.info("Bạn có thể chọn tối đa 5 sở thích.");
      return;
    }
    setInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  };

  const toggleNotification = (key: NotificationKey) => setNotifications((current) => ({ ...current, [key]: !current[key] }));

  const toggleTwoFactor = () => {
    setTwoFactor((current) => !current);
    toast.info("Đã thay đổi tùy chọn bảo mật demo", { description: "Cài đặt bảo mật thực tế của tài khoản chưa thay đổi." });
  };

  const endOtherSession = () => {
    setOtherSession(false);
    toast.success("Đã kết thúc phiên đăng nhập mẫu");
  };

  return { tab, setTab, profile, editing, setEditing, avatar, updateAvatar, completion, interests, toggleInterest, saveProfile, twoFactor, toggleTwoFactor, otherSession, endOtherSession, notifications, toggleNotification };
}

export type AccountProfileDemo = ReturnType<typeof useAccountProfileDemo>;
