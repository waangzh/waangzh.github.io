// Profile Data
let profileData = null;

// Skill category → bar color mapping
const SKILL_CATEGORY_COLORS = {
  '后端技术': 'blue',
  '数据库': 'green',
  '前端技术': 'purple',
  '深度学习': 'orange',
  '其他技能': 'teal',
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadProfileData();
  renderContent();
  initNavigation();
  initScrollSpy();
  initNavScroll();
  initBackToTop();
  initEntranceAnimations();
});

// Load profile data
async function loadProfileData() {
  try {
    const response = await fetch('data/profile.json');
    profileData = await response.json();
  } catch (error) {
    console.error('Failed to load profile data:', error);
    profileData = {
      personal: {},
      education: {},
      projects: [],
      skills: [],
      social: {}
    };
  }
}

// Render all content
function renderContent() {
  if (!profileData) return;

  renderHero();
  renderAbout();
  renderEducation();
  renderProjects();
  renderSkills();
  renderContact();
  renderFooter();
}

// Render Hero Section
function renderHero() {
  const { personal } = profileData;

  const heroNameEl = document.getElementById('heroName');
  const heroSubtitleEl = document.querySelector('.hero-subtitle');
  const heroDescriptionEl = document.getElementById('heroDescription');
  const avatarImageEl = document.getElementById('avatarImage');
  const avatarPlaceholderEl = document.querySelector('.avatar-placeholder');

  if (heroNameEl && personal.name) {
    heroNameEl.textContent = personal.name;
  }

  if (heroSubtitleEl && personal.title) {
    heroSubtitleEl.textContent = personal.title;
  }

  if (heroDescriptionEl && personal.description) {
    heroDescriptionEl.textContent = personal.description;
  }

  // Load avatar
  if (avatarImageEl) {
    if (personal.avatar) {
      avatarImageEl.src = personal.avatar;
      avatarImageEl.onerror = function() {
        this.style.display = 'none';
        if (avatarPlaceholderEl) {
          avatarPlaceholderEl.style.display = 'flex';
          const initial = personal.name ? personal.name.charAt(0).toUpperCase() : 'W';
          avatarPlaceholderEl.querySelector('span').textContent = initial;
        }
      };
    } else if (avatarPlaceholderEl && personal.name) {
      avatarImageEl.style.display = 'none';
      avatarPlaceholderEl.style.display = 'flex';
      avatarPlaceholderEl.querySelector('span').textContent = personal.name.charAt(0).toUpperCase();
    }
  }
}

// Render About Section
function renderAbout() {
  const { personal } = profileData;

  const aboutSectionsEl = document.getElementById('aboutSections');
  const aboutStatusEl = document.getElementById('aboutStatus');
  const aboutLocationEl = document.getElementById('aboutLocation');
  const aboutEmailEl = document.getElementById('aboutEmail');

  if (aboutSectionsEl && personal.about && personal.about.content) {
    let content = personal.about.content;
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="highlight">$1</strong>');

    aboutSectionsEl.innerHTML = `
      <div class="about-main-content animate-on-scroll">
        <p class="about-text-content">${content}</p>
      </div>
    `;
  }

  if (aboutStatusEl && personal.status) {
    aboutStatusEl.textContent = personal.status;
  }

  if (aboutLocationEl && personal.location) {
    aboutLocationEl.textContent = personal.location;
  }

  if (aboutEmailEl && personal.email) {
    aboutEmailEl.textContent = personal.email;
    aboutEmailEl.href = `mailto:${personal.email}`;
  }
}

// Render Education Section
function renderEducation() {
  const { education } = profileData;

  const educationSchoolEl = document.getElementById('educationSchool');
  const educationPeriodEl = document.getElementById('educationPeriod');
  const educationDegreeEl = document.getElementById('educationDegree');
  const educationGpaEl = document.getElementById('educationGpa');
  const courseListEl = document.getElementById('courseList');

  if (educationSchoolEl && education.school) {
    educationSchoolEl.textContent = education.school;
  }

  if (educationPeriodEl && education.period) {
    educationPeriodEl.textContent = education.period;
  }

  if (educationDegreeEl && education.degree && education.major) {
    educationDegreeEl.textContent = `${education.degree} · ${education.major}`;
  }

  if (educationGpaEl && education.gpa) {
    let gpaHTML = `<div class="gpa-info">
      <span class="gpa-label">📈 绩点：</span>
      <span class="gpa-value">${education.gpa}</span>`;
    if (education.gpaDescription) {
      gpaHTML += ` <span class="gpa-description">${education.gpaDescription}</span>`;
    }
    gpaHTML += `</div>`;
    educationGpaEl.innerHTML = gpaHTML;
  }

  if (courseListEl && education.courses && Array.isArray(education.courses)) {
    courseListEl.innerHTML = education.courses
      .map(course => {
        const courseName = typeof course === 'string' ? course : course.name;
        const courseIcon = (typeof course === 'object' && course.icon) ? course.icon : '📚';
        return `<li>
          <span class="course-icon">${courseIcon}</span>
          <span class="course-name">${courseName}</span>
        </li>`;
      })
      .join('');
  }
}

// Render Projects Section
function renderProjects() {
  const { projects } = profileData;
  const projectsGridEl = document.getElementById('projectsGrid');

  if (!projectsGridEl || !projects || !Array.isArray(projects)) return;

  projectsGridEl.innerHTML = projects.map((project, index) => `
    <div class="project-card animate-on-scroll delay-${(index % 5) + 1}" data-type="${project.type}">
      ${project.images && project.images.length > 0 ? `
        <div class="project-image-carousel" data-carousel-id="${project.id}">
          <div class="carousel-track">
            ${project.images.map((img, imgIndex) => `
              <div class="carousel-slide ${imgIndex === 0 ? 'active' : ''}">
                <img src="${img}" alt="${project.name} screenshot ${imgIndex + 1}" loading="lazy" decoding="async">
              </div>
            `).join('')}
          </div>
          <div class="carousel-indicators">
            ${project.images.map((_, imgIndex) => `
              <span class="indicator ${imgIndex === 0 ? 'active' : ''}" data-slide="${imgIndex}"></span>
            `).join('')}
          </div>
        </div>
      ` : ''}
      <div class="project-content">
        <div class="project-header">
          <h3 class="project-name">${project.name}</h3>
          <span class="project-type">${project.type}</span>
        </div>
        <p class="project-description">${project.description}</p>
        ${project.highlights && project.highlights.length > 0 ? `
          <div class="project-highlights">
            <h4>项目亮点</h4>
            <ul>
              ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${project.technologies && project.technologies.length > 0 ? `
          <div class="project-technologies">
            ${project.technologies.map(tech => `<span class="tech-tag" data-tech="${tech}">${tech}</span>`).join('')}
          </div>
        ` : ''}
        ${project.links ? `
          <div class="project-links">
            ${project.links.github ? `
              <a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="project-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                GitHub
              </a>` : ''}
            ${project.links.demo ? `
              <a href="${project.links.demo}" target="_blank" rel="noopener noreferrer" class="project-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Demo
              </a>` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');

  initProjectCarousels();
}

// Render Skills Section
function renderSkills() {
  const { skills } = profileData;
  const skillsContentEl = document.getElementById('skillsContent');

  if (!skillsContentEl || !skills || !Array.isArray(skills)) return;

  skillsContentEl.innerHTML = skills.map((category, catIndex) => {
    const colorKey = SKILL_CATEGORY_COLORS[category.category] || 'blue';
    return `
      <div class="skill-category animate-on-scroll delay-${(catIndex % 5) + 1}" data-color="${colorKey}">
        <h3 class="skill-category-title">${category.category}</h3>
        <div class="skill-items">
          ${category.items.map(item => `
            <div class="skill-item">
              <div class="skill-header">
                <div class="skill-icon">${item.icon || '⭐'}</div>
                <div class="skill-name">
                  <span>${item.name}</span>
                  <span class="skill-level">${item.level}%</span>
                </div>
              </div>
              <div class="skill-bar-container">
                <div class="skill-bar" style="width: 0%" data-width="${item.level}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Animate skill bars when the skills section enters viewport
  initSkillBarAnimations();
}

// Animate skill bars via IntersectionObserver
function initSkillBarAnimations() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.skill-bar');
        bars.forEach((bar, i) => {
          const targetWidth = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, i * 40);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(skillsSection);
}

// Render Contact Section
function renderContact() {
  const { social } = profileData;
  const contactLinksEl = document.getElementById('contactLinks');

  if (!contactLinksEl || !social) return;

  const links = [];

  if (social.github) {
    links.push(`<div class="contact-item" data-type="link" data-url="${social.github}" data-text="${social.github}">
      <span class="contact-label">GitHub</span>
      <span class="contact-value">${social.github}</span>
      <span class="contact-actions">
        <button class="contact-action-btn" data-action="copy" title="复制链接">📋</button>
        <button class="contact-action-btn" data-action="open" title="打开链接">🔗</button>
      </span>
    </div>`);
  }

  if (social.email) {
    links.push(`<div class="contact-item" data-type="email" data-url="mailto:${social.email}" data-text="${social.email}">
      <span class="contact-label">Email</span>
      <span class="contact-value">${social.email}</span>
      <span class="contact-actions">
        <button class="contact-action-btn" data-action="copy" title="复制邮箱">📋</button>
        <button class="contact-action-btn" data-action="open" title="发送邮件">✉️</button>
      </span>
    </div>`);
  }

  if (social.wechat) {
    links.push(`<div class="contact-item">
      <span class="contact-label">WeChat</span>
      <span class="contact-value">扫码添加</span>
    </div>`);
  }

  contactLinksEl.innerHTML = links.join('');

  initContactActions();
}

// Render Footer
function renderFooter() {
  const footerStatusEl = document.getElementById('footerStatus');
  if (footerStatusEl && profileData.personal && profileData.personal.status) {
    footerStatusEl.textContent = profileData.personal.status;
  }
}

// Initialize Navigation
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) {
        navMenu.classList.remove('active');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.getElementById(href.substring(1));
        if (targetEl) {
          const navHeight = document.querySelector('.nav').offsetHeight;
          window.scrollTo({
            top: targetEl.offsetTop - navHeight,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Scroll Spy
function initScrollSpy() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

// Navigation scroll effect — RAF throttled
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.pageYOffset > 50);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Initialize project image carousels
function initProjectCarousels() {
  const carousels = document.querySelectorAll('.project-image-carousel');

  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    let currentIndex = 0;
    let intervalId;

    if (slides.length <= 1) return;

    function showSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      indicators.forEach(ind => ind.classList.remove('active'));
      slides[index].classList.add('active');
      indicators[index].classList.add('active');
      currentIndex = index;
    }

    function nextSlide() {
      showSlide((currentIndex + 1) % slides.length);
    }

    function startCarousel() {
      intervalId = setInterval(nextSlide, 4000);
    }

    function stopCarousel() {
      if (intervalId) clearInterval(intervalId);
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showSlide(index);
        stopCarousel();
        startCarousel();
      });
    });

    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
    startCarousel();
  });
}

// Initialize contact actions (copy/open)
function initContactActions() {
  const contactItems = document.querySelectorAll('.contact-item');

  contactItems.forEach(item => {
    const copyBtn = item.querySelector('[data-action="copy"]');
    const openBtn = item.querySelector('[data-action="open"]');
    const text = item.getAttribute('data-text');
    const url = item.getAttribute('data-url');

    if (copyBtn && text) {
      copyBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
          showToast('已复制到剪贴板！');
          copyBtn.textContent = '✓';
          setTimeout(() => { copyBtn.textContent = '📋'; }, 2000);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand('copy');
            showToast('已复制到剪贴板！');
            copyBtn.textContent = '✓';
            setTimeout(() => { copyBtn.textContent = '📋'; }, 2000);
          } catch {
            showToast('复制失败，请手动复制');
          }
          document.body.removeChild(ta);
        }
      });
    }

    if (openBtn && url) {
      openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(url, '_blank');
      });
    }
  });
}

// Show toast notification
function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Initialize back to top button — RAF throttled
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.pageYOffset > 300);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Scroll-triggered entrance animations via IntersectionObserver
function initEntranceAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}
