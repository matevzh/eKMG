// @ts-ignore - jsPDF types may not match perfectly
import jsPDF from "jspdf";
// @ts-ignore - autoTable types
import autoTable from "jspdf-autotable";

const addHeaderFooter = (doc: any, title: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(20);
  doc.setTextColor(34, 139, 34);
  doc.text(title, pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("KMG Farm Management System", pageWidth / 2, 28, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const date = new Date().toLocaleDateString();
  doc.text(`Generated: ${date}`, 14, pageHeight - 10);
  doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageWidth - 14, pageHeight - 10, { align: "right" });
};

export const generateHealthInspectionReport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "Health Inspection Report");

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Farm Health Status Overview", 14, 45);

  autoTable(doc, {
    startY: 55,
    head: [["Date", "Animal ID", "Animal Name", "Type", "Diagnosis", "Veterinarian"]],
    body: [],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 55;
  doc.setFontSize(12);
  doc.text("Summary", 14, finalY + 15);
  doc.setFontSize(10);
  doc.text("Total Records: 0", 14, finalY + 25);

  doc.save("health-inspection-report.pdf");
};

export const generateMedicineRegisterReport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "Medicine Register");

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Medicine Inventory & Usage Records", 14, 45);

  autoTable(doc, {
    startY: 55,
    head: [["Medicine Name", "Category", "Current Stock", "Minimum Stock", "Status"]],
    body: [],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 55;
  doc.setFontSize(12);
  doc.text("Active Withdrawal Periods", 14, finalY + 15);

  autoTable(doc, {
    startY: finalY + 20,
    head: [["Animal ID", "Medicine", "Start Date", "End Date", "Days Remaining"]],
    body: [],
    theme: "striped",
    headStyles: { fillColor: [220, 38, 38] },
  });

  doc.save("medicine-register.pdf");
};

export const generateMilkProductionReport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "Milk Production Report");

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Monthly Milk Production Analytics", 14, 45);

  autoTable(doc, {
    startY: 55,
    head: [["Date", "Animal ID", "Morning", "Evening", "Total", "Quality"]],
    body: [],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 55;
  doc.setFontSize(12);
  doc.text("Production Statistics", 14, finalY + 15);
  doc.setFontSize(10);
  doc.text("Total Production Today: 0 L", 14, finalY + 25);

  doc.setFontSize(12);
  doc.text("Delivery Schedule", 14, finalY + 40);

  autoTable(doc, {
    startY: finalY + 45,
    head: [["Buyer", "Date", "Volume", "Price/L", "Total"]],
    body: [],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });

  doc.save("milk-production-report.pdf");
};

export const generateSubsidyDocumentationReport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "Subsidy Documentation");

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Land Use & Subsidy Claim Documentation", 14, 45);

  autoTable(doc, {
    startY: 55,
    head: [["GERK ID", "Area", "Type", "Last Fertilization"]],
    body: [],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 55;
  doc.setFontSize(12);
  doc.text("Active Subsidy Claims", 14, finalY + 15);

  autoTable(doc, {
    startY: finalY + 20,
    head: [["Program", "Area", "Amount", "Status", "Deadline"]],
    body: [],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });

  doc.save("subsidy-documentation.pdf");
};

export const exportAnimalListCSV = () => {
  downloadCSV("ID,Name,Breed,Birth Date,Status,Weight\n", "animal-list.csv");
};

export const exportHealthRecordsCSV = () => {
  downloadCSV("Date,Animal ID,Animal Name,Type,Diagnosis,Veterinarian\n", "health-records.csv");
};

export const exportMilkDataCSV = () => {
  downloadCSV("Date,Animal ID,Morning,Evening,Total,Quality\n", "milk-data.csv");
};

export const exportCRGMovementXML = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<CRGMovementReport>
  <ReportMetadata>
    <ReportDate>${new Date().toISOString()}</ReportDate>
  </ReportMetadata>
  <Movements />
</CRGMovementReport>`;

  downloadFile(xml, "crg-movement-report.xml", "application/xml");
};

export const exportARSKTRPSubsidyJSON = () => {
  const data = {
    reportDate: new Date().toISOString(),
    landUnits: [],
    subsidyClaims: [],
  };

  downloadFile(JSON.stringify(data, null, 2), "arsktrp-subsidy-data.json", "application/json");
};

export const generateDairyProcessorReport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "Dairy Processor Report");

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Milk Delivery Documentation", 14, 45);

  autoTable(doc, {
    startY: 55,
    head: [["Date", "Volume", "Fat %", "Protein %", "SCC", "Quality Grade"]],
    body: [],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });

  doc.save("dairy-processor-report.pdf");
};

export const generateGDPRDataExport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "GDPR Data Export");

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Complete Data Export for GDPR Compliance", 14, 45);

  doc.setFontSize(10);
  doc.text("This export contains all personal and farm data stored in the system.", 14, 55);
  doc.text("Export Date: " + new Date().toLocaleDateString(), 14, 62);

  doc.setFontSize(12);
  doc.text("1. Animal Records", 14, 75);
  autoTable(doc, {
    startY: 80,
    head: [["ID", "Name", "Breed", "Birth Date", "Status"]],
    body: [],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });

  const animalY = (doc as any).lastAutoTable.finalY || 80;
  doc.setFontSize(12);
  doc.text("2. Health Records", 14, animalY + 15);
  autoTable(doc, {
    startY: animalY + 20,
    head: [["Date", "Animal", "Type", "Diagnosis"]],
    body: [],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });

  doc.save("gdpr-data-export.pdf");
};

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
