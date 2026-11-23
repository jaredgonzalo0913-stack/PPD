import { Bell } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabase';
import { setDeepLink } from '../utils/deepLinks';

interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  related_type: 'announcement' | 'assessment' | 'module' | 'submission';
  related_id: string;
  created_at: string;
  read_at: string | null;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
};

const describeNotificationError = (error: { code?: string; message: string }) =>
  error.code === 'PGRST205' || /schema cache/i.test(error.message)
    ? 'Notifications are temporarily unavailable. The required database update may need approval.'
    : 'Notifications are temporarily unavailable. Please try again later.';

export default function NotificationBell({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    setError(null);
    const [notificationResult, unreadResult] = await Promise.all([
      supabase
        .from('notifications')
        .select('id, title, description, related_type, related_id, created_at, read_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('read_at', null),
    ]);
    if (notificationResult.error || unreadResult.error) {
      const failure = notificationResult.error ?? unreadResult.error;
      if (failure) console.error('Unable to load notifications.', failure);
      setError(failure ? describeNotificationError(failure) : 'Unable to load notifications.');
    } else {
      setNotifications((notificationResult.data ?? []) as NotificationRecord[]);
      setUnreadCount(unreadResult.count ?? 0);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const openNotification = async (notification: NotificationRecord) => {
    if (!notification.read_at) {
      const readAt = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read_at: readAt })
        .eq('id', notification.id)
        .eq('user_id', user?.id ?? '');
      if (updateError) {
        console.error('Unable to mark notification as read.', updateError);
        setError('Unable to update this notification. Please try again.');
        return;
      }
      setNotifications((current) => current.map((item) =>
        item.id === notification.id ? { ...item, read_at: readAt } : item,
      ));
      setUnreadCount((current) => Math.max(0, current - 1));
    }

    if (notification.related_type === 'submission') {
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .select('assessment_id')
        .eq('id', notification.related_id)
        .maybeSingle();
      if (submissionError || !submission?.assessment_id) {
        if (submissionError) console.error('Unable to open the graded assessment.', submissionError);
        setError('Unable to open this graded assessment. Please try again.');
        return;
      }
      setDeepLink({ assessment: submission.assessment_id });
      setCurrentPage('assessments');
    } else if (notification.related_type === 'assessment') {
      setDeepLink({ assessment: notification.related_id });
      setCurrentPage('assessments');
    } else if (notification.related_type === 'announcement') {
      setDeepLink({ announcement: notification.related_id });
      setCurrentPage('modules');
    } else {
      const moduleNumber = Number(notification.related_id);
      setDeepLink(Number.isInteger(moduleNumber) && moduleNumber > 0 ? { module: String(moduleNumber) } : {});
      setCurrentPage('modules');
    }
    onOpenChange(false);
  };

  const markAllRead = async () => {
    if (!user?.id || unreadCount === 0) return;
    const readAt = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('notifications')
      .update({ read_at: readAt })
      .eq('user_id', user.id)
      .is('read_at', null);
    if (updateError) {
      console.error('Unable to mark notifications as read.', updateError);
      setError('Unable to update notifications. Please try again.');
      return;
    }
    setNotifications((current) => current.map((notification) => ({
      ...notification,
      read_at: notification.read_at ?? readAt,
    })));
    setUnreadCount(0);
  };

  return (
    <div className="relative" data-header-panel>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        className="button-ghost relative"
      >
        <Bell className="inline h-4 w-4" aria-hidden="true" />
        <span className="ml-1">Notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1 text-center text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] rounded-lg border border-cyan/30 bg-navy p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="heading-subsection">Notifications</h2>
            <button type="button" onClick={() => void loadNotifications()} className="text-xs text-cyan underline">
              Refresh
            </button>
            <button
              type="button"
              onClick={() => void markAllRead()}
              disabled={unreadCount === 0}
              className="text-xs text-cyan underline disabled:opacity-50"
            >
              Mark all read
            </button>
          </div>
          {loading ? (
            <p role="status" className="text-sm text-light-gray">Loading notifications...</p>
          ) : error ? (
            <p role="alert" className="text-sm text-red-300">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-light-gray">No notifications are available.</p>
          ) : (
            <ul className="max-h-96 space-y-2 overflow-y-auto">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => void openNotification(notification)}
                    className={`w-full rounded-md border p-3 text-left ${notification.read_at ? 'border-cyan/10 bg-white/5' : 'border-cyan/40 bg-cyan/10'}`}
                  >
                    <span className="block font-semibold text-cyan">{notification.title}</span>
                    <span className="mt-1 block text-sm text-light-gray">{notification.description}</span>
                    <span className="mt-2 block text-xs text-light-gray/70">{formatDate(notification.created_at)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
