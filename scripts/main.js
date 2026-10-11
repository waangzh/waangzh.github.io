let profileData = null;

document.addEventListener("DOMContentLoaded", async () => {
  await loadProfileData();
  applySiteMeta();

  if ((document.body.dataset.page || "home") === "resume") {
    renderResumePage();
    return;
  }

  renderHomePage();
  initNavigation();
  initScrollSpy();
  initBackToTop();
  initMotion();
});

async function loadProfileData() {
  try {
    const response = await fetch("data/profile.json");
    profileData = await response.json();
  } catch (error) {
    console.error("Failed to load profile data:", error);
    profileData = {
      site: {},
      personal: {},
      education: {},
      research: {},
      projects: [],
      awards: [],
      skills: [],
      social: {}
    };
  }
}

function applySiteMeta() {
  const site = profileData.site || {};
  if (site.title && document.body.dataset.page !== "resume") {
    document.title = site.title;
  }

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta && site.description && document.body.dataset.page !== "resume") {
    descriptionMeta.setAttribute("content", site.description);
  }
}

function renderHomePage() {
  if (document.body.classList.contains("minimal-home")) {
    renderMinimalHome();
    return;
  }
  const { personal, education, research } = profileData;

  setText("heroName", personal.name);
  setText("heroTitle", personal.title);
  setText("heroStatus", personal.status);
  setText("educationBrief", `${education.school || ""} · ${education.ranking || ""}`);
  setText("researchBrief", `${research.direction || ""} · ${research.period || ""}`);
  setText("summaryIntro", (personal.summary || [])[1] || (personal.summary || [])[0] || "");
  setText("skillsIntro", (personal.summary || [])[1] || (personal.summary || [])[0] || "");
  setText("skillsSupport", (personal.summary || [])[2] || "");
  setText("contactIntro", "");
  setText("footerStatus", personal.status);

  renderHeroTags();
  renderHeroMetrics();
  renderProfileList();
  renderEducation();
  renderResearch();
  renderProjects();
  renderAwards();
  renderSkills();
  renderContact();
}

function renderMinimalHome() {
  const { personal, education, research, homepage = {} } = profileData;
  setText("heroName", personal.name);
  setText("heroTitle", personal.title);
  setText("summaryIntro", homepage.intro);
  setText("heroStatus", personal.availability);
  setText("aboutIntro", homepage.about);
  setText("aboutSupport", homepage.support);
  setText("educationSchool", education.school);
  setText("educationDegree", `${education.major} · ${education.period}`);
  setText("educationNote", education.gpaDescription);
  setText("educationEnglish", education.english);
  setHTML("courseList", renderTags(education.courses));
  setText("futureEducation", homepage.futureEducation);
  setText("researchRole", `${research.lab} · ${research.role}`);
  setText("researchMeta", research.period);
  setText("researchOverview", research.overview);
  setHTML("researchItems", (research.items || []).map(item => `<li>${item.description}</li>`).join(""));
  setHTML("skillTags", renderTags(homepage.tools));
  setHTML("skillsContent", (profileData.skills || []).map(group =>
    `<p><strong>${group.category}</strong><span>${group.description}</span></p>`
  ).join(""));
  setHTML("awardsGrid", (profileData.awards || []).map(award =>
    `<li><span>${award.year}</span><strong>${award.title}</strong><em>${award.level}</em></li>`
  ).join(""));
  setHTML("additionalProjects", (profileData.projects || []).filter(project => project.id === "habitly").map(project =>
    `<p><strong>${project.name} · ${project.type}</strong><br>${project.description}</p>`
  ).join(""));
  const homepageProjects = homepage.projects || [];
  if (homepageProjects.length) setHTML("projectsGrid", homepageProjects.map((project, index) => `
    <article class="selected-project">
      <div class="project-art project-art-${project.visual}" role="img" aria-label="${project.name} 项目概念示意">
        ${renderProjectArtwork(project.visual)}
      </div>
      <div class="selected-project-copy">
        <div class="project-eyebrow"><span>PROJECT / 0${index + 1}</span><span>${project.kind}</span></div>
        <h3>${project.name} <span>— ${project.subtitle}</span></h3>
        <div class="project-case-copy">
          <div class="case-row"><b class="case-label problem">Problem</b><p>${project.problem}</p></div>
          <div class="case-row"><b class="case-label solution">Solution</b><p>${project.solution}</p></div>
          <div class="case-row"><b class="case-label impact">Impact</b><p>${project.impact}</p></div>
        </div>
        <div class="project-tech">${renderTags(project.technologies)}</div>
        <div class="project-actions">
          <a href="${project.url}" target="_blank" rel="noopener noreferrer">查看源码 ↗</a>
          <a href="${project.url}#readme" target="_blank" rel="noopener noreferrer">了解项目 ↗</a>
        </div>
      </div>
    </article>
  `).join(""));
  document.querySelectorAll("[data-github]").forEach(link => { link.href = personal.github; });
  document.querySelectorAll("[data-email]").forEach(link => { link.href = `mailto:${personal.email}`; });
  setText("contactEmail", personal.email);
  setText("contactLocation", personal.location);
  setText("footerText", `© ${new Date().getFullYear()} ${personal.nameEn}. Built with care and ☕.`);
}

function renderProjectArtwork(visual) {
  if (visual === "review") return `
    <div class="art-window review-window">
      <div class="art-toolbar"><b>repo / guardian</b><span>•••</span></div>
      <div class="review-headline">Good code.<br>Better evidence.</div>
      <p>PLAN / REVIEW / VERIFY</p>
      <div class="review-flow"><span>Diff</span><span>Agent</span><span>Evidence</span></div>
    </div>`;
  if (visual === "plant") return `
    <div class="art-window plant-window">
      <div class="art-toolbar"><b>green.care</b><span>•••</span></div>
      <div class="plant-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="plant-readings"><span>SOIL</span><span>LIGHT</span><span>TEMP</span></div>
      <p>CONNECTED TO NATURE.</p>
    </div>`;
  return `
    <div class="art-window bookmark-window">
      <div class="art-toolbar"><b>REMARKS</b><span>•••</span></div>
      <div class="bookmark-rows"><span><i>✓</i>开发 / Agents</span><span><i>✓</i>阅读 / 灵感</span><span><i>✓</i>工具 / 日常</span><span><i>✓</i>先预览，再整理</span></div>
    </div>`;
}

function renderHeroTags() {
  const tagsEl = document.getElementById("heroTags");
  const summaryEl = document.getElementById("heroSummary");
  const tags = profileData.personal.heroTags || [];
  const skillFocus = profileData.personal.skillFocus || [];
  const summary = skillFocus.length ? skillFocus : (profileData.personal.summary || []).slice(1);

  if (tagsEl) {
    tagsEl.innerHTML = tags.map(tag => `<span class="hero-badge">${tag}</span>`).join("");
    tagsEl.style.display = tags.length ? "flex" : "none";
  }

  if (summaryEl) {
    summaryEl.innerHTML = summary.map(item => `<div class="summary-badge">${item}</div>`).join("");
  }
}

function renderHeroMetrics() {
  const heroMetricsEl = document.getElementById("heroMetrics");
  const metrics = profileData.personal.metrics || [];
  if (!heroMetricsEl) return;

  heroMetricsEl.innerHTML = metrics.map(item => `
    <div class="metric-mini-card">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </div>
  `).join("");
}

function renderProfileList() {
  const items = createProfileInfoItems();
  setHTML("profileList", items.map(item => `
      <div class="contact-info-row">
        <span class="contact-info-label">${item.label}</span>
        <span class="contact-info-value">${renderContactValue(item)}</span>
      </div>
    `)
    .join(""));
}

function renderEducation() {
  const { education } = profileData;
  setText("educationSchool", education.school);
  setText("educationDegree", [education.degree, education.major, education.grade].filter(Boolean).join(" · "));
  setText("educationPeriod", education.period);
  setText("educationGpa", education.gpa);
  setText("educationRanking", education.ranking);
  setText("educationEnglish", education.english);
  setText("educationNote", education.gpaDescription);
  setHTML("courseList", renderTags(education.courses));
}

function renderResearch() {
  const { research } = profileData;
  setText("researchRole", research.role);
  setText("researchMeta", [research.lab, research.direction, research.period].filter(Boolean).join(" · "));
  setText("researchOverview", research.overview);
  renderCollection("researchItems", research.items, item => `
    <div class="timeline-item">
      <h4>${item.title}</h4>
      <p>${item.description}</p>
    </div>
  `);
}

function renderProjects() {
  const projectsGridEl = document.getElementById("projectsGrid");
  if (!projectsGridEl) return;

  projectsGridEl.innerHTML = (profileData.projects || []).map(project => {
    const focus = project.focus || [];
    return `
    <article class="project-card project-case-card">
      <h3 class="project-case-title">项目：${project.name || ""}</h3>
      <p class="project-case-meta">${[project.role, project.period].filter(Boolean).join(" · ")}</p>
      <div class="project-case-body">
        ${renderProjectCaseRow("Problem", project.problem || project.description)}
        ${renderProjectCaseRow("Solution", project.solution || focus[0] || project.type)}
        ${renderProjectCaseRow("Impact", project.impact || focus.slice(1).join("；"))}
      </div>
      <div class="project-case-tags">
        ${renderTags(project.technologies, "project-case-tag")}
      </div>
    </article>
  `}).join("");
}

function renderProjectCaseRow(label, content) {
  if (!content) return "";

  return `
    <div class="project-case-row">
      <span class="project-case-label project-case-label-${label.toLowerCase()}">${label}</span>
      <p class="project-case-copy">${content}</p>
    </div>
  `;
}

function renderAwards() {
  renderCollection("awardsGrid", profileData.awards, award => `
    <article class="achievement-card">
      <span class="achievement-year">${award.period || award.year}</span>
      <h3>${award.title}</h3>
      <p>${award.level}</p>
    </article>
  `);
}

function renderSkills() {
  setHTML("skillsContent", (profileData.skills || []).map((group, index) => {
    const isFeatured = index === 0;
    const isWide = index === 3;
    return `
    <article class="skill-card skill-card-narrative${isFeatured ? " skill-card-featured" : ""}${isWide ? " skill-card-wide" : ""}">
      <div class="skill-card-header">
        <p class="skill-card-kicker">${isFeatured ? "Current Focus" : "Capability"}</p>
        <h3>${group.category}</h3>
        <p class="skill-card-copy">${group.description || ""}</p>
      </div>
      <div class="skill-chip-list">
        ${renderTags((group.items || []).map(item => item.name), "skill-chip")}
      </div>
    </article>
  `}).join(""));
}

function renderContact() {
  setHTML("contactLinks", createPrimaryContacts().map(item => `
    <a class="contact-link-card" href="${item.href}" ${item.href.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener noreferrer"'}>
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </a>
  `).join(""));
}

function renderResumePage() {
  const { personal, education, projects, awards, skills, social, campusExperience } = profileData;

  setText("resumeName", personal.name);
  setText("resumeTitle", personal.title);
  setText("resumeEducationSchool", education.school);
  setText("resumeEducationMajor", education.major);
  setText("resumeEducationPeriod", education.period);
  setHTML("resumeEducationNote", `
    <li>专业绩点（${education.gpa}）排名 ${education.ranking}，连续两年荣获校级奖学金</li>
    <li>英语水平：${education.english || ""}</li>
    <li>主修核心课程：${(education.courses || []).join("、")}</li>
    <li>目标方向：自然语言处理、大模型应用与 Agents</li>
  `);

  const photo = getElement("resumePhoto");
  if (photo && personal.avatar) {
    photo.setAttribute("src", personal.avatar);
    photo.setAttribute("alt", `${personal.name}照片`);
  }

  setHTML("resumeContact", createResumeContacts(personal, social).map(item => `
    <div class="resume-contact-item">
      <span>${item.label}</span>
      <strong>${item.href ? renderContactValue(item) : item.value}</strong>
    </div>
  `).join(""));

  setHTML("resumeSkills", (skills || []).map(group => `
    <li><strong>${group.category}：</strong>${group.description || (group.items || []).map(item => item.name).join("、")}</li>
  `).join(""));

  renderCollection("resumeProjects", projects, project => `
    <article class="resume-compact-entry">
      ${renderResumeEntryHead(project.name, project.role, project.period)}
      ${renderBulletList(project.bullets || project.focus)}
    </article>
  `);

  renderCollection("resumeCampus", campusExperience, item => `
    <article class="resume-compact-entry">
      ${renderResumeEntryHead(item.name, item.role, item.period)}
      ${renderBulletList(item.bullets)}
    </article>
  `);

  renderCollection("resumeAwards", awards, award => `
    <div class="resume-award-row">
      <strong>${award.title}</strong>
      <span>${award.level}</span>
      <time>${award.period || award.year || ""}</time>
    </div>
  `);
}

function createResumeContacts(personal = {}, social = {}) {
  const email = social.email || personal.email;
  const github = social.github || personal.github;

  return [
    { label: "年级", value: "2023级" },
    { label: "邮箱", value: email, href: email ? `mailto:${email}` : "" },
    { label: "方向", value: "NLP / 大模型应用 / Agents" },
    { label: "地点", value: personal.location },
    { label: "GitHub", value: github, href: github }
  ].filter(item => item.value);
}

function renderResumeEntryHead(name, role, period) {
  return `
    <div class="resume-compact-head">
      <h3>${name || ""}</h3>
      <span>${role || ""}</span>
      <time>${period || ""}</time>
    </div>
  `;
}

function renderBulletList(items = []) {
  return `<ul class="resume-bullet-list">${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
}

function initNavigation() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isActive = navMenu.classList.toggle("active");
      navToggle.setAttribute("aria-expanded", String(isActive));
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");
      const target = href ? document.querySelector(href) : null;
      if (!target) return;

      event.preventDefault();
      navMenu?.classList.remove("active");
      navToggle?.setAttribute("aria-expanded", "false");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, {
    rootMargin: "-20% 0px -65% 0px",
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  window.addEventListener("scroll", () => {
    button.classList.toggle("visible", window.scrollY > 320);
  }, { passive: true });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initMotion() {
  const animatedItems = document.querySelectorAll([
    ".hero-badge",
    ".summary-badge",
    ".metric-mini-card",
    ".skill-card",
    ".project-card",
    ".achievement-card",
    ".contact-link-card",
    ".timeline-item",
    ".contact-card"
  ].join(","));

  if (!animatedItems.length) return;

  animatedItems.forEach((item, index) => {
    item.classList.add("motion-reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.12
  });

  animatedItems.forEach(item => observer.observe(item));
}

function renderTags(items, className = "tag") {
  return (items || []).map(item => `<span class="${className}">${item}</span>`).join("");
}

function renderTagList(id, items) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = renderTags(items);
}

function formatResumeContact(value) {
  if (value.includes("@")) return `<a href="mailto:${value}">${value}</a>`;
  if (value.startsWith("http")) return `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
  return value;
}

function getElement(id) {
  return document.getElementById(id);
}

function setHTML(id, value = "") {
  const element = getElement(id);
  if (element) {
    element.innerHTML = value;
  }
}

function renderCollection(id, items, renderItem) {
  setHTML(id, (items || []).map(renderItem).join(""));
}

function createPrimaryContacts() {
  const { social = {}, personal = {} } = profileData;
  const email = social.email || personal.email;
  const github = social.github || personal.github;

  return [
    {
      label: "邮箱",
      value: email,
      href: email ? `mailto:${email}` : ""
    },
    {
      label: "GitHub",
      value: github,
      href: github
    }
  ].filter(item => item.value && item.href);
}

function createProfileInfoItems() {
  const { personal = {} } = profileData;
  const [emailContact, githubContact] = createPrimaryContacts();

  return [
    { label: "姓名", value: personal.name },
    { label: "英文名", value: personal.nameEn },
    { label: "地点", value: personal.location },
    emailContact,
    githubContact
  ].filter(item => item && item.value);
}

function renderContactValue(item) {
  if (!item.href) return item.value;

  const externalAttrs = item.href.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener noreferrer"';
  return `<a href="${item.href}"${externalAttrs}>${item.value}</a>`;
}

function setText(id, value) {
  const element = getElement(id);
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
}

