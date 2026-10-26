import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Users, 
  Building2, 
  Target, 
  GraduationCap, 
  ShieldCheck, 
  Filter, 
  Search, 
  RefreshCw,
  ExternalLink,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { fetchCollaborationGraph } from '../utils/api';

export default function CollaborationNetworkGraphPage({
  currentUser,
  onOpenAuth,
  language = 'en'
}) {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'ngo' | 'corporate' | 'project' | 'mentor'
  const [selectedNode, setSelectedNode] = useState(null);

  const loadGraph = async () => {
    setLoading(true);
    try {
      const data = await fetchCollaborationGraph();
      setGraphData(data);
    } catch (err) {
      console.error('Error fetching graph data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

  const filteredNodes = graphData.nodes.filter(n => {
    if (selectedType === 'all') return true;
    return n.type === selectedType;
  });

  const nodeColor = (type) => {
    switch (type) {
      case 'ngo': return { bg: '#ECFDF5', border: '#10B981', text: '#065F46', badge: 'NGO' };
      case 'corporate': return { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF', badge: 'Corporate CSR' };
      case 'project': return { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', badge: 'Project Drive' };
      case 'mentor': return { bg: '#FAF5FF', border: '#A855F7', text: '#6B21A8', badge: 'Expert Mentor' };
      default: return { bg: '#F1F5F9', border: '#64748B', text: '#334155', badge: 'Entity' };
    }
  };

  // Node position calculation for SVG ring graph layout
  const width = 800;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 190;

  const nodePositions = {};
  filteredNodes.forEach((node, idx) => {
    const angle = (idx / (filteredNodes.length || 1)) * 2 * Math.PI - Math.PI / 2;
    nodePositions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs relative">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center space-x-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>Verified Ecosystem Mapping</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Collaboration Network Graph
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore verified relationships across grassroots NGOs, Corporate CSR leaders, pro-bono expert advisors, and active field campaigns. Click any entity to inspect verified past partnerships.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Entities:</span>
            </span>
            {[
              { id: 'all', label: 'All Entities' },
              { id: 'ngo', label: 'Grassroots NGOs' },
              { id: 'corporate', label: 'Corporate CSR' },
              { id: 'project', label: 'Impact Projects' },
              { id: 'mentor', label: 'Expert Mentors' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedType(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedType === f.id
                    ? 'bg-[#16A36A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Graph Canvas Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SVG Graph Viewport */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[520px]">
            
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 text-[11px] font-bold text-slate-400 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200">
              <Info className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>Interactive Graph: Click on any node to view collaborations</span>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">Mapping Verified Social Network...</p>
              </div>
            ) : (
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-auto max-h-[500px] select-none"
              >
                {/* Central Radial Guide Circles */}
                <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#E2E8F0" strokeDasharray="4 4" />
                <circle cx={centerX} cy={centerY} r={radius / 2} fill="none" stroke="#F1F5F9" />
                
                {/* Center Hub Logo */}
                <circle cx={centerX} cy={centerY} r={32} fill="#16A36A" opacity={0.1} />
                <circle cx={centerX} cy={centerY} r={22} fill="#16A36A" />
                <text x={centerX} y={centerY + 4} textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  HUB
                </text>

                {/* Edges */}
                {graphData.edges.map((edge, i) => {
                  const srcPos = nodePositions[edge.source];
                  const tgtPos = nodePositions[edge.target];
                  if (!srcPos || !tgtPos) return null;

                  const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

                  return (
                    <g key={i}>
                      <line
                        x1={srcPos.x}
                        y1={srcPos.y}
                        x2={tgtPos.x}
                        y2={tgtPos.y}
                        stroke={isHighlighted ? '#16A36A' : '#CBD5E1'}
                        strokeWidth={isHighlighted ? 2.5 : 1.2}
                        strokeDasharray={isHighlighted ? 'none' : '3 3'}
                        opacity={isHighlighted ? 1 : 0.6}
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {filteredNodes.map(node => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;
                  const colors = nodeColor(node.type);
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer group"
                    >
                      <circle
                        r={isSelected ? 26 : 22}
                        fill={colors.bg}
                        stroke={isSelected ? '#0F172A' : colors.border}
                        strokeWidth={isSelected ? 3 : 2}
                        className="transition-all duration-300"
                      />
                      
                      {/* Node Center Initial */}
                      <text
                        textAnchor="middle"
                        y={4}
                        fill={colors.text}
                        fontSize="11"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {node.label.charAt(0).toUpperCase()}
                      </text>

                      {/* Label Text below node */}
                      <text
                        textAnchor="middle"
                        y={36}
                        fill="#1E293B"
                        fontSize="9"
                        fontWeight="600"
                        className="pointer-events-none"
                      >
                        {node.label.length > 14 ? node.label.slice(0, 12) + '..' : node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Node Inspector Drawer */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Node Inspector
                </span>
                {selectedNode && (
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {selectedNode ? (
                <div className="mt-4 space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block"
                      style={{
                        backgroundColor: nodeColor(selectedNode.type).bg,
                        color: nodeColor(selectedNode.type).text
                      }}
                    >
                      {nodeColor(selectedNode.type).badge}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {selectedNode.full_title || selectedNode.label}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedNode.details}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-slate-700 block">Verified Focus Area:</span>
                    <span className="text-slate-600 font-medium">{selectedNode.cause}</span>
                  </div>

                  {/* Connected Relationships */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">
                      Active Collaborations in Network:
                    </span>
                    <div className="space-y-1.5">
                      {graphData.edges
                        .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                        .map((edge, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                            <span className="font-medium text-slate-800">{edge.relation}</span>
                            <ShieldCheck className="w-4 h-4 text-[#16A36A] shrink-0" />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-2 text-slate-400">
                  <Share2 className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">No entity selected</p>
                  <p className="text-[11px] text-slate-400">Click any circle in the graph to inspect its verified partnerships and CSR grants.</p>
                </div>
              )}
            </div>

            {selectedNode && (
              <button
                type="button"
                onClick={() => alert(`Connection request initiated with ${selectedNode.label}.`)}
                className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>Propose New Partnership</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
