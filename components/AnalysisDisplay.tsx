
import React, { useState } from 'react';
import { ContractAnalysisResult, RiskLevel } from '../types';
import RiskMeter from './RiskMeter';
import { ICONS, COLORS } from '../constants';

interface AnalysisDisplayProps {
  analysis: ContractAnalysisResult;
  onReset: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, onReset }) => {
  const [activeTab, setActiveTab] = useState<'clauses' | 'compliance' | 'mitigation'>('clauses');

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-700 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
      case 'CRITICAL': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-start mb-8 no-print">
        <button 
          onClick={onReset}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Upload
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <ICONS.Download className="w-4 h-4 mr-2" />
          Export PDF
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="bg-slate-900 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Analysis Result</span>
              <h1 className="text-2xl font-bold mt-1">{analysis.contractType}</h1>
            </div>
            <div className="mt-4 md:mt-0 bg-slate-800 p-2 rounded-lg border border-slate-700">
              <div className="flex items-center space-x-4 px-4 py-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Parties Involved</span>
                  <span className="text-sm font-medium">
                    {analysis.parties.map(p => p.name).join(' & ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Executive Summary</h3>
              <p className="text-slate-700 leading-relaxed text-lg italic">
                "{analysis.summary}"
              </p>
            </section>
            
            <section className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Key Dates</h3>
                <div className="space-y-2">
                  {analysis.keyDates.map((date, idx) => (
                    <div key={idx} className="flex items-center text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                      <ICONS.Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="font-medium mr-2">{date.label}:</span>
                      <span>{date.date}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Critical Warnings</h3>
                <ul className="space-y-2">
                  {analysis.unfavorableTerms.slice(0, 3).map((term, idx) => (
                    <li key={idx} className="flex items-start text-sm text-red-600 font-medium">
                      <ICONS.AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-100">
            <RiskMeter score={analysis.overallRiskScore} />
            <p className="text-xs text-slate-400 text-center mt-4">
              Composite score based on liability, termination rights, and compliance gaps.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 no-print">
        <button 
          onClick={() => setActiveTab('clauses')}
          className={`pb-4 px-6 font-semibold text-sm transition-colors relative ${activeTab === 'clauses' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Clause Breakdown
          {activeTab === 'clauses' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('compliance')}
          className={`pb-4 px-6 font-semibold text-sm transition-colors relative ${activeTab === 'compliance' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Compliance Check
          {activeTab === 'compliance' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('mitigation')}
          className={`pb-4 px-6 font-semibold text-sm transition-colors relative ${activeTab === 'mitigation' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Mitigation Strategies
          {activeTab === 'mitigation' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'clauses' && (
          <div className="space-y-6">
            {analysis.clauses.map((clause, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition hover:shadow-md">
                <div className="p-5 flex justify-between items-start border-b border-slate-100 bg-slate-50/50">
                  <h4 className="font-bold text-slate-900 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] mr-3 font-bold">{idx + 1}</span>
                    {clause.clauseTitle}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getRiskBadgeColor(clause.riskLevel)}`}>
                    {clause.riskLevel} Risk
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 border-r border-slate-100 bg-slate-50/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Original Legal Text</span>
                    <p className="text-sm text-slate-600 leading-relaxed font-mono">
                      {clause.originalText}
                    </p>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Business Explanation</span>
                    <p className="text-slate-800 font-medium mb-4">
                      {clause.simplifiedExplanation}
                    </p>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center mb-2">
                        <ICONS.Shield className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Risk Note & Recommendation</span>
                      </div>
                      <p className="text-xs text-blue-700 italic">
                        {clause.riskDescription}
                      </p>
                      {clause.suggestedAlternative && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest block mb-1">Better Version</span>
                          <p className="text-xs text-blue-900 bg-white/50 p-2 rounded">
                            "{clause.suggestedAlternative}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.complianceCheck.map((check, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${check.status === 'COMPLIANT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {check.status === 'COMPLIANT' ? <ICONS.CheckCircle /> : <ICONS.AlertTriangle />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{check.statute}</h4>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${check.status === 'COMPLIANT' ? 'text-green-600' : 'text-red-600'}`}>
                    {check.status.replace('_', ' ')}
                  </div>
                  <p className="text-sm text-slate-600">
                    {check.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mitigation' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <ICONS.Shield className="w-6 h-6 mr-3 text-blue-600" />
              Strategic Risk Mitigation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recommended Actions</h4>
                <ul className="space-y-4">
                  {analysis.mitigationStrategies.map((strategy, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center text-[10px] font-bold mr-3 mt-1 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-slate-700 font-medium">{strategy}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Renegotiation Checklist</h4>
                <div className="space-y-3">
                  {analysis.unfavorableTerms.map((term, idx) => (
                    <label key={idx} className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 transition">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                      <span className="text-sm text-slate-700">{term}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl no-print">
        <h5 className="text-sm font-bold text-yellow-800 uppercase tracking-widest flex items-center mb-2">
          <ICONS.AlertTriangle className="w-4 h-4 mr-2" />
          Legal Disclaimer
        </h5>
        <p className="text-xs text-yellow-700 leading-relaxed">
          NyayaDost is an AI-powered educational tool designed for Indian SMEs. The analysis provided is based on GenAI processing and does not constitute formal legal advice. Please consult with a qualified legal professional before signing any contract. NyayaDost and its developers are not responsible for any legal or financial outcomes based on this analysis.
        </p>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
