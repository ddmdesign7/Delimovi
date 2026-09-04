import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Folder, Terminal, Server } from 'lucide-react';

interface FlaskSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlaskSourceModal: React.FC<FlaskSourceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'app.py' | 'home.html' | 'result.html' | 'requirements.txt' | 'Procfile'>('app.py');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fileContents = {
    'app.py': `# app.py - Delimovi Flask Logistics Tracking Engine
import os
import datetime
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "delimovi-secret-key-2026")

PARCELS_DB = {
    "DLM-4419-US": {
        "tracking_number": "DLM-4419-US",
        "status": "In Transit",
        "progress_percent": 55,
        "service_tier": "Delimovi Continental Priority",
        "carrier": "Delimovi North America",
        "sender": {"name": "Silicon Design Labs", "city": "San Jose, CA", "country": "United States"},
        "recipient": {"name": "Dr. Aris Thorne", "address": "780 Broadway Ave", "city": "New York", "postal_code": "10003", "country": "USA"},
        "package_details": {"weight": "5.10 kg", "dimensions": "45 × 30 × 20 cm", "declared_value": "$1,250.00", "signature_required": True},
        "courier": {"name": "Regional Linehaul Dispatch", "id": "DRV-NA-3301", "phone": "+1 800 555 0199", "vehicle": "Freightliner Semi #NY-14", "rating": 4.9},
        "eta": "Tomorrow by 12:00 PM",
        "history": [
            {"timestamp": "2026-09-01 01:10", "status": "Arrived at Sorting Facility", "location": "Chicago O'Hare Freight Hub, IL", "description": "Midpoint cargo scan complete.", "completed": True, "is_current": True},
            {"timestamp": "2026-08-31 06:45", "status": "Departed Origin Hub", "location": "San Jose Air Logistics Center, CA", "description": "Departed on Cargo Flight DLM-402.", "completed": True, "is_current": False}
        ]
    }
}

@app.route("/")
def home():
    return render_template("home.html", recent_codes=list(PARCELS_DB.keys()), total_parcels=len(PARCELS_DB))

@app.route("/track", methods=["GET", "POST"])
def track():
    if request.method == "POST":
        tracking_number = request.form.get("tracking_number", "").strip().upper()
    else:
        tracking_number = request.args.get("tracking_number", "").strip().upper()

    parcel = PARCELS_DB.get(tracking_number)
    if not parcel:
        return render_template("result.html", not_found=True, tracking_number=tracking_number, sample_codes=list(PARCELS_DB.keys()))
    return render_template("result.html", parcel=parcel, not_found=False)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)`,

    'home.html': `<!-- templates/home.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Delimovi — Global Logistics & Parcel Tracking</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans">
    <header class="border-b border-slate-800 p-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">D</div>
            <h1 class="text-xl font-bold font-mono">DELIMOVI</h1>
        </div>
    </header>
    <main class="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 class="text-4xl font-extrabold text-white mb-4">Track Any Parcel with Absolute Precision</h1>
        <form action="/track" method="POST" class="flex gap-2 max-w-xl mx-auto mb-8">
            <input type="text" name="tracking_number" required placeholder="DLM-4419-US" class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono uppercase">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl font-mono">Track</button>
        </form>
    </main>
</body>
</html>`,

    'result.html': `<!-- templates/result.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ parcel.tracking_number }} Tracking Details — Delimovi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans">
    {% if not_found %}
    <div class="max-w-md mx-auto my-16 text-center bg-slate-900 p-8 rounded-2xl">
        <h2 class="text-xl font-bold text-red-400 mb-2">Tracking ID {{ tracking_number }} Not Found</h2>
        <a href="/" class="text-amber-400 underline">Try Another Code</a>
    </div>
    {% else %}
    <main class="max-w-5xl mx-auto py-8 px-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <span class="text-xs uppercase text-slate-400 font-bold">Consignment ID</span>
                    <h1 class="text-3xl font-extrabold font-mono text-white">{{ parcel.tracking_number }}</h1>
                    <span class="text-amber-400 font-mono text-sm font-semibold">● {{ parcel.status }}</span>
                </div>
                <div class="text-right">
                    <span class="text-xs text-slate-400">ETA:</span>
                    <div class="text-xl font-bold text-amber-400 font-mono">{{ parcel.eta }}</div>
                </div>
            </div>
            <!-- Progress Bar -->
            <div class="w-full bg-slate-800 h-3 rounded-full mt-4 overflow-hidden">
                <div class="bg-amber-500 h-full" style="width: {{ parcel.progress_percent }}%"></div>
            </div>
        </div>

        <!-- Milestones -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 class="text-lg font-bold text-white mb-4">Milestone Timeline</h2>
            <div class="space-y-4">
                {% for event in parcel.history %}
                <div class="flex gap-4 items-start">
                    <div class="w-3 h-3 rounded-full bg-amber-500 mt-1.5"></div>
                    <div>
                        <div class="font-bold text-white text-sm">{{ event.status }}</div>
                        <div class="text-xs text-sky-400 font-mono">{{ event.location }} — {{ event.timestamp }}</div>
                        <p class="text-xs text-slate-400">{{ event.description }}</p>
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>
    </main>
    {% endif %}
</body>
</html>`,

    'requirements.txt': `Flask>=3.0.0
gunicorn>=21.2.0
python-dotenv>=1.0.0
requests>=2.31.0`,

    'Procfile': `web: gunicorn app:app`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
                Delimovi Flask Project Files
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">100% Python/Flask Native</span>
              </h2>
              <p className="text-xs text-slate-500">Pure Flask + Jinja2 project structure matching tracking-app/</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-200 bg-slate-50/50 overflow-x-auto">
          <div className="flex items-center gap-1">
            {(['app.py', 'home.html', 'result.html', 'requirements.txt', 'Procfile'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer border-t border-x ${
                  activeTab === tab
                    ? 'bg-white text-blue-700 border-slate-200 font-bold -mb-px shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 transition-all cursor-pointer mb-2 shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed">
          <pre className="overflow-x-auto whitespace-pre selection:bg-blue-600 selection:text-white">
            <code>{fileContents[activeTab]}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>Run locally with: <code className="text-blue-700 font-bold">python app.py</code> or <code className="text-blue-700 font-bold">gunicorn app:app</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs cursor-pointer transition-colors shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
