import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Seo from "@/components/ui/Seo";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePricingCalculator } from "@/hooks/usePricingCalculator";
import advicelabLogo from "@/assets/advicelab-logo.webp";
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Users,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  HandCoins,
  TrendingUp,
  Umbrella,
  Building2,
  HeartHandshake,
  FileText,
  Send,
  Mail,
  Lock,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

// ─── Constants ─────────────────────────────────────────────────────────────────
const API_BASE_URL =
  "https://oxch4uog7g.execute-api.ap-southeast-2.amazonaws.com/prod";

const STRATEGIES = {
  superannuation: {
    label: "Superannuation",
    items: [
      "Make a Non-Concessional Contribution",
      "Make a Concessional Contribution",
      "Establish/Continue Salary Sacrifice contribution",
      "Make a spouse contribution",
      "Cashout and recontribute",
      "Government co contribution",
      "Downsizer contribution",
      "First Home Super Saver Scheme",
      "Withdrawal from super",
      "Rollover Super",
      "Retain super",
      "Switch and rebalance super",
      "Establish super",
    ],
  },
  investment: {
    label: "Investment",
    items: [
      "Rollover Investment portfolio",
      "Withdraw from Investment portfolio",
      "Retain investment portfolio",
      "Rebalance investment",
      "Establish investment portfolio",
      "Establish an investment loan (i.e. gearing)",
      "Establish Family Trust",
      "Purchase an investment bond",
      "Retain Investment bond",
      "Invest through the Managed Portfolio Service",
      "Purchase Funeral bond",
    ],
  },
  retirementPlanning: {
    label: "Retirement Planning",
    items: [
      "Withdraw from pension",
      "Retain pension product",
      "Rebalance pension",
      "Commence ABP",
      "Purchase annuity (with super/non super money)",
      "Convert TTR pension to an ABP",
    ],
  },
  insurance: {
    label: "Insurance",
    items: [
      "Apply for Life with Linked TPD Insurance",
      "Apply for Income Protection and Trauma insurance",
      "Adjust the existing personal insurance cover (Increase or Decrease cover)",
      "Maintain personal insurance strategy",
    ],
  },
  smsf: {
    label: "Setting up an SMSF",
    items: [
      "Setting up an SMSF",
      "Establish a limited recourse borrowing arrangement within your SMSF",
      "Investment of funds for your SMSF",
      "Commence an ABP for SMSF",
      "Wind up SMSF",
      "Retain SMSF",
      "Review SMSF trust deed",
    ],
  },
  agedCare: {
    label: "Aged Care",
    items: ["Aged care services & accommodation"],
  },
};

const CATEGORY_ICONS = {
  superannuation: HandCoins,
  investment: TrendingUp,
  retirementPlanning: Users,
  insurance: Umbrella,
  smsf: Building2,
  agedCare: HeartHandshake,
};

const CATEGORY_COLORS = {
  superannuation: {
    bg: "hsl(var(--primary)/10%)",
    accent: "hsl(var(--primary))",
    light: "hsl(var(--primary)/20%)",
  },
  investment: {
    bg: "hsl(var(--primary)/10%)",
    accent: "hsl(var(--primary))",
    light: "hsl(var(--primary)/20%)",
  },
  retirementPlanning: {
    bg: "hsl(var(--primary)/10%)",
    accent: "hsl(var(--primary))",
    light: "hsl(var(--primary)/20%)",
  },
  insurance: {
    bg: "hsl(var(--primary)/10%)",
    accent: "hsl(var(--primary))",
    light: "hsl(var(--primary)/20%)",
  },
  smsf: {
    bg: "hsl(var(--primary)/10%)",
    accent: "hsl(var(--primary))",
    light: "hsl(var(--primary)/20%)",
  },
  agedCare: {
    bg: "hsl(var(--primary)/10%)",
    accent: "hsl(var(--primary))",
    light: "hsl(var(--primary)/20%)",
  },
};

const CUSTOM_TOOLS = ["XTOOLS", "Wealthsolver"];

const SOA_TIERS = [
  { max: 1, name: "Simple SoA", regular: 275, urgent: 412 },
  { max: 3, name: "Standard SoA", regular: 385, urgent: 577 },
  { max: 6, name: "Comprehensive SoA", regular: 550, urgent: 825 },
  { max: Infinity, name: "Complex Comprehensive", regular: 720, urgent: 1080 },
];

const ROA_TIERS = [
  { max: 2, name: "RoA", regular: 120, urgent: 180 },
  { max: Infinity, name: "RoA Extended", regular: 150, urgent: 225 },
];

function getPrice(adviceType: string, strategyCount: number, urgent: boolean) {
  if (strategyCount === 0) return null;
  const tiers = adviceType === "SOA" ? SOA_TIERS : ROA_TIERS;
  const tier =
    tiers.find((t) => strategyCount <= t.max) || tiers[tiers.length - 1];
  return { tier, price: urgent ? tier.urgent : tier.regular };
}

// ─── Quote HTML Generator ──────────────────────────────────────────────────────
function generateQuoteHTML({
  adviceType,
  urgency,
  strategyCount,
  calculated,
  checked,
  customTools,
  logoBase64,
  recipientEmail,
  companyName,
  quoteNumber,
}: {
  adviceType: string;
  urgency: string;
  strategyCount: number;
  calculated: { tier: { name: string }; price: number } | null;
  checked: Record<string, boolean>;
  customTools: Record<string, boolean>;
  logoBase64: string;
  recipientEmail: string;
  companyName: string;
  quoteNumber: string;
}) {
  const today = new Date();
  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const expiry = new Date(today);
  expiry.setDate(expiry.getDate() + 14);

  const categoryLabels: Record<string, string> = {
    superannuation: "Superannuation",
    investment: "Investment",
    retirementPlanning: "Retirement Planning",
    insurance: "Insurance",
    smsf: "SMSF",
    agedCare: "Aged Care",
  };
  const categoryOrder = [
    "superannuation",
    "investment",
    "retirementPlanning",
    "insurance",
    "smsf",
    "agedCare",
  ];

  const groupedSelected: Record<string, string[]> = {};
  Object.entries(checked)
    .filter(([, v]) => v)
    .forEach(([key]) => {
      const [groupKey, ...rest] = key.split("__");
      if (!groupedSelected[groupKey]) groupedSelected[groupKey] = [];
      groupedSelected[groupKey].push(rest.join("__"));
    });

  const selectedCustomTools = Object.entries(customTools)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const basePrice = calculated?.price ?? 0;

  const categoryRowsHTML = categoryOrder
    .filter((gk) => groupedSelected[gk]?.length)
    .map((gk) => {
      const items = groupedSelected[gk];
      return `
    <tr>
      <td class="td-name">${categoryLabels[gk]}</td>
      <td class="td-detail">${items.join(", ")}</td>
    </tr>`;
    })
    .join("");

  const customRowHTML =
    selectedCustomTools.length > 0
      ? `<tr>
      <td class="td-name">Custom Tools</td>
      <td class="td-detail">${selectedCustomTools.join(", ")}</td>
    </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quotation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --text: #1a1a1a; --muted: #6b7280; --border: #d1d5db; --border-light: #e5e7eb; --bg: #f3f4f6; --white: #ffffff; }
    body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); font-size: 13px; }
    .toolbar { background: var(--white); border-bottom: 1px solid var(--border-light); padding: 10px 40px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
    .toolbar-left { font-size: 13px; color: var(--muted); }
    .toolbar-left strong { color: var(--text); }
    .toolbar-actions { display: flex; gap: 8px; align-items: center; }
    .tbtn { padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border); background: var(--white); color: var(--text); transition: all .12s; display: inline-flex; align-items: center; gap: 6px; }
    .tbtn:hover { background: var(--bg); }
    .tbtn-primary { background: #1a2e5a; color: white; border-color: #1a2e5a; }
    .tbtn-primary:hover { background: #2b4a8a; }
    .tbtn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .doc-wrap { max-width: 820px; margin: 36px auto; padding-bottom: 80px; }
    #pdf-content { background: var(--white); border: 1px solid var(--border-light); box-shadow: 0 2px 12px rgba(0,0,0,.07); padding: 52px 60px 60px; }
    .doc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
    .doc-header-right { display: flex; flex-direction: column; align-items: flex-end; }
    .doc-title { font-size: 28px; font-weight: 700; letter-spacing: -.5px; color: var(--text); margin-bottom: 18px; }
    .doc-meta-table { border-collapse: collapse; }
    .doc-meta-table td { font-size: 12px; padding: 2.5px 0; vertical-align: top; }
    .doc-meta-table td:first-child { color: var(--muted); width: 110px; }
    .doc-meta-table td:last-child { font-weight: 500; color: var(--text); }
    .logo-img { height: 56px; max-width: 180px; object-fit: contain; flex-shrink: 0; margin-bottom: 16px; }
    hr { border: none; border-top: 1px solid var(--border-light); margin: 24px 0; }
    .address-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 28px; }
    .address-block h3 { font-size: 11px; font-weight: 700; color: var(--text); margin-bottom: 8px; text-transform: uppercase; letter-spacing: .6px; }
    .address-block p { font-size: 12.5px; color: var(--muted); line-height: 1.9; }
    .address-block p strong { color: var(--text); font-weight: 600; }
    .amount-hero { margin-bottom: 28px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .amount-hero-text { font-size: 20px; font-weight: 700; color: var(--text); }
    .fast-track-badge { background: #fff3e0; color: #b45309; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
    table.items { width: 100%; border-collapse: collapse; }
    table.items thead tr { border-bottom: 1.5px solid var(--text); }
    table.items thead th { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; padding: 6px 0 8px; text-align: left; }
    table.items tbody tr { border-bottom: 1px solid var(--border-light); }
    table.items tbody tr:last-child { border-bottom: none; }
    td.td-name { padding: 12px 0; font-weight: 600; font-size: 13px; color: var(--text); width: 200px; vertical-align: top; }
    td.td-detail { padding: 12px 0 12px 16px; font-size: 12px; color: var(--muted); line-height: 1.6; vertical-align: top; }
    .totals-wrap { display: flex; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-light); }
    .totals-table { border-collapse: collapse; min-width: 240px; }
    .totals-table td { font-size: 14px; padding: 3px 0; }
    .totals-table td:first-child { color: var(--muted); padding-right: 48px; }
    .totals-table td:last-child { text-align: right; font-weight: 500; }
    .totals-table tr.total-row td { font-weight: 700; font-size: 15px; color: var(--text); padding-top: 12px; border-top: 1.5px solid var(--text); }
    .doc-footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-light); font-size: 11px; color: var(--muted); line-height: 1.7; display: flex; justify-content: space-between; align-items: flex-end; }
  </style>
  <script>
    function downloadPDF() {
      var btn = document.getElementById('dl-btn');
      btn.disabled = true;
      btn.textContent = 'Generating…';
      var element = document.getElementById('pdf-content');
      var opt = {
        margin: [10, 10, 10, 10],
        filename: 'AdviceLab-Quote.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save().then(function() {
        btn.disabled = false;
        btn.textContent = '⬇ Download PDF';
      });
    }
  </script>
</head>
<body>
<div class="toolbar">
  <div class="toolbar-actions">
    <button id="dl-btn" class="tbtn tbtn-primary" onclick="downloadPDF()">⬇ Download PDF</button>
    <button class="tbtn" onclick="window.close()">✕ Close</button>
  </div>
</div>
<div class="doc-wrap">
  <div id="pdf-content">
    <div class="doc-header">
      <div>
        <div class="doc-title">Quotation</div>
        <table class="doc-meta-table">
          <tr><td>Quote Date</td><td>${fmtDate(today)}</td></tr>
          <tr><td>Expiry Date</td><td>${fmtDate(expiry)}</td></tr>
          <tr><td>Turnaround</td><td>${urgency}${urgency === "Fast Track" ? " ⚡" : ""}</td></tr>
        </table>
      </div>
      <div class="doc-header-right">
        <img src="${logoBase64}" class="logo-img" alt="Advice Lab" />
      </div>
    </div>
    <hr />
    <div class="address-row">
      <div class="address-block">
        <h3>Advice Lab</h3>
        <p>Financial Advice Services<br/>Australia<br/>hello@advicelab.com.au</p>
      </div>
      <div class="address-block">
        <h3>Quotation For</h3>
        <p>
          ${companyName ? `<strong>${companyName}</strong><br/>` : ""}
          ${recipientEmail || "Client Email Not Provided"}<br/>
        </p>
      </div>
      <div class="address-block">
        <h3>Statement of Advice</h3>
        <p>
          <strong>${adviceType === "SOA" ? "Statement of Advice" : "Record of Advice"}</strong><br/>
          ${strategyCount} strateg${strategyCount === 1 ? "y" : "ies"} selected<br/>
          Tier: ${calculated?.tier?.name ?? "—"}
        </p>
      </div>
    </div>
    <div class="amount-hero">
      <div class="amount-hero-text">AUD ${basePrice.toLocaleString()} (exc. GST)</div>
      ${urgency === "Fast Track" ? `<span class="fast-track-badge">⚡ Fast Track surcharge applied</span>` : ""}
    </div>
    <table class="items">
      <thead><tr><th>Category</th><th>Strategies</th></tr></thead>
      <tbody>${categoryRowsHTML}${customRowHTML}</tbody>
    </table>
    <div class="totals-wrap">
      <table class="totals-table">
        <tr class="total-row">
          <td>Total (exc. GST)</td>
          <td>AUD ${basePrice.toLocaleString()}</td>
        </tr>
      </table>
    </div>
    <div class="doc-footer">
      <div>
        This quote is valid until <strong>${fmtDate(expiry)}</strong>. Prices are in AUD and exclude GST.
        ${urgency === "Fast Track" ? "Fast Track applies a 1.5&times; surcharge. " : ""}
        Enquiries: <strong>hello@advicelab.com.au</strong>
      </div>
      <div>Page 1 of 1</div>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ─── Helper: render quote HTML → PDF blob → base64 (via hidden iframe) ────────
async function htmlToPdfBase64(html: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.cssText =
      "position:fixed;left:-9999px;top:-9999px;width:900px;height:1200px;visibility:hidden;";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      reject(new Error("Could not access iframe document"));
      return;
    }

    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = iframe.contentWindow as any;
    const maxWait = 15000;
    const started = Date.now();

    const poll = setInterval(async () => {
      if (Date.now() - started > maxWait) {
        clearInterval(poll);
        document.body.removeChild(iframe);
        reject(new Error("Timed out waiting for html2pdf to load in iframe"));
        return;
      }

      if (typeof win?.html2pdf !== "function") return;
      clearInterval(poll);

      try {
        const element = iframeDoc.getElementById("pdf-content");
        if (!element) {
          document.body.removeChild(iframe);
          reject(new Error("#pdf-content not found inside iframe"));
          return;
        }

        const opt = {
          margin: 10,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        // outputPdf("blob") gives us the raw PDF as a Blob
        const pdfBlob: Blob = await win
          .html2pdf()
          .set(opt)
          .from(element)
          .outputPdf("blob");

        const reader = new FileReader();
        reader.onloadend = () => {
          document.body.removeChild(iframe);
          // strip the "data:application/pdf;base64," prefix
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.onerror = () => {
          document.body.removeChild(iframe);
          reject(new Error("FileReader failed converting PDF blob to base64"));
        };
        reader.readAsDataURL(pdfBlob);
      } catch (err) {
        document.body.removeChild(iframe);
        reject(err);
      }
    }, 300);
  });
}

// ─── Category Card ─────────────────────────────────────────────────────────────
function CategoryCard({
  groupKey,
  group,
  checked,
  onToggle,
}: {
  groupKey: string;
  group: { label: string; items: string[] };
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const Icon = CATEGORY_ICONS[groupKey];
  const colors = CATEGORY_COLORS[groupKey];
  const selectedCount = group.items.filter(
    (item) => checked[`${groupKey}__${item}`],
  ).length;
  const progress = (selectedCount / group.items.length) * 100;

  return (
    <div
      style={{
        borderColor: selectedCount > 0 ? colors.accent : "hsl(var(--border))",
      }}
      className="rounded-xl border-2 bg-white overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
        style={{ background: selectedCount > 0 ? colors.bg : "#FAFAFA" }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: colors.light }}
          >
            <Icon
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: colors.accent }}
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm">
              {group.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedCount > 0
                ? `${selectedCount} / ${group.items.length} selected`
                : `${group.items.length} strategies`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {selectedCount > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: colors.accent }}
            >
              {selectedCount}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {selectedCount > 0 && (
        <div className="h-1 w-full bg-border">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${progress}%`, background: colors.accent }}
          />
        </div>
      )}

      {expanded && (
        <div className="p-2 sm:p-3 space-y-0.5">
          {group.items.map((item) => {
            const key = `${groupKey}__${item}`;
            const isChecked = !!checked[key];
            return (
              <label
                key={key}
                className="flex items-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary/30 group transition-colors active:opacity-75"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle(key);
                }}
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    id={key}
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="sr-only"
                    tabIndex={-1}
                  />
                  <div
                    className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 pointer-events-none"
                    style={
                      isChecked
                        ? {
                            background: colors.accent,
                            borderColor: colors.accent,
                          }
                        : {
                            background: "white",
                            borderColor: "hsl(var(--border))",
                          }
                    }
                  >
                    {isChecked && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span
                  className="text-xs sm:text-sm leading-relaxed transition-colors flex-1 select-none"
                  style={{
                    color: isChecked ? colors.accent : "hsl(var(--foreground))",
                  }}
                >
                  {item}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PricingCalculator() {
  // Get form submission status from React context (temporary state - clears on refresh)
  const { isFormSubmitted } = usePricingCalculator();

  const { toast } = useToast();
  const [adviceType, setAdviceType] = useState("SOA");
  const [urgency, setUrgency] = useState("Standard");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [customTools, setCustomTools] = useState<Record<string, boolean>>({});
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");

  // Action states
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSendLoading, setIsSendLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Get form submission status and navigation
  const { open: openPopup } = usePricingCalculator();
  const navigate = useNavigate();

  // Check if session is valid (has email in localStorage)
  const [isSessionValid, setIsSessionValid] = useState(false);

  useEffect(() => {
    // Read from localStorage for email/company (persists but we use React state for form submission)
    try {
      const storedEmail = localStorage.getItem("pricingCalculatorEmail");
      const storedCompany = localStorage.getItem("pricingCalculatorCompany");
      const storedFirstName = localStorage.getItem(
        "pricingCalculatorFirstName",
      );

      if (storedEmail) {
        setRecipientEmail(storedEmail);
        setIsSessionValid(true);
      }
      if (storedCompany) setCompanyName(storedCompany);
      if (storedFirstName) {
        setFirstName(storedFirstName);
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle form fill button click
  const handleFillForm = () => {
    openPopup();
    navigate("/");
  };

  // Calculate memoized values - these hooks must be called unconditionally
  const strategyCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked],
  );

  const calculated = useMemo(() => {
    if (strategyCount === 0) return null;
    return getPrice(adviceType, strategyCount, urgency === "Fast Track");
  }, [adviceType, strategyCount, urgency]);

  // Gate UI: Show message if user accessed page without filling form
  // Use conditional rendering instead of early return to satisfy React hooks rules
  if (!isFormSubmitted) {
    return (
      <Layout>
        <Seo
          title="Pricing Calculator - Advice Lab"
          description="Transparent pricing for Statements or Records of Advice—select strategies and see live costs. Fast-track options and strategy-based fees."
          keywords="pricing calculator, soa pricing, roa pricing, advice costs, financial advice calculator, paraplanning costs, statement of advice pricing, record of advice pricing"
          pathname="/resources/pricing-calculator"
          schemaData={{
            "@type": "WebApplication",
            name: "Advice Lab Pricing Calculator",
            description:
              "Calculate transparent, strategy-based pricing for Statements or Records of Advice with live updates.",
            url: "https://advicelab.com.au/resources/pricing-calculator",
            applicationCategory: "BusinessApplication",
            offers: {
              "@type": "AggregateOffer",
              availability: "https://schema.org/InStock",
              priceCurrency: "AUD",
              description:
                "Strategy-based pricing for financial advice statements",
            },
          }}
        />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="max-w-md mx-auto px-4 py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Form Required
            </h1>
            <p className="text-muted-foreground mb-8">
              Please complete the registration form to access the Pricing
              Calculator. This helps us provide you with accurate pricing
              tailored to your needs.
            </p>
            <Button
              onClick={handleFillForm}
              className="gradient-primary text-primary-foreground font-semibold px-8 py-6 text-lg"
            >
              Fill Registration Form
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // All hooks must be called - move useMemo before the conditional check
  // Actually, the issue is the useMemo is defined after this block but used after
  // Since we need all hooks to be called, let's restructure to compute memo values only when form is submitted

  const toggleStrategy = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleTool = (key: string) =>
    setCustomTools((prev) => ({ ...prev, [key]: !prev[key] }));
  const clearAll = () => setChecked({});

  // ── Shared: build logo + HTML with a stable quote number ──────────────────
  const buildQuoteAssets = async () => {
    const quoteNumber = `AL-${Date.now().toString().slice(-6)}`;

    let logoBase64 = "";
    try {
      const res = await fetch(advicelabLogo);
      const blob = await res.blob();
      logoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      // silently continue without logo
    }

    const html = generateQuoteHTML({
      adviceType,
      urgency,
      strategyCount,
      calculated,
      checked,
      customTools,
      logoBase64,
      recipientEmail,
      companyName,
      quoteNumber,
    });

    return { html, quoteNumber };
  };

  // ── Preview: open the HTML quote in a new browser tab ────────────────────
  const handlePreviewQuote = async () => {
    if (!calculated) {
      toast({
        title: "No quote yet",
        description: "Please select at least one strategy first.",
        variant: "destructive",
      });
      return;
    }
    setIsPreviewLoading(true);
    try {
      const { html } = await buildQuoteAssets();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const newTab = window.open(url, "_blank");
      if (newTab) {
        newTab.addEventListener("load", () =>
          setTimeout(() => URL.revokeObjectURL(url), 1000),
        );
      }
    } catch {
      toast({
        title: "Preview failed",
        description: "Could not generate the preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // ── Send Email: HTML → PDF (iframe) → base64 → API (same as JobDetail) ──
  const handleSendEmail = async () => {
    if (!calculated) {
      toast({
        title: "No quote yet",
        description: "Please select at least one strategy first.",
        variant: "destructive",
      });
      return;
    }
    if (!recipientEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the quote to.",
        variant: "destructive",
      });
      return;
    }

    setIsSendLoading(true);
    setEmailSent(false);

    try {
      // Step 1 — build the HTML document
      const { html, quoteNumber } = await buildQuoteAssets();

      // Step 2 — render HTML → PDF → base64 inside a hidden iframe
      toast({
        title: "Generating PDF…",
        description: "Rendering the quote, this takes a few seconds.",
      });
      const pdfBase64 = await htmlToPdfBase64(html);

      // Step 3 — build a professional HTML email body
      const greeting = firstName ? `Dear ${firstName},` : "Dear Valued Client,";
      const currentYear = new Date().getFullYear();

      const emailBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#202BFF;padding:32px 40px;text-align:center;">
          <img 
            src="https://advicelab.com.au/og-image.webp" 
            alt="Advice Lab Logo" 
            width="100"
            style="
              display:block;
              margin:0 auto 12px;
              border-radius:50%;
              overflow:hidden;
              background:transparent;
            "
          />
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Advice Lab</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Financial Advice Support Services</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#1a1a1a;">${greeting}</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
              Thank you for using the <strong>Advice Lab Pricing Calculator</strong>. Please find your personalised quotation
               attached to this email as a PDF document.
            </p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#374151;">
              The attached PDF includes a complete breakdown of the selected advice strategies, the applicable service tier,
              and the total fee excluding any taxes applicable.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:28px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Quote Summary</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#6b7280;">Advice Type</td>
                    <td style="padding:5px 0;font-size:13px;font-weight:600;color:#1a1a1a;">${adviceType === "SOA" ? "Statement of Advice (SOA)" : "Record of Advice (ROA)"}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#6b7280;">Turnaround</td>
                    <td style="padding:5px 0;font-size:13px;font-weight:600;color:#1a1a1a;">${urgency}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#6b7280;">Service Tier</td>
                    <td style="padding:5px 0;font-size:13px;font-weight:600;color:#1a1a1a;">${calculated?.tier?.name ?? "\u2014"}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#6b7280;">Strategies Included</td>
                    <td style="padding:5px 0;font-size:13px;font-weight:600;color:#1a1a1a;">${strategyCount} strateg${strategyCount === 1 ? "y" : "ies"}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 4px;font-size:15px;font-weight:700;color:#1a2e5a;border-top:1.5px solid #e5e7eb;">Total (exc. GST)</td>
                    <td style="padding:12px 0 4px;font-size:15px;font-weight:700;color:#1a2e5a;border-top:1.5px solid #e5e7eb;">AUD ${calculated?.price?.toLocaleString() ?? "\u2014"}</td>
                  </tr>
                </table>
              </td></tr>
            </table>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
              This quote is valid for <strong>14 days</strong> from the date of issue. If you have any questions,
              would like to adjust the scope, or are ready to proceed, please don&#39;t hesitate to write back to us and we'll get back to you promptly.
            </p>
            <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#374151;">
              We look forward to supporting you and your clients with high-quality, timely advice documentation.
            </p>
            <p style="margin:0;font-size:15px;color:#1a1a1a;line-height:1.8;">
              Warm Regards,<br/>
              <strong>The Advice Lab Team</strong><br/>
              <a href="mailto:hello@advicelab.com.au" style="color:#1a2e5a;text-decoration:none;font-size:13px;">hello@advicelab.com.au</a>
              <br/>
              <a href="https://advicelab.com.au/" style="color:#1a2e5a;text-decoration:none;font-size:13px;">
                advicelab.com.au
              </a>
            </p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/></td></tr>
        <tr>
          <td style="padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">This email and its attachments are confidential and intended solely for the named recipient.</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${currentYear} Advice Lab &middot; Australia &middot; <a href="https://advicelab.com.au" style="color:#1a2e5a;text-decoration:none;">advicelab.com.au</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

      // Step 4 — POST to the same API endpoint used in JobDetail
      const payload = (recipient: string, isInternal = false) => ({
        sender: "hello@advicelab.com.au",
        recipient,
        subject: isInternal
          ? `[🔗 INTERNAL COPY] AdviceLab Quote — (${adviceType}, ${urgency})`
          : `Your AdviceLab Quote —  (${adviceType}, ${urgency})`,
        body: emailBody,
        is_html: true,
        attachments: [
          {
            filename: `AdviceLab-Quote.pdf`,
            contentType: "application/pdf",
            content: pdfBase64,
          },
        ],
      });

      // Send to client
      const clientResponse = await fetch(`${API_BASE_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload(recipientEmail, false)),
      });

      if (!clientResponse.ok) {
        throw new Error(`Client email failed: ${clientResponse.status}`);
      }

      // Send internal copy
      const internalResponse = await fetch(`${API_BASE_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload("rasanjali@advicelab.com.au", true)),
        // Copy of the pdf receiver email
      });

      if (!internalResponse.ok) {
        throw new Error(`Internal email failed: ${internalResponse.status}`);
      }

      setEmailSent(true);
      toast({
        title: "Quote sent! ✅",
        description: `Quote emailed to ${recipientEmail} with PDF attached.`,
      });
    } catch (err) {
      console.error("Send quote error:", err);
      toast({
        title: "Failed to send",
        description:
          "Could not send the quote. Please try again or use Preview & Download instead.",
        variant: "destructive",
      });
    } finally {
      setIsSendLoading(false);
    }
  };

  return (
    <Layout>
      <Seo
        title="Pricing Calculator - Advice Lab"
        description="Transparent pricing for Statements or Records of Advice—select strategies and see live costs. Fast-track options and strategy-based fees."
        keywords="pricing calculator, soa pricing, roa pricing, advice costs, financial advice calculator, paraplanning costs, statement of advice pricing, record of advice pricing"
        pathname="/resources/pricing-calculator"
        schemaData={{
          "@type": "WebApplication",
          name: "Advice Lab Pricing Calculator",
          description:
            "Calculate transparent, strategy-based pricing for Statements or Records of Advice with live updates.",
          url: "https://advicelab.com.au/resources/pricing-calculator",
          applicationCategory: "BusinessApplication",
          offers: {
            "@type": "AggregateOffer",
            availability: "https://schema.org/InStock",
            priceCurrency: "AUD",
            description:
              "Strategy-based pricing for financial advice statements",
          },
        }}
      />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="gradient-primary px-4 py-12 md:py-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
            Pricing Calculator
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto text-center">
            Transparent, strategy-based pricing — updates live as you select
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {/* Step 1 & 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* Advice Type */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
              <h2 className="text-lg font-black text-foreground mb-3">
                Step 1 · Advice Type
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { type: "SOA", full: "Statement of Advice" },
                  { type: "ROA", full: "Record of Advice" },
                ].map(({ type, full }) => (
                  <button
                    key={type}
                    onClick={() => setAdviceType(type)}
                    className="relative rounded-xl border-2 p-3 sm:p-4 text-left transition-all duration-150 cursor-pointer hover:border-primary"
                    style={
                      adviceType === type
                        ? {
                            borderColor: "hsl(var(--primary))",
                            background: "hsl(var(--primary)/10%)",
                          }
                        : {
                            borderColor: "hsl(var(--border))",
                            background: "white",
                          }
                    }
                  >
                    {adviceType === type && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    <p className="font-black text-base sm:text-lg text-foreground">
                      {type}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {full}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Turnaround */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
              <h2 className="text-lg font-black text-foreground mb-3">
                Step 2 · Turnaround
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { label: "Standard", Icon: Clock, desc: "Regular timeline" },
                  { label: "Fast Track", Icon: Zap, desc: "1.5× price" },
                ].map(({ label, Icon, desc }) => (
                  <button
                    key={label}
                    onClick={() => setUrgency(label)}
                    className="relative rounded-xl border-2 p-3 sm:p-4 text-left transition-all duration-150 cursor-pointer hover:border-primary"
                    style={
                      urgency === label
                        ? {
                            borderColor: "hsl(var(--primary))",
                            background: "hsl(var(--primary)/10%)",
                          }
                        : {
                            borderColor: "hsl(var(--border))",
                            background: "white",
                          }
                    }
                  >
                    {urgency === label && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    <Icon className="w-4 sm:w-5 h-4 sm:h-5 mb-1 text-primary" />
                    <p className="font-bold text-foreground text-sm">{label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 + Step 4 */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div>
                <h2 className="text-lg font-black text-foreground">
                  Step 3 · Select Strategies
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Price updates live as you tick strategies
                </p>
              </div>
              {strategyCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-destructive hover:text-destructive/90 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors self-start sm:self-auto"
                >
                  <X className="w-3.5 h-3.5" /> Clear all
                </button>
              )}
            </div>

            {/* 3-column strategy grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(STRATEGIES).map(([groupKey, group]) => (
                <CategoryCard
                  key={groupKey}
                  groupKey={groupKey}
                  group={group}
                  checked={checked}
                  onToggle={toggleStrategy}
                />
              ))}
            </div>

            {/* Custom tools */}
            <div className="rounded-xl border-2 border-dashed border-accent bg-accent/5 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-sm mb-0.5 sm:mb-1">
                    Custom Strategies
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2 sm:mb-3">
                    Do you have any additional custom strategies not mentioned
                    above, please select if this may require the use of
                    Wealthsolver or Xtools.
                  </p>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {CUSTOM_TOOLS.map((tool) => {
                      const isOn = !!customTools[tool];
                      return (
                        <label
                          key={tool}
                          className="flex items-center gap-2 cursor-pointer select-none"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleTool(tool);
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all pointer-events-none"
                            style={
                              isOn
                                ? {
                                    background: "hsl(var(--accent))",
                                    borderColor: "hsl(var(--accent))",
                                  }
                                : {
                                    background: "white",
                                    borderColor: "hsl(var(--accent))",
                                  }
                            }
                          >
                            {isOn && (
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="none"
                                viewBox="0 0 12 12"
                              >
                                <path
                                  d="M2 6l3 3 5-5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {tool}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Step 4: Quote Actions ── */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Step 4 · Quote Actions
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                <p className="text-sm text-muted-foreground mt-1">
                  Thank you for using our paraplanning pricing calculator. Your
                  will receive your quote to the email address you entered
                  earlier
                </p>
              </p>

              <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                <div className="flex flex-col sm:flex-row gap-3 flex-1"></div>

                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                  {/* <Button
                    variant="outline"
                    onClick={handlePreviewQuote}
                    disabled={
                      !calculated ||
                      isPreviewLoading ||
                      isSendLoading ||
                      !isSessionValid
                    }
                    className={`flex items-center gap-2 whitespace-nowrap h-[38px] ${!isSessionValid ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <FileText className="w-4 h-4" />
                    {isPreviewLoading
                      ? "Generating…"
                      : calculated
                        ? "Preview & Download"
                        : "Select strategies first"}
                  </Button> */}

                  <Button
                    onClick={handleSendEmail}
                    disabled={
                      !calculated ||
                      isSendLoading ||
                      isPreviewLoading ||
                      !isSessionValid
                    }
                    className={`flex items-center gap-2 whitespace-nowrap h-[38px] ${!isSessionValid ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={
                      emailSent
                        ? {
                            background: "hsl(142 71% 45%)",
                            borderColor: "hsl(142 71% 45%)",
                          }
                        : {}
                    }
                  >
                    {emailSent ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        Resend Quote
                      </>
                    ) : isSendLoading ? (
                      <>
                        <Mail className="w-4 h-4 animate-pulse" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {calculated
                          ? "Send Quote via Email"
                          : "Select strategies first"}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Status hints */}
              {!recipientEmail.trim() && calculated && !emailSent && (
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  Enter an email address above to send the quote PDF.
                </p>
              )}
              {emailSent && (
                <p className="text-xs text-green-600 font-medium mt-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                  Quote emailed successfully to{" "}
                  <span className="font-semibold">{recipientEmail}</span> with
                  the PDF attached.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
