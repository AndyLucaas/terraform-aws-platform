import React, { useState } from 'react';
import { SystemTelemetry, Video } from '../../types';
import { Activity, Server, Users, ShieldAlert, Zap, BarChart3, Lock, CheckCircle2 } from 'lucide-react';

interface EnterpriseDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: SystemTelemetry;
  videos: Video[];
}

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({
  isOpen,
  onClose,
  telemetry,
  videos
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'nodes' | 'moderation' | 'rbac'>('metrics');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Console de Control Enterprise & Telemetry K8s</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Monitoring Prometheus + Grafana • Spring Boot Actuator • Redis Cluster
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-800 mt-6 pb-3">
          {[
            { id: 'metrics', label: 'Télémétrie Temps Réel', icon: BarChart3 },
            { id: 'nodes', label: 'Cluster Kubernetes (EKS/GKE)', icon: Server },
            { id: 'moderation', label: 'Modération du Catalogue', icon: ShieldAlert },
            { id: 'rbac', label: 'Gestion Keycloak RBAC', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl font-semibold text-xs transition-all flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/40 shadow-glow-cyan'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6 space-y-6">

          {/* TAB 1: Real-time Telemetry Metrics */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                    <span>Spectateurs Simultanés</span>
                    <Users className="w-4 h-4 text-brand-500" />
                  </div>
                  <div className="text-3xl font-black text-white font-mono tracking-tight">
                    {telemetry.liveViewers.toLocaleString('fr-FR')}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold mt-1 block">
                    +12.4% vs heure précédente
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                    <span>Bande Passante Egress</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-mono tracking-tight">
                    {telemetry.egressBandwidthGbps} <span className="text-sm font-normal text-slate-400">Gbps</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    CDN Edge CDN-ANYCAST-01
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                    <span>Ratio Hit CDN Edge</span>
                    <Server className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                    {telemetry.cdnHitRatioPct}%
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                    Zero Cache Miss sur HLS segments
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                    <span>Kafka Ingestion Stream</span>
                    <Activity className="w-4 h-4 text-accent-purple" />
                  </div>
                  <div className="text-3xl font-black text-white font-mono tracking-tight">
                    {(telemetry.kafkaEventsPerSec / 1000).toFixed(1)}k <span className="text-sm font-normal text-slate-400">events/s</span>
                  </div>
                  <span className="text-[10px] text-accent-purple font-mono mt-1 block">
                    QoE analytics & user history
                  </span>
                </div>

              </div>

              {/* Cluster Hardware Gauges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Utilisation CPU Cluster Kubernetes</span>
                    <span className="font-mono text-emerald-400">{telemetry.clusterCpuPct}%</span>
                  </h4>
                  <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${telemetry.clusterCpuPct}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Horizontal Pod Autoscaler (HPA): 24 Pods actifs sur 50 max.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Utilisation RAM Cluster Redis</span>
                    <span className="font-mono text-accent-cyan">{telemetry.clusterMemoryPct}%</span>
                  </h4>
                  <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-accent-cyan rounded-full" style={{ width: `${telemetry.clusterMemoryPct}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    6 Shards Redis (3 Masters + 3 Replicas) avec éviction LFU.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: K8s Infrastructure Topology */}
          {activeTab === 'nodes' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-3">Statut des Microservices (Namespace: streaming-prod)</h4>
                
                <div className="space-y-2">
                  {[
                    { name: 'video-catalog-service', status: 'HEALTHY', replicas: '8/8', image: 'aether/video-catalog:v2.4', cpu: '140m', memory: '512Mi' },
                    { name: 'transcoder-worker-pool', status: 'HEALTHY', replicas: '12/12', image: 'aether/transcoder-ffmpeg:v2.4', cpu: '1850m', memory: '4096Mi' },
                    { name: 'auth-keycloak-cluster', status: 'HEALTHY', replicas: '4/4', image: 'quay.io/keycloak/keycloak:24.0', cpu: '320m', memory: '1024Mi' },
                    { name: 'kafka-event-broker', status: 'HEALTHY', replicas: '3/3', image: 'confluentinc/cp-kafka:7.5', cpu: '890m', memory: '2048Mi' },
                    { name: 'postgresql-primary-ha', status: 'HEALTHY', replicas: '2/2', image: 'postgres:16-alpine', cpu: '410m', memory: '2048Mi' },
                  ].map((pod, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="font-bold text-white">{pod.name}</p>
                          <span className="text-[10px] text-slate-500">{pod.image}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-slate-400">
                        <span>Replicas: <strong className="text-white">{pod.replicas}</strong></span>
                        <span>CPU: <strong className="text-emerald-400">{pod.cpu}</strong></span>
                        <span>RAM: <strong className="text-accent-cyan">{pod.memory}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Video Catalog Moderation */}
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase">
                      <th className="p-3">Vidéo</th>
                      <th className="p-3">Catégorie</th>
                      <th className="p-3">Vues</th>
                      <th className="p-3">Statut DRM</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {videos.map((vid) => (
                      <tr key={vid.id} className="hover:bg-slate-950/60 transition-colors">
                        <td className="p-3 font-bold text-white flex items-center gap-3">
                          <img src={vid.thumbnailUrl} alt="" className="w-10 h-6 object-cover rounded" />
                          <span>{vid.title}</span>
                        </td>
                        <td className="p-3 text-slate-300">{vid.category}</td>
                        <td className="p-3 text-slate-300">{vid.views.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                            Widevine + FairPlay OK
                          </span>
                        </td>
                        <td className="p-3">
                          <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]">
                            Inspecter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Keycloak RBAC Matrix */}
          {activeTab === 'rbac' && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs font-mono">
              <h4 className="font-bold text-white text-sm">Matrice des Rôles & Autorisations (Keycloak OpenID Connect)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-purple-400">ROLE_TENANT_ADMIN</span>
                  <p className="text-[11px] text-slate-400">Accès complet à la télémétrie, création de comptes, gestion des clés de cryptage DRM.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-accent-cyan">ROLE_CONTENT_MODERATOR</span>
                  <p className="text-[11px] text-slate-400">Publication de vidéos, gestion des transcodages ABR, modération des commentaires.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-400">ROLE_SUBSCRIBER_PREMIUM</span>
                  <p className="text-[11px] text-slate-400">Lecture des flux 4K UHD HDR10+, son Dolby Atmos, téléchargement hors-ligne.</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
