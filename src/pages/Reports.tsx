import { useState, useEffect } from "react";
import { FileText, Download, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { currentUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getHistory, getContacts } from "@/lib/safeher";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const u = currentUser();
    if (!u) {
      navigate("/login");
      return;
    }
    setUser(u);
  }, [navigate]);

  async function generateReport() {
    if (!form.title || !form.startDate || !form.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setGenerating(true);
    toast.loading("Generating PDF report...", { id: "pdf" });

    try {
      const startDate = new Date(form.startDate);
      const endDate = new Date(form.endDate);
      endDate.setHours(23, 59, 59, 999);

      // Get incidents from localStorage
      const allIncidents = getHistory();
      const incidents = allIncidents.filter(inc => {
        const incDate = new Date(inc.ts);
        return incDate >= startDate && incDate <= endDate;
      });

      if (incidents.length === 0) {
        toast.warning("No incidents found in the selected date range", { id: "pdf" });
        setGenerating(false);
        return;
      }

      const contacts = getContacts();

      // Generate PDF
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(34, 139, 34);
      doc.text("SafeGuard Emergency Report", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      
      // Report Info
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(form.title, 14, 40);
      
      if (form.description) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        const splitDesc = doc.splitTextToSize(form.description, 180);
        doc.text(splitDesc, 14, 48);
      }
      
      // User Info
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("User Information", 14, 65);
      doc.setFontSize(10);
      doc.text(`Name: ${user.name}`, 14, 72);
      doc.text(`Email: ${user.email}`, 14, 78);
      doc.text(`Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, 14, 84);
      
      // Incidents Table
      doc.setFontSize(12);
      doc.text(`Emergency Incidents (${incidents.length})`, 14, 95);
      
      const incidentData = incidents.map(inc => [
        new Date(inc.ts).toLocaleString(),
        inc.lat && inc.lng ? `${inc.lat.toFixed(4)}, ${inc.lng.toFixed(4)}` : "N/A",
        inc.lat && inc.lng ? `https://maps.google.com/?q=${inc.lat},${inc.lng}` : "N/A"
      ]);
      
      autoTable(doc, {
        startY: 100,
        head: [["Date & Time", "Location", "Map Link"]],
        body: incidentData,
        theme: "grid",
        headStyles: { fillColor: [34, 139, 34] },
        styles: { fontSize: 8 },
      });
      
      // Contacts Table
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      doc.setFontSize(12);
      doc.text(`Emergency Contacts (${contacts.length})`, 14, finalY + 10);
      
      const contactData = contacts.map(c => [
        c.name,
        c.phone,
        c.relation || "N/A"
      ]);
      
      autoTable(doc, {
        startY: finalY + 15,
        head: [["Name", "Phone", "Relation"]],
        body: contactData,
        theme: "grid",
        headStyles: { fillColor: [34, 139, 34] },
        styles: { fontSize: 8 },
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `SafeGuard Report - Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }
      
      // Download
      const filename = `SafeGuard_Report_${form.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(filename);

      toast.success(`Report generated with ${incidents.length} incident${incidents.length > 1 ? "s" : ""}!`, { id: "pdf" });
      setShowCreateModal(false);
      setForm({ title: "", description: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.", { id: "pdf" });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="app-shell px-5 pt-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Documentation</p>
          <h1 className="text-3xl font-display font-bold gradient-text">Reports</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
          style={{
            background: "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155))",
            boxShadow: "0 0 24px oklch(0.45 0.15 150 / 0.4)",
          }}
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <div className="glass rounded-3xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-strong">
            <FileText className="w-6 h-6 text-[oklch(0.45_0.15_150)]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Generate Official Reports</h3>
            <p className="text-sm text-muted-foreground">
              Create comprehensive PDF reports of your emergency incidents for official documentation,
              legal purposes, or personal records. Reports include all incident details, locations,
              timestamps, and emergency contacts.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-display font-semibold">Report Features</h2>
        
        <div className="glass rounded-2xl p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[oklch(0.45_0.15_150)]" />
            What's Included
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
            <li>• All emergency incidents with timestamps</li>
            <li>• GPS coordinates and accuracy information</li>
            <li>• Emergency contacts list</li>
            <li>• Google Maps links for locations</li>
          </ul>
        </div>

        <div className="glass rounded-2xl p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Download className="w-4 h-4 text-[oklch(0.45_0.15_150)]" />
            Use Cases
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
            <li>• Police reports and legal documentation</li>
            <li>• Insurance claims</li>
            <li>• Court evidence</li>
            <li>• Personal safety records</li>
            <li>• Workplace incident reports</li>
          </ul>
        </div>
      </div>

      {/* Create Report Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !generating && setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-3xl p-6 w-full max-w-md space-y-4"
            >
              <h3 className="font-display text-xl font-bold">Generate Report</h3>

              <div>
                <label className="text-sm font-medium block mb-2">Report Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Monthly Safety Report"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.15_150)]"
                  disabled={generating}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Description (Optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Add any additional context or notes..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.15_150)] resize-none"
                  disabled={generating}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.15_150)]"
                    disabled={generating}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">End Date *</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.15_150)]"
                    disabled={generating}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl font-semibold border border-white/10"
                  disabled={generating}
                >
                  Cancel
                </button>
                <button
                  onClick={generateReport}
                  disabled={generating}
                  className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155))",
                  }}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate PDF
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
