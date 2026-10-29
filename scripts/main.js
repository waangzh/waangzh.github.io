let profileData = null;

document.addEventListener("DOMContentLoaded", async () => {
  await loadProfileData();
  applySiteMeta();

  renderHomePage();
  initNavigation();
  initScrollSpy();
  initBackToTop();
  initMotion();
  initTerminalAnimation();
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
  renderSkills();
  renderContact();
}

function initTerminalAnimation() {
  const output = document.getElementById("terminalOutput");
  if (!output || output.dataset.started === "true") return;
  output.dataset.started = "true";

  const lines = [
    ["command", "whoami"],
    ["result", "kevin · backend & agent developer"],
    ["command", "focus"],
    ["result", "Backend / Agents / LLMs / AI"],
    ["command", "git status"],
    ["result", `${(profileData.homepage?.projects || []).length} projects · working tree clean`]
  ];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lineIndex = 0;

  const addLine = () => {
    if (lineIndex >= lines.length) {
      output.insertAdjacentHTML("beforeend", '<span class="terminal-line command"><span class="terminal-cursor"></span></span>');
      return;
    }
    const [type, text] = lines[lineIndex++];
    const line = document.createElement("span");
    line.className = `terminal-line ${type}`;
    output.appendChild(line);
    if (reducedMotion) {
      line.textContent = text;
      addLine();
      return;
    }
    let characterIndex = 0;
    const typeCharacter = () => {
      line.textContent = text.slice(0, characterIndex++);
      if (characterIndex <= text.length) {
        window.setTimeout(typeCharacter, type === "command" ? 42 : 16);
      } else {
        window.setTimeout(addLine, type === "command" ? 180 : 260);
      }
    };
    typeCharacter();
  };

  addLine();
}

function renderMinimalHome() {
  const { personal, homepage = {} } = profileData;
  setText("heroName", personal.name);
  setText("heroTitle", personal.title);
  setText("heroStatus", personal.availability);
  const homepageProjects = homepage.projects || [];
  if (homepageProjects.length) setHTML("projectsGrid", homepageProjects.map(project => `
    <article class="project-row">
      <div class="project-mark" aria-hidden="true">${project.mark || ""}</div>
      <div class="project-body">
        <div class="project-head">
          <h3><a href="${project.url}" target="_blank" rel="noopener noreferrer">${project.name}</a><span class="project-subtitle">${project.subtitle}</span></h3>
        </div>
        <p class="project-desc">${project.description}</p>
        <div class="project-meta">
          <a class="project-source" href="${project.url}" target="_blank" rel="noopener noreferrer">source ↗</a>
          <span class="project-tech-text">${(project.technologies || []).join(", ")}</span>
        </div>
      </div>
    </article>
  `).join(""));
  document.querySelectorAll("[data-github]").forEach(link => { link.href = personal.github; });
  setText("footerText", `© ${new Date().getFullYear()} ${personal.nameEn}. Built with care and ☕.`);
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

  const updateActiveSection = () => {
    const bottomReached = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    let activeSection = sections[0];

    if (bottomReached) {
      activeSection = sections[sections.length - 1];
    } else {
      const marker = window.scrollY + window.innerHeight * 0.38;
      sections.forEach(section => {
        if (section.offsetTop <= marker) activeSection = section;
      });
    }

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeSection.id}`);
    });
  };

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  updateActiveSection();
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
  const github = social.github || personal.github;

  return [
    {
      label: "GitHub",
      value: github,
      href: github
    }
  ].filter(item => item.value && item.href);
}

function createProfileInfoItems() {
  const [githubContact] = createPrimaryContacts();

  return [githubContact].filter(item => item && item.value);
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

