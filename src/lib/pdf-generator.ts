import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Incident, Contact, User } from '@/db/schema';

export interface ReportData {
  user: User;
  incidents: Incident[];
  contacts: Contact[];
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

export function generatePDFReport(data: ReportData): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94); // Green color
  doc.text('SafeGuard', 14, yPosition);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Emergency Incident Report', 14, yPosition + 6);
  
  // Report title and date
  yPosition += 20;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(data.title, 14, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPosition);
  doc.text(`Period: ${data.startDate.toLocaleDateString()} - ${data.endDate.toLocaleDateString()}`, 14, yPosition + 5);
  
  // User information
  yPosition += 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('User Information', 14, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.text(`Name: ${data.user.name}`, 14, yPosition);
  doc.text(`Email: ${data.user.email}`, 14, yPosition + 5);
  
  // Description if provided
  if (data.description) {
    yPosition += 15;
    doc.setFontSize(12);
    doc.text('Description', 14, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    const splitDescription = doc.splitTextToSize(data.description, pageWidth - 28);
    doc.text(splitDescription, 14, yPosition);
    yPosition += splitDescription.length * 5;
  }
  
  // Emergency contacts
  yPosition += 15;
  doc.setFontSize(12);
  doc.text('Emergency Contacts', 14, yPosition);
  
  if (data.contacts.length > 0) {
    yPosition += 7;
    autoTable(doc, {
      startY: yPosition,
      head: [['Name', 'Phone', 'Relation']],
      body: data.contacts.map(c => [c.name, c.phone, c.relation || '-']),
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 14, right: 14 },
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  } else {
    yPosition += 7;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('No emergency contacts added', 14, yPosition);
    yPosition += 10;
  }
  
  // Incidents summary
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Incidents Summary (${data.incidents.length} total)`, 14, yPosition);
  
  if (data.incidents.length > 0) {
    yPosition += 7;
    
    const incidentData = data.incidents.map(incident => {
      const date = new Date(incident.createdAt).toLocaleString();
      const type = incident.type.replace(/_/g, ' ').toUpperCase();
      const location = incident.latitude && incident.longitude
        ? `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`
        : 'N/A';
      const accuracy = incident.accuracy ? `±${Math.round(incident.accuracy)}m` : 'N/A';
      
      return [date, type, location, accuracy];
    });
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Date & Time', 'Type', 'Location', 'Accuracy']],
      body: incidentData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  } else {
    yPosition += 7;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('No incidents recorded in this period', 14, yPosition);
    yPosition += 10;
  }
  
  // Detailed incidents
  if (data.incidents.length > 0) {
    doc.addPage();
    yPosition = 20;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Detailed Incident Reports', 14, yPosition);
    
    data.incidents.forEach((incident, index) => {
      yPosition += 15;
      
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(11);
      doc.setTextColor(34, 197, 94);
      doc.text(`Incident #${index + 1}`, 14, yPosition);
      
      yPosition += 7;
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      const details = [
        `Date: ${new Date(incident.createdAt).toLocaleString()}`,
        `Type: ${incident.type.replace(/_/g, ' ').toUpperCase()}`,
        `Location: ${incident.latitude && incident.longitude 
          ? `${incident.latitude.toFixed(6)}, ${incident.longitude.toFixed(6)}` 
          : 'Not available'}`,
        `Accuracy: ${incident.accuracy ? `±${Math.round(incident.accuracy)} meters` : 'N/A'}`,
        `Address: ${incident.address || 'Not available'}`,
      ];
      
      if (incident.message) {
        details.push(`Message: ${incident.message}`);
      }
      
      if (incident.videoBlob) {
        details.push('Video: Recorded (attached separately)');
      }
      
      if (incident.contactsNotified && incident.contactsNotified.length > 0) {
        details.push(`Contacts Notified: ${incident.contactsNotified.length} contact(s)`);
      }
      
      details.forEach(detail => {
        doc.text(detail, 14, yPosition);
        yPosition += 5;
      });
      
      // Add Google Maps link if location available
      if (incident.latitude && incident.longitude) {
        yPosition += 2;
        doc.setTextColor(34, 197, 94);
        doc.textWithLink('View on Google Maps', 14, yPosition, {
          url: `https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`
        });
        doc.setTextColor(0, 0, 0);
        yPosition += 5;
      }
      
      // Separator line
      yPosition += 3;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPosition, pageWidth - 14, yPosition);
    });
  }
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `SafeGuard Emergency Report - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'This is an official emergency incident report. Keep it confidential.',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    );
  }
  
  // Return as blob
  return doc.output('blob');
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
