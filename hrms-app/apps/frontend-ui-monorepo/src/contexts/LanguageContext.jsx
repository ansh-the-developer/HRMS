// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    // General & Navigation
    dashboard: "Dashboard",
    employeeManagement: "Employee Management",
    attendance: "Attendance",
    leaveManagement: "Leave Management",
    payroll: "Salary & Payroll",
    complaints: "Complaint Center",
    settings: "System Settings",
    activityLogs: "Activity Logs",
    switchEmployeeUI: "Switch to Employee UI",
    switchAdminUI: "Switch to Admin UI",
    needHelp: "Need Help?",
    contactSupport: "Contact Support",
    signOut: "Sign out",
    searchPlaceholder: "Search employees, attendance, leaves...",
    language: "LANGUAGE",
    profile: "Profile",

    // Dashboard Stats
    totalEmployees: "Total Employees",
    presentToday: "Present Today",
    absentToday: "Absent Today",
    onLeave: "On Leave",
    newJoiners: "New Joiners",
    upcomingBirthdays: "Upcoming Birthdays",
    recentAnnouncements: "Recent Announcements",
    noAnnouncements: "No announcements currently posted.",
    noBirthdays: "No upcoming birthdays this week.",

    // Buttons & Actions
    applyLeave: "Apply Leave",
    generatePayslip: "Generate Payslip",
    addEmployee: "Add Employee",
    markAttendance: "Mark Attendance",
    viewAll: "View All",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
  },
  hi: {
    // General & Navigation
    dashboard: "डैशबोर्ड",
    employeeManagement: "कर्मचारी प्रबंधन",
    attendance: "उपस्थिति",
    leaveManagement: "अवकाश प्रबंधन",
    payroll: "वेतन एवं पेरोल",
    complaints: "शिकायत केंद्र",
    settings: "सिस्टम सेटिंग्स",
    activityLogs: "गतिविधि लॉग",
    switchEmployeeUI: "कर्मचारी दृश्य पर स्विच करें",
    switchAdminUI: "व्यवस्थापक दृश्य पर स्विच करें",
    needHelp: "सहायता चाहिए?",
    contactSupport: "सहायता केंद्र से संपर्क करें",
    signOut: "साइन आउट",
    searchPlaceholder: "कर्मचारी, उपस्थिति, अवकाश खोजें...",
    language: "भाषा",
    profile: "प्रोफ़ाइल",

    // Dashboard Stats
    totalEmployees: "कुल कर्मचारी",
    presentToday: "आज उपस्थित",
    absentToday: "आज अनुपस्थित",
    onLeave: "अवकाश पर",
    newJoiners: "नए कर्मचारी",
    upcomingBirthdays: "आगामी जन्मदिन",
    recentAnnouncements: "हाल की घोषणाएं",
    noAnnouncements: "वर्तमान में कोई घोषणा पोस्ट नहीं की गई है।",
    noBirthdays: "इस सप्ताह कोई आगामी जन्मदिन नहीं है।",

    // Buttons & Actions
    applyLeave: "अवकाश लागू करें",
    generatePayslip: "पेस्लिप बनाएं",
    addEmployee: "कर्मचारी जोड़ें",
    markAttendance: "उपस्थिति दर्ज करें",
    viewAll: "सभी देखें",
    save: "सहेजें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
  },
  ne: {
    // General & Navigation
    dashboard: "ड्यासबोर्ड",
    employeeManagement: "कर्मचारी व्यवस्थापन",
    attendance: "उपस्थिति",
    leaveManagement: "बिदा व्यवस्थापन",
    payroll: "तलब तथा पेरोल",
    complaints: "गुणासो केन्द्र",
    settings: "सिस्टम सेटिङहरू",
    activityLogs: "गतिविधि लगहरू",
    switchEmployeeUI: "कर्मचारी दृश्यमा स्विच गर्नुहोस्",
    switchAdminUI: "प्रशासक दृश्यमा स्विच गर्नुहोस्",
    needHelp: "सहयोग चाहिन्छ?",
    contactSupport: "सहयोग केन्द्रलाई सम्पर्क गर्नुहोस्",
    signOut: "साइन आउट",
    searchPlaceholder: "कर्मचारी, उपस्थिति, बिदा खोज्नुहोस्...",
    language: "भाषा",
    profile: "प्रोफाइल",

    // Dashboard Stats
    totalEmployees: "जम्मा कर्मचारी",
    presentToday: "आज उपस्थित",
    absentToday: "आज अनुपस्थित",
    onLeave: "बिदामा",
    newJoiners: "नयाँ भर्ना भएका",
    upcomingBirthdays: "आगामी जन्मदिन",
    recentAnnouncements: "भर्खरका सूचनाहरू",
    noAnnouncements: "हाल कुनै सूचना पोस्ट गरिएको छैन।",
    noBirthdays: "यो हप्ता कुनै आगामी जन्मदिन छैन।",

    // Buttons & Actions
    applyLeave: "बिदा आवेदन दिनुहोस्",
    generatePayslip: "पेस्लिप बनाउनुहोस्",
    addEmployee: "कर्मचारी थप्नुहोस्",
    markAttendance: "उपस्थिति जनाउनुहोस्",
    viewAll: "सबै हेर्नुहोस्",
    save: "बचत गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    confirm: "पुष्टि गर्नुहोस्",
  },
  ko: {
    // General & Navigation
    dashboard: "대시보드",
    employeeManagement: "직원 관리",
    attendance: "근태 관리",
    leaveManagement: "휴가 관리",
    payroll: "급여 및 급여 명세서",
    complaints: "고충 처리 센터",
    settings: "시스템 설정",
    activityLogs: "활동 로그",
    switchEmployeeUI: "직원 모드로 전환",
    switchAdminUI: "관리자 모드로 전환",
    needHelp: "도움이 필요하신가요?",
    contactSupport: "지원팀 문의",
    signOut: "로그아웃",
    searchPlaceholder: "직원, 근태, 휴가 검색...",
    language: "언어",
    profile: "프로필",

    // Dashboard Stats
    totalEmployees: "총 직원 수",
    presentToday: "오늘 출근",
    absentToday: "오늘 결근",
    onLeave: "휴가 중",
    newJoiners: "신규 입사자",
    upcomingBirthdays: "다가오는 생일",
    recentAnnouncements: "최신 공지사항",
    noAnnouncements: "현재 등록된 공지사항이 없습니다.",
    noBirthdays: "이번 주 다가오는 생일이 없습니다.",

    // Buttons & Actions
    applyLeave: "휴가 신청",
    generatePayslip: "급여 명세서 생성",
    addEmployee: "직원 추가",
    markAttendance: "출근 기록",
    viewAll: "전체 보기",
    save: "저장",
    cancel: "취소",
    confirm: "확인",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("happyhrms_lang") || "en";
  });

  const setLanguage = (lang) => {
    if (TRANSLATIONS[lang]) {
      setLanguageState(lang);
      localStorage.setItem("happyhrms_lang", lang);
    }
  };

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, TRANSLATIONS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en",
      setLanguage: () => {},
      t: (key) => TRANSLATIONS.en[key] || key,
      TRANSLATIONS,
    };
  }
  return context;
}