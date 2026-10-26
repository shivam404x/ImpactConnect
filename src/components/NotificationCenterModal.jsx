import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  HeartHandshake, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Mail, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  fetchNotificationPreferences, 
  updateNotificationPreferences 
} from '../utils/api';
import { translations } from '../data/translations';

export default function NotificationCenterModal({
  isOpen,
  currentUser,
  onClose,
  onNavigate,
  language = 'en'
}) {
  const t = translations[language] || translations.en;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'preferences'
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Preferences
  const [preferences, setPreferences] = useState({
    email_alerts_enabled: true,
    in_app_enabled: true,
    match_alerts: true,
    partnership_alerts: true,
    event_reminders: true
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const email = currentUser?.email || 'marcus.chen@apextech.com';
      const [notifData, prefData] = await Promise.all([
        fetchNotifications(email, currentUser?.id),
        currentUser?.id ? fetchNotificationPreferences(currentUser.id) : Promise.resolve(null)
      ]);
      setNotifications(notifData.notifications || []);
      setUnreadCount(notifData.unreadCount || 0);
      if (prefData) setPreferences(prefData);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleMarkAsRead = async (notif, e) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const email = currentUser?.email || 'marcus.chen@apextech.com';
      await markAllNotificationsAsRead(email);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePreferences = async () => {
    if (!currentUser?.id) return;
    setSavingPrefs(true);
    try {
      await updateNotificationPreferences(currentUser.id, preferences);
      alert('Notification preferences updated successfully.');
    } catch (err) {
      alert('Failed to save preferences: ' + err.message);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleItemClick = (notif) => {
    if (!notif.is_read) {
      markNotificationAsRead(notif.id).catch(() => {});
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    if (notif.target_page && onNavigate) {
      onNavigate(notif.target_page);
      onClose();
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'match_opportunity':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'partnership_update':
        return <HeartHandshake className="w-4 h-4 text-sky-500" />;
      case 'shift_confirmed':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'milestone_reached':
        return <CheckCircle2 className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-[#16A36A]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center shrink-0 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {t.notificationsTitle || 'Notification Center'}
              </h2>
              <span className="text-xs text-slate-500">
                {unreadCount} unread platform alert{unreadCount === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Sub-Header */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-slate-200 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`font-bold pb-1 border-b-2 transition ${
                activeTab === 'all'
                  ? 'border-[#16A36A] text-[#16A36A]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Alerts ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`font-bold pb-1 border-b-2 transition flex items-center space-x-1 ${
                activeTab === 'preferences'
                  ? 'border-[#16A36A] text-[#16A36A]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>

          {activeTab === 'all' && unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[#16A36A] hover:underline font-bold text-[11px] flex items-center space-x-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{t.markAllRead || 'Mark all as read'}</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* TAB 1: NOTIFICATIONS LIST */}
          {activeTab === 'all' && (
            <div className="space-y-3">
              {loading && (
                <div className="space-y-3">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="bg-white p-4 rounded-2xl border border-slate-200 h-20 animate-pulse" />
                  ))}
                </div>
              )}

              {!loading && notifications.length === 0 && (
                <div className="text-center py-16 text-slate-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">{t.noNotifications || 'No notifications right now.'}</p>
                </div>
              )}

              {!loading && notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start space-x-3 ${
                    notif.is_read
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs ${notif.is_read ? 'font-bold text-slate-800' : 'font-black text-slate-900'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      {notif.target_page && (
                        <span className="text-[10px] font-bold text-[#16A36A] hover:underline flex items-center space-x-1">
                          <span>View Update</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                      {!notif.is_read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notif, e)}
                          title="Mark as read"
                          className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 ml-auto flex items-center space-x-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t.notificationPrefs || 'Notification Preferences'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Control which platform events send in-app and email notifications.</p>
              </div>

              <div className="space-y-4 text-xs">
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block">In-App Desktop Notifications</span>
                    <span className="text-[11px] text-slate-500">Surface real-time activity and message updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.in_app_enabled}
                    onChange={(e) => setPreferences({ ...preferences, in_app_enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#16A36A] focus:ring-[#16A36A]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block">Matching Opportunities</span>
                    <span className="text-[11px] text-slate-500">When an initiative launches matching your skills or CSR focus</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.match_alerts}
                    onChange={(e) => setPreferences({ ...preferences, match_alerts: e.target.checked })}
                    className="w-4 h-4 rounded text-[#16A36A] focus:ring-[#16A36A]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block">Partnership Status Alerts</span>
                    <span className="text-[11px] text-slate-500">When an NGO accepts, responds to, or finalizes a proposal</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.partnership_alerts}
                    onChange={(e) => setPreferences({ ...preferences, partnership_alerts: e.target.checked })}
                    className="w-4 h-4 rounded text-[#16A36A] focus:ring-[#16A36A]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block">Volunteering Shift Reminders</span>
                    <span className="text-[11px] text-slate-500">24-hour reminder before upcoming registered shifts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.event_reminders}
                    onChange={(e) => setPreferences({ ...preferences, event_reminders: e.target.checked })}
                    className="w-4 h-4 rounded text-[#16A36A] focus:ring-[#16A36A]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block">Email Digest Integration</span>
                    <span className="text-[11px] text-slate-500">Dispatch weekly impact summaries to your email</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.email_alerts_enabled}
                    onChange={(e) => setPreferences({ ...preferences, email_alerts_enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#16A36A] focus:ring-[#16A36A]"
                  />
                </label>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSavePreferences}
                  disabled={savingPrefs}
                  className="w-full py-2.5 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                >
                  {savingPrefs ? 'Saving Settings...' : 'Save Notification Preferences'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}