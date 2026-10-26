import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  HeartHandshake, 
  CheckCircle2, 
  Truck, 
  Flame, 
  QrCode, 
  FolderKanban, 
  Bell, 
  Bookmark, 
  Clock, 
  ExternalLink,
  Filter,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { fetchActivityFeed, fetchUserFollows, toggleProjectFollow } from '../utils/api';

const EVENT_TYPE_CONFIG = {
  partnership_accepted: {
    icon: HeartHandshake,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotColor: 'bg-emerald-500'
  },
  partnership_request: {
    icon: Bell,
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500'
  },
  milestone_completed: {
    icon: CheckCircle2,
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    dotColor: 'bg-blue-500'
  },
  resource_delivered: {
    icon: Truck,
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    dotColor: 'bg-purple-500'
  },
  urgent_pledged: {
    icon: Flame,
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    dotColor: 'bg-rose-500'
  },
  volunteer_checked_in: {
    icon: QrCode,
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    dotColor: 'bg-teal-500'
  }
};

export default function LiveActivityFeed({
  currentUser,
  onSelectProject
}) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'milestones' | 'partnerships' | 'resources'
  const [followingOnly, setFollowingOnly] = useState(false);
  const [userFollows, setUserFollows] = useState([]);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const [feedData, followsData] = await Promise.all([
        fetchActivityFeed({}),
        currentUser?.id ? fetchUserFollows(currentUser.id).catch(() => []) : []
      ]);
      setFeed(feedData);
      setUserFollows(followsData);
    } catch (err) {
      console.error('Error fetching activity feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [currentUser]);

  // Filter feed entries
  const filteredFeed = feed.filter(item => {
    if (followingOnly && item.project_id && !userFollows.includes(item.project_id)) {
      return false;
    }
    if (filterType === 'partnerships') {
      return item.type?.includes('partnership');
    }
    if (filterType === 'milestones') {
      return item.type?.includes('milestone');
    }
    if (filterType === 'resources') {
      return item.type?.includes('resource') || item.type?.includes('urgent');
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Live Impact Stream</h2>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A] animate-ping" />
                <span>Real-Time Sync</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified operational events across community milestones, resource deliveries & partnerships.
            </p>
          </div>
        </div>

        <button
          onClick={loadFeed}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 self-start sm:self-center transition"
          title="Refresh Feed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Control Strip */}
      <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Category Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              filterType === 'all' ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilterType('partnerships')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              filterType === 'partnerships' ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Partnerships
          </button>
          <button
            onClick={() => setFilterType('milestones')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              filterType === 'milestones' ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Milestones
          </button>
          <button
            onClick={() => setFilterType('resources')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              filterType === 'resources' ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Resources & Goods
          </button>
        </div>

        {/* Following Toggle */}
        {currentUser && (
          <label className="flex items-center space-x-2 font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={followingOnly}
              onChange={(e) => setFollowingOnly(e.target.checked)}
              className="rounded text-[#16A36A] focus:ring-[#16A36A]"
            />
            <span>Followed Projects Only ({userFollows.length})</span>
          </label>
        )}
      </div>

      {/* Feed List */}
      <div className="divide-y divide-slate-100 p-6 space-y-4 max-h-[550px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Loading activity stream...
          </div>
        ) : filteredFeed.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No events match the selected criteria.
          </div>
        ) : (
          filteredFeed.map(item => {
            const config = EVENT_TYPE_CONFIG[item.type] || {
              icon: Sparkles,
              badgeBg: 'bg-slate-100 text-slate-700',
              dotColor: 'bg-slate-400'
            };
            const Icon = config.icon;

            return (
              <div key={item.id} className="pt-4 first:pt-0 flex items-start space-x-3.5 group">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${config.badgeBg}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {new Date(item.timestamp || item.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                    {item.actor_name && (
                      <span className="font-semibold text-slate-700">
                        By {item.actor_name}
                      </span>
                    )}
                    {item.project_title && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => onSelectProject && onSelectProject({ id: item.project_id, title: item.project_title })}
                          className="text-[#16A36A] hover:underline font-bold truncate max-w-[200px]"
                        >
                          {item.project_title}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
