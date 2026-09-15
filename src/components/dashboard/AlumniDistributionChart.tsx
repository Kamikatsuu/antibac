import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import {
  GraduationCap,
  Building2,
  Calendar,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AlumniDistributionChartProps {
  users: UserProfile[];
  currentUser: UserProfile | null;
}

// Harmonious, high-contrast accessible color palette
const DEPARTMENT_COLORS = [
  '#2563eb', // Blue
  '#059669', // Emerald
  '#7c3aed', // Purple
  '#d97706', // Amber
  '#e11d48', // Rose
  '#0891b2', // Cyan
  '#4f46e5', // Indigo
  '#64748b'  // Slate
];

const BATCH_COLORS = [
  '#1d4ed8', // Dark Blue (2024)
  '#2563eb', // Blue (2023)
  '#3b82f6', // Light Blue (2022)
  '#60a5fa', // Sky (2021)
  '#93c5fd', // Soft Blue (2020)
  '#818cf8', // Indigo (2019)
  '#a78bfa', // Violet (2018)
  '#cbd5e1'  // Slate (Earlier)
];

// Helper to normalize course into institutional academic department
function getDepartmentFromProfile(user: UserProfile): string {
  if (user.department && user.department.trim() && user.department !== 'N/A') {
    return user.department;
  }
  const course = (user.course || '').toLowerCase();
  if (course.includes('information technology') || course.includes('computer science') || course.includes('software')) {
    return 'Information Technology & CS';
  }
  if (course.includes('accountancy') || course.includes('business') || course.includes('marketing') || course.includes('finance')) {
    return 'Business & Accountancy';
  }
  if (course.includes('nursing') || course.includes('health') || course.includes('clinical') || course.includes('medical')) {
    return 'Nursing & Health Sciences';
  }
  if (course.includes('education') || course.includes('arts') || course.includes('english')) {
    return 'Education & Liberal Arts';
  }
  if (course.includes('hospitality') || course.includes('tourism') || course.includes('hotel')) {
    return 'Hospitality & Tourism Mgmt';
  }
  if (course.includes('engineering') || course.includes('civil') || course.includes('electrical')) {
    return 'College of Engineering';
  }
  if (course.includes('criminology') || course.includes('justice')) {
    return 'College of Criminology';
  }
  return user.course || 'Institutional Programs';
}

export const AlumniDistributionChart: React.FC<AlumniDistributionChartProps> = ({
  users,
  currentUser
}) => {
  const [viewMode, setViewMode] = useState<'department' | 'batch'>('department');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Filter to alumni community members
  const alumniUsers = useMemo(() => {
    const list = users.filter((u) => u.role === 'alumni');
    // If no users flagged as alumni role yet, fall back to all users with batch/course
    return list.length > 0 ? list : users;
  }, [users]);

  // Aggregate by Department
  const departmentData = useMemo(() => {
    const map = new Map<string, number>();
    alumniUsers.forEach((u) => {
      const dept = getDepartmentFromProfile(u);
      map.set(dept, (map.get(dept) || 0) + 1);
    });

    const total = alumniUsers.length || 1;
    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
  }, [alumniUsers]);

  // Aggregate by Graduation Batch / Year
  const batchData = useMemo(() => {
    const map = new Map<string, number>();
    alumniUsers.forEach((u) => {
      const batch = u.batch && u.batch.trim() && u.batch !== 'N/A' ? `Class of ${u.batch}` : 'Earlier Cohorts';
      map.set(batch, (map.get(batch) || 0) + 1);
    });

    const total = alumniUsers.length || 1;
    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / total) * 100).toFixed(1)
      }))
      .sort((a, b) => {
        // Sort descending by batch year if possible
        const yearA = parseInt(a.name.replace(/\D/g, ''), 10) || 0;
        const yearB = parseInt(b.name.replace(/\D/g, ''), 10) || 0;
        return yearB - yearA;
      });
  }, [alumniUsers]);

  const activeData = viewMode === 'department' ? departmentData : batchData;
  const activeColors = viewMode === 'department' ? DEPARTMENT_COLORS : BATCH_COLORS;

  // Key metrics
  const topDepartment = departmentData[0]?.name || 'N/A';
  const topBatch = batchData[0]?.name || 'N/A';
  const totalGraduates = alumniUsers.length;

  // User's department or batch in the chart
  const userDept = currentUser ? getDepartmentFromProfile(currentUser) : null;
  const userBatch = currentUser?.batch ? `Class of ${currentUser.batch}` : null;

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-lg text-xs z-50">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: payload[0].fill }}
            />
            <span className="font-bold text-stone-900">{data.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-stone-600 mt-1">
            <span>Alumni Count:</span>
            <span className="font-semibold text-stone-900">{data.value} graduates</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-stone-600">
            <span>Community Share:</span>
            <span className="font-bold text-blue-600">{data.percentage}%</span>
          </div>
          {((viewMode === 'department' && userDept === data.name) ||
            (viewMode === 'batch' && userBatch === data.name)) && (
            <div className="mt-1.5 pt-1.5 border-t border-stone-100 text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
              ✓ Your graduation cohort
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Alumni Demographics & Cohort Distribution
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
              {totalGraduates} Graduates
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time distribution of Cecilian alumni across graduation cohorts and academic departments
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => {
              setViewMode('department');
              setSelectedSegment(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'department'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>By Department</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('batch');
              setSelectedSegment(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'batch'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>By Graduation Year</span>
          </button>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
          <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Total Alumni</span>
          </div>
          <div className="mt-1 font-bold text-lg text-stone-900">{totalGraduates}</div>
          <div className="text-[10px] text-stone-400">Verified institutional records</div>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
          <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Top Department</span>
          </div>
          <div className="mt-1 font-bold text-sm text-stone-900 truncate" title={topDepartment}>
            {topDepartment}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">
            {departmentData[0]?.percentage || 0}% of alumni base
          </div>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
          <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            <span>Largest Batch</span>
          </div>
          <div className="mt-1 font-bold text-sm text-stone-900 truncate">
            {topBatch}
          </div>
          <div className="text-[10px] text-purple-600 font-medium">
            {batchData[0]?.value || 0} registered graduates
          </div>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
          <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Your Cohort</span>
          </div>
          <div className="mt-1 font-bold text-sm text-stone-900 truncate">
            {currentUser?.batch ? `Batch ${currentUser.batch}` : 'Alumnus'}
          </div>
          <div className="text-[10px] text-stone-500 truncate" title={currentUser?.course}>
            {currentUser?.course || 'Enrolled Member'}
          </div>
        </div>
      </div>

      {/* Main Chart + Legend Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Recharts Pie Chart Canvas */}
        <div className="lg:col-span-6 h-64 sm:h-72 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                onClick={(entry) =>
                  setSelectedSegment(selectedSegment === entry.name ? null : entry.name)
                }
              >
                {activeData.map((entry, index) => {
                  const isSelected = selectedSegment === entry.name;
                  const isUserCohort =
                    (viewMode === 'department' && userDept === entry.name) ||
                    (viewMode === 'batch' && userBatch === entry.name);
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={activeColors[index % activeColors.length]}
                      stroke={isSelected || isUserCohort ? '#1e293b' : '#ffffff'}
                      strokeWidth={isSelected ? 3 : isUserCohort ? 2 : 1.5}
                      className="cursor-pointer transition-all hover:opacity-90"
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Summary */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              {viewMode === 'department' ? 'Departments' : 'Batches'}
            </span>
            <span className="text-2xl font-extrabold text-stone-900 leading-none mt-0.5">
              {activeData.length}
            </span>
            <span className="text-[10px] text-blue-600 font-medium mt-1">
              Active Cohorts
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Legend List */}
        <div className="lg:col-span-6 space-y-2 max-h-72 overflow-y-auto pr-1">
          <div className="text-xs font-bold text-stone-700 flex items-center justify-between pb-1.5 border-b border-stone-100">
            <span>
              {viewMode === 'department' ? 'Department / Academic Program' : 'Graduation Batch Cohort'}
            </span>
            <span className="text-stone-400">Graduates / Share</span>
          </div>

          {activeData.map((item, index) => {
            const isSelected = selectedSegment === item.name;
            const isUserCohort =
              (viewMode === 'department' && userDept === item.name) ||
              (viewMode === 'batch' && userBatch === item.name);

            return (
              <div
                key={item.name}
                onClick={() => setSelectedSegment(isSelected ? null : item.name)}
                className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-blue-50/80 border border-blue-200'
                    : 'hover:bg-stone-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: activeColors[index % activeColors.length] }}
                  />
                  <div className="truncate">
                    <span className="font-semibold text-stone-800 truncate block">
                      {item.name}
                    </span>
                    {isUserCohort && (
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        ★ Your Cohort
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-stone-900">{item.value}</span>
                  <span className="text-[11px] text-stone-400 ml-1.5">({item.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
