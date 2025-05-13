"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language } from "@/lib/types"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Common
    "app.name": "Meaningful Tracker",
    "app.tagline": "Track What Matters, Find What's Meaningful",
    "app.description": "Record not just what you do, but how it makes you feel and what it means to you.",

    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.newLog": "New Log",
    "nav.logs": "Logs",
    "nav.settings": "Settings",
    "nav.login": "Login",
    "nav.logout": "Logout",

    // Home page
    "home.title": "Track What Matters, Find What's Meaningful",
    "home.subtitle":
      "Meaningful Tracker helps you record not just what you do, but how it makes you feel and what it means to you.",
    "home.createLog": "Create New Log",
    "home.viewDashboard": "View Dashboard",
    "home.logActivities": "Log Your Activities",
    "home.logActivitiesDesc": "Record what you do, how it makes you feel, and its meaning to you.",
    "home.reviewLogs": "Review Your Logs",
    "home.reviewLogsDesc": "Look back at your activities, filter by mood, type, and more.",
    "home.analyzePatterns": "Analyze Patterns",
    "home.analyzePatternsDesc": "Discover insights about your activities, moods, and what brings meaning.",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Visualize your activities, moods, and find meaningful patterns",
    "dashboard.weeklySummary": "Weekly Summary",
    "dashboard.statsFromLastWeek": "Stats from the last 7 days",
    "dashboard.totalLogs": "Total Logs",
    "dashboard.avgEnergy": "Avg. Energy",
    "dashboard.avgMeaning": "Avg. Meaning",
    "dashboard.commonMood": "Common Mood",
    "dashboard.insights": "Insights",
    "dashboard.whatLogsReveal": "What your logs reveal",
    "dashboard.mostCommonActivity": "Most Common Activity",
    "dashboard.mostMeaningfulActivity": "Most Meaningful Activity",
    "dashboard.recommendation": "Recommendation",
    "dashboard.highMeaningMessage": "You're finding meaning in your activities. Keep it up!",
    "dashboard.lowMeaningMessage": "Try to focus more on activities that bring you meaning and joy.",
    "dashboard.moodTrends": "Mood Trends",
    "dashboard.moodTrendsDesc": "Track how your mood changes over time",
    "dashboard.activityDistribution": "Activity Distribution",
    "dashboard.activityDistributionDesc": "Breakdown of your activities by type",
    "dashboard.energyMeaningMatrix": "Energy vs. Meaning Matrix",
    "dashboard.energyMeaningMatrixDesc": "Visualize the relationship between energy spent and meaning gained",
    "dashboard.wordCloud": "Word Cloud",
    "dashboard.wordCloudDesc": "Common words in your log descriptions",
    "dashboard.timeline": "Activity Timeline",
    "dashboard.timelineDesc": "Your activities over time",
    "dashboard.charts": "Charts",
    "dashboard.summary": "Summary",
    "dashboard.insights": "Insights",
    "dashboard.aiInsights": "AI Insights",
    "dashboard.aiInsightsDesc": "Personalized insights based on your logs",
    "dashboard.notEnoughData": "Not enough data to generate insights. Add more logs!",
    "dashboard.dominantMoodInsight": "You've been feeling {mood} a lot lately.",
    "dashboard.dominantWorkTypeInsight": "Most of your activities are related to {workType}.",
    "dashboard.positiveCorrelationInsight": "You find more meaning in high-energy activities.",
    "dashboard.negativeCorrelationInsight": "You find more meaning in low-energy activities.",
    "dashboard.weekendHappierInsight": "You tend to be happier on weekends.",
    "dashboard.generalInsight": "Try to balance high-energy and high-meaning activities for better well-being.",
    "dashboard.noDataAvailable": "No data available yet. Add some logs!",
    "dashboard.highEnergyLowMeaning": "High Energy, Low Meaning",
    "dashboard.highEnergyHighMeaning": "High Energy, High Meaning",
    "dashboard.lowEnergyLowMeaning": "Low Energy, Low Meaning",
    "dashboard.lowEnergyHighMeaning": "Low Energy, High Meaning",
    "dashboard.noLogsTitle": "No logs found",
    "dashboard.noLogsDesc": "You haven't created any logs yet. Start by creating your first log.",
    "dashboard.notLoggedInDesc": "Please log in to view your dashboard.",
    "dashboard.createFirstLog": "Create your first log",

    // Logs
    "logs.title": "Your Logs",
    "logs.subtitle": "View, filter, and manage your activity logs",
    "logs.newLog": "New Log",
    "logs.searchLogs": "Search logs...",
    "logs.filterByMood": "Filter by mood",
    "logs.filterByType": "Filter by type",
    "logs.sortBy": "Sort by",
    "logs.sortOrder": "Sort order",
    "logs.allMoods": "All Moods",
    "logs.allTypes": "All Types",
    "logs.date": "Date",
    "logs.energy": "Energy Level",
    "logs.meaning": "Meaning Level",
    "logs.newestFirst": "Newest First",
    "logs.oldestFirst": "Oldest First",
    "logs.noLogsFound": "No logs found",
    "logs.notLoggedIn": "Please log in to view your logs",
    "logs.createFirstLogDesc": "Start tracking your activities and emotions by creating your first log.",
    "logs.loginToViewLogs": "Log in to view and manage your activity logs.",
    "logs.edit": "Edit",
    "logs.delete": "Delete",
    "logs.deleteConfirm": "Are you sure?",
    "logs.deleteWarning": "This action cannot be undone. This will permanently delete your log entry.",
    "logs.cancel": "Cancel",
    "logs.deleting": "Deleting...",
    "logs.cardsView": "Cards",
    "logs.matrixView": "Matrix",
    "logs.timelineView": "Timeline",

    // Log form
    "logForm.createTitle": "Create New Log",
    "logForm.editTitle": "Edit Log",
    "logForm.subtitle": "Record your activity along with how it made you feel and its meaning to you",
    "logForm.title": "Title",
    "logForm.titlePlaceholder": "What did you do?",
    "logForm.titleDesc": "A brief title for your activity.",
    "logForm.description": "Description",
    "logForm.descriptionPlaceholder": "Describe what you did and how it made you feel...",
    "logForm.descriptionDesc": "Provide details about your activity and reflections.",
    "logForm.mood": "Mood",
    "logForm.moodDesc": "How did you feel during/after this activity?",
    "logForm.activityType": "Activity Type",
    "logForm.activityTypeDesc": "What category does this activity fall under?",
    "logForm.energyLevel": "Energy Level",
    "logForm.energyLevelDesc": "How much energy did this activity consume?",
    "logForm.meaningLevel": "Meaning Level",
    "logForm.meaningLevelDesc": "How meaningful was this activity to you?",
    "logForm.date": "Date",
    "logForm.dateDesc": "When did this activity take place?",
    "logForm.saving": "Saving...",
    "logForm.update": "Update Log",
    "logForm.create": "Create Log",
    "logForm.back": "Back",
    "logForm.selectMood": "Select mood",
    "logForm.selectActivityType": "Select activity type",
    "logForm.selectEnergyLevel": "Select energy level",
    "logForm.selectMeaningLevel": "Select meaning level",
    "logForm.feelingsSection": "Feelings & Energy",
    "logForm.activitySection": "Activity & Meaning",
    "logForm.updating": "Updating...",
    "logForm.creating": "Creating...",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account and application preferences",
    "settings.account": "Account",
    "settings.accountDesc": "Manage your account information",
    "settings.name": "Name",
    "settings.email": "Email",
    "settings.signOut": "Sign Out",
    "settings.saveChanges": "Save Changes",
    "settings.preferences": "Preferences",
    "settings.preferencesDesc": "Customize your application experience",
    "settings.theme": "Theme",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.system": "System",
    "settings.language": "Language",
    "settings.english": "English",
    "settings.vietnamese": "Vietnamese",
    "settings.dailyReminder": "Daily Reminder",
    "settings.dailyReminderDesc": "Receive a daily reminder to log your activities",
    "settings.dataManagement": "Data Management",
    "settings.dataManagementDesc": "Export or delete your data",
    "settings.exportData": "Export Data (JSON)",
    "settings.deleteAllData": "Delete All Data",
    "settings.deleteConfirm": "Are you absolutely sure?",
    "settings.deleteWarning":
      "This action cannot be undone. This will permanently delete all your logs and account data.",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Name",
    "auth.loggingIn": "Logging in...",
    "auth.creatingAccount": "Creating account...",
    "auth.termsNotice": "By continuing, you agree to our Terms of Service and Privacy Policy.",
    "auth.accountDesc": "Sign in to your account or create a new one",

    // Moods
    "mood.excited": "Excited",
    "mood.happy": "Happy",
    "mood.neutral": "Neutral",
    "mood.tired": "Tired",
    "mood.frustrated": "Frustrated",
    "mood.sad": "Sad",

    // Work types
    "workType.work": "Work",
    "workType.learning": "Learning",
    "workType.personal": "Personal",
    "workType.health": "Health",
    "workType.social": "Social",
    "workType.leisure": "Leisure",

    // Energy levels
    "energyLevel.1": "Very Low",
    "energyLevel.2": "Low",
    "energyLevel.3": "Medium",
    "energyLevel.4": "High",
    "energyLevel.5": "Very High",

    // Meaning levels
    "meaningLevel.1": "Not Meaningful",
    "meaningLevel.2": "Slightly Meaningful",
    "meaningLevel.3": "Moderately Meaningful",
    "meaningLevel.4": "Very Meaningful",
    "meaningLevel.5": "Extremely Meaningful",
  },
  vi: {
    // Common
    "app.name": "Nhật Ký Ý Nghĩa",
    "app.tagline": "Ghi Lại Điều Quan Trọng, Tìm Kiếm Ý Nghĩa",
    "app.description": "Ghi lại không chỉ việc bạn làm, mà còn cảm xúc và ý nghĩa của nó.",

    // Navigation
    "nav.home": "Trang Chủ",
    "nav.dashboard": "Bảng Điều Khiển",
    "nav.newLog": "Nhật Ký Mới",
    "nav.logs": "Nhật Ký",
    "nav.settings": "Cài Đặt",
    "nav.login": "Đăng Nhập",
    "nav.logout": "Đăng Xuất",

    // Home page
    "home.title": "Ghi Lại Điều Quan Trọng, Tìm Kiếm Ý Nghĩa",
    "home.subtitle": "Nhật Ký Ý Nghĩa giúp bạn ghi lại không chỉ việc bạn làm, mà còn cảm xúc và ý nghĩa của nó.",
    "home.createLog": "Tạo Nhật Ký Mới",
    "home.viewDashboard": "Xem Bảng Điều Khiển",
    "home.logActivities": "Ghi Lại Hoạt Động",
    "home.logActivitiesDesc": "Ghi lại việc bạn làm, cảm xúc và ý nghĩa của nó.",
    "home.reviewLogs": "Xem Lại Nhật Ký",
    "home.reviewLogsDesc": "Nhìn lại hoạt động, lọc theo tâm trạng, loại và nhiều hơn nữa.",
    "home.analyzePatterns": "Phân Tích Mẫu",
    "home.analyzePatternsDesc": "Khám phá thông tin chi tiết về hoạt động, tâm trạng và điều mang lại ý nghĩa.",

    // Dashboard
    "dashboard.title": "Bảng Điều Khiển",
    "dashboard.subtitle": "Trực quan hóa hoạt động, tâm trạng và tìm kiếm mẫu có ý nghĩa",
    "dashboard.weeklySummary": "Tổng Kết Tuần",
    "dashboard.statsFromLastWeek": "Thống kê từ 7 ngày qua",
    "dashboard.totalLogs": "Tổng Nhật Ký",
    "dashboard.avgEnergy": "Năng Lượng TB",
    "dashboard.avgMeaning": "Ý Nghĩa TB",
    "dashboard.commonMood": "Tâm Trạng Phổ Biến",
    "dashboard.insights": "Phân Tích",
    "dashboard.whatLogsReveal": "Những gì nhật ký của bạn tiết lộ",
    "dashboard.mostCommonActivity": "Hoạt Động Phổ Biến Nhất",
    "dashboard.mostMeaningfulActivity": "Hoạt Động Ý Nghĩa Nhất",
    "dashboard.recommendation": "Đề Xuất",
    "dashboard.highMeaningMessage": "Bạn đang tìm thấy ý nghĩa trong các hoạt động của mình. Hãy tiếp tục!",
    "dashboard.lowMeaningMessage": "Hãy tập trung hơn vào các hoạt động mang lại ý nghĩa và niềm vui cho bạn.",
    "dashboard.moodTrends": "Xu Hướng Tâm Trạng",
    "dashboard.moodTrendsDesc": "Theo dõi sự thay đổi tâm trạng theo thời gian",
    "dashboard.activityDistribution": "Phân Bố Hoạt Động",
    "dashboard.activityDistributionDesc": "Phân tích hoạt động theo loại",
    "dashboard.energyMeaningMatrix": "Ma Trận Năng Lượng vs. Ý Nghĩa",
    "dashboard.energyMeaningMatrixDesc": "Trực quan hóa mối quan hệ giữa năng lượng tiêu tốn và ý nghĩa đạt được",
    "dashboard.wordCloud": "Đám Mây Từ",
    "dashboard.wordCloudDesc": "Các từ phổ biến trong mô tả nhật ký của bạn",
    "dashboard.timeline": "Dòng Thời Gian Hoạt Động",
    "dashboard.timelineDesc": "Hoạt động của bạn theo thời gian",
    "dashboard.charts": "Biểu Đồ",
    "dashboard.summary": "Tóm Tắt",
    "dashboard.insights": "Phân Tích",
    "dashboard.aiInsights": "Phân Tích AI",
    "dashboard.aiInsightsDesc": "Phân tích cá nhân hóa dựa trên nhật ký của bạn",
    "dashboard.notEnoughData": "Không đủ dữ liệu để tạo phân tích. Hãy thêm nhiều nhật ký hơn!",
    "dashboard.dominantMoodInsight": "Gần đây bạn cảm thấy {mood} khá nhiều.",
    "dashboard.dominantWorkTypeInsight": "Hầu hết các hoạt động của bạn liên quan đến {workType}.",
    "dashboard.positiveCorrelationInsight": "Bạn tìm thấy nhiều ý nghĩa hơn trong các hoạt động năng lượng cao.",
    "dashboard.negativeCorrelationInsight": "Bạn tìm thấy nhiều ý nghĩa hơn trong các hoạt động năng lượng thấp.",
    "dashboard.weekendHappierInsight": "Bạn có xu hướng hạnh phúc hơn vào cuối tuần.",
    "dashboard.generalInsight": "Hãy cân bằng giữa các hoạt động năng lượng cao và ý nghĩa cao để có sức khỏe tốt hơn.",
    "dashboard.noDataAvailable": "Chưa có dữ liệu. Hãy thêm một số nhật ký!",
    "dashboard.highEnergyLowMeaning": "Năng Lượng Cao, Ý Nghĩa Thấp",
    "dashboard.highEnergyHighMeaning": "Năng Lượng Cao, Ý Nghĩa Cao",
    "dashboard.lowEnergyLowMeaning": "Năng Lượng Thấp, Ý Nghĩa Thấp",
    "dashboard.lowEnergyHighMeaning": "Năng Lượng Thấp, Ý Nghĩa Cao",
    "dashboard.noLogsTitle": "Không tìm thấy nhật ký",
    "dashboard.noLogsDesc": "Bạn chưa tạo nhật ký nào. Hãy bắt đầu bằng cách tạo nhật ký đầu tiên.",
    "dashboard.notLoggedInDesc": "Vui lòng đăng nhập để xem bảng điều khiển của bạn.",
    "dashboard.createFirstLog": "Tạo nhật ký đầu tiên của bạn",

    // Logs
    "logs.title": "Nhật Ký Của Bạn",
    "logs.subtitle": "Xem, lọc và quản lý nhật ký hoạt động",
    "logs.newLog": "Nhật Ký Mới",
    "logs.searchLogs": "Tìm kiếm nhật ký...",
    "logs.filterByMood": "Lọc theo tâm trạng",
    "logs.filterByType": "Lọc theo loại",
    "logs.sortBy": "Sắp xếp theo",
    "logs.sortOrder": "Thứ tự sắp xếp",
    "logs.allMoods": "Tất Cả Tâm Trạng",
    "logs.allTypes": "Tất Cả Loại",
    "logs.date": "Ngày",
    "logs.energy": "Mức Năng Lượng",
    "logs.meaning": "Mức Ý Nghĩa",
    "logs.newestFirst": "Mới Nhất Trước",
    "logs.oldestFirst": "Cũ Nhất Trước",
    "logs.noLogsFound": "Không tìm thấy nhật ký",
    "logs.notLoggedIn": "Vui lòng đăng nhập để xem nhật ký của bạn",
    "logs.createFirstLogDesc": "Bắt đầu theo dõi hoạt động và cảm xúc của bạn bằng cách tạo nhật ký đầu tiên.",
    "logs.loginToViewLogs": "Đăng nhập để xem và quản lý nhật ký hoạt động của bạn.",
    "logs.edit": "Sửa",
    "logs.delete": "Xóa",
    "logs.deleteConfirm": "Bạn có chắc không?",
    "logs.deleteWarning": "Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn mục nhật ký của bạn.",
    "logs.cancel": "Hủy",
    "logs.deleting": "Đang xóa...",
    "logs.cardsView": "Thẻ",
    "logs.matrixView": "Ma Trận",
    "logs.timelineView": "Dòng Thời Gian",

    // Log form
    "logForm.createTitle": "Tạo Nhật Ký Mới",
    "logForm.editTitle": "Chỉnh Sửa Nhật Ký",
    "logForm.subtitle": "Ghi lại hoạt động cùng với cảm xúc và ý nghĩa của nó đối với bạn",
    "logForm.title": "Tiêu Đề",
    "logForm.titlePlaceholder": "Bạn đã làm gì?",
    "logForm.titleDesc": "Tiêu đề ngắn gọn cho hoạt động của bạn.",
    "logForm.description": "Mô Tả",
    "logForm.descriptionPlaceholder": "Mô tả những gì bạn đã làm và cảm nhận của bạn...",
    "logForm.descriptionDesc": "Cung cấp chi tiết về hoạt động và suy ngẫm của bạn.",
    "logForm.mood": "Tâm Trạng",
    "logForm.moodDesc": "Bạn cảm thấy thế nào trong/sau hoạt động này?",
    "logForm.activityType": "Loại Hoạt Động",
    "logForm.activityTypeDesc": "Hoạt động này thuộc loại nào?",
    "logForm.energyLevel": "Mức Năng Lượng",
    "logForm.energyLevelDesc": "Hoạt động này tiêu tốn bao nhiêu năng lượng?",
    "logForm.meaningLevel": "Mức Ý Nghĩa",
    "logForm.meaningLevelDesc": "Hoạt động này có ý nghĩa như thế nào đối với bạn?",
    "logForm.date": "Ngày",
    "logForm.dateDesc": "Hoạt động này diễn ra khi nào?",
    "logForm.saving": "Đang lưu...",
    "logForm.update": "Cập Nhật Nhật Ký",
    "logForm.create": "Tạo Nhật Ký",
    "logForm.back": "Quay Lại",
    "logForm.selectMood": "Chọn tâm trạng",
    "logForm.selectActivityType": "Chọn loại hoạt động",
    "logForm.selectEnergyLevel": "Chọn mức năng lượng",
    "logForm.selectMeaningLevel": "Chọn mức ý nghĩa",
    "logForm.feelingsSection": "Cảm Xúc & Năng Lượng",
    "logForm.activitySection": "Hoạt Động & Ý Nghĩa",
    "logForm.updating": "Đang cập nhật...",
    "logForm.creating": "Đang tạo...",

    // Settings
    "settings.title": "Cài Đặt",
    "settings.subtitle": "Quản lý tài khoản và tùy chọn ứng dụng",
    "settings.account": "Tài Khoản",
    "settings.accountDesc": "Quản lý thông tin tài khoản",
    "settings.name": "Tên",
    "settings.email": "Email",
    "settings.signOut": "Đăng Xuất",
    "settings.saveChanges": "Lưu Thay Đổi",
    "settings.preferences": "Tùy Chọn",
    "settings.preferencesDesc": "Tùy chỉnh trải nghiệm ứng dụng",
    "settings.theme": "Giao Diện",
    "settings.light": "Sáng",
    "settings.dark": "Tối",
    "settings.system": "Hệ Thống",
    "settings.language": "Ngôn Ngữ",
    "settings.english": "Tiếng Anh",
    "settings.vietnamese": "Tiếng Việt",
    "settings.dailyReminder": "Nhắc Nhở Hàng Ngày",
    "settings.dailyReminderDesc": "Nhận nhắc nhở hàng ngày để ghi nhật ký hoạt động",
    "settings.dataManagement": "Quản Lý Dữ Liệu",
    "settings.dataManagementDesc": "Xuất hoặc xóa dữ liệu của bạn",
    "settings.exportData": "Xuất Dữ Liệu (JSON)",
    "settings.deleteAllData": "Xóa Tất Cả Dữ Liệu",
    "settings.deleteConfirm": "Bạn có chắc chắn không?",
    "settings.deleteWarning":
      "Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn tất cả nhật ký và dữ liệu tài khoản của bạn.",

    // Auth
    "auth.login": "Đăng Nhập",
    "auth.register": "Đăng Ký",
    "auth.email": "Email",
    "auth.password": "Mật Khẩu",
    "auth.name": "Tên",
    "auth.loggingIn": "Đang đăng nhập...",
    "auth.creatingAccount": "Đang tạo tài khoản...",
    "auth.termsNotice": "Bằng cách tiếp tục, bạn đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của chúng tôi.",
    "auth.accountDesc": "Đăng nhập vào tài khoản của bạn hoặc tạo tài khoản mới",

    // Moods
    "mood.excited": "Phấn Khích",
    "mood.happy": "Vui Vẻ",
    "mood.neutral": "Bình Thường",
    "mood.tired": "Mệt Mỏi",
    "mood.frustrated": "Thất Vọng",
    "mood.sad": "Buồn",

    // Work types
    "workType.work": "Công Việc",
    "workType.learning": "Học Tập",
    "workType.personal": "Cá Nhân",
    "workType.health": "Sức Khỏe",
    "workType.social": "Xã Hội",
    "workType.leisure": "Giải Trí",

    // Energy levels
    "energyLevel.1": "Rất Thấp",
    "energyLevel.2": "Thấp",
    "energyLevel.3": "Trung Bình",
    "energyLevel.4": "Cao",
    "energyLevel.5": "Rất Cao",

    // Meaning levels
    "meaningLevel.1": "Không Ý Nghĩa",
    "meaningLevel.2": "Hơi Ý Nghĩa",
    "meaningLevel.3": "Khá Ý Nghĩa",
    "meaningLevel.4": "Rất Ý Nghĩa",
    "meaningLevel.5": "Cực Kỳ Ý Nghĩa",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
})

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "vi")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    try {
      const translationObj = translations[language]
      if (!translationObj) return key

      return translationObj[key as keyof typeof translationObj] || key
    } catch (error) {
      console.error("Translation error:", error)
      return key
    }
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
