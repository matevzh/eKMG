import { FileDown, FileText, Calendar } from "lucide-react";
import {
  generateHealthInspectionReport,
  generateMedicineRegisterReport,
  generateMilkProductionReport,
  generateSubsidyDocumentationReport,
  generateDairyProcessorReport,
  generateGDPRDataExport,
  exportAnimalListCSV,
  exportHealthRecordsCSV,
  exportMilkDataCSV,
  exportCRGMovementXML,
  exportARSKTRPSubsidyJSON,
} from "../../utils/pdfExports";

export function Reports() {
  const reports = [
    {
      id: 1,
      name: "Zdravstveno inšpekcijsko poročilo",
      description: "Celoviti zdravstveni zapisi in veterinarske inšpekcije",
      lastGenerated: null as string | null,
      type: "PDF",
      generator: generateHealthInspectionReport,
    },
    {
      id: 2,
      name: "Register zdravil",
      description: "Popoln inventar zdravil in zapisi o uporabi",
      lastGenerated: null as string | null,
      type: "PDF",
      generator: generateMedicineRegisterReport,
    },
    {
      id: 3,
      name: "CRG izvoz (XML)",
      description: "Podatki o premiku živali za regulativno skladnost",
      lastGenerated: null as string | null,
      type: "XML",
      generator: exportCRGMovementXML,
    },
    {
      id: 4,
      name: "Poročilo o proizvodnji mleka",
      description: "Mesečna analitika proizvodnje mleka in zapisi dostav",
      lastGenerated: null as string | null,
      type: "PDF",
      generator: generateMilkProductionReport,
    },
    {
      id: 5,
      name: "GDPR izvoz podatkov",
      description: "Popoln izvoz podatkov za skladnost z GDPR",
      lastGenerated: null as string | null,
      type: "PDF",
      generator: generateGDPRDataExport,
    },
    {
      id: 6,
      name: "Dokumentacija subvencij",
      description: "Dokumenti o uporabi zemljišč in zahtevkih za subvencije",
      lastGenerated: null as string | null,
      type: "PDF",
      generator: generateSubsidyDocumentationReport,
    },
  ];

  const handleGenerateReport = (reportName: string, generator: () => void) => {
    try {
      generator();
    } catch (error) {
      console.error(`Error generating ${reportName}:`, error);
      alert(`Napaka pri ustvarjanju poročila ${reportName}. Poskusi znova.`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Poročila in izvozi</h2>
        <p className="text-gray-600 mt-1">Ustvarite inšpekcijska poročila in izvozite podatke</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Zadnji: {report.lastGenerated ?? "—"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleGenerateReport(report.name, report.generator)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FileDown className="w-4 h-4" />
                    Ustvari
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hitri izvozi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportAnimalListCSV}
            className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <FileDown className="w-8 h-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Seznam živali (CSV)</span>
          </button>
          <button
            onClick={exportHealthRecordsCSV}
            className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <FileDown className="w-8 h-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Zdravstveni zapisi (CSV)</span>
          </button>
          <button
            onClick={exportMilkDataCSV}
            className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <FileDown className="w-8 h-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Podatki o mleku (CSV)</span>
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Regulativna skladnost</h3>
        <p className="text-sm text-blue-800 mb-4">
          Izvozite podatke za eksterne sisteme in regulativno poročanje
        </p>
        <div className="space-y-3">
          <button
            onClick={exportCRGMovementXML}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">CRG poročilo o premikih</div>
                <div className="text-xs text-gray-600">Izvoz za UVHVVR (CRG) sistem</div>
              </div>
            </div>
            <FileDown className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={exportARSKTRPSubsidyJSON}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">ARSKTRP podatki o subvencijah</div>
                <div className="text-xs text-gray-600">Izvoz za zahtevke subvencij</div>
              </div>
            </div>
            <FileDown className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={generateDairyProcessorReport}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Poročilo mlekarne</div>
                <div className="text-xs text-gray-600">Dokumentacija dostave mleka</div>
              </div>
            </div>
            <FileDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
