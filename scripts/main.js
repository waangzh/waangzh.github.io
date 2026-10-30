let profileData = null;

const STACK_ICONS = {
  "Python": "python.svg",
  "Java": "openjdk.svg",
  "TypeScript": "typescript.svg",
  "React": "react.svg",
  "微信小程序": "wechat.svg",
  "HTML / CSS": "html5.svg",
  "FastAPI": "fastapi.svg",
  "Spring AI": "spring.svg",
  "Qdrant": "qdrant.svg",
  "LangGraph": "langchain.svg",
  "PyTorch": "pytorch.svg",
  "LLM / Agent": "agent.svg",
  "Git / GitHub": "git.svg",
  "Prompt Engineering": "prompt.svg",
  "JSON Schema": "json.svg"
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadProfileData();
  applySiteMeta();
  renderHomePage();
  initNavigation();
  initScrollSpy();
  initClock();
  initEmailReveal();
  initMotion();
  loadContributions();
});

async function loadProfileData() {
  try {
    const response = await fetch("data/profile.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    profileData = await response.json();
  } catch (error) {
    console.error("Failed to load profile data:", error);
    profileData = { site: {}, personal: {}, homepage: { about: [], stack: [], projects: [] } };
  }
}

function applySiteMeta() {
  const site = profileData.site || {};
  if (site.title) document.title = site.title;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta && site.description) {
    descriptionMeta.setAttribute("content", site.description);
  }
}

function renderHomePage() {
  const { personal = {}, homepage = {} } = profileData;

  setText("heroName", personal.name || "Kevin");
  setText("heroTitle", personal.title || "");
  setText("projectCount", String((homepage.projects || []).length).padStart(2, "0"));

  renderAbout(homepage.about);
  renderStack(homepage.stack);
  renderProjects(homepage.projects);
  setGreeting();
  setBuildDate();

  document.querySelectorAll("[data-github]").forEach(link => {
    if (personal.github) link.href = personal.github;
  });
}

function renderAbout(about) {
  const paragraphs = Array.isArray(about) ? about : about ? [about] : [];
  setHTML("aboutCopy", paragraphs.map(text => `<p>${text}</p>`).join(""));
}

function renderStack(groups) {
  setHTML("stackList", (groups || []).map((group, index) => `
    <div class="stack-row" data-reveal>
      <span class="stack-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="stack-label">${group.label}</span>
      <div class="stack-items">
        ${(group.items || []).map(item => `<span class="stack-pill">${STACK_ICONS[item] ? `<img class="stack-icon" src="assets/icons/${STACK_ICONS[item]}" alt="" loading="lazy">` : ""}${item}</span>`).join("")}
      </div>
    </div>
  `).join(""));
}

function renderProjects(projects) {
  setHTML("projectList", (projects || []).map(project => `
    <a class="project-row" data-reveal href="${project.url}" target="_blank" rel="noopener noreferrer">
      <span class="project-icon">
        ${project.icon
          ? `<img src="${project.icon}" alt="" loading="lazy">`
          : `<span class="mark">${project.mark || ""}</span>`}
      </span>
      <span class="project-body">
        <span class="project-head">
          <span class="project-name">${project.name}</span>
          <span class="project-subtitle">${project.subtitle || ""}</span>
        </span>
        <span class="project-desc">${project.description}</span>
        <span class="project-tech">${(project.technologies || []).join(" · ")}</span>
      </span>
      <span class="project-link">GitHub <span aria-hidden="true">↗</span></span>
    </a>
  `).join(""));
}

function initNavigation() {
  document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length) return;

  const updateActiveSection = () => {
    const bottomReached = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    const marker = window.scrollY + window.innerHeight * 0.35;
    let activeSection = sections[0];

    if (bottomReached) {
      activeSection = sections[sections.length - 1];
    } else {
      sections.forEach(section => {
        if (section.offsetTop <= marker) activeSection = section;
      });
    }

    links.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeSection.id}`);
    });
  };

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  updateActiveSection();
}

function initClock() {
  const tick = () => {
    setText("localTime", new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    }));
  };

  tick();
  window.setInterval(tick, 30000);
}

function initEmailReveal() {
  const toggle = document.getElementById("emailToggle");
  const widget = document.querySelector(".email-widget");
  const reveal = document.getElementById("emailReveal");
  if (!toggle || !widget || !reveal) return;

  const email = (profileData.personal?.email || "").trim();

  if (email) {
    reveal.textContent = email;
    reveal.href = `mailto:${email}`;
    reveal.classList.remove("is-empty");
  } else {
    reveal.textContent = "email not set";
    reveal.classList.add("is-empty");
    reveal.removeAttribute("href");
  }

  toggle.addEventListener("click", () => {
    const open = widget.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "隐藏邮箱" : "显示邮箱");
    reveal.setAttribute("aria-hidden", String(!open || !email));
    reveal.tabIndex = open && email ? 0 : -1;
  });
}

function initMotion() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.08
  });

  items.forEach(item => observer.observe(item));
}

async function loadContributions() {
  const grid = document.getElementById("contribGrid");
  if (!grid) return;

  const username = (profileData.personal.github || "").split("/").filter(Boolean).pop();
  if (!username) return;

  renderContributionGrid([]);
  scrollContribToLatest();
  setText("contribTotal", "…");
  setText("contribRange", "loading GitHub activity");

  try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const days = data.contributions || [];

    renderContributionGrid(days);
    scrollContribToLatest();
    setText("contribTotal", (data.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0)).toLocaleString("en-US"));
    if (days.length) {
      setText("contribRange", `${formatDate(days[0].date)} – ${formatDate(days[days.length - 1].date)}`);
    }
  } catch (error) {
    console.error("Failed to load GitHub contributions:", error);
    renderContributionGrid([]);
    setText("contribTotal", "—");
    setText("contribRange", "GitHub activity unavailable");
  }
}

function scrollContribToLatest() {
  const scroller = document.querySelector(".contrib-scroll");
  if (!scroller || !window.matchMedia("(max-width: 760px)").matches) return;

  requestAnimationFrame(() => {
    scroller.scrollLeft = scroller.scrollWidth - scroller.clientWidth;
  });
}

function renderContributionGrid(days) {
  const grid = document.getElementById("contribGrid");
  if (!grid) return;

  if (!days.length) {
    grid.innerHTML = Array.from({ length: 371 }, () => '<span class="contrib-cell"></span>').join("");
    return;
  }

  const firstDayOffset = new Date(`${days[0].date}T00:00:00`).getDay();
  const cells = Array.from({ length: firstDayOffset }, () => '<span class="contrib-cell"></span>');

  days.forEach(day => {
    cells.push(`<span class="contrib-cell level-${day.level}" title="${day.date}: ${day.count} contributions"></span>`);
  });

  grid.innerHTML = cells.join("");
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function setGreeting() {
  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Still up" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  setText("greeting", greeting);
}

function setBuildDate() {
  const now = new Date();
  setText("buildDate", [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-"));
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
}

function setHTML(id, value = "") {
  const element = document.getElementById(id);
  if (element) element.innerHTML = value;
}
