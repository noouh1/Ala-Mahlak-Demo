import { useState } from 'react';
import { useMemo } from 'react';
import { Smartphone, Eye, Moon, Utensils, CheckCircle } from 'lucide-react';
import { trips, alerts } from '../data/mockData';

const getAlertIcon = (type: string) => {
  const iconProps = { size: 20 };
  switch (type) {
    case 'Phone Usage':
      return <Smartphone {...iconProps} className="text-blue-600" />;
    case 'Drowsiness Detected':
      return <Moon {...iconProps} className="text-amber-600" />;
    case 'Looking Away':
      return <Eye {...iconProps} className="text-slate-600" />;
    case 'Eating / Drinking':
      return <Utensils {...iconProps} className="text-orange-600" />;
    default:
      return <Eye {...iconProps} className="text-slate-400" />;
  }
};

const severityStyles = {
  high: { badge: 'bg-red-100 text-red-600' },
  medium: { badge: 'bg-amber-100 text-amber-700' },
  low: { badge: 'bg-blue-100 text-blue-600' },
};

export default function TripMonitoring() {
  const [alertSeverity, setAlertSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [alertStatus, setAlertStatus] = useState('all');

  const activeTrips = trips.filter(t => t.status === 'active');

  const filteredAlerts = useMemo(() => 
    alerts.filter(a => {
      const matchSeverity = alertSeverity === 'all' || a.severity === alertSeverity;
      return matchSeverity;
    }), 
    [alertSeverity]
  );

  const alertStats = {
    total: alerts.length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    unhandled: alerts.length,
  };

  return (
    <div className="space-y-5">

      {/* Active Trips */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">Active Trips</h3>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle size={14} />
            <span>{activeTrips.length} in progress</span>
          </div>
        </div>
        <div className="space-y-3">
          {activeTrips.map(tr => (
            <div key={tr.id} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: tr.driverColor }}>{tr.driverInitials}</div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{tr.driverName}</div>
                  <div className="text-xs text-slate-400">Started: {tr.startTime} · Distance: {tr.duration}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">Alerts: <span className="font-semibold text-slate-800">{tr.alerts}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Distraction Alerts section */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Distraction Alerts</h3>
          <div className="flex items-center gap-3">
            <select
              value={alertStatus}
              onChange={e => setAlertStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none"
            >
              <option value="all">All Alerts</option>
              <option value="unhandled">Unhandled</option>
              <option value="handled">Handled</option>
            </select>
            <select
              value={alertSeverity}
                onChange={e => setAlertSeverity(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredAlerts.map(a => (
            <div key={a.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 flex items-center justify-center">{getAlertIcon(a.type)}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-slate-800">{a.driverName}</div>
                    <div className="text-xs text-slate-500 font-medium">{a.type}</div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{a.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${severityStyles[a.severity].badge}`}>{a.severity.toUpperCase()}</div>
                <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">Mark as Handled</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats at bottom */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 text-center">
          <div className="text-3xl font-bold text-slate-800">{alertStats.total}</div>
          <div className="text-xs text-slate-500 mt-1">Total Alerts</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 text-center">
          <div className="flex items-center justify-center mb-1">
            <div className="text-3xl font-bold text-red-600">{alertStats.high}</div>
          </div>
          <div className="text-xs text-slate-500">High Severity</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 text-center">
          <div className="flex items-center justify-center mb-1">
            <div className="text-3xl font-bold text-amber-600">{alertStats.medium}</div>
          </div>
          <div className="text-xs text-slate-500">Medium Severity</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 text-center">
          <div className="flex items-center justify-center mb-1">
            <div className="text-3xl font-bold text-slate-800">{alertStats.unhandled}</div>
          </div>
          <div className="text-xs text-slate-500">Unhandled</div>
        </div>
      </div>
    </div>
  );
}
