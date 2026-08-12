import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Timer,
  CalendarDays,
  CalendarRange,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/Card';
import { ChartCard } from '@/shared/ui/ChartCard';
import { Loader } from '@/shared/ui/Loader';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/Button';
import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable';
import { StatusBadge } from '@/features/tickets/components/StatusBadge';
import { PriorityBadge } from '@/features/tickets/components/PriorityBadge';
import type { TicketSummary } from '@/features/tickets/types';
import { StatCard } from '../components/StatCard';
import { useDashboardCharts, useDashboardStats, useRecentTickets } from '../hooks';

const PIE_COLORS = ['#0F766E', '#14532D', '#0369A1', '#CA8A04', '#B91C1C'];

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: charts, isLoading: chartsLoading } = useDashboardCharts();
  const { data: recentTickets, isLoading: recentLoading } = useRecentTickets();

  const columns: DataTableColumn<TicketSummary>[] = [
    { key: 'reference', header: 'Référence', render: (t) => <span className="font-mono text-xs">{t.reference}</span> },
    { key: 'title', header: 'Titre', render: (t) => t.title },
    { key: 'status', header: 'Statut', render: (t) => <StatusBadge status={t.status} /> },
    { key: 'priority', header: 'Priorité', render: (t) => <PriorityBadge priority={t.priority} /> },
    { key: 'createdAt', header: 'Créé le', render: (t) => format(new Date(t.createdAt), 'dd/MM/yyyy') },
  ];

  if (statsError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Impossible de charger le tableau de bord"
        description="Le serveur ne répond pas. Vérifiez que le backend est accessible et réessayez."
        action={<Button onClick={() => refetchStats()}>Réessayer</Button>}
      />
    );
  }

  if (statsLoading || !stats) {
    return <Loader fullHeight />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Tableau de bord</h1>
        <p className="text-sm text-text-secondary">Vue d'ensemble de l'activité de la plateforme</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Ticket} label="Total des tickets" value={stats.totalTickets} tone="brand" />
        <StatCard icon={Clock} label="Tickets ouverts" value={stats.openTickets} tone="info" />
        <StatCard icon={CheckCircle2} label="Tickets fermés" value={stats.closedTickets} tone="success" />
        <StatCard icon={AlertTriangle} label="Tickets critiques" value={stats.criticalTickets} tone="error" />
        <StatCard icon={Timer} label="Tickets en attente" value={stats.pendingTickets} tone="warning" />
        <StatCard icon={CalendarDays} label="Aujourd'hui" value={stats.ticketsToday} tone="brand" />
        <StatCard icon={CalendarRange} label="Cette semaine" value={stats.ticketsThisWeek} tone="brand" />
        <StatCard icon={Users} label="Techniciens disponibles" value={stats.availableTechnicians} tone="info" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <ChartCard title="Tickets créés (14 derniers jours)" subtitle="Volume quotidien">
          {chartsLoading || !charts ? (
            <Loader fullHeight />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.ticketsCreatedLast14Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0F766E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Répartition par statut">
          {chartsLoading || !charts ? (
            <Loader fullHeight />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.ticketsByStatus} dataKey="value" nameKey="label" innerRadius={50} outerRadius={80}>
                  {charts.ticketsByStatus.map((entry, index) => (
                    <Cell key={entry.label} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Répartition par priorité">
          {chartsLoading || !charts ? (
            <Loader fullHeight />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.ticketsByPriority}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité récente — derniers tickets</CardTitle>
        </CardHeader>
        <DataTable
          columns={columns}
          data={recentTickets ?? []}
          isLoading={recentLoading}
          getRowKey={(ticket) => ticket.id}
          onRowClick={(ticket) => navigate(`/tickets/${ticket.id}`)}
        />
      </Card>
    </div>
  );
}
