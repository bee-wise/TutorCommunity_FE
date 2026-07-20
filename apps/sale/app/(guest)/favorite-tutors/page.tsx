import { Metadata } from "next";
import { FavoriteTutorsPage } from "../../../features/favorite-tutors/components/FavoriteTutorsPage";

export const metadata: Metadata = {
  title: "Gia sư yêu thích | BeeWise",
  description: "Danh sách các gia sư bạn đã lưu lại trên hệ thống BeeWise.",
};

import { Header } from "@workspace/ui/components/layout/Header";
import { Footer } from "@workspace/ui/components/layout/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)] pt-16">
        <FavoriteTutorsPage />
      </main>
      <Footer />
    </>
  );
}
