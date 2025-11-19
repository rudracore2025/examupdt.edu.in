import { useState, useEffect } from 'react';
import { Mail, Trash2, Check } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { DataTable } from './DataTable';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { adminMessagesApi, ContactMessage } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const data = await adminMessagesApi.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await adminMessagesApi.markAsRead(id);
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, status: 'read' as const } : m))
      );
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await adminMessagesApi.delete(deleteId);
      setMessages(messages.filter((m) => m.id !== deleteId));
      toast.success('Message deleted successfully');
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      await handleMarkAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (message: ContactMessage) => (
        <a
          href={`mailto:${message.email}`}
          className="text-[#004AAD] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {message.email}
        </a>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (message: ContactMessage) => (
        <div className="max-w-md">
          <p className="truncate">{message.message}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (message: ContactMessage) => (
        <Badge
          variant="secondary"
          className={
            message.status === 'unread'
              ? 'bg-orange-500/10 text-orange-600'
              : 'bg-green-500/10 text-green-600'
          }
        >
          {message.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (message: ContactMessage) => <span>{formatDate(message.date)}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (message: ContactMessage) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewMessage(message);
            }}
          >
            <Mail className="w-4 h-4" />
          </Button>
          {message.status === 'unread' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead(message.id);
              }}
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(message.id);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h1 className="text-[#0A0A0A] text-2xl sm:text-3xl">Contact Messages</h1>
            <p className="text-[#0A0A0A]/60 text-sm sm:text-base">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
            </p>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={messages}
          columns={columns}
          searchPlaceholder="Search messages..."
          isLoading={isLoading}
          emptyMessage="No messages yet."
          mobileCardRender={(message) => (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#0A0A0A] mb-1">{message.name}</h3>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-sm text-[#004AAD] hover:underline truncate block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {message.email}
                  </a>
                </div>
                <Badge
                  variant="secondary"
                  className={`flex-shrink-0 ${
                    message.status === 'unread'
                      ? 'bg-orange-500/10 text-orange-600'
                      : 'bg-green-500/10 text-green-600'
                  }`}
                >
                  {message.status}
                </Badge>
              </div>
              <p className="text-sm text-[#0A0A0A]/80 line-clamp-2">{message.message}</p>
              <p className="text-xs text-[#0A0A0A]/60">{formatDate(message.date)}</p>
              <div className="pt-3 border-t border-gray-200 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewMessage(message);
                  }}
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  View
                </Button>
                {message.status === 'unread' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(message.id);
                    }}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark Read
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(message.id);
                  }}
                  className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        />
      </div>

      {/* View Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Message from {selectedMessage?.name}</DialogTitle>
            <DialogDescription className="text-sm">
              {selectedMessage?.email} • {selectedMessage && formatDate(selectedMessage.date)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-[#F5F5F5] rounded-lg p-4">
              <p className="text-[#0A0A0A] whitespace-pre-wrap text-sm sm:text-base">{selectedMessage?.message}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild className="flex-1 bg-[#004AAD]">
                <a href={`mailto:${selectedMessage?.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Reply via Email
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedMessage(null)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action cannot be undone. This will permanently delete the message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}