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
  const { personal, education, research } = profileData;

  setText("heroName", personal.name);
  setText("heroTitle", personal.title);
  setText("heroStatus", personal.status);
  setText("educationBrief", `${education.school || ""} · ${education.ranking || ""}`);
  setText("researchBrief", `${research.direction || ""} · ${research.period || ""}`);
  setText("summaryIntro", (personal.summary || [])[1] || (personal.summary || [])[0] || "");
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
  const profileListEl = document.getElementById("profileList");
  const personal = profileData.personal || {};
  if (!profileListEl) return;

  const items = [
    ["姓名", personal.name],
    ["英文名", personal.nameEn],
    ["地点", personal.location],
    ["邮箱", personal.email],
    ["GitHub", personal.github]
  ];

  profileListEl.innerHTML = items
    .filter(([, value]) => value)
    .map(([label, value]) => `
      <div class="contact-info-row">
        <span class="contact-info-label">${label}</span>
        <span class="contact-info-value">${formatLink(label, value)}</span>
      </div>
    `)
    .join("");
}

function renderEducation() {
  const { education } = profileData;
  setText("educationSchool", education.school);
  setText("educationDegree", [education.degree, education.major, education.grade].filter(Boolean).join(" · "));
  setText("educationPeriod", education.period);
  setText("educationGpa", education.gpa);
  setText("educationRanking", education.ranking);
  setText("educationNote", education.gpaDescription);

  const courseListEl = document.getElementById("courseList");
  if (courseListEl) {
    courseListEl.innerHTML = renderTags(education.courses);
  }
}

function renderResearch() {
  const { research } = profileData;
  setText("researchRole", research.role);
  setText("researchMeta", [research.lab, research.direction, research.period].filter(Boolean).join(" · "));
  setText("researchOverview", research.overview);

  const researchItemsEl = document.getElementById("researchItems");

  if (researchItemsEl) {
    researchItemsEl.innerHTML = (research.items || []).map(item => `
      <div class="timeline-item">
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      </div>
    `).join("");
  }
}

function renderProjects() {
  const projectsGridEl = document.getElementById("projectsGrid");
  if (!projectsGridEl) return;

  projectsGridEl.innerHTML = (profileData.projects || []).map(project => {
    const focus = project.focus || [];
    return `
    <article class="project-card project-case-card">
      <h3 class="project-case-title">项目：${project.name || ""}</h3>
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
  const awardsGridEl = document.getElementById("awardsGrid");
  if (!awardsGridEl) return;

  awardsGridEl.innerHTML = (profileData.awards || []).map(award => `
    <article class="achievement-card">
      <span class="achievement-year">${award.year}</span>
      <h3>${award.title}</h3>
      <p>${award.level}</p>
    </article>
  `).join("");
}

function renderSkills() {
  const skillsContentEl = document.getElementById("skillsContent");
  if (!skillsContentEl) return;

  skillsContentEl.innerHTML = (profileData.skills || []).map((group, index) => {
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
  `}).join("");
}

function renderContact() {
  const contactLinksEl = document.getElementById("contactLinks");
  const { social, personal } = profileData;
  if (!contactLinksEl) return;

  const contacts = [
    {
      label: "邮箱",
      value: social.email || personal.email,
      href: `mailto:${social.email || personal.email}`
    },
    {
      label: "GitHub",
      value: social.github || personal.github,
      href: social.github || personal.github
    }
  ].filter(item => item.value && item.href);

  contactLinksEl.innerHTML = contacts.map(item => `
    <a class="contact-link-card" href="${item.href}" ${item.href.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener noreferrer"'}>
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </a>
  `).join("");
}

function renderResumePage() {
  const { personal, education, research, projects, awards, skills, social } = profileData;

  setText("resumeName", personal.name);
  setText("resumeTitle", personal.title);
  setText("resumeEducationSchool", education.school);
  setText("resumeEducationPeriod", education.period);
  setText("resumeEducationDegree", [education.degree, education.major, education.grade].filter(Boolean).join(" · "));
  setText("resumeEducationNote", `${education.gpaDescription || ""}${education.ranking ? ` 绩点/排名：${education.gpa}，${education.ranking}。` : ""}`);
  setText("resumeResearchRole", research.role);
  setText("resumeResearchPeriod", research.period);
  setText("resumeResearchMeta", [research.lab, research.direction].filter(Boolean).join(" · "));
  setText("resumeResearchOverview", research.overview);

  const summaryEl = document.getElementById("resumeSummary");
  if (summaryEl) {
    summaryEl.innerHTML = (personal.summary || []).map(item => `<p>${item}</p>`).join("");
  }

  const contactEl = document.getElementById("resumeContact");
  if (contactEl) {
    contactEl.innerHTML = [personal.location, social.email || personal.email, social.github || personal.github]
      .filter(Boolean)
      .map(item => `<p>${formatResumeContact(item)}</p>`)
      .join("");
  }

  renderTagList("resumeCourses", education.courses);

  const researchItemsEl = document.getElementById("resumeResearchItems");
  if (researchItemsEl) {
    researchItemsEl.innerHTML = (research.items || []).map(item => `
      <div class="resume-list-row">
        <strong>${item.title}</strong>
        <p>${item.description}</p>
      </div>
    `).join("");
  }

  const projectsEl = document.getElementById("resumeProjects");
  if (projectsEl) {
    projectsEl.innerHTML = (projects || []).map(project => `
      <article class="resume-entry">
        <div class="resume-entry-head">
          <h3>${project.name}</h3>
          <p>${project.type || ""}</p>
        </div>
        <p class="muted">${project.description || ""}</p>
        <div class="resume-list">
          ${(project.focus || []).map(item => `<div class="resume-list-row"><p>${item}</p></div>`).join("")}
        </div>
        <div class="tag-list">
          ${renderTags(project.technologies)}
        </div>
      </article>
    `).join("");
  }

  const awardsEl = document.getElementById("resumeAwards");
  if (awardsEl) {
    awardsEl.innerHTML = (awards || []).map(award => `
      <div class="resume-list-row">
        <strong>${award.title}</strong>
        <p>${award.year} · ${award.level}</p>
      </div>
    `).join("");
  }

  const skillsEl = document.getElementById("resumeSkills");
  if (skillsEl) {
    skillsEl.innerHTML = (skills || []).map(group => `
      <article class="resume-skill-group">
        <h3>${group.category}</h3>
        <p>${(group.items || []).map(item => `${item.name}（${item.level}）`).join(" / ")}</p>
      </article>
    `).join("");
  }
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

function renderProjectLink(label, url) {
  if (!url) return "";
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function renderTags(items, className = "tag") {
  return (items || []).map(item => `<span class="${className}">${item}</span>`).join("");
}

function renderTagList(id, items) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = renderTags(items);
}

function formatLink(label, value) {
  if (label === "邮箱") return `<a href="mailto:${value}">${value}</a>`;
  if (label === "GitHub") return `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
  return value;
}

function formatResumeContact(value) {
  if (value.includes("@")) return `<a href="mailto:${value}">${value}</a>`;
  if (value.startsWith("http")) return `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
  return value;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.textContent = value;
  }
}

