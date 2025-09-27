import React, { useEffect } from 'react';
import { Notification, User } from '../../types';
import UserAvatar from '../common/UserAvatar';
import * as api from '../../api';
import { useSocket } from '../../contexts/SocketContext';

interface NotificationsPageProps {
  notifications: Notification[];
  onViewProfile: (user: User) => void;
  onViewMessage: (user: User) => void;
}

const NotificationItem: React.FC<{ notification: Notification; onViewProfile: (user: User) => void; onViewMessage: (user: User) => void; }> = ({ notification, onViewProfile, onViewMessage }) => {
  const { sender, type, timestamp } = notification;

  const renderText = () => {
    switch (type) {
      case 'follow':
        return 'started following you.';
      case 'like':
        return 'liked your post.';
      case 'comment':
        return 'commented on your post.';
      case 'message':
        return 'sent you a message.';
      default:
        return '';
    }
  };
  
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }
  
  const handleClick = () => {
      if (type === 'follow') {
          onViewProfile(sender);
      } else if (type === 'message') {
          onViewMessage(sender);
      }
      // Future: handle clicks for 'like' and 'comment' to go to the post
  };

  return (
    <div onClick={handleClick} className={`p-4 flex items-start space-x-4 border-b border-border cursor-pointer transition-colors hover:bg-background ${!notification.read ? 'bg-accent/5' : ''}`}>
      <div className="w-12 h-12 flex-shrink-0" onClick={(e) => { e.stopPropagation(); onViewProfile(sender);}}>
        <UserAvatar user={sender} />
      </div>
      <div className="flex-1">
        <p className="text-primary">
          <strong className="hover:underline" onClick={(e) => { e.stopPropagation(); onViewProfile(sender);}}>{sender.name}</strong>
          <span className="text-secondary"> @{sender.username} </span>
          {renderText()}
        </p>
        <p className="text-sm text-secondary mt-1">{timeAgo(timestamp)}</p>
      </div>
    </div>
  );
};

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onViewProfile, onViewMessage }) => {
  const { setNotifications } = useSocket();
  
  useEffect(() => {
      const markAsRead = async () => {
          try {
              if (notifications.some(n => !n.read)) {
                  await api.markNotificationsRead();
                  setNotifications(prev => prev.map(n => ({...n, read: true})));
              }
          } catch (error) {
              console.error("Failed to mark notifications as read", error);
          }
      };
      const timer = setTimeout(markAsRead, 2000); // Mark as read after 2 seconds on view
      return () => clearTimeout(timer);
  }, [notifications, setNotifications]);
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6 font-display">Notifications</h1>
      <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onViewProfile={onViewProfile} 
                onViewMessage={onViewMessage}
            />
          ))
        ) : (
          <p className="text-center text-secondary p-8">You have no notifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
