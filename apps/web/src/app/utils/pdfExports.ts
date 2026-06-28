// @ts-ignore - jsPDF types may not match perfectly
import jsPDF from "jspdf";
// @ts-ignore - autoTable types
import autoTable from "jspdf-autotable";

// Mock data for demonstrations
const getMockAnimals = () => [
  { id: "A1234", name: "Bella", breed: "Holstein", birthDate: "2020-03-15", status: "Healthy", weight: "650 kg" },
  { id: "A1235", name: "Daisy", breed: "Jersey", birthDate: "2019-06-22", status: "Healthy", weight: "580 kg" },
  { id: "A1236", name: "Luna", breed: "Brown Swiss", birthDate: "2021-01-10", status: "Healthy", weight: "620 kg" },
  { id: "A1237", name: "Rosie", breed: "Holstein", birthDate: "2018-08-30", status: "Pregnant", weight: "680 kg" },
];

const getMockHealthRecords = () => [
  { date: "2026-02-27", animalId: "A1234", animalName: "Bella", type: "Checkup", diagnosis: "Healthy", vet: "Dr. Smith" },
  { date: "2026-02-25", animalId: "A1235", animalName: "Daisy", type: "Treatment", diagnosis: "Minor infection", vet: "Dr. Johnson" },
  { date: "2026-02-20", animalId: "A1236", animalName: "Luna", type: "Vaccination", diagnosis: "Annual vaccination", vet: "Dr. Smith" },
];

const getMockMedicines = () => [
  { name: "Penicillin", category: "Antibiotic", stock: "150 units", minStock: "100 units", status: "In Stock" },
  { name: "Meloxicam", category: "Anti-inflammatory", stock: "75 units", minStock: "50 units", status: "In Stock" },
  { name: "Ivermectin", category: "Antiparasitic", stock: "30 units", minStock: "40 units", status: "Low Stock" },
];

const getMockMilkRecords = () => [
  { date: "2026-02-28", animalId: "A1234", morning: "28 L", evening: "26 L", total: "54 L", quality: "A" },
  { date: "2026-02-28", animalId: "A1235", morning: "22 L", evening: "20 L", total: "42 L", quality: "A" },
  { date: "2026-02-28", animalId: "A1236", morning: "25 L", evening: "24 L", total: "49 L", quality: "A" },
];

const getMockLandUnits = () => [
  { gerkId: "GERK-1235", area: "5.2 ha", type: "Pasture", lastFertilization: "2025-10-15" },
  { gerkId: "GERK-1236", area: "3.8 ha", type: "Hay Field", lastFertilization: "2025-09-20" },
  { gerkId: "GERK-1237", area: "2.5 ha", type: "Crop Land", lastFertilization: "2025-11-05" },
];

// Helper function to add header and footer
const addHeaderFooter = (doc: any, title: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(34, 139, 34); // Green color
  doc.text(title, pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("KMG Farm Management System", pageWidth / 2, 28, { align: "center" });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const date = new Date().toLocaleDateString();
  doc.text(`Generated: ${date}`, 14, pageHeight - 10);
  doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageWidth - 14, pageHeight - 10, { align: "right" });
};

// Health Inspection Report
export const generateHealthInspectionReport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "Health Inspection Report");
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Farm Health Status Overview", 14, 45);
  
  const healthRecords = getMockHealthRecords();
  
  autoTable(doc, {
    startY: 55,
    head: [["Date", "Animal ID", "Animal Name", "Type", "Diagnosis", "Veterinarian"]],
    body: healthRecords.map(record => [
      record.date,
      record.animalId,
      record.animalName,
      record.type,
      record.diagnosis,
      record.vet
    ]),
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  // Add summary section
  const finalY = (doc as any).lastAutoTable.finalY || 55;
  doc.setFontSize(12);
  doc.text("Summary", 14, finalY + 15);
  doc.setFontSize(10);
  doc.text(`Total Records: ${healthRecords.length}`, 14, finalY + 25);
  doc.text(`Report Period: Last 30 days`, 14, finalY + 32);
  doc.text(`Next Inspection Due: March 15, 2026`, 14, finalY + 39);
  
  doc.save("health-inspection-report.pdf");
};

// Medicine Register Report
export const generateMedicineRegisterReport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "Medicine Register");
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Medicine Inventory & Usage Records", 14, 45);
  
  const medicines = getMockMedicines();
  
  autoTable(doc, {
    startY: 55,
    head: [["Medicine Name", "Category", "Current Stock", "Minimum Stock", "Status"]],
    body: medicines.map(medicine => [
      medicine.name,
      medicine.category,
      medicine.stock,
      medicine.minStock,
      medicine.status
    ]),
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
    didParseCell: (data: any) => {
      if (data.cell.text[0] === "Low Stock") {
        data.cell.styles.textColor = [220, 38, 38]; // Red text for low stock
      }
    }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY || 55;
  
  // Add withdrawal periods section
  doc.setFontSize(12);
  doc.text("Active Withdrawal Periods", 14, finalY + 15);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [["Animal ID", "Medicine", "Start Date", "End Date", "Days Remaining"]],
    body: [
      ["A1234", "Penicillin", "2026-02-20", "2026-03-07", "6"],
      ["A1235", "Meloxicam", "2026-02-27", "2026-03-04", "3"],
    ],
    theme: "striped",
    headStyles: { fillColor: [220, 38, 38] },
  });
  
  doc.save("medicine-register.pdf");
};

// Milk Production Report
export const generateMilkProductionReport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "Milk Production Report");
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Monthly Milk Production Analytics", 14, 45);
  
  const milkRecords = getMockMilkRecords();
  
  autoTable(doc, {
    startY: 55,
    head: [["Date", "Animal ID", "Morning", "Evening", "Total", "Quality"]],
    body: milkRecords.map(record => [
      record.date,
      record.animalId,
      record.morning,
      record.evening,
      record.total,
      record.quality
    ]),
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  const finalY = (doc as any).lastAutoTable.finalY || 55;
  
  // Add statistics
  doc.setFontSize(12);
  doc.text("Production Statistics", 14, finalY + 15);
  doc.setFontSize(10);
  doc.text(`Total Production Today: 145 L`, 14, finalY + 25);
  doc.text(`Average per Animal: 48.3 L/day`, 14, finalY + 32);
  doc.text(`Monthly Average: 4,350 L`, 14, finalY + 39);
  doc.text(`Quality Grade: A`, 14, finalY + 46);
  
  // Add delivery schedule
  doc.setFontSize(12);
  doc.text("Delivery Schedule", 14, finalY + 60);
  
  autoTable(doc, {
    startY: finalY + 65,
    head: [["Buyer", "Date", "Volume", "Price/L", "Total"]],
    body: [
      ["Alpine Dairy Co.", "2026-03-02", "800 L", "€0.45", "€360.00"],
      ["Alpine Dairy Co.", "2026-03-06", "850 L", "€0.45", "€382.50"],
    ],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  doc.save("milk-production-report.pdf");
};

// Subsidy Documentation Report
export const generateSubsidyDocumentationReport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "Subsidy Documentation");
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Land Use & Subsidy Claim Documentation", 14, 45);
  
  const landUnits = getMockLandUnits();
  
  autoTable(doc, {
    startY: 55,
    head: [["GERK ID", "Area", "Type", "Last Fertilization"]],
    body: landUnits.map(unit => [
      unit.gerkId,
      unit.area,
      unit.type,
      unit.lastFertilization
    ]),
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  const finalY = (doc as any).lastAutoTable.finalY || 55;
  
  // Add subsidy claims
  doc.setFontSize(12);
  doc.text("Active Subsidy Claims", 14, finalY + 15);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [["Program", "Area", "Amount", "Status", "Deadline"]],
    body: [
      ["Direct Payments 2026", "11.5 ha", "€3,450.00", "Pending", "2026-03-31"],
      ["Agri-Environment", "5.2 ha", "€1,560.00", "Approved", "N/A"],
      ["Greening Premium", "11.5 ha", "€2,300.00", "Pending", "2026-03-31"],
    ],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  const claimFinalY = (doc as any).lastAutoTable.finalY || 55;
  doc.setFontSize(10);
  doc.text(`Total Land Area: 11.5 ha`, 14, claimFinalY + 15);
  doc.text(`Total Expected Subsidies: €7,310.00`, 14, claimFinalY + 22);
  
  doc.save("subsidy-documentation.pdf");
};

// CSV Export Functions
export const exportAnimalListCSV = () => {
  const animals = getMockAnimals();
  const headers = ["ID", "Name", "Breed", "Birth Date", "Status", "Weight"];
  
  let csv = headers.join(",") + "\n";
  animals.forEach(animal => {
    csv += `${animal.id},${animal.name},${animal.breed},${animal.birthDate},${animal.status},${animal.weight}\n`;
  });
  
  downloadCSV(csv, "animal-list.csv");
};

export const exportHealthRecordsCSV = () => {
  const records = getMockHealthRecords();
  const headers = ["Date", "Animal ID", "Animal Name", "Type", "Diagnosis", "Veterinarian"];
  
  let csv = headers.join(",") + "\n";
  records.forEach(record => {
    csv += `${record.date},${record.animalId},${record.animalName},${record.type},"${record.diagnosis}",${record.vet}\n`;
  });
  
  downloadCSV(csv, "health-records.csv");
};

export const exportMilkDataCSV = () => {
  const records = getMockMilkRecords();
  const headers = ["Date", "Animal ID", "Morning", "Evening", "Total", "Quality"];
  
  let csv = headers.join(",") + "\n";
  records.forEach(record => {
    csv += `${record.date},${record.animalId},${record.morning},${record.evening},${record.total},${record.quality}\n`;
  });
  
  downloadCSV(csv, "milk-data.csv");
};

// XML Export for CRG
export const exportCRGMovementXML = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<CRGMovementReport>
  <ReportMetadata>
    <FarmID>SI-123456</FarmID>
    <ReportDate>${new Date().toISOString()}</ReportDate>
    <ReportPeriod>
      <StartDate>2026-02-01</StartDate>
      <EndDate>2026-02-28</EndDate>
    </ReportPeriod>
  </ReportMetadata>
  <Movements>
    <Movement>
      <AnimalID>A1234</AnimalID>
      <EarTag>SI-123456-A1234</EarTag>
      <Date>2026-02-10</Date>
      <FromLocation>Barn B - Stall 5</FromLocation>
      <ToLocation>Barn A - Stall 12</ToLocation>
      <Reason>Group reorganization</Reason>
    </Movement>
    <Movement>
      <AnimalID>A1235</AnimalID>
      <EarTag>SI-123456-A1235</EarTag>
      <Date>2026-02-15</Date>
      <FromLocation>Pasture 2</FromLocation>
      <ToLocation>Barn A - Stall 13</ToLocation>
      <Reason>Weather conditions</Reason>
    </Movement>
  </Movements>
</CRGMovementReport>`;
  
  downloadFile(xml, "crg-movement-report.xml", "application/xml");
};

// JSON Export for ARSKTRP Subsidy Data
export const exportARSKTRPSubsidyJSON = () => {
  const data = {
    farmId: "SI-123456",
    reportDate: new Date().toISOString(),
    landUnits: getMockLandUnits().map(unit => ({
      gerkId: unit.gerkId,
      area: parseFloat(unit.area),
      type: unit.type,
      lastFertilization: unit.lastFertilization
    })),
    subsidyClaims: [
      {
        program: "DirectPayments2026",
        area: 11.5,
        amount: 3450.00,
        status: "Pending",
        deadline: "2026-03-31"
      },
      {
        program: "AgriEnvironment",
        area: 5.2,
        amount: 1560.00,
        status: "Approved",
        deadline: null
      }
    ]
  };
  
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, "arsktrp-subsidy-data.json", "application/json");
};

// Dairy Processor Report
export const generateDairyProcessorReport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "Dairy Processor Report");
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Milk Delivery Documentation", 14, 45);
  
  doc.setFontSize(10);
  doc.text("Farm: KMG Farm (SI-123456)", 14, 55);
  doc.text("Period: February 2026", 14, 62);
  
  autoTable(doc, {
    startY: 70,
    head: [["Date", "Volume", "Fat %", "Protein %", "SCC", "Quality Grade"]],
    body: [
      ["2026-02-02", "800 L", "3.8%", "3.2%", "185,000", "A"],
      ["2026-02-06", "850 L", "3.9%", "3.3%", "170,000", "A"],
      ["2026-02-10", "825 L", "3.7%", "3.2%", "190,000", "A"],
      ["2026-02-14", "840 L", "3.8%", "3.3%", "175,000", "A"],
    ],
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  const finalY = (doc as any).lastAutoTable.finalY || 70;
  
  doc.setFontSize(12);
  doc.text("Summary", 14, finalY + 15);
  doc.setFontSize(10);
  doc.text(`Total Volume: 3,315 L`, 14, finalY + 25);
  doc.text(`Average Fat: 3.8%`, 14, finalY + 32);
  doc.text(`Average Protein: 3.25%`, 14, finalY + 39);
  doc.text(`Average SCC: 180,000`, 14, finalY + 46);
  doc.text(`Consistent Quality Grade: A`, 14, finalY + 53);
  
  doc.save("dairy-processor-report.pdf");
};

// GDPR Data Export (Create a comprehensive ZIP-like text file)
export const generateGDPRDataExport = () => {
  const doc = new jsPDF();
  addHeaderFooter(doc, "GDPR Data Export");
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Complete Data Export for GDPR Compliance", 14, 45);
  
  doc.setFontSize(10);
  doc.text("This export contains all personal and farm data stored in the system.", 14, 55);
  doc.text("Export Date: " + new Date().toLocaleDateString(), 14, 62);
  
  // Animals
  doc.setFontSize(12);
  doc.text("1. Animal Records", 14, 75);
  const animals = getMockAnimals();
  autoTable(doc, {
    startY: 80,
    head: [["ID", "Name", "Breed", "Birth Date", "Status"]],
    body: animals.map(a => [a.id, a.name, a.breed, a.birthDate, a.status]),
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  const animalY = (doc as any).lastAutoTable.finalY || 80;
  
  // Health Records
  doc.setFontSize(12);
  doc.text("2. Health Records", 14, animalY + 15);
  const healthRecords = getMockHealthRecords();
  autoTable(doc, {
    startY: animalY + 20,
    head: [["Date", "Animal", "Type", "Diagnosis"]],
    body: healthRecords.map(r => [r.date, r.animalName, r.type, r.diagnosis]),
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  const healthY = (doc as any).lastAutoTable.finalY || animalY + 20;
  
  doc.setFontSize(10);
  doc.text("For complete data including images and attachments,", 14, healthY + 15);
  doc.text("please contact the system administrator.", 14, healthY + 22);
  
  doc.save("gdpr-data-export.pdf");
};

// Helper functions
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
