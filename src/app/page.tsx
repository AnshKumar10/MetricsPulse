"use client";
import React, { useState, useEffect } from "react";
import {
  Bell,
  Circle,
  AlertCircle,
  XCircle,
  BarChart3,
  LineChart,
  Activity,
  Thermometer,
  Users,
  BellOffIcon,
  BellIcon,
  ClockIcon,
  ActivityIcon,
  AlertOctagonIcon,
  ArrowRightIcon,
  BarChartIcon,
  BellRingIcon,
  InfoIcon,
  HeartPulse,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

// Types
type MetricType = "temperature" | "traffic" | "visitors";
type AlertSeverity = "critical" | "warning" | "info";
type AlertStatus = "new" | "acknowledged" | "resolved";

interface Metric {
  id: string;
  name: string;
  type: MetricType;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  thresholds: {
    warning: number;
    critical: number;
  };
  history: { time: string; value: number }[];
}

interface Alert {
  id: string;
  timestamp: Date;
  metricId: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
}

// Generate mock data
const generateMetrics = (): Metric[] => {
  return [
    {
      id: "temp-server-1",
      name: "Server Room Temperature",
      type: "temperature",
      value: 72,
      unit: "°F",
      status: "normal",
      thresholds: {
        warning: 80,
        critical: 90,
      },
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          time: `${i}:00`,
          value: 70 + Math.floor(Math.random() * 8),
        })),
    },
    {
      id: "traffic-main",
      name: "Network Traffic",
      type: "traffic",
      value: 68,
      unit: "Mbps",
      status: "normal",
      thresholds: {
        warning: 85,
        critical: 95,
      },
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          time: `${i}:00`,
          value: 45 + Math.floor(Math.random() * 30),
        })),
    },
    {
      id: "visitors-website",
      name: "Website Visitors",
      type: "visitors",
      value: 342,
      unit: "users",
      status: "warning",
      thresholds: {
        warning: 300,
        critical: 500,
      },
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          time: `${i}:00`,
          value: 200 + Math.floor(Math.random() * 350),
        })),
    },
    {
      id: "temp-server-2",
      name: "Database Server Temperature",
      type: "temperature",
      value: 86,
      unit: "°F",
      status: "warning",
      thresholds: {
        warning: 80,
        critical: 90,
      },
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          time: `${i}:00`,
          value: 75 + Math.floor(Math.random() * 15),
        })),
    },
    {
      id: "traffic-backup",
      name: "Backup Network Traffic",
      type: "traffic",
      value: 12,
      unit: "Mbps",
      status: "normal",
      thresholds: {
        warning: 85,
        critical: 95,
      },
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          time: `${i}:00`,
          value: 10 + Math.floor(Math.random() * 10),
        })),
    },
    {
      id: "visitors-api",
      name: "API Requests",
      type: "visitors",
      value: 523,
      unit: "req/min",
      status: "critical",
      thresholds: {
        warning: 450,
        critical: 500,
      },
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          time: `${i}:00`,
          value: 400 + Math.floor(Math.random() * 200),
        })),
    },
  ];
};

const generateAlerts = (): Alert[] => {
  const now = new Date();
  return [
    {
      id: crypto.randomUUID(),
      timestamp: new Date(now.getTime() - 5 * 60000),
      metricId: "visitors-api",
      message: "API Requests exceeded critical threshold of 500 req/min",
      severity: "critical",
      status: "new",
    },
    {
      id: crypto.randomUUID(),
      timestamp: new Date(now.getTime() - 25 * 60000),
      metricId: "visitors-website",
      message:
        "Website Visitors approaching capacity, current value: 342 users",
      severity: "warning",
      status: "new",
    },
    {
      id: crypto.randomUUID(),
      timestamp: new Date(now.getTime() - 55 * 60000),
      metricId: "temp-server-2",
      message: "Database Server Temperature above normal: 86°F",
      severity: "warning",
      status: "acknowledged",
    },
    {
      id: crypto.randomUUID(),
      timestamp: new Date(now.getTime() - 120 * 60000),
      metricId: "traffic-main",
      message: "Network Traffic spike detected: 87 Mbps",
      severity: "info",
      status: "resolved",
    },
  ];
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState<Metric[]>(generateMetrics());
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "alerts">(
    "overview"
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [metricsViewMode, setMetricsViewMode] = useState<"grid" | "list">(
    "grid"
  );

  // Simulate real-time data updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setMetrics((currentMetrics) => {
        return currentMetrics.map((metric) => {
          // Generate a new value with some randomness
          let newValue: number;

          if (metric.type === "temperature") {
            newValue = metric.value + (Math.random() * 2 - 1);
          } else if (metric.type === "traffic") {
            newValue = metric.value + (Math.random() * 8 - 4);
          } else {
            newValue = metric.value + (Math.random() * 20 - 10);
          }

          // Ensure values stay within reasonable bounds
          newValue = Math.max(0, newValue);

          // Update status based on thresholds
          let newStatus: "normal" | "warning" | "critical" = "normal";
          if (newValue >= metric.thresholds.critical) {
            newStatus = "critical";
          } else if (newValue >= metric.thresholds.warning) {
            newStatus = "warning";
          }

          // Add new value to history
          const now = new Date();
          const timeStr = `${now.getHours()}:${now
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          const newHistory = [
            ...metric.history.slice(-23),
            { time: timeStr, value: newValue },
          ];

          return {
            ...metric,
            value: Math.round(newValue * 10) / 10,
            status: newStatus,
            history: newHistory,
          };
        });
      });
    }, 5000);

    // Generate new alerts occasionally
    const alertInterval = setInterval(() => {
      setMetrics((currentMetrics) => {
        const criticalMetrics = currentMetrics.filter(
          (m) => m.status === "critical"
        );
        const warningMetrics = currentMetrics.filter(
          (m) => m.status === "warning"
        );

        if (
          criticalMetrics.length > 0 ||
          (warningMetrics.length > 0 && Math.random() > 0.7)
        ) {
          const sourceMetric =
            criticalMetrics.length > 0
              ? criticalMetrics[
                  Math.floor(Math.random() * criticalMetrics.length)
                ]
              : warningMetrics[
                  Math.floor(Math.random() * warningMetrics.length)
                ];

          const severity: AlertSeverity =
            sourceMetric.status === "critical" ? "critical" : "warning";

          setAlerts((currentAlerts) => [
            {
              id: `alert-${Date.now()}`,
              timestamp: new Date(),
              metricId: sourceMetric.id,
              message: `${sourceMetric.name} ${
                severity === "critical" ? "exceeded" : "approaching"
              } ${severity} threshold: ${sourceMetric.value}${
                sourceMetric.unit
              }`,
              severity,
              status: "new",
            },
            ...currentAlerts.slice(0, 19), // Keep only last 20 alerts
          ]);
        }

        return currentMetrics;
      });
    }, 30000);

    return () => {
      clearInterval(updateInterval);
      clearInterval(alertInterval);
    };
  }, []);

  // Format time relative to now
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffMin < 1) {
      return "just now";
    } else if (diffMin < 60) {
      return `${diffMin}m ago`;
    } else {
      return `${diffHour}h ${diffMin % 60}m ago`;
    }
  };

  // Get the status icon based on metric status
  const getStatusIcon = (status: "normal" | "warning" | "critical") => {
    switch (status) {
      case "normal":
        return <Circle className="text-green-500 mr-2" size={16} />;
      case "warning":
        return <AlertCircle className="text-yellow-500 mr-2" size={16} />;
      case "critical":
        return <XCircle className="text-red-500 mr-2" size={16} />;
    }
  };

  // Get the severity icon based on alert severity
  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "info":
        return <Circle className="text-blue-500" size={16} />;
      case "warning":
        return <AlertCircle className="text-yellow-500" size={16} />;
      case "critical":
        return <XCircle className="text-red-500" size={16} />;
    }
  };

  // Get the metric icon based on metric type
  const getMetricIcon = (type: MetricType) => {
    switch (type) {
      case "temperature":
        return <Thermometer size={20} className="mr-2" />;
      case "traffic":
        return <Activity size={20} className="mr-2" />;
      case "visitors":
        return <Users size={20} className="mr-2" />;
    }
  };

  // Dashboard stats
  const criticalCount = metrics.filter((m) => m.status === "critical").length;
  const warningCount = metrics.filter((m) => m.status === "warning").length;
  const normalCount = metrics.filter((m) => m.status === "normal").length;
  const newAlertsCount = alerts.filter((a) => a.status === "new").length;

  return (
    <div
      className={`min-h-screen bg-gray-900 text-white transition-colors duration-300`}
    >
      <nav className="fixed top-0 inset-x-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-6 py-4 shadow-sm text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HeartPulse className="text-blue-400" size={24} />
          <h1 className="text-xl font-semibold tracking-wide">MetricsPulse</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Bell className="text-gray-300" size={20} />
              {newAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {newAlertsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-lg overflow-hidden border border-gray-700 shadow-xl z-50 bg-gray-900">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
                  <div className="flex items-center gap-2">
                    <BellIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-white font-semibold text-sm">
                      Alerts
                    </span>
                  </div>
                  {newAlertsCount > 0 && (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-red-700 text-red-100">
                      {newAlertsCount} new
                    </span>
                  )}
                </div>

                {/* Notifications list */}
                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                  {alerts.filter((a) => a.status !== "resolved").length > 0 ? (
                    alerts
                      .filter((a) => a.status !== "resolved")
                      .slice(0, 5)
                      .map((alert) => (
                        <div
                          key={alert.id}
                          className={`relative px-4 py-3 border-b border-gray-800 ${
                            alert.status === "new"
                              ? "bg-gray-800/60"
                              : "bg-gray-900"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`mt-0.5 ${
                                alert.severity === "critical"
                                  ? "text-red-400"
                                  : alert.severity === "warning"
                                  ? "text-yellow-400"
                                  : "text-blue-400"
                              }`}
                            >
                              {getSeverityIcon(alert.severity)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-100">
                                {alert.message}
                              </p>
                              <div className="mt-1 flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                  {formatRelativeTime(alert.timestamp)}
                                </span>
                                {alert.status === "new" && (
                                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="py-8 px-4 text-center text-gray-400">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-700">
                        <BellOffIcon className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-gray-100">
                        All caught up!
                      </p>
                      <p className="mt-1 text-xs">No active notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-6 pt-20 px-4">
        <div className="mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {["overview", "metrics"].map((tab) => (
              <button
                key={tab}
                className={`relative py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-200
          ${
            activeTab === tab
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
                onClick={() => setActiveTab(tab as "overview" | "metrics")}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-sm" />
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* System Status Card */}
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/60 shadow-lg overflow-hidden flex flex-col">
                <div
                  className={`h-1 w-full ${
                    criticalCount > 0
                      ? "bg-gradient-to-r from-red-600 to-red-500"
                      : warningCount > 0
                      ? "bg-gradient-to-r from-yellow-600 to-yellow-500"
                      : "bg-gradient-to-r from-green-600 to-green-500"
                  }`}
                ></div>

                <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <ActivityIcon size={18} className="text-gray-400" />
                      <h3 className="text-lg font-semibold text-white">
                        System Status
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        criticalCount > 0
                          ? "bg-red-900/50 text-red-200 border border-red-700/30"
                          : warningCount > 0
                          ? "bg-yellow-900/50 text-yellow-200 border border-yellow-700/30"
                          : "bg-green-900/50 text-green-200 border border-green-700/30"
                      }`}
                    >
                      {criticalCount > 0
                        ? "Critical Issues"
                        : warningCount > 0
                        ? "Warnings"
                        : "All Systems Normal"}
                    </span>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/40">
                      <div className="flex items-center gap-3">
                        <Circle className="text-green-500" size={16} />
                        <span className="text-gray-200">Normal</span>
                      </div>
                      <span className="font-semibold text-white bg-gray-500/20 px-2.5 py-1 rounded-md">
                        {normalCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/40">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="text-yellow-500" size={16} />
                        <span className="text-gray-200">Warning</span>
                      </div>
                      <span className="font-semibold text-white bg-yellow-500/20 px-2.5 py-1 rounded-md">
                        {warningCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/40">
                      <div className="flex items-center gap-3">
                        <XCircle className="text-red-500" size={16} />
                        <span className="text-gray-200">Critical</span>
                      </div>
                      <span className="font-semibold text-white bg-red-500/20 px-2.5 py-1 rounded-md">
                        {criticalCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Alerts Card */}
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/60 shadow-lg overflow-hidden flex flex-col">
                <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <BellIcon size={18} className="text-gray-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Active Alerts
                      </h3>
                    </div>
                    <span className="text-sm text-gray-400 bg-gray-700/60 px-2.5 py-1 rounded-md">
                      Last 24 hours
                    </span>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-900/20 border border-red-800/20">
                      <div className="flex items-center gap-3">
                        <XCircle className="text-red-500" size={16} />
                        <span className="text-gray-200">Critical</span>
                      </div>
                      <span className="font-semibold text-white bg-red-500/20 px-2.5 py-1 rounded-md">
                        {
                          alerts.filter(
                            (a) =>
                              a.severity === "critical" &&
                              a.status !== "resolved"
                          ).length
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-900/20 border border-yellow-800/20">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="text-yellow-500" size={16} />
                        <span className="text-gray-200">Warning</span>
                      </div>
                      <span className="font-semibold text-white bg-yellow-500/20 px-2.5 py-1 rounded-md">
                        {
                          alerts.filter(
                            (a) =>
                              a.severity === "warning" &&
                              a.status !== "resolved"
                          ).length
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-900/20 border border-blue-800/20">
                      <div className="flex items-center gap-3">
                        <InfoIcon className="text-blue-500" size={16} />
                        <span className="text-gray-200">Info</span>
                      </div>
                      <span className="font-semibold text-white bg-blue-500/20 px-2.5 py-1 rounded-md">
                        {
                          alerts.filter(
                            (a) =>
                              a.severity === "info" && a.status !== "resolved"
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Activity Chart Card */}
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/60 shadow-lg overflow-hidden flex flex-col">
                <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <BarChartIcon size={18} className="text-gray-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Current Activity
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm bg-gray-700/60 text-green-400 px-2.5 py-1 rounded-md">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Live
                    </div>
                  </div>

                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={metrics[2].history.slice(-10)}>
                        <defs>
                          <linearGradient
                            id="colorValue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#374151"
                          opacity={0.4}
                        />
                        <XAxis
                          dataKey="time"
                          stroke="#9ca3af"
                          tick={{ fill: "#9ca3af" }}
                          axisLine={{ stroke: "#4b5563" }}
                          tickLine={{ stroke: "#4b5563" }}
                        />
                        <YAxis
                          stroke="#9ca3af"
                          tick={{ fill: "#9ca3af" }}
                          axisLine={{ stroke: "#4b5563" }}
                          tickLine={{ stroke: "#4b5563" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#374151",
                            borderRadius: "0.5rem",
                            color: "#f3f4f6",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }}
                          itemStyle={{ color: "#f3f4f6" }}
                          labelStyle={{ color: "#9ca3af" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4, strokeWidth: 2, fill: "#1f2937" }}
                          activeDot={{ r: 6, strokeWidth: 0, fill: "#60a5fa" }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Metrics Table */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/60 shadow-lg overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                    <AlertOctagonIcon size={18} className="text-gray-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Critical Metrics
                    </h3>
                  </div>
                  <button
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors bg-gray-700/60 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm"
                    onClick={() => setActiveTab("metrics")}
                  >
                    View all metrics
                    <ArrowRightIcon size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-700">
                  <table className="w-full min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Metric
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800/30">
                      {metrics
                        .filter(
                          (m) =>
                            m.status === "critical" || m.status === "warning"
                        )
                        .map((metric) => (
                          <tr
                            key={metric.id}
                            className="hover:bg-gray-700/30 transition-colors"
                          >
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                {getMetricIcon(metric.type)}
                                <span className="font-medium text-gray-200">
                                  {metric.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div className="text-gray-200 font-mono bg-gray-700/40 px-2.5 py-1 rounded inline-block">
                                {metric.value} {metric.unit}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(metric.status)}
                                <span
                                  className={`${
                                    metric.status === "critical"
                                      ? "text-red-400 bg-red-900/30 border border-red-700/30"
                                      : "text-yellow-400 bg-yellow-900/30 border border-yellow-700/30"
                                  } 
                          px-2.5 py-1 rounded-full text-xs font-medium`}
                                >
                                  {metric.status.charAt(0).toUpperCase() +
                                    metric.status.slice(1)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div className="w-36 h-12">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RechartsLineChart
                                    data={metric.history.slice(-8)}
                                    margin={{
                                      top: 5,
                                      right: 5,
                                      bottom: 5,
                                      left: 5,
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id={`colorTrend${metric.id}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={
                                            metric.status === "critical"
                                              ? "#ef4444"
                                              : "#f59e0b"
                                          }
                                          stopOpacity={0.8}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={
                                            metric.status === "critical"
                                              ? "#ef4444"
                                              : "#f59e0b"
                                          }
                                          stopOpacity={0.2}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <Area
                                      type="monotone"
                                      dataKey="value"
                                      stroke={
                                        metric.status === "critical"
                                          ? "#ef4444"
                                          : "#f59e0b"
                                      }
                                      fillOpacity={1}
                                      fill={`url(#colorTrend${metric.id})`}
                                    />
                                    <Line
                                      type="monotone"
                                      dataKey="value"
                                      stroke={
                                        metric.status === "critical"
                                          ? "#ef4444"
                                          : "#f59e0b"
                                      }
                                      strokeWidth={2}
                                      dot={false}
                                    />
                                  </RechartsLineChart>
                                </ResponsiveContainer>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/60 shadow-lg overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                    <BellRingIcon size={18} className="text-gray-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Recent Alerts
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${
                        alert.severity === "critical"
                          ? "bg-red-900/20 border-red-900/30"
                          : alert.severity === "warning"
                          ? "bg-yellow-900/20 border-yellow-900/30"
                          : "bg-blue-900/20 border-blue-900/30"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-3">
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-white">
                              {alert.message}
                            </p>
                            <span
                              className={`ml-3 flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                                alert.severity === "critical"
                                  ? "bg-red-800/50 text-red-200"
                                  : alert.severity === "warning"
                                  ? "bg-yellow-800/50 text-yellow-200"
                                  : "bg-blue-800/50 text-blue-200"
                              }`}
                            >
                              {alert.severity}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-400">
                              <ClockIcon size={12} className="mr-1" />
                              {formatRelativeTime(alert.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* View Toggle Buttons */}
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <button
                  onClick={() => setMetricsViewMode("grid")}
                  className={`p-2 rounded-md border shadow-sm transition-colors ${
                    metricsViewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <BarChart3 size={16} />
                </button>
                <button
                  onClick={() => setMetricsViewMode("list")}
                  className={`p-2 rounded-md border shadow-sm transition-colors ${
                    metricsViewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <LineChart size={16} />
                </button>
              </div>

              {/* Status Summary */}
              <div className="flex flex-wrap justify-center sm:justify-end items-center text-sm gap-3 text-gray-400">
                <div className="flex items-center">
                  <Circle className="text-green-500 mr-1" size={10} />
                  {normalCount} Normal
                </div>
                <div className="flex items-center">
                  <AlertCircle className="text-yellow-500 mr-1" size={10} />
                  {warningCount} Warning
                </div>
                <div className="flex items-center">
                  <XCircle className="text-red-500 mr-1" size={10} />
                  {criticalCount} Critical
                </div>
              </div>
            </div>

            {/* Content View */}
            {metricsViewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="p-5 rounded-xl bg-gray-900 border border-gray-700 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(metric.type)}
                        <h3 className="text-sm font-semibold text-white">
                          {metric.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(metric.status)}
                        <span
                          className={`text-sm font-medium ${
                            metric.status === "critical"
                              ? "text-red-500"
                              : metric.status === "warning"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {metric.status.charAt(0).toUpperCase() +
                            metric.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-3xl font-bold text-white">
                        {metric.value}
                        <span className="text-sm ml-1 text-gray-400">
                          {metric.unit}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Thresholds:{" "}
                        <span className="text-yellow-400">
                          Warning {metric.thresholds.warning}
                        </span>
                        ,{" "}
                        <span className="text-red-400">
                          Critical {metric.thresholds.critical}
                        </span>
                      </div>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={metric.history}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#2d3748"
                          />
                          <XAxis
                            dataKey="time"
                            stroke="#718096"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis stroke="#718096" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a202c",
                              borderColor: "#2d3748",
                              color: "#fff",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={
                              metric.status === "critical"
                                ? "#ef4444"
                                : metric.status === "warning"
                                ? "#fbbf24"
                                : "#34d399"
                            }
                            strokeWidth={2}
                            dot={false}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl bg-gray-900">
                <table className="min-w-full text-sm text-left text-gray-200">
                  <thead>
                    <tr className="text-xs uppercase text-gray-400 bg-gray-900 border-b border-gray-800">
                      <th className="px-6 py-3 font-medium tracking-wide">
                        Metric
                      </th>
                      <th className="px-6 py-3 font-medium tracking-wide">
                        Value
                      </th>
                      <th className="px-6 py-3 font-medium tracking-wide">
                        Status
                      </th>
                      <th className="px-6 py-3 font-medium tracking-wide">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric) => (
                      <tr
                        key={metric.id}
                        className="transition hover:bg-gray-800/70 even:bg-gray-900 odd:bg-gray-950"
                      >
                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2 font-medium text-white">
                          {getMetricIcon(metric.type)}
                          <span>{metric.name}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-white">
                          {metric.value}
                          <span className="text-gray-400 text-sm ml-1">
                            {metric.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(metric.status)}
                            <span
                              className={`text-sm font-medium ${
                                metric.status === "critical"
                                  ? "text-red-400"
                                  : metric.status === "warning"
                                  ? "text-yellow-300"
                                  : "text-green-400"
                              }`}
                            >
                              {metric.status.charAt(0).toUpperCase() +
                                metric.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-24 h-8">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart
                                data={metric.history.slice(-10)}
                              >
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke={
                                    metric.status === "critical"
                                      ? "#ef4444"
                                      : metric.status === "warning"
                                      ? "#fbbf24"
                                      : "#34d399"
                                  }
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </RechartsLineChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
