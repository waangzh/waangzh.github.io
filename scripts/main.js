// Profile Data
let profileData = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadProfileData();
  renderContent();
  initNavigation();
  initScrollSpy();
  initNavScroll();
  initBackToTop();
});

// Load profile data
async function loadProfileData() {
  try {
    const response = await fetch('data/profile.json');
    profileData = await response.json();
  } catch (error) {
    console.error('Failed to load profile data:', error);
    // Fallback data structure
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
          const initial = personal.name ? personal.name.charAt(0).toUpperCase() : 'B';
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
  
  // Render about content (merged single section)
  if (aboutSectionsEl && personal.about && personal.about.content) {
    let content = personal.about.content;
    // Convert **text** to <strong>text</strong> for highlighting
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="highlight">$1</strong>');
    
    aboutSectionsEl.innerHTML = `
      <div class="about-main-content">
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
  
  // Render GPA
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
  
  // Render courses with icons
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
    <div class="project-card">
      ${project.images && project.images.length > 0 ? `
        <div class="project-image-carousel" data-carousel-id="${project.id}">
          <div class="carousel-track">
            ${project.images.map((img, imgIndex) => `
              <div class="carousel-slide ${imgIndex === 0 ? 'active' : ''}">
                <img src="${img}" alt="${project.name} screenshot ${imgIndex + 1}" loading="lazy">
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
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        ` : ''}
        ${project.links ? `
          <div class="project-links">
            ${project.links.github ? `<a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="project-link">GitHub →</a>` : ''}
            ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" rel="noopener noreferrer" class="project-link">Demo →</a>` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
  
  // Initialize carousels after rendering
  initProjectCarousels();
}

// Render Skills Section
function renderSkills() {
  const { skills } = profileData;
  const skillsContentEl = document.getElementById('skillsContent');
  
  if (!skillsContentEl || !skills || !Array.isArray(skills)) return;
  
  skillsContentEl.innerHTML = skills.map(category => `
    <div class="skill-category">
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
              <div class="skill-bar" style="width: ${item.level}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  // Animate skill bars
  setTimeout(() => {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  }, 100);
}

// Render Contact Section
function renderContact() {
  const { social } = profileData;
  const contactLinksEl = document.getElementById('contactLinks');
  
  if (!contactLinksEl || !social) return;
  
  const links = [];
  
  if (social.github) {
    links.push(`<div class="contact-item" data-type="link" data-url="${social.github}" data-text="GitHub">
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
  
  // Initialize contact actions
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
  
  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
  }
  
  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) {
        navMenu.classList.remove('active');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
  
  // Smooth scroll for anchor links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const navHeight = document.querySelector('.nav').offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight;
          window.scrollTo({
            top: targetPosition,
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
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };
  
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
  }, observerOptions);
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Navigation scroll effect
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// Initialize project image carousels
function initProjectCarousels() {
  const carousels = document.querySelectorAll('.project-image-carousel');
  
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    let currentIndex = 0;
    let intervalId;
    
    if (slides.length <= 1) return; // No need to carousel if only one image
    
    function showSlide(index) {
      // Remove active class from all slides and indicators
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));
      
      // Add active class to current slide and indicator
      slides[index].classList.add('active');
      indicators[index].classList.add('active');
      currentIndex = index;
    }
    
    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    }
    
    function startCarousel() {
      intervalId = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }
    
    function stopCarousel() {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
    
    // Indicator click handlers
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showSlide(index);
        stopCarousel();
        startCarousel(); // Restart carousel after manual change
      });
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
    
    // Start auto-rotation
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
          // Visual feedback
          copyBtn.textContent = '✓';
          setTimeout(() => {
            copyBtn.textContent = '📋';
          }, 2000);
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            showToast('已复制到剪贴板！');
            copyBtn.textContent = '✓';
            setTimeout(() => {
              copyBtn.textContent = '📋';
            }, 2000);
          } catch (fallbackErr) {
            showToast('复制失败，请手动复制');
          }
          document.body.removeChild(textArea);
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
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove after 2 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2000);
}

// Initialize back to top button
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Smooth scroll to top on click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

