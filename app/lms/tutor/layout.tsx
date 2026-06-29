export default function LMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 border-b flex items-center px-6 bg-white">
        LMS Navbar (Tutor/Learner)
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
