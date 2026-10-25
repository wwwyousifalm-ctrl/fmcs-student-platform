const translations = {
  en: {
    brandTitle: "FMCS Student Association",
    navHome: "Home",
    navAbout: "About",
    navEvents: "Events",
    navProjects: "Projects",
    navResources: "Resources",
    navContact: "Contact",
    navDashboard: "Dashboard",
    loginBtn: "Login",
    logoutBtn: "Logout",
    langToggle: "العربية / EN",
    heroTitle: "Empowering Future Innovators & Computer Scientists",
    heroDesc:
      "Welcome to the official academic and professional web portal of the Student Association, Faculty of Mathematical and Computer Sciences, University of Gezira.",
    exploreEvents: "Explore Events",
    joinAssoc: "Join Association",
  },
  ar: {
    brandTitle: "اتحاد طلاب كلية العلوم الرياضية والحاسوب",
    navHome: "الرئيسية",
    navAbout: "عن الكلية",
    navEvents: "الفعاليات",
    navProjects: "المشاريع",
    navResources: "المستودع الأكاديمي",
    navContact: "اتصل بنا",
    navDashboard: "لوحة التحكم",
    loginBtn: "دخول",
    logoutBtn: "خروج",
    langToggle: "English / AR",
    heroTitle: "تمكين قادة المستقبل والمبرمجين",
    heroDesc:
      "أهلاً بك في البوابة الأكاديمية والمهنية الرسمية لاتحاد طلاب كلية العلوم الرياضية والحاسوب، جامعة الجزيرة.",
    exploreEvents: "استكشف الفعاليات",
    joinAssoc: "انضم للاتحاد",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initPreferences();
  setupLanguageToggle();
  setupThemeToggle();
  setupFormValidations();
  setupResourceFilters();
  setupEventFilters();
  fetchGitHubProjects();
});

/* --- Preferences & Internationalization (i18n / RTL & Theme) --- */
function initPreferences() {
  const savedLang = localStorage.getItem("fmcs_lang") || "en";
  const savedTheme = localStorage.getItem("fmcs_theme") || "light";

  applyLanguage(savedLang);
  applyTheme(savedTheme);

  const langSelect = document.getElementById("languageSelect");
  if (langSelect) langSelect.value = savedLang;

  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect) themeSelect.value = savedTheme;
}

function setupLanguageToggle() {
  const langToggleBtn = document.getElementById("langToggleBtn");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      const currentLang = document.documentElement.lang || "en";
      const newLang = currentLang === "en" ? "ar" : "en";
      saveAndApplyLanguage(newLang);
    });
  }

  const langSelect = document.getElementById("languageSelect");
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      saveAndApplyLanguage(e.target.value);
    });
  }
}

function saveAndApplyLanguage(lang) {
  localStorage.setItem("fmcs_lang", lang);
  applyLanguage(lang);
}

function applyLanguage(lang) {
  const html = document.documentElement;
  html.setAttribute("lang", lang);
  html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  // Update dynamic text content based on data-i18n attributes
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
}

function setupThemeToggle() {
  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect) {
    themeSelect.addEventListener("change", (e) => {
      const theme = e.target.value;
      localStorage.setItem("fmcs_theme", theme);
      applyTheme(theme);
    });
  }

  const saveSettingsBtn = document.getElementById("saveSettingsBtn");
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", () => {
      const statusMsg = document.getElementById("saveStatusMsg");
      if (statusMsg) {
        statusMsg.textContent = "Preferences saved successfully!";
        statusMsg.style.color = "var(--accent-green)";
        setTimeout(() => {
          statusMsg.textContent = "";
        }, 3000);
      }
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/* --- Client-Side Form Validations --- */
function setupFormValidations() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      if (!email || !password) {
        e.preventDefault();
        alert("Please fill in all required login fields.");
      }
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      const studentId = document.getElementById("student_id").value.trim();
      if (!studentId.includes("-")) {
        e.preventDefault();
        alert("Please enter a valid Student ID format (e.g., 2021-CS-1234).");
      }
    });
  }
}

/* --- Resource Repository Filtering & Real-time Search --- */
function setupResourceFilters() {
  const searchInput = document.getElementById("resourceSearch");
  const filterBtns = document.querySelectorAll(
    ".filter-bar .filter-btn[data-dept]",
  );
  const resourceCards = document.querySelectorAll(".resource-card");

  if (!searchInput && filterBtns.length === 0) return;

  let activeDept = "all";

  function filterResources() {
    const query = searchInput ? searchInput.value.toLowerCase() : "";

    resourceCards.forEach((card) => {
      const dept = card.getAttribute("data-dept");
      const text = card.textContent.toLowerCase();

      const matchesDept = activeDept === "all" || dept === activeDept;
      const matchesSearch = text.includes(query);

      if (matchesDept && matchesSearch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterResources);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      activeDept = e.target.getAttribute("data-dept");
      filterResources();
    });
  });
}

/* --- Event Catalog Filtering --- */
function setupEventFilters() {
  const filterBtns = document.querySelectorAll(
    ".filter-bar .filter-btn[data-filter]",
  );
  const eventCards = document.querySelectorAll(".event-card");

  if (filterBtns.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      const filter = e.target.getAttribute("data-filter");

      eventCards.forEach((card) => {
        if (filter === "all" || card.classList.contains(filter)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* --- Dynamic GitHub API Integration for Projects --- */
async function fetchGitHubProjects() {
  const grid = document.getElementById("githubProjectsGrid");
  const statusBanner = document.getElementById("githubApiStatus");
  if (!grid) return;

  try {
    const response = await fetch(
      "https://api.github.com/orgs/FMCS-UofG/repos?per_page=6",
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      },
    );

    if (!response.ok) throw new Error("GitHub API response failed");

    const repos = await response.json();
    if (repos.length > 0) {
      grid.innerHTML = "";
      repos.forEach((repo) => {
        const card = document.createElement("article");
        card.className = "project-card";
        card.innerHTML = `
                    <div class="project-header">
                        <span class="project-tag">${repo.language || "Open Source"}</span>
                        <h3>${repo.name}</h3>
                    </div>
                    <p class="project-desc">${repo.description || "No description provided."}</p>
                    <div class="project-meta">
                        <span>⭐ ${repo.stargazers_count} Stars</span>
                        <span>🍴 ${repo.forks_count} Forks</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn-secondary btn-sm">
                        View on GitHub ↗
                    </a>
                `;
        grid.appendChild(card);
      });
      if (statusBanner)
        statusBanner.textContent =
          " Live repositories successfully loaded from GitHub API.";
    }
  } catch (error) {
    console.warn("GitHub API fallback mode active:", error);
    if (statusBanner)
      statusBanner.textContent =
        " Showing curated student projects archive (Offline/Cache mode).";
  }
}
