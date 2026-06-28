import { FileDown, FileText, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const reports = [
    {
      id: 1,
      name: t("reports.healthInspection"),
      description: t("reports.healthInspectionDesc"),
      lastGenerated: "2026-02-28",
      type: "PDF",
      generator: generateHealthInspectionReport,
    },
    {
      id: 2,
      name: t("reports.medicineRegister"),
      description: t("reports.medicineRegisterDesc"),
      lastGenerated: "2026-02-27",
      type: "PDF",
      generator: generateMedicineRegisterReport,
    },
    {
      id: 3,
      name: t("reports.crgExport"),
      description: t("reports.crgExportDesc"),
      lastGenerated: "2026-02-26",
      type: "XML",
      generator: exportCRGMovementXML,
    },
    {
      id: 4,
      name: t("reports.milkProduction"),
      description: t("reports.milkProductionDesc"),
      lastGenerated: "2026-02-25",
      type: "PDF",
      generator: generateMilkProductionReport,
    },
    {
      id: 5,
      name: t("reports.gdprExport"),
      description: t("reports.gdprExportDesc"),
      lastGenerated: "2026-02-20",
      type: "PDF",
      generator: generateGDPRDataExport,
    },
    {
      id: 6,
      name: t("reports.subsidyDoc"),
      description: t("reports.subsidyDocDesc"),
      lastGenerated: "2026-02-15",
      type: "PDF",
      generator: generateSubsidyDocumentationReport,
    },
  ];

  const handleGenerateReport = (reportName: string, generator: () => void) => {
    try {
      generator();
      // Update last generated date in a real app
    } catch (error) {
      console.error(`Error generating ${reportName}:`, error);
      alert(`Error generating ${reportName}. Please try again.`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{t("reports.title")}</h2>
        <p className="text-gray-600 mt-1">{t("reports.subtitle")}</p>
      </div>

      {/* Reports Grid */}
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
                      {t("reports.lastGenerated")}: {report.lastGenerated}
                    </span>
                  </div>
                  <button
                    onClick={() => handleGenerateReport(report.name, report.generator)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FileDown className="w-4 h-4" />
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Export Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("reports.quickExports")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportAnimalListCSV}
            className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <FileDown className="w-8 h-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {t("reports.animalListCSV")}
            </span>
          </button>
          <button
            onClick={exportHealthRecordsCSV}
            className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <FileDown className="w-8 h-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {t("reports.healthRecordsCSV")}
            </span>
          </button>
          <button
            onClick={exportMilkDataCSV}
            className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <FileDown className="w-8 h-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {t("reports.milkDataCSV")}
            </span>
          </button>
        </div>
      </div>

      {/* Regulatory Compliance Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          {t("reports.regulatoryCompliance")}
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          {t("reports.regulatoryDesc")}
        </p>
        <div className="space-y-3">
          <button
            onClick={exportCRGMovementXML}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  {t("reports.crgMovement")}
                </div>
                <div className="text-xs text-gray-600">
                  {t("reports.crgMovementDesc")}
                </div>
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
                <div className="font-medium text-gray-900">
                  {t("reports.arsktrpSubsidy")}
                </div>
                <div className="text-xs text-gray-600">
                  {t("reports.arsktrpSubsidyDesc")}
                </div>
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
                <div className="font-medium text-gray-900">
                  {t("reports.dairyProcessor")}
                </div>
                <div className="text-xs text-gray-600">
                  {t("reports.dairyProcessorDesc")}
                </div>
              </div>
            </div>
            <FileDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}