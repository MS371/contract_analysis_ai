
import React, { useState, useEffect } from 'react';
import { analyzeContract, generateTemplate } from './services/geminiService';
import { ContractAnalysisResult, ContractAudit } from './types';
import AnalysisDisplay from './components/AnalysisDisplay';
import { ICONS, COLORS } from './constants';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisResult | null>(null);
  const [auditLog, setAuditLog] = useState<ContractAudit[]>([]);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeView, setActiveView] = useState<'analyzer' | 'templates' | 'dashboard'>('analyzer');
  const [generatedTemplate, setGeneratedTemplate] = useState<string | null>(null);

  // Load audit log from local storage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('nyayadost_audit');
    if (savedLogs) {
      setAuditLog(JSON.parse(savedLogs));
    }
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeContract(inputText, language);
      setAnalysisResult(result);
      
      // Update Audit Log
      const newAudit: ContractAudit = {
        id: Math.random().toString(36).substr(2, 9),
        fileName: inputText.substring(0, 30) + '...',
        timestamp: new Date().toISOString(),
        contractType: result.contractType,
        riskScore: result.overallRiskScore
      };
      const updatedLogs = [newAudit, ...auditLog].slice(0, 10);
      setAuditLog(updatedLogs);
      localStorage.setItem('nyayadost_audit', JSON.stringify(updatedLogs));
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTemplateRequest = async (type: string) => {
    setIsAnalyzing(true);
    const template = await generateTemplate(type);
    setGeneratedTemplate(template);
    setIsAnalyzing(false);
  };

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Your Legal Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Analyses</div>
          <div className="text-4xl font-bold text-blue-600">{auditLog.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Critical Alerts</div>
          <div className="text-4xl font-bold text-red-600">
            {auditLog.filter(a => a.riskScore > 75).length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Average Risk</div>
          <div className="text-4xl font-bold text-amber-600">
            {auditLog.length ? Math.round(auditLog.reduce((acc, curr) => acc + curr.riskScore, 0) / auditLog.length) : 0}%
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Risk</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((log) => (
              <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-800">{log.contractType}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${log.riskScore > 70 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {log.riskScore}% Score
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline text-sm font-bold">View</button>
                </td>
              </tr>
            ))}
            {auditLog.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No analysis history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">SME Standard Templates</h2>
        <p className="text-slate-500">Download legally vetted, SME-friendly Indian contract templates.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Employment Agreement', type: 'EMPLOYMENT' },
          { name: 'Vendor Service Contract', type: 'VENDOR' },
          { name: 'Commercial Lease', type: 'LEASE' },
          { name: 'Partnership Deed', type: 'PARTNERSHIP' },
          { name: 'Freelance Service', type: 'FREELANCE' },
          { name: 'Mutual NDA', type: 'NDA' }
        ].map(tpl => (
          <div key={tpl.type} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition cursor-pointer group" onClick={() => handleTemplateRequest(tpl.name)}>
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
              <ICONS.FileText className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{tpl.name}</h3>
            <p className="text-sm text-slate-500 mb-6">Standard Indian compliant {tpl.name.toLowerCase()} with basic risk protections.</p>
            <button className="w-full py-2 rounded-lg bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition">
              Generate Now
            </button>
          </div>
        ))}
      </div>

      {generatedTemplate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Generated Template</h3>
              <button onClick={() => setGeneratedTemplate(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 bg-white font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {generatedTemplate}
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end space-x-4">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedTemplate);
                  alert("Copied to clipboard!");
                }}
                className="px-6 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition"
              >
                Copy Text
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 h-16 flex items-center px-6 sticky top-0 z-40 no-print">
        <div className="flex items-center space-x-2 mr-12">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ICONS.Shield className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">Nyaya<span className="text-blue-600">Dost</span></span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => setActiveView('analyzer')}
            className={`text-sm font-bold transition ${activeView === 'analyzer' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Contract Analyzer
          </button>
          <button 
            onClick={() => setActiveView('templates')}
            className={`text-sm font-bold transition ${activeView === 'templates' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Legal Templates
          </button>
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`text-sm font-bold transition ${activeView === 'dashboard' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Dashboard
          </button>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-[10px] font-bold rounded ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              ENGLISH
            </button>
            <button 
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 text-[10px] font-bold rounded ${language === 'hi' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              HINDI
            </button>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <ICONS.Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1">
        {analysisResult ? (
          <AnalysisDisplay 
            analysis={analysisResult} 
            onReset={() => setAnalysisResult(null)} 
          />
        ) : activeView === 'analyzer' ? (
          <div className="max-w-4xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black text-slate-900 mb-4">
                Smart Legal Guard for Indian SMEs
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Paste your contract (Employment, Vendor, Lease) or upload a file to identify hidden risks and get plain-language advice.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Contract Content</label>
                  <span className="text-[10px] font-medium text-slate-400">Supported: English & Hindi</span>
                </div>
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste legal text here... (e.g., 'This Employment Agreement is made on...')"
                  className="w-full h-64 p-6 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-700 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2 overflow-hidden py-1">
                    {[1, 2, 3, 4].map(i => (
                      <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={`https://picsum.photos/seed/${i + 100}/100/100`} alt="" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Used by 2,000+ Indian Small Businesses</p>
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className={`flex items-center space-x-3 px-10 py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 shadow-lg ${
                    isAnalyzing || !inputText.trim() 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <ICONS.Search className="w-5 h-5" />
                      <span>Start Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                  <ICONS.CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Plain Language</h3>
                <p className="text-sm text-slate-500">Complex legal jargon converted into simple business English or Hindi.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                  <ICONS.AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Risk Detection</h3>
                <p className="text-sm text-slate-500">Flags unfavorable termination, indemnity, and liability clauses instantly.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <ICONS.Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Compliance</h3>
                <p className="text-sm text-slate-500">Checks against standard Indian statutes and best business practices.</p>
              </div>
            </div>
          </div>
        ) : activeView === 'templates' ? (
          renderTemplates()
        ) : (
          renderDashboard()
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 px-6 no-print">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-slate-900 p-1 rounded">
                <ICONS.Shield className="text-white w-4 h-4" />
              </div>
              <span className="font-black text-lg tracking-tight text-slate-900">NyayaDost</span>
            </div>
            <p className="text-sm text-slate-400">© 2024 Legal AI Solutions Pvt Ltd. Empowering Indian SMEs.</p>
          </div>
          <div className="flex space-x-8 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Terms of Service</a>
            <a href="#" className="hover:text-blue-600">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
