import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, UserPlus } from 'lucide-react';
import { drivers, type DriverStatus } from '../data/mockData';

const statusConfig: Record<DriverStatus, { label: string; class: string; dot: string }> = {
  active: { label: 'Active', class: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500 pulse-dot' },
  break: { label: 'On Break', class: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  offline: { label: 'Offline', class: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
};


export default function Drivers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | DriverStatus>('all');

  const filtered = drivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.driverId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || d.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: drivers.length,
    active: drivers.filter(d => d.status === 'active').length,
    break: drivers.filter(d => d.status === 'break').length,
    offline: drivers.filter(d => d.status === 'offline').length,
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-0.5">
          {(['all', 'active', 'break', 'offline'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'break' ? 'On Break' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`ml-1.5 ${filter === f ? 'text-blue-200' : 'text-slate-400'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={14} />
            <span>Sort</span>
          </button>
          <button
            onClick={() => navigate('/assign')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-500/25"
          >
            <UserPlus size={15} />
            <span>Add Driver</span>
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-slate-400">
        Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of {drivers.length} drivers
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-slate-500">Total Drivers</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{counts.all}</div>
          <div className="text-xs mt-1 text-emerald-500">{counts.active} active</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-slate-500">On Trip</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{counts.active}</div>
          <div className="text-xs mt-1 text-slate-500">In progress</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-slate-500">Available</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{counts.break + counts.offline}</div>
          <div className="text-xs mt-1 text-slate-500">Ready for assignment</div>
        </div>
      </div>

      {/* Table list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
          <div className="text-slate-300 text-4xl mb-3">👤</div>
          <div className="text-slate-500 font-medium">No drivers found</div>
          <div className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</div>
        </div>
      ) : (
        <div className="mt-4 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="text-sm text-slate-600 font-semibold">Drivers</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left">Driver</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Vehicle</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Stats</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const sc = statusConfig[d.status];
                return (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                          style={{ background: d.color }}
                        >
                          {d.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{d.name}</div>
                          <div className="text-xs text-slate-400">{d.driverId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-xs text-slate-600">{d.email}</div>
                      <div className="text-xs text-slate-400 mt-1">{d.phone}</div>
                    </td>
                    <td className="px-6 py-4 align-top text-slate-600">{d.driverId}</td>
                    <td className="px-6 py-4 align-top">
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${sc.class}`}>
                        <span className={`h-2 w-2 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-slate-600">
                      <div className="text-sm font-semibold">{d.totalTrips} trips</div>
                      <div className="text-xs text-amber-600 mt-1">{d.todayAlerts} alerts</div>
                    </td>
                    <td className="px-6 py-4 align-top text-indigo-600 font-medium">
                      <button onClick={() => navigate('/drivers')} className="text-sm hover:underline">View Details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
            </div>
          </div>
      )}
    </div>
  );
}
