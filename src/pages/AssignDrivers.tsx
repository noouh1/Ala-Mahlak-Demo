import { useState } from 'react';
import { Copy, Check, FileText, CheckCircle2, MapPin } from 'lucide-react';
import { COMPANY_CODE } from '../data/mockData';

export default function AssignDrivers() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    license: '',
    vehicleId: '',
    status: 'active',
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(COMPANY_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ fullName: '', email: '', phone: '', license: '', vehicleId: '', status: 'active' });
  };

  const assignmentSteps = [
    { title: 'Enter Driver Details', desc: 'Fill in all required information about the driver' },
    { title: 'Assign Vehicle', desc: 'Link the driver to their designated vehicle' },
    { title: 'Start Monitoring', desc: 'Driver is now active in your system' },
  ];

  const importantNotes = [
    'All fields marked with * are required',
    'Drivers will be notified via email after assignment',
    'Each vehicle should have a unique ID',
    'Other status can be changed user from the drivers list',
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left side - Form */}
      <div className="col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Assign Driver</h1>
          <p className="text-sm text-slate-500 mb-8">Add new drivers to your monitoring system</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Driver Information Section */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234-567-8900"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>

            {/* License & Vehicle Details Section */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4">License & Vehicle Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="license"
                    value={formData.license}
                    onChange={handleChange}
                    placeholder="DL1234567B"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vehicle ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    placeholder="VH-001"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Initial Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="break">On Break</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              Assign Driver
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Info panels */}
      <div className="col-span-1 space-y-5">
        {/* Company Code Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
          <p className="text-sm font-medium text-indigo-200 mb-2">Company Code</p>
          <div className="text-4xl font-bold tracking-widest mb-3">{COMPANY_CODE}</div>
          <p className="text-sm text-indigo-100 mb-4">Share this code with drivers to allow them to join your monitoring system.</p>
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium text-sm transition-colors"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Code
              </>
            )}
          </button>
        </div>

        {/* Assignment Process */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={16} className="text-indigo-600" />
            Assignment Process
          </h3>
          <div className="space-y-4">
            {assignmentSteps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center">
                    {idx + 1}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <MapPin size={16} />
            Important Notes
          </h3>
          <ul className="space-y-2">
            {importantNotes.map((note, idx) => (
              <li key={idx} className="text-xs text-amber-900 flex gap-2">
                <span className="font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
