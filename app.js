/* ══════════════════════════════════════════
   BRAND BEAT LAB — App UI (Part 1: Utils + Rendering Core)
   ══════════════════════════════════════════ */

/* ── State ── */
const state = {
  page: "landing", // landing | form | success | admin | pw
  formStep: 0,
  formData: { name:"",business:"",industry:[],target:"",channels:[],phone:"",contact:"",
    deliverables:[],cta:[],must_include:"",has_assets:"",benchmark:"",
    mood:[],brand_color:"",features:[],language:[],tools:"",
    budget:"",deadline:"",priority:[],maintenance:"",additional:"" },
  clients: Storage.load(STORAGE_KEY),
  lastSubmit: null,
  selectedClient: null,
  pw: "",
  showNotifs: false,
  mobileAnalysis: false,
  toasts: [],
};

const arr = v => Array.isArray(v) ? v.join(", ") : (v || "");
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

/* ── Toast System ── */
function showToast(icon, title, desc) {
  const id = Date.now();
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = "toast";
  el.id = `toast-${id}`;
  el.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${desc}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    <div class="toast-progress"></div>
  `;
  container.appendChild(el);
  setTimeout(() => el.remove(), 4500);
}

/* ── Render Engine ── */
function render() {
  const app = document.getElementById("app");
  let html = renderNavbar();
  switch (state.page) {
    case "landing": html += renderLanding(); break;
    case "form": html += renderForm(); break;
    case "success": html += renderSuccess(); break;
    case "admin": html += renderAdmin(); break;
    case "pw": html += renderLanding() + renderPwModal(); break;
  }
  html += renderFooter();
  if (state.showNotifs) html += renderNotifCenter();
  app.innerHTML = html;
  bindEvents();
}

/* ══════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════ */
function renderNavbar() {
  const unread = notifEngine.getUnreadCount();
  const newCount = state.clients.filter(c => c.status === "new").length;
  return `
  <nav class="navbar">
    <div class="nav-logo" onclick="navigate('landing')">
      <div class="nav-logo-icon">BB</div>
      <span class="nav-logo-text">Brand Beat Lab</span>
    </div>
    <div class="nav-actions">
      <button class="notif-bell" onclick="toggleNotifs()" id="notif-bell">
        🔔${unread > 0 ? `<span class="notif-bell-count">${unread}</span>` : ""}
      </button>
      <button class="btn btn-ghost btn-sm" onclick="navigate('pw')" style="position:relative">
        🔒 관리자${newCount > 0 ? `<span style="position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:var(--er);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff">${newCount}</span>` : ""}
      </button>
      <button class="btn btn-primary btn-sm" onclick="navigate('form')">프로젝트 시작 →</button>
    </div>
  </nav>`;
}

/* ══════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════ */
function renderLanding() {
  return `
  <div class="landing page">
    <div class="hero">
      <div class="hero-badge"><span class="hero-badge-dot"></span>AI-Powered Vibe Coding Agency</div>
      <h1 class="hero-title">당신의 브랜드에<br><em>심장 박동</em>을 불어넣다</h1>
      <p class="hero-subtitle">랜딩페이지 · 상세페이지 · 웹앱 · 자동화<br>바이브 코딩으로 3~10일 안에 완성합니다.</p>
      <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center">
        <button class="btn btn-primary btn-lg" onclick="navigate('form')">무료 상담 시작하기</button>
      </div>
    </div>
    <div class="trust-badges">
      ${[["3~10일","빠른 납기"],["AI 기반","바이브 코딩"],["50%","선금 후 시작"],["24h","제안서 발송"]].map(([n,l])=>`
        <div class="trust-badge"><div class="trust-badge-number">${n}</div><div class="trust-badge-label">${l}</div></div>
      `).join("")}
    </div>
    <div class="services-section" id="services">
      <div class="section-header">
        <div class="section-label">SERVICES</div>
        <h2 class="section-title">맞춤 서비스 패키지</h2>
      </div>
      <div class="tier-grid">
        ${[
          {t:"TIER 1",n:"스타터",p:"29만원~",c:"var(--dim)",pop:false,f:["원페이지 랜딩","모바일 최적화","기본 섹션 5개","수정 1회 · 납기 5~7일"]},
          {t:"TIER 2",n:"스탠다드",p:"59만원~",c:"var(--lav)",pop:true,f:["멀티섹션 (최대 10)","모바일+태블릿 최적화","예약/문의 폼 연동","기본 SEO · 수정 2회","납기 7~10일"]},
          {t:"TIER 3",n:"프리미엄",p:"99만원~",c:"var(--ok)",pop:false,f:["풀 사이트 멀티페이지","애니메이션/인터랙션","CMS/DB 연동","카카오 알림 · 수정 3회","납기 2~3주"]}
        ].map(s=>`
          <div class="tier-card${s.pop?" popular":""}">
            ${s.pop?'<div class="tier-popular-badge">MOST POPULAR</div>':""}
            <div class="tier-label">${s.t}</div>
            <div class="tier-name">${s.n}</div>
            <div class="tier-price" style="color:${s.c}">${s.p}</div>
            ${s.f.map(f=>`<div class="tier-feature"><span class="check">✓</span>${f}</div>`).join("")}
            <button class="tier-cta" style="background:${s.pop?"linear-gradient(135deg,var(--ame),var(--vio))":"var(--s2)"};color:${s.pop?"#fff":"var(--lav)"}" onclick="navigate('form')">시작하기 →</button>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="cta-section">
      <h2 style="font-family:var(--font-serif);font-size:clamp(1.2rem,4vw,1.7rem);color:var(--soft);margin-bottom:12px">지금 바로 시작하세요</h2>
      <p style="font-size:14px;color:var(--dim);font-weight:300;margin-bottom:28px">간단한 질문지 작성 → 24시간 내 맞춤 제안서</p>
      <button class="btn btn-primary btn-lg" onclick="navigate('form')">무료 상담 시작하기 →</button>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════
   FORM + LIVE ANALYSIS PANEL
   ══════════════════════════════════════════ */
function renderForm() {
  const step = state.formStep;
  const f = state.formData;
  const pct = ((step + 1) / 4) * 100;
  const STEPS = ["기본정보", "프로젝트", "디자인·기능", "예산·일정"];
  const secNames = ["기본 비즈니스 파악","프로젝트 요구사항","디자인 & 기능","예산 & 일정"];
  const secDescs = ["사업에 대해 알려주세요.","원하는 결과물을 알려주세요.","분위기와 기능을 알려주세요.","현실적 제안을 위한 정보입니다."];

  const stepFields = [
    renderFormStep0(f),
    renderFormStep1(f),
    renderFormStep2(f),
    renderFormStep3(f)
  ];

  const analysis = feedbackEngine.analyze(f);

  return `
  <div class="form-layout page">
    <div class="form-column">
      <button class="btn btn-outline btn-sm" onclick="navigate('landing')" style="margin-top:16px">← 메인으로</button>
      <div class="progress-bar-container">
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="progress-steps">
          ${STEPS.map((s,i)=>`<span class="progress-step${i===step?" active":i<step?" done":""}" ${i<=step?`onclick="setFormStep(${i})"`:""} >${s}</span>`).join("")}
        </div>
      </div>
      <div class="form-section-header">
        <div class="form-section-label">SECTION ${String.fromCharCode(65+step)}</div>
        <h2 class="form-section-title">${secNames[step]}</h2>
        <p class="form-section-desc">${secDescs[step]}</p>
      </div>
      <div style="animation:fadeUp .35s ease both">
        ${stepFields[step]}
      </div>
      <div class="form-nav">
        ${step>0?'<button class="btn btn-ghost" onclick="prevStep()">← 이전</button>':""}
        ${step<3?'<button class="btn btn-primary" onclick="nextStep()">다음 →</button>':'<button class="btn btn-success" onclick="submitForm()">제출하기 ✓</button>'}
      </div>
    </div>
    ${renderLiveAnalysis(analysis)}
    <button class="mobile-analysis-toggle" onclick="toggleMobileAnalysis()">📊</button>
  </div>`;
}

/* ── Form Steps ── */
function renderInput(id, label, tag, hint, value, placeholder) {
  const tagClass = tag==="필수"?"tag-required":tag==="핵심"?"tag-key":"tag-optional";
  return `<div class="field-group">
    <div class="field-label"><span class="field-label-text">${label}</span>${tag?`<span class="tag ${tagClass}">${tag}</span>`:""}</div>
    ${hint?`<div class="field-hint">${hint}</div>`:""}
    <input class="input" id="${id}" value="${value||""}" placeholder="${placeholder||""}" oninput="updateForm('${id}',this.value)">
  </div>`;
}
function renderTextarea(id, label, tag, hint, value, placeholder) {
  const tagClass = tag==="필수"?"tag-required":tag==="핵심"?"tag-key":"tag-optional";
  return `<div class="field-group">
    <div class="field-label"><span class="field-label-text">${label}</span>${tag?`<span class="tag ${tagClass}">${tag}</span>`:""}</div>
    ${hint?`<div class="field-hint">${hint}</div>`:""}
    <textarea class="textarea" id="${id}" placeholder="${placeholder||""}" oninput="updateForm('${id}',this.value)">${value||""}</textarea>
  </div>`;
}
function renderChips(id, label, tag, hint, opts, multi, value) {
  const tagClass = tag==="필수"?"tag-required":tag==="핵심"?"tag-key":"tag-optional";
  const vals = Array.isArray(value)?value:[];
  return `<div class="field-group">
    <div class="field-label"><span class="field-label-text">${label}</span>${tag?`<span class="tag ${tagClass}">${tag}</span>`:""}</div>
    ${hint?`<div class="field-hint">${hint}</div>`:""}
    <div class="chip-group">${opts.map(o=>`<button class="chip${vals.includes(o)?" active":""}" onclick="toggleChip('${id}','${o}',${multi})">${vals.includes(o)?"✓ ":""}${o}</button>`).join("")}</div>
  </div>`;
}
function renderRadios(id, label, tag, hint, opts, value) {
  const tagClass = tag==="필수"?"tag-required":tag==="핵심"?"tag-key":"tag-optional";
  return `<div class="field-group">
    <div class="field-label"><span class="field-label-text">${label}</span>${tag?`<span class="tag ${tagClass}">${tag}</span>`:""}</div>
    ${hint?`<div class="field-hint">${hint}</div>`:""}
    <div style="display:grid;gap:10px">${opts.map(o=>`
      <button class="radio-card${value===o.v?" active":""}" onclick="updateForm('${id}','${o.v}')">
        <div class="radio-dot"><div class="radio-dot-inner"></div></div>
        <div><div class="radio-title">${o.t}</div>${o.d?`<div class="radio-desc">${o.d}</div>`:""}</div>
      </button>`).join("")}</div>
  </div>`;
}

function renderFormStep0(f) {
  return renderInput("name","대표님 성함","필수","",f.name,"예: 김대표")
    + renderInput("business","사업체명","필수","",f.business,"예: 맛나식당")
    + renderChips("industry","업종","필수","디자인 방향과 카피 톤이 결정됩니다.",["음식점/카페","쇼핑몰","서비스업","뷰티/건강","교육","B2B","기타"],false,f.industry)
    + renderInput("target","주요 고객층","필수","타겟이 명확할수록 전환율 상승",f.target,"예: 30~40대 여성")
    + renderChips("channels","현재 마케팅 채널","핵심","",["인스타그램","블로그","유튜브","카카오채널","오프라인","없음"],true,f.channels)
    + renderInput("phone","연락처","필수","",f.phone,"010-0000-0000")
    + renderInput("contact","카톡 ID / 이메일","필수","",f.contact,"제안서 받으실 연락처");
}
function renderFormStep1(f) {
  return renderChips("deliverables","원하는 결과물","필수","복수 선택 가능",["랜딩페이지","상세페이지","예약/주문 웹앱","쇼핑몰","업무 자동화","SNS 마케팅","기타"],true,f.deliverables)
    + renderChips("cta","고객 행동 목적","핵심","페이지의 최종 목적",["전화 문의","카톡 문의","온라인 구매","예약하기","유입/인지도"],true,f.cta)
    + renderTextarea("must_include","꼭 들어갈 내용","필수","",f.must_include,"예: 대표 메뉴 5개, 지도, 후기")
    + renderRadios("has_assets","사진/영상 자료","핵심","",
      [{v:"있음",t:"있음 — 직접 제공",d:"로고,사진 등"},{v:"일부",t:"일부만 있음",d:"사진 부족"},{v:"없음",t:"없음 — AI 대체",d:"별도 비용 가능"}],f.has_assets)
    + renderInput("benchmark","벤치마크 사이트","선택","",f.benchmark,"https://");
}
function renderFormStep2(f) {
  return renderChips("mood","선호 분위기","선택","",["고급·어두운","밝고 따뜻한","심플·세련","귀엽고 캐주얼","모던·트렌디","잘 모르겠어요"],true,f.mood)
    + renderInput("brand_color","브랜드 컬러","선택","",f.brand_color,"예: 네이비+골드")
    + renderChips("features","필요한 기능","핵심","",["예약 폼","문의 폼","카카오톡 연동","결제 연동","위치 지도","리뷰 섹션","다국어","관리자 페이지","SNS 연동"],true,f.features)
    + renderChips("language","다국어","선택","",["한국어만","한·영","한·중","한·중·영"],false,f.language)
    + renderInput("tools","사용 중인 툴","선택","",f.tools,"예: 스마트스토어, 배민");
}
function renderFormStep3(f) {
  return renderRadios("budget","예산 범위","핵심","현실적 제안을 위해 필요합니다.",
      [{v:"30만원 미만",t:"30만원 미만",d:"심플 원페이지"},{v:"30~60만원",t:"30~60만원",d:"스탠다드"},{v:"60~100만원",t:"60~100만원",d:"프리미엄+기능"},{v:"100만원+",t:"100만원 이상",d:"웹앱·풀시스템"},{v:"상담 후",t:"상담 후 결정",d:"제안 먼저 확인"}],f.budget)
    + renderInput("deadline","희망 완료일","필수","",f.deadline,"예: 5월 15일")
    + renderChips("priority","우선순위","선택","",["⚡ 속도","✨ 품질","💰 비용","⚖️ 균형"],false,f.priority)
    + renderRadios("maintenance","유지보수","선택","",
      [{v:"월 정기",t:"월 정기 관리",d:"월 수정+모니터링"},{v:"건별",t:"필요할 때만",d:"건별 요청"},{v:"미정",t:"모르겠음",d:"나중에 결정"}],f.maintenance)
    + renderTextarea("additional","추가 요청","선택","",f.additional,"기타");
}

/* ══════════════════════════════════════════
   LIVE ANALYSIS PANEL (실시간 니즈 분석)
   ══════════════════════════════════════════ */
function renderLiveAnalysis(a) {
  const ind = a.industry;
  return `
  <div class="live-analysis-panel${state.mobileAnalysis?" show":""}">
    <div class="analysis-header">
      <span class="analysis-header-icon">💜</span>
      <h3>실시간 니즈 분석</h3>
      <span class="live-dot"></span>
    </div>

    <!-- 매칭도 -->
    <div class="match-meter">
      <div class="match-meter-label">프로젝트 매칭도</div>
      <div class="match-meter-bar"><div class="match-meter-fill" style="width:${a.matchScore}%"></div></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end">
        <div class="match-meter-value">${a.matchScore}%</div>
        <div class="match-meter-desc">${a.matchScore>70?"최적의 매칭!":a.matchScore>40?"정보를 더 입력하면 정확해져요":"시작해볼까요?"}</div>
      </div>
    </div>

    <!-- 추천 티어 -->
    <div class="analysis-section">
      <div class="analysis-section-label">추천 패키지</div>
      <div class="analysis-value highlight" style="font-size:16px;margin-bottom:4px">${a.recommendedTier}</div>
      <div style="display:flex;justify-content:space-between;margin-top:6px">
        <div><span style="font-size:10px;color:var(--mu)">예상 가격</span><div class="analysis-value warn">${a.priceRange}</div></div>
        <div><span style="font-size:10px;color:var(--mu)">예상 기간</span><div class="analysis-value success">${a.timeline}</div></div>
      </div>
    </div>

    <!-- 업종별 ROI 인사이트 -->
    ${ind ? `
    <div class="roi-insight">
      <div class="roi-insight-title">📈 업종 인사이트</div>
      <div class="roi-insight-stat">${ind.roi}</div>
      <div class="roi-insight-desc">${ind.insight}</div>
      <div style="margin-top:8px;font-size:10px;color:var(--wa);font-weight:600">⚡ ${ind.urgency}</div>
    </div>` : `
    <div class="analysis-section">
      <div class="analysis-section-label">💡 TIP</div>
      <div class="analysis-value" style="font-size:12px">업종을 선택하면 맞춤 인사이트가 표시됩니다</div>
    </div>`}

    <!-- 소셜 프루프 -->
    ${ind && ind.socialProof ? `
    <div class="social-proof">
      <div class="social-proof-label">비슷한 프로젝트 성과</div>
      ${ind.socialProof.map(s => `
        <div class="social-proof-item">
          <div class="social-proof-avatar">${s.name[0]}</div>
          <div class="social-proof-text"><strong>${s.biz}</strong> ${s.name}님 — ${s.result}</div>
        </div>
      `).join("")}
    </div>` : ""}

    <!-- 입력 완성도 -->
    <div class="analysis-section">
      <div class="analysis-section-label">입력 완성도</div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="flex:1;height:6px;border-radius:3px;background:rgba(167,139,250,.12);overflow:hidden">
          <div style="height:100%;width:${a.completeness}%;background:linear-gradient(90deg,var(--ame),var(--ok));border-radius:3px;transition:width .5s"></div>
        </div>
        <span style="font-size:12px;font-weight:600;color:${a.completeness>70?"var(--ok)":"var(--wa)"}">${a.completeness}%</span>
      </div>
      <div style="font-size:11px;color:var(--dim);margin-top:6px">${a.completeness>80?"👏 거의 완성! 제출하면 바로 분석됩니다":a.completeness>50?"💪 좋아요! 조금만 더 채워주세요":"✨ 정보가 많을수록 정확한 제안이 가능해요"}</div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════
   SUCCESS PAGE + AUTO REPORT
   ══════════════════════════════════════════ */
function renderSuccess() {
  const d = state.lastSubmit;
  if (!d) return '<div class="page" style="text-align:center;padding:80px">데이터 없음</div>';
  const analysis = feedbackEngine.analyze(d);
  const keyPoints = feedbackEngine.generateKeyPoints(d);
  const reply = feedbackEngine.generateReply(d);

  return `
  <div class="success-page page">
    <div class="success-header">
      <div class="success-icon">✅</div>
      <h2 class="success-title">접수 완료!</h2>
      <p class="success-subtitle">24시간 내 맞춤 제안서를 보내드립니다.</p>
      <p style="font-size:13px;color:var(--lav)">급하시면 카톡으로 연락주세요</p>
    </div>

    <!-- 접수 내역 -->
    <div class="card" style="margin-bottom:20px">
      <h4 style="font-size:13px;color:var(--lav);font-weight:600;margin-bottom:16px">접수 내역</h4>
      ${[["name","성함"],["business","사업체명"],["industry","업종"],["deliverables","결과물"],["budget","예산"],["deadline","완료일"],["phone","연락처"],["contact","카톡/이메일"]].map(([k,l])=>{
        const v=arr(d[k]); return v?`<div class="data-row"><span class="data-label">${l}</span><span class="data-value">${v}</span></div>`:"";
      }).join("")}
    </div>

    <!-- AI 자동 분석 리포트 -->
    <div class="card card-gradient auto-report" style="margin-bottom:20px">
      <div class="auto-report-header">
        <span style="font-size:22px">🤖</span>
        <h3>AI 자동 분석 리포트</h3>
      </div>
      <div class="report-grid">
        <div class="report-stat"><div class="report-stat-label">추천 티어</div><div class="report-stat-value" style="color:var(--ok)">${analysis.recommendedTier}</div></div>
        <div class="report-stat"><div class="report-stat-label">추정 가격</div><div class="report-stat-value" style="color:var(--wa)">${analysis.priceRange}</div></div>
        <div class="report-stat"><div class="report-stat-label">예상 기간</div><div class="report-stat-value" style="color:var(--lav)">${analysis.timeline}</div></div>
        <div class="report-stat"><div class="report-stat-label">프로젝트 매칭</div><div class="report-stat-value" style="color:var(--ok)">${analysis.matchScore}%</div></div>
      </div>
      ${analysis.industry?`<div style="padding:12px;border-radius:8px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.15);margin-bottom:16px">
        <div style="font-size:11px;font-weight:700;color:var(--ok);margin-bottom:4px">📈 업종 인사이트</div>
        <div style="font-size:13px;color:var(--tx);line-height:1.7">${analysis.industry.insight}</div>
      </div>`:""}
      <div class="report-points">
        <div class="report-points-label">제안서 핵심 포인트</div>
        ${keyPoints.map(p=>`<div class="report-point"><span class="bullet">•</span>${p}</div>`).join("")}
      </div>
      <div class="reply-draft" onclick="copyReply()">
        <div class="reply-draft-label">📱 카톡 자동 답변 (복사용)</div>
        <div class="reply-draft-text" id="reply-text">${reply.replace(/\n/g,"<br>")}</div>
        <div class="reply-draft-copy" id="reply-copy-status">📋 클릭→복사</div>
      </div>
    </div>

    <div style="text-align:center">
      <button class="btn btn-outline" onclick="navigate('landing')">← 메인으로</button>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════
   ADMIN DASHBOARD
   ══════════════════════════════════════════ */
function renderAdmin() {
  if (state.selectedClient) return renderClientDetail();
  const cl = state.clients;
  const newC = cl.filter(c=>c.status==="new").length;
  const contactedC = cl.filter(c=>c.status==="contacted").length;
  const closedC = cl.filter(c=>c.status==="closed").length;

  return `
  <div class="admin-page page">
    <div class="admin-header">
      <div class="admin-title-group">
        <div class="admin-logo">BB</div>
        <div><div style="font-size:14px;font-weight:600;color:var(--soft)">관리자 대시보드</div><div style="font-size:11px;color:var(--mu)">총 ${cl.length}건</div></div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="navigate('landing')">← 랜딩페이지</button>
    </div>
    <div class="admin-stats">
      <div class="admin-stat"><div class="admin-stat-value" style="color:var(--ok)">${newC}</div><div class="admin-stat-label">신규</div></div>
      <div class="admin-stat"><div class="admin-stat-value" style="color:var(--wa)">${contactedC}</div><div class="admin-stat-label">상담중</div></div>
      <div class="admin-stat"><div class="admin-stat-value" style="color:var(--lav)">${closedC}</div><div class="admin-stat-label">완료</div></div>
      <div class="admin-stat"><div class="admin-stat-value" style="color:var(--soft)">${cl.length}</div><div class="admin-stat-label">전체</div></div>
    </div>
    ${cl.length===0?`<div style="text-align:center;padding:80px 0;color:var(--mu)"><p style="font-size:40px;margin-bottom:12px">📭</p><p>접수건이 없습니다.</p></div>`:`
    <div class="client-list">
      ${[...cl].reverse().map(c=>{
        const sc={new:"var(--ok)",contacted:"var(--wa)",closed:"var(--lav)",rejected:"var(--er)"};
        const sl={new:"신규",contacted:"상담중",closed:"완료",rejected:"미진행"};
        return `<div class="client-card" onclick="selectClient('${c.id}')">
          <div class="client-card-header">
            <span class="client-name">${c.business||"미입력"}</span>
            <span class="status-badge" style="background:${sc[c.status]}22;color:${sc[c.status]}">${sl[c.status]}</span>
          </div>
          <div class="client-meta"><span>${c.name}</span><span>${arr(c.industry)}</span><span>${c.budget}</span></div>
          <div class="client-date">${new Date(c.submitted_at).toLocaleDateString("ko-KR")} 접수</div>
        </div>`;
      }).join("")}
    </div>`}
  </div>`;
}

function renderClientDetail() {
  const c = state.clients.find(x=>x.id===state.selectedClient);
  if (!c) return "";
  const analysis = feedbackEngine.analyze(c);
  const keyPoints = feedbackEngine.generateKeyPoints(c);
  const reply = feedbackEngine.generateReply(c);
  const sc={new:"var(--ok)",contacted:"var(--wa)",closed:"var(--lav)",rejected:"var(--er)"};
  const sl={new:"신규",contacted:"상담중",closed:"완료",rejected:"미진행"};

  return `
  <div class="admin-page detail-page page">
    <button class="btn btn-outline btn-sm" onclick="deselectClient()" style="margin-bottom:20px">← 목록으로</button>
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
        <div><h2 style="font-size:20px;color:var(--soft);font-weight:700;margin-bottom:4px">${c.business}</h2><p style="font-size:13px;color:var(--dim)">${c.name} · ${c.phone} · ${c.contact}</p></div>
        <div class="status-buttons">
          ${Object.entries(sl).map(([k,v])=>`<button class="status-btn" style="background:${c.status===k?sc[k]+"22":"var(--s1)"};border:1px solid ${c.status===k?sc[k]:"var(--glass-border)"};color:${c.status===k?sc[k]:"var(--mu)"}" onclick="updateStatus('${c.id}','${k}')">${v}</button>`).join("")}
        </div>
      </div>
    </div>
    <div class="card card-gradient" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px"><span style="font-size:18px">🤖</span><h3 style="font-size:15px;color:var(--lav);font-weight:700">AI 자동 분석</h3></div>
      <div class="report-grid">
        <div class="report-stat"><div class="report-stat-label">추천 티어</div><div class="report-stat-value" style="color:var(--ok)">${analysis.recommendedTier}</div></div>
        <div class="report-stat"><div class="report-stat-label">추정 가격</div><div class="report-stat-value" style="color:var(--wa)">${analysis.priceRange}</div></div>
      </div>
      <div class="report-points" style="margin-top:12px">
        <div class="report-points-label">제안서 핵심 포인트</div>
        ${keyPoints.map(p=>`<div class="report-point"><span class="bullet">•</span>${p}</div>`).join("")}
      </div>
      <div class="reply-draft" onclick="copyReply()" style="margin-top:12px">
        <div class="reply-draft-label">카톡 자동 답변 (복사용)</div>
        <div class="reply-draft-text" id="reply-text">${reply.replace(/\n/g,"<br>")}</div>
        <div class="reply-draft-copy" id="reply-copy-status">📋 클릭→복사</div>
      </div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:14px;color:var(--lav);font-weight:600;margin-bottom:16px">전체 데이터</h3>
      ${[["사업체",c.business],["업종",c.industry],["타겟",c.target],["채널",c.channels],["결과물",c.deliverables],["CTA",c.cta],["필수내용",c.must_include],["자료",c.has_assets],["무드",c.mood],["컬러",c.brand_color],["기능",c.features],["예산",c.budget],["일정",c.deadline],["우선순위",c.priority],["유지보수",c.maintenance],["추가",c.additional]].map(([l,v])=>{const val=arr(v);return val?`<div class="data-row"><span class="data-label">${l}</span><span class="data-value">${val}</span></div>`:""}).join("")}
    </div>
    <button class="btn btn-danger" onclick="deleteClient('${c.id}')">🗑 삭제</button>
  </div>`;
}

/* ══════════════════════════════════════════
   NOTIFICATION CENTER
   ══════════════════════════════════════════ */
function renderNotifCenter() {
  const notifs = notifEngine.notifications;
  const icons = {new:"notif-icon new",analysis:"notif-icon analysis",status:"notif-icon status",reminder:"notif-icon reminder"};
  const emojis = {new:"🆕",analysis:"🤖",status:"📋",reminder:"⏰"};
  return `
  <div class="notif-center" id="notif-center">
    <div class="notif-header">
      <h4>🔔 알림센터</h4>
      <button class="btn btn-ghost btn-sm" onclick="markAllRead()" style="padding:4px 10px;font-size:10px">모두 읽음</button>
    </div>
    <div class="notif-list">
      ${notifs.length===0?'<div class="notif-empty"><div class="notif-empty-icon">🔕</div><p>알림이 없습니다</p></div>':
        notifs.slice(0,20).map(n=>`
          <div class="notif-item${n.read?"":" unread"}" onclick="readNotif('${n.id}')">
            <div class="${icons[n.type]||"notif-icon new"}">${emojis[n.type]||"📌"}</div>
            <div class="notif-content">
              <div class="notif-title">${n.title}</div>
              <div class="notif-desc">${n.desc}</div>
              <div class="notif-time">${timeAgo(n.time)}</div>
            </div>
            ${n.read?"":'<div class="notif-dot"></div>'}
          </div>
        `).join("")}
    </div>
  </div>`;
}

function timeAgo(t) {
  const diff = Date.now() - new Date(t).getTime();
  const m = Math.floor(diff/60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m/60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h/24)}일 전`;
}

/* ── Password Modal ── */
function renderPwModal() {
  return `
  <div class="modal-overlay" onclick="navigate('landing')">
    <div class="modal" onclick="event.stopPropagation()">
      <h3>🔒 관리자 인증</h3>
      <p>비밀번호를 입력하세요</p>
      <input type="password" class="input" id="pw-input" placeholder="비밀번호" autofocus onkeydown="if(event.key==='Enter')tryPw()" style="margin-bottom:14px">
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="navigate('landing')">취소</button>
        <button class="btn btn-primary" onclick="tryPw()">확인</button>
      </div>
    </div>
  </div>`;
}

/* ── Footer ── */
function renderFooter() {
  return `<div class="footer"><p>Brand Beat Lab · AI-Powered Vibe Coding Agency</p><p>Powered by Ian Ko</p></div>`;
}

/* ══════════════════════════════════════════
   EVENT HANDLERS
   ══════════════════════════════════════════ */
function navigate(page) { state.page = page; state.showNotifs = false; render(); window.scrollTo(0,0); }
function setFormStep(n) { state.formStep = n; render(); }
function nextStep() { if(state.formStep<3) { state.formStep++; render(); window.scrollTo(0,0); } }
function prevStep() { if(state.formStep>0) { state.formStep--; render(); } }

function updateForm(key, value) { state.formData[key] = value; updateAnalysisPanel(); }
function toggleChip(key, value, multi) {
  const cur = Array.isArray(state.formData[key]) ? state.formData[key] : [];
  if (multi) {
    state.formData[key] = cur.includes(value) ? cur.filter(x=>x!==value) : [...cur,value];
  } else {
    state.formData[key] = cur.includes(value) ? [] : [value];
  }
  render();
}

function updateAnalysisPanel() {
  const panel = document.querySelector(".live-analysis-panel");
  if (!panel) return;
  const a = feedbackEngine.analyze(state.formData);
  // Only update dynamic parts
  const meter = panel.querySelector(".match-meter-fill");
  if (meter) meter.style.width = a.matchScore + "%";
}

function submitForm() {
  const d = state.formData;
  if (!d.name || !d.business || !d.phone) {
    showToast("⚠️","필수 입력 누락","성함, 사업체명, 연락처는 필수입니다.");
    return;
  }
  const submission = { ...d, submitted_at: new Date().toISOString(), id: Date.now().toString(36)+Math.random().toString(36).slice(2,6), status: "new" };
  state.clients.push(submission);
  state.lastSubmit = submission;
  Storage.save(STORAGE_KEY, state.clients);
  notifEngine.onNewSubmission(submission);
  showToast("✅","접수 완료!",`${submission.business} 프로젝트가 접수되었습니다.`);
  state.formData = { name:"",business:"",industry:[],target:"",channels:[],phone:"",contact:"",deliverables:[],cta:[],must_include:"",has_assets:"",benchmark:"",mood:[],brand_color:"",features:[],language:[],tools:"",budget:"",deadline:"",priority:[],maintenance:"",additional:"" };
  state.formStep = 0;
  navigate("success");
}

function tryPw() {
  const input = document.getElementById("pw-input");
  if (input && input.value === ADMIN_PW) { navigate("admin"); }
  else { showToast("❌","인증 실패","비밀번호가 틀렸습니다."); }
}

function selectClient(id) { state.selectedClient = id; render(); window.scrollTo(0,0); }
function deselectClient() { state.selectedClient = null; render(); }
function updateStatus(id, status) {
  const c = state.clients.find(x=>x.id===id);
  if (c) { c.status = status; Storage.save(STORAGE_KEY, state.clients); notifEngine.onStatusChange(c, status); render(); }
}
function deleteClient(id) {
  if (!confirm("삭제하시겠습니까?")) return;
  state.clients = state.clients.filter(c=>c.id!==id);
  Storage.save(STORAGE_KEY, state.clients);
  state.selectedClient = null;
  render();
}
function copyReply() {
  const el = document.getElementById("reply-text");
  if (el) {
    navigator.clipboard?.writeText(el.innerText);
    const status = document.getElementById("reply-copy-status");
    if (status) { status.textContent = "✅ 복사됨!"; status.classList.add("copied"); setTimeout(()=>{status.textContent="📋 클릭→복사";status.classList.remove("copied");},2000); }
  }
}

function toggleNotifs() { state.showNotifs = !state.showNotifs; render(); }
function markAllRead() { notifEngine.markAllRead(); render(); }
function readNotif(id) { notifEngine.markRead(id); render(); }
function toggleMobileAnalysis() { state.mobileAnalysis = !state.mobileAnalysis; render(); }

function bindEvents() {
  // Close notif center on outside click
  document.addEventListener("click", (e) => {
    if (state.showNotifs && !e.target.closest("#notif-center") && !e.target.closest("#notif-bell")) {
      state.showNotifs = false; render();
    }
  }, { once: true });
}

/* ── INIT ── */
notifEngine.subscribe(() => {});
render();
