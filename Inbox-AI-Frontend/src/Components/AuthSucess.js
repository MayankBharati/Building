import React, { useState, useEffect, memo, useMemo } from "react";
import {
  Mail,
  MessageSquare,
  BarChart2,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import ChatInterface from "./ChatInterface";

const Dashboard = () => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const accessToken = new URLSearchParams(window.location.search).get(
    "access_token"
  );
  const refreshToken = new URLSearchParams(window.location.search).get(
    "refresh_token"
  );

  useEffect(() => {
    if (!accessToken) return;

    const fetchEmails = async () => {
      try {
        const response = await fetch(
          `https://inbox-ai-backend.vercel.app/emails?access_token=${accessToken}`
        );
        const data = await response.json();
        setEmails(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching emails:", error);
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, [accessToken]);

  const metrics = {
    totalEmails: emails.length,
    responseRate: emails.length
      ? (emails.filter((e) => e.body).length / emails.length) * 100
      : 0,
    averageResponseTime: 2.3,
  };

  const SidebarButton = ({ icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const MetricCard = ({ icon: Icon, label, value, subtext }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
        </div>
      </div>
    </div>
  );

  const EmailList = () => (
    <div className="space-y-4">
      {emails.map((email, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium text-gray-900">{email.sender}</span>
            <span className="text-sm text-gray-500">2h ago</span>
          </div>
          <h3 className="font-medium text-gray-800 mb-1">{email.subject}</h3>
          <p className="text-gray-600 text-sm">
            {email.body?.substring(0, 100)}...
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-30 w-64 bg-white border-r transition-transform duration-200 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">Earthworm.AI</span>
            </div>
          </div>

          <div className="flex-1 py-4 space-y-1 px-2">
            <SidebarButton
              icon={BarChart2}
              label="Dashboard"
              active={activeSection === "dashboard"}
              onClick={() => setActiveSection("dashboard")}
            />
            <SidebarButton
              icon={MessageSquare}
              label="Email Assistant"
              active={activeSection === "chat"}
              onClick={() => setActiveSection("chat")}
            />
          </div>

          <div className="p-4 border-t">
            <SidebarButton
              icon={LogOut}
              label="Logout"
              onClick={() => console.log("Logout")}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden"
          >
            {isMobileSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeSection === "dashboard" ? (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  icon={Mail}
                  label="Total Emails"
                  value={metrics.totalEmails}
                  subtext="Last 30 days"
                />
                <MetricCard
                  icon={Users}
                  label="Response Rate"
                  value={`${metrics.responseRate.toFixed(1)}%`}
                  subtext="Average"
                />
                <MetricCard
                  icon={Clock}
                  label="Response Time"
                  value={`${metrics.averageResponseTime} min`}
                  subtext="Average"
                />
              </div>

              {/* Email List */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : emails.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No emails found
                  </h3>
                  <p className="text-gray-500">
                    Start by connecting your email account
                  </p>
                </div>
              ) : (
                <EmailList />
              )}
            </div>
          ) : <ChatInterface mails={emails} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
