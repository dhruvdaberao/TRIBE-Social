






// import React, { useEffect, useCallback } from 'react';
// import { Notification, User } from '../../types';
// import UserAvatar from '../common/UserAvatar';
// import * as api from '../../api';
// import { useSocket } from '../../contexts/SocketContext';

// interface NotificationsPageProps {
//   notifications: Notification[];
//   onViewProfile: (user: User) => void;
//   onViewMessage: (user: User) => void;
//   onViewPost: (postId: string) => void;
// }

// const NotificationItem: React.FC<{ notification: Notification; onViewProfile: (user: User) => void; onViewMessage: (user: User) => void; onViewPost: (postId: string) => void; }> = ({ notification, onViewProfile, onViewMessage, onViewPost }) => {
//   const { sender, type, timestamp } = notification;

//   const renderText = () => {
//     switch (type) {
//       case 'follow':
//         return 'started following you.';
//       case 'like':
//         return 'liked your post.';
//       case 'comment':
//         return 'commented on your post.';
//       case 'message':
//         return 'sent you a message.';
//       default:
//         return '';
//     }
//   };
  
//   const timeAgo = (dateString: string) => {
//     if (!dateString) return '...';
//     const date = new Date(dateString);
//     const now = new Date();
//     const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
//     const minutes = Math.round(seconds / 60);
//     const hours = Math.round(minutes / 60);
//     const days = Math.round(hours / 24);

//     if (seconds < 60) return `${seconds}s ago`;
//     if (minutes < 60) return `${minutes}m ago`;
//     if (hours < 24) return `${hours}h ago`;
//     if (days < 7) return `${days}d ago`;
//     return date.toLocaleDateString();
//   }
  
//   const handleClick = () => {
//       if (type === 'follow') {
//           onViewProfile(sender);
//       } else if (type === 'message') {
//           onViewMessage(sender);
//       } else if ((type === 'like' || type === 'comment') && notification.postId) {
//           onViewPost(notification.postId);
//       }
//   };

//   return (
//     <div onClick={handleClick} className={`p-4 flex items-start space-x-4 border-b border-border cursor-pointer transition-colors hover:bg-background ${!notification.read ? 'bg-accent/5' : ''}`}>
//       <div className="w-12 h-12 flex-shrink-0" onClick={(e) => { e.stopPropagation(); onViewProfile(sender);}}>
//         <UserAvatar user={sender} />
//       </div>
//       <div className="flex-1">
//         <p className="text-primary">
//           <strong className="hover:underline" onClick={(e) => { e.stopPropagation(); onViewProfile(sender);}}>{sender.name}</strong>
//           <span className="text-secondary"> @{sender.username} </span>
//           {renderText()}
//         </p>
//         <p className="text-sm text-secondary mt-1">{timeAgo(timestamp)}</p>
//       </div>
//     </div>
//   );
// };

// const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onViewProfile, onViewMessage, onViewPost }) => {
//   const { setNotifications } = useSocket();
  
//   const markAsRead = useCallback(async () => {
//     try {
//         if (notifications.some(n => !n.read)) {
//             await api.markNotificationsRead();
//             setNotifications(prev => prev.map(n => ({...n, read: true})));
//         }
//     } catch (error) {
//         console.error("Failed to mark notifications as read", error);
//     }
//   }, [notifications, setNotifications]);

//   useEffect(() => {
//     // Mark as read after a short delay to allow user to see what's new
//     const timer = setTimeout(() => {
//         markAsRead();
//     }, 2000); 

//     return () => clearTimeout(timer);
//   }, [markAsRead]);
  
//   return (
//     <div className="max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold text-primary mb-6 font-display">Notifications</h1>
//       <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden">
//         {notifications.length > 0 ? (
//           notifications.map(notification => (
//             <NotificationItem 
//                 key={notification.id} 
//                 notification={notification} 
//                 onViewProfile={onViewProfile} 
//                 onViewMessage={onViewMessage}
//                 onViewPost={onViewPost}
//             />
//           ))
//         ) : (
//           <p className="text-center text-secondary p-8">You have no notifications yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;






import React, { useEffect, useCallback } from 'react';
import { Notification, User } from '../../types';
import UserAvatar from '../common/UserAvatar';
import * as api from '../../api';
import { useSocket } from '../../contexts/SocketContext';

interface NotificationsPageProps {
  notifications: Notification[];
  onViewProfile: (user: User) => void;
  onViewMessage: (user: User) => void;
  onViewPost: (postId: string) => void;
}

const timeAgo = (dateString: string) => {
    if (!dateString) return '...';
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
};

const NotificationItem: React.FC<{ notification: Notification; onViewProfile: (user: User) => void; onViewMessage: (user: User) => void; onViewPost: (postId: string) => void; }> = ({ notification, onViewProfile, onViewMessage, onViewPost }) => {
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
  
  const getDetailsText = () => {
    switch (notification.type) {
        case 'follow': return 'View Profile';
        case 'message': return 'View Message';
        case 'like': return 'View Post';
        case 'comment': return 'View Post';
        default: return 'View Details';
    }
  };
  
  const handleClick = () => {
      if (type === 'follow') {
          onViewProfile(sender);
      } else if (type === 'message') {
          onViewMessage(sender);
      } else if ((type === 'like' || type === 'comment') && notification.postId) {
          onViewPost(notification.postId);
      }
  };

  const Icon = {
    like: <HeartIcon />,
    comment: <CommentIcon />,
    follow: <FollowIcon />,
    message: <MessageIcon />
  }[notification.type];

  return (
    <div className={`bg-surface rounded-2xl border shadow-sm p-4 transition-colors ${!notification.read ? 'border-accent/50' : 'border-border'}`}>
        <div className="flex items-start space-x-4">
            <div className="relative flex-shrink-0">
                <div className="w-12 h-12 cursor-pointer" onClick={(e) => { e.stopPropagation(); onViewProfile(sender);}}>
                    <UserAvatar user={sender} />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-surface p-0.5 rounded-full ring-2 ring-surface">
                    <div className="w-5 h-5 text-accent">
                        {Icon}
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <p className="text-primary text-sm leading-relaxed">
                    <strong className="hover:underline cursor-pointer" onClick={(e) => { e.stopPropagation(); onViewProfile(sender);}}>{sender.name}</strong>
                    <span className="text-secondary"> @{sender.username} </span>
                    {renderText()}
                </p>
                <p className="text-xs text-secondary mt-1">{timeAgo(timestamp)}</p>
            </div>
        </div>
        <div className="mt-3 flex justify-end">
            <button
                onClick={handleClick}
                className="text-sm font-semibold bg-accent/10 text-accent px-4 py-1.5 rounded-lg hover:bg-accent/20 transition-colors"
            >
                {getDetailsText()}
            </button>
        </div>
    </div>
  );
};

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onViewProfile, onViewMessage, onViewPost }) => {
  const { setNotifications } = useSocket();
  
  const markAsRead = useCallback(async () => {
    try {
        if (notifications.some(n => !n.read)) {
            await api.markNotificationsRead();
            setNotifications(prev => prev.map(n => ({...n, read: true})));
        }
    } catch (error) {
        console.error("Failed to mark notifications as read", error);
    }
  }, [notifications, setNotifications]);

  useEffect(() => {
    const timer = setTimeout(() => {
        markAsRead();
    }, 2000); 

    return () => clearTimeout(timer);
  }, [markAsRead]);
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6 font-display">Notifications</h1>
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onViewProfile={onViewProfile} 
                onViewMessage={onViewMessage}
                onViewPost={onViewPost}
            />
          ))
        ) : (
          <div className="bg-surface rounded-2xl border border-border shadow-md text-center text-secondary p-8">
            <p>You have no notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ICONS ---
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="w-full h-full">{children}</div>;
const HeartIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg></IconWrapper>;
const CommentIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg></IconWrapper>;
const FollowIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg></IconWrapper>;
const MessageIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg></IconWrapper>;

export default NotificationsPage;