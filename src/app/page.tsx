"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar, { type Panel } from "@/components/Sidebar";
import ChatPanel from "@/components/panels/ChatPanel";
import SwapPanel from "@/components/panels/SwapPanel";
import LendingPanel from "@/components/panels/LendingPanel";
import DeployPanel from "@/components/panels/DeployPanel";
import PricesPanel from "@/components/panels/PricesPanel";

export default function Home() {
  const [activePanel, setActivePanel] = useState<Panel>("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <Navbar
        activePanel={activePanel}
        onSelectPanel={setActivePanel}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activePanel={activePanel}
          onSelectPanel={setActivePanel}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-5xl">
            {activePanel === "chat" && <ChatPanel />}
            {activePanel === "prices" && <PricesPanel />}
            {activePanel === "swap" && <SwapPanel />}
            {activePanel === "deploy" && <DeployPanel />}
            {activePanel === "lending" && <LendingPanel />}
          </div>
        </div>
      </div>
    </main>
  );
}
