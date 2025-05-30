
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TableauDeBord from "./pages/TableauDeBord";
import Commander from "./pages/Commander";
import Evenements from "./pages/Evenements";
import Profil from "./pages/Profil";
import NousTrouver from "./pages/NousTrouver";
import APropos from "./pages/APropos";
import AirtableTest from "./pages/AirtableTest";
import AirtableConfig from "./components/AirtableConfig";
import Admin from "./pages/Admin";
import AdminCommandes from "./pages/AdminCommandes";
import AdminCommandeDetail from "./pages/AdminCommandeDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background flex">
          <Sidebar />
          <main className="flex-1 ml-16 lg:ml-64 transition-all duration-300">
            <Routes>
              <Route path="/" element={<TableauDeBord />} />
              <Route path="/commander" element={<Commander />} />
              <Route path="/evenements" element={<Evenements />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/nous-trouver" element={<NousTrouver />} />
              <Route path="/a-propos" element={<APropos />} />
              <Route path="/airtable-config" element={<AirtableConfig />} />
              <Route path="/airtable-test" element={<AirtableTest />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/commandes" element={<AdminCommandes />} />
              <Route path="/admin/commandes/:id" element={<AdminCommandeDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
