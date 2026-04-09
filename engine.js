/* ══════════════════════════════════════════
   BRAND BEAT LAB — Feedback Automation Engine
   실시간 니즈 분석 + 자동 피드백 + 알림 시스템
   ══════════════════════════════════════════ */

const STORAGE_KEY = "bblab-feedback-v5";
const NOTIF_KEY = "bblab-notifs-v1";
const ADMIN_PW = "bblab2026";

/* ── 업종별 인사이트 데이터 ── */
const INDUSTRY_DATA = {
  "음식점/카페": {
    roi: "평균 매출 35% 증가",
    roiNum: 35,
    insight: "음식점/카페 업종은 랜딩페이지 도입 후 온라인 예약률이 평균 2.4배 증가합니다.",
    socialProof: [
      { name: "김사장", biz: "블룸카페", result: "리뷰 유입 3배 증가" },
      { name: "이대표", biz: "맛나식당", result: "예약률 180% 상승" }
    ],
    suggestedFeatures: ["위치 지도", "리뷰 섹션", "예약 폼", "카카오톡 연동"],
    avgBudget: "30~60만원",
    commonCta: ["카톡 문의", "예약하기"],
    urgency: "신규 고객 유입이 가장 활발한 시즌이 다가오고 있습니다"
  },
  "쇼핑몰": {
    roi: "전환율 평균 42% 개선",
    roiNum: 42,
    insight: "쇼핑몰은 상세페이지 최적화만으로도 구매 전환율을 42% 이상 끌어올릴 수 있습니다.",
    socialProof: [
      { name: "박대표", biz: "뷰티샵", result: "월 매출 2배 성장" },
      { name: "최사장", biz: "핸드메이드몰", result: "재구매율 65% 상승" }
    ],
    suggestedFeatures: ["결제 연동", "리뷰 섹션", "SNS 연동"],
    avgBudget: "60~100만원",
    commonCta: ["온라인 구매"],
    urgency: "경쟁 쇼핑몰 대비 디지털 전환이 시급합니다"
  },
  "서비스업": {
    roi: "문의량 평균 58% 증가",
    roiNum: 58,
    insight: "서비스업은 전문성을 보여주는 랜딩페이지로 신뢰도와 문의량을 동시에 높일 수 있습니다.",
    socialProof: [
      { name: "정대표", biz: "클린홈", result: "월 문의 3배 증가" },
      { name: "한사장", biz: "법률사무소", result: "온라인 상담 200% 상승" }
    ],
    suggestedFeatures: ["문의 폼", "카카오톡 연동", "리뷰 섹션"],
    avgBudget: "30~60만원",
    commonCta: ["전화 문의", "카톡 문의"],
    urgency: "고객의 70%가 온라인에서 먼저 검색합니다"
  },
  "뷰티/건강": {
    roi: "예약률 평균 67% 상승",
    roiNum: 67,
    insight: "뷰티/건강 업종은 비주얼 중심 랜딩페이지로 예약 전환율을 극적으로 높일 수 있습니다.",
    socialProof: [
      { name: "윤원장", biz: "글로우클리닉", result: "신규 예약 3배 증가" },
      { name: "송대표", biz: "필라테스랩", result: "체험권 신청 250% 상승" }
    ],
    suggestedFeatures: ["예약 폼", "리뷰 섹션", "SNS 연동", "카카오톡 연동"],
    avgBudget: "30~60만원",
    commonCta: ["예약하기", "카톡 문의"],
    urgency: "시각적 브랜딩이 곧 매출입니다"
  },
  "교육": {
    roi: "수강 문의 평균 45% 증가",
    roiNum: 45,
    insight: "교육 업종은 커리큘럼과 성과를 효과적으로 보여주면 수강 신청률이 급증합니다.",
    socialProof: [
      { name: "김원장", biz: "스마트코딩", result: "수강생 2배 증가" },
      { name: "이대표", biz: "영어캠프", result: "문의 180% 상승" }
    ],
    suggestedFeatures: ["문의 폼", "리뷰 섹션", "결제 연동"],
    avgBudget: "30~60만원",
    commonCta: ["전화 문의", "카톡 문의"],
    urgency: "학기 시작 전 세팅이 중요합니다"
  },
  "B2B": {
    roi: "리드 생성 평균 53% 증가",
    roiNum: 53,
    insight: "B2B 기업은 전문성과 실적을 담은 랜딩페이지로 양질의 리드를 확보할 수 있습니다.",
    socialProof: [
      { name: "강대표", biz: "테크솔루션", result: "B2B 리드 3배 확보" },
      { name: "조대표", biz: "마케팅프로", result: "계약 전환율 40% 상승" }
    ],
    suggestedFeatures: ["문의 폼", "관리자 페이지", "다국어"],
    avgBudget: "60~100만원",
    commonCta: ["전화 문의", "유입/인지도"],
    urgency: "디지털 세일즈 퍼널 구축이 경쟁력입니다"
  },
  "기타": {
    roi: "온라인 전환율 평균 30% 개선",
    roiNum: 30,
    insight: "모든 업종에서 전문적인 웹 프레즌스는 신뢰도와 매출에 직접적인 영향을 줍니다.",
    socialProof: [
      { name: "다양한", biz: "클라이언트", result: "평균 만족도 97%" }
    ],
    suggestedFeatures: ["문의 폼", "카카오톡 연동"],
    avgBudget: "30~60만원",
    commonCta: ["카톡 문의"],
    urgency: "지금 시작하면 경쟁사보다 앞설 수 있습니다"
  }
};

/* ── 예산별 추천 티어 ── */
const BUDGET_TIERS = {
  "30만원 미만": { tier: "스타터", color: "#9B95AB", match: 60 },
  "30~60만원": { tier: "스탠다드", color: "#A78BFA", match: 80 },
  "60~100만원": { tier: "프리미엄", color: "#34D399", match: 95 },
  "100만원+": { tier: "프리미엄+커스텀", color: "#FBBF24", match: 100 },
  "상담 후": { tier: "상담 후 결정", color: "#9B95AB", match: 50 }
};

/* ══════════════════════════════════════════
   실시간 분석 엔진
   ══════════════════════════════════════════ */
class FeedbackEngine {
  constructor() {
    this.formData = {};
    this.analysisCache = {};
  }

  /* 입력 완성도 계산 */
  calcCompleteness(data) {
    const required = ["name", "business", "industry", "target", "phone", "contact", "deliverables", "must_include", "budget", "deadline"];
    const optional = ["channels", "cta", "has_assets", "benchmark", "mood", "brand_color", "features", "language", "tools", "priority", "maintenance", "additional"];
    let filled = 0;
    required.forEach(k => { if (data[k] && (Array.isArray(data[k]) ? data[k].length > 0 : data[k].trim())) filled++; });
    let optFilled = 0;
    optional.forEach(k => { if (data[k] && (Array.isArray(data[k]) ? data[k].length > 0 : data[k].trim())) optFilled++; });
    return Math.min(100, Math.round((filled / required.length) * 70 + (optFilled / optional.length) * 30));
  }

  /* 실시간 분석 결과 생성 */
  analyze(data) {
    const industry = Array.isArray(data.industry) && data.industry.length > 0 ? data.industry[0] : null;
    const indData = industry ? (INDUSTRY_DATA[industry] || INDUSTRY_DATA["기타"]) : null;
    const budgetInfo = data.budget ? BUDGET_TIERS[data.budget] : null;
    const completeness = this.calcCompleteness(data);
    const deliverables = Array.isArray(data.deliverables) ? data.deliverables : [];
    const features = Array.isArray(data.features) ? data.features : [];

    /* 복잡도 계산 */
    let complexity = 0;
    if (deliverables.length > 2) complexity += 20;
    if (features.length > 3) complexity += 20;
    if (deliverables.includes("예약/주문 웹앱") || deliverables.includes("쇼핑몰")) complexity += 25;
    if (deliverables.includes("업무 자동화")) complexity += 15;
    if (features.includes("결제 연동")) complexity += 15;
    if (features.includes("관리자 페이지")) complexity += 10;
    if (features.includes("다국어")) complexity += 10;
    complexity = Math.min(100, complexity);

    /* 추천 티어 */
    let recommendedTier = "스타터";
    if (complexity > 60 || (budgetInfo && budgetInfo.tier === "프리미엄+커스텀")) recommendedTier = "프리미엄";
    else if (complexity > 30 || (budgetInfo && budgetInfo.tier === "스탠다드")) recommendedTier = "스탠다드";

    /* 예상 가격 */
    let priceRange = "29~39만원";
    if (recommendedTier === "스탠다드") priceRange = "59~79만원";
    if (recommendedTier === "프리미엄") priceRange = "99~150만원+";

    /* 예상 기간 */
    let timeline = "5~7일";
    if (recommendedTier === "스탠다드") timeline = "7~10일";
    if (recommendedTier === "프리미엄") timeline = "2~3주";

    /* 매칭도 */
    let matchScore = completeness;
    if (budgetInfo) matchScore = Math.round((completeness * 0.6) + (budgetInfo.match * 0.4));

    return {
      completeness,
      complexity,
      recommendedTier,
      priceRange,
      timeline,
      matchScore,
      industry: indData,
      budget: budgetInfo,
      deliverables,
      features,
      target: data.target,
      business: data.business,
    };
  }

  /* 자동 응답 메시지 생성 */
  generateReply(data) {
    const analysis = this.analyze(data);
    const name = data.name || "고객";
    const biz = data.business || "사업체";
    const industry = Array.isArray(data.industry) ? data.industry[0] : "사업";
    const delivs = Array.isArray(data.deliverables) ? data.deliverables.join(", ") : "프로젝트";

    return `안녕하세요 ${name}님! Brand Beat Lab입니다 💜\n` +
      `${biz} ${industry} 프로젝트 접수 확인했습니다.\n` +
      `${delivs} 제작 관련 맞춤 제안서를 24시간 내 보내드리겠습니다.\n` +
      `추천 패키지: ${analysis.recommendedTier} (${analysis.priceRange})\n` +
      `예상 기간: ${analysis.timeline}\n` +
      `궁금하신 점은 언제든 편하게 말씀해주세요! 🙏`;
  }

  /* 제안서 포인트 자동 생성 */
  generateKeyPoints(data) {
    const points = [];
    const analysis = this.analyze(data);
    if (analysis.industry) {
      points.push(`${data.industry?.[0]} 업종 전문 디자인 적용 → ${analysis.industry.roi}`);
    }
    if (data.target) points.push(`${data.target} 타겟 최적화 UX/UI 설계`);
    const delivs = Array.isArray(data.deliverables) ? data.deliverables : [];
    if (delivs.length > 0) points.push(`${delivs.join(" + ")} 통합 제작`);
    const feats = Array.isArray(data.features) ? data.features : [];
    if (feats.length > 0) points.push(`핵심 기능: ${feats.slice(0, 3).join(", ")} 구현`);
    if (data.budget) points.push(`예산 ${data.budget} 맞춤 최적화 패키지`);
    if (points.length < 3) points.push("모바일 최적화 + SEO 기본 세팅 포함");
    return points;
  }
}

/* ══════════════════════════════════════════
   알림 시스템 엔진
   ══════════════════════════════════════════ */
class NotificationEngine {
  constructor() {
    this.notifications = this.load();
    this.listeners = [];
  }
  load() {
    try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]"); } catch { return []; }
  }
  save() {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(this.notifications));
    this.listeners.forEach(fn => fn(this.notifications));
  }
  subscribe(fn) { this.listeners.push(fn); }

  add(type, title, desc, data = {}) {
    const notif = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      type, title, desc, data,
      time: new Date().toISOString(),
      read: false
    };
    this.notifications.unshift(notif);
    if (this.notifications.length > 50) this.notifications = this.notifications.slice(0, 50);
    this.save();
    return notif;
  }
  markRead(id) {
    const n = this.notifications.find(x => x.id === id);
    if (n) { n.read = true; this.save(); }
  }
  markAllRead() {
    this.notifications.forEach(n => n.read = true);
    this.save();
  }
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  /* 자동 알림 생성 */
  onNewSubmission(clientData) {
    this.add("new", `🆕 새 프로젝트 접수`, `${clientData.business || "미입력"} — ${clientData.name || ""}`, clientData);
    this.add("analysis", `🤖 AI 자동 분석 완료`, `${clientData.business || ""}: 맞춤 제안서 준비됨`, clientData);
  }
  onStatusChange(clientData, newStatus) {
    const labels = { new: "신규", contacted: "상담중", closed: "완료", rejected: "미진행" };
    this.add("status", `📋 상태 변경`, `${clientData.business}: ${labels[newStatus]}`, clientData);
  }
}

/* ══════════════════════════════════════════
   스토리지 유틸
   ══════════════════════════════════════════ */
class Storage {
  static load(key) {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
  }
  static save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

/* Global instances */
const feedbackEngine = new FeedbackEngine();
const notifEngine = new NotificationEngine();
