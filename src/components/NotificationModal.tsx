import React, { useState } from "react";
import { NotificationItem } from "../types";
import { Bell, X, Check, Award, BookOpen, GraduationCap, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead
}) => {
  const { setActiveTab } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  if (!isOpen) return null;

  const filteredNotifs = filter === "all" ? notifications : notifications.filter((n) => !n.read);

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "recommendation":
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case "competency_boost":
        return <Award className="w-4 h-4 text-emerald-600" />;
      case "training":
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case "assessment":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleActionClick = (notif: NotificationItem) => {
    onMarkRead(notif.id);
    onClose();
    if (notif.actionUrl === "/igot-courses") setActiveTab("igot-courses");
    else if (notif.actionUrl === "/nssta-training") setActiveTab("nssta-training");
    else if (notif.actionUrl === "/competency-profile") setActiveTab("competency-profile");
    else if (notif.actionUrl === "/quiz-generator") setActiveTab("quiz-generator");
    else setActiveTab("dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Official Notifications</h3>
              <p className="text-xs text-slate-500">Ministry Competency & Training Alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 border-b border-slate-100 flex items-center gap-2 bg-white">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
              filter === "unread" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No notifications to display</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  notif.read ? "bg-white border-slate-200 text-slate-600" : "bg-blue-50/50 border-blue-200 text-slate-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-md shadow-xs shrink-0 mt-0.5 border border-slate-100">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-xs text-slate-900 truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(notif.timestamp).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>

                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100/80">
                      {notif.actionUrl ? (
                        <button
                          onClick={() => handleActionClick(notif)}
                          className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                        >
                          <span>Take Action</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span></span>
                      )}

                      {!notif.read && (
                        <button
                          onClick={() => onMarkRead(notif.id)}
                          className="text-[11px] text-slate-500 hover:text-slate-700 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark as read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
