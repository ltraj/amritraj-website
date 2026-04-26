/* =========================================================
   EASY EDIT SETTINGS
   Change these values first when you personalize the site.
   ========================================================= */

// EDIT THIS EMAIL: the contact form opens an email to this address.
const CONTACT_EMAIL = "your.email@example.com";

// This key is used by localStorage to save your personal tree in this browser.
const STORAGE_KEY = "amrit_personal_tree_v2";

// This keeps compatibility with your previous version of the page.
const OLD_STORAGE_KEY = "personal_tree_placeholders_v1";

/* =========================================================
   DEFAULT PERSONAL TREE DATA
   Edit this starter content if you want the reset button to restore
   different branches. The live tree can also be edited from the website.
   ========================================================= */
const defaultTree = {
  title: "root",
  children: [
    {
      title: "About Me",
      short: "A friendly intro, not a CV",
      content:
        "Hi! I am <strong>Amrit Raj</strong>. I study BSc (Hons) Mathematics at Ramanujan College, University of Delhi, and I am exploring Data Science through IIT Madras because I enjoy computers, logic, and practical technology.",
      children: []
    },
    {
      title: "Education",
      short: "What I study",
      content:
        "BSc (Hons) Mathematics at Ramanujan College, University of Delhi. I am also learning Data Science concepts and programming through IIT Madras.",
      children: []
    },
    {
      title: "Interests",
      short: "Things I keep exploring",
      content:
        "These are the areas that keep pulling my attention. Open the sub-branches to see more personal notes.",
      children: [
        {
          title: "Mathematics",
          short: "Problem solving and core ideas",
          content:
            "I enjoy mathematics because it matches how my mind likes to think: precise, structured, and full of satisfying patterns.",
          children: []
        },
        {
          title: "Linux",
          short: "Control, clarity, and customization",
          content:
            "I prefer Linux because it gives me control. I like terminal workflows, customization, troubleshooting, and learning how the system works underneath.",
          children: []
        },
        {
          title: "Chess",
          short: "Late start, serious interest",
          content:
            "I learned chess in mid-2024 and now wish I had started earlier. I like the mix of calculation, planning, tactics, and pattern recognition.",
          children: [
            {
              title: "What I am studying",
              short: "Openings, tactics, endgames",
              content:
                "Right now I am learning the fundamentals: opening principles, tactical patterns, and simple endgames.",
              children: []
            }
          ]
        },
        {
          title: "Movies",
          short: "Nostalgia and favorites",
          content:
            "I enjoy older Hindi films, especially from around 2000 to 2016. I like the music, emotional clarity, comedy, and nostalgia from that period.",
          children: []
        },
        {
          title: "Automation",
          short: "Small tools that save time",
          content:
            "I enjoy using Tasker, scripts, and simple tools to automate repetitive tasks. Small improvements can make daily workflows feel much better.",
          children: []
        }
      ]
    },
    {
      title: "Personality Notes",
      short: "Reflective, selective, curious",
      content:
        "I am naturally reflective and sometimes shy. I like thoughtful conversations, small circles, and things that feel genuinely useful or meaningful.",
      children: []
    }
  ]
};

/* =========================================================
   NAVBAR + MOBILE MENU
   ========================================================= */
const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-links a");

// Adds a glassy navbar background after scrolling down a little.
function updateHeaderState() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", updateHeaderState);
updateHeaderState();

// Opens and closes the hamburger menu on mobile.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Close the mobile menu after clicking a navigation link.
navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});

/* =========================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================= */
const revealElements = document.querySelectorAll(".reveal");

// Reveals anything already visible when the page first loads.
function revealVisibleElementsNow() {
  revealElements.forEach((element) => {
    const box = element.getBoundingClientRect();

    if (box.top < window.innerHeight && box.bottom > 0) {
      element.classList.add("is-visible");
    }
  });
}

// IntersectionObserver is lightweight and runs only when elements enter the screen.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => revealObserver.observe(element));
revealVisibleElementsNow();
window.addEventListener("load", revealVisibleElementsNow);

/* =========================================================
   ACTIVE NAV LINK WHILE SCROLLING
   ========================================================= */
const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);

      navItems.forEach((link) => link.classList.remove("active"));
      if (activeLink) activeLink.classList.add("active");
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

/* =========================================================
   CONTACT FORM
   This does not need a backend. It opens your email app.
   ========================================================= */
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});

/* =========================================================
   PERSONAL TREE LOGIC
   The original idea is preserved:
   - Add top-level branches
   - Add sub-branches
   - Edit branches
   - Delete branches
   - Save everything in localStorage
   ========================================================= */
const rootEl = document.getElementById("treeRoot");
const template = document.getElementById("nodeTpl");
const addRootBtn = document.getElementById("addRoot");
const resetBtn = document.getElementById("resetBtn");
const expandAllBtn = document.getElementById("expandAll");
const collapseAllBtn = document.getElementById("collapseAll");

let treeData = loadTree();

// Safely loads the saved tree. If something goes wrong, it uses the default tree.
function loadTree() {
  try {
    const savedTree = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY);
    return savedTree ? JSON.parse(savedTree) : clone(defaultTree);
  } catch (error) {
    console.warn("Tree data could not be loaded, using default tree.", error);
    return clone(defaultTree);
  }
}

// Saves the current tree to this browser.
function saveTree() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(treeData));
  } catch (error) {
    console.warn("Tree data could not be saved.", error);
  }
}

// Creates a deep copy so the default data is never accidentally changed.
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// Creates a new branch object in the same format as the rest of the tree.
function createBranch(title) {
  return {
    title: title || "Untitled Branch",
    short: "",
    content: "Add details for this branch.",
    children: []
  };
}

// Redraws the full tree on the page.
function renderTree() {
  rootEl.innerHTML = "";

  treeData.children.forEach((branch) => {
    rootEl.appendChild(buildNode(branch));
  });

  saveTree();
}

// Builds one branch and all of its children.
function buildNode(branch) {
  const node = template.content.firstElementChild.cloneNode(true);
  const titleEl = node.querySelector('[data-role="title"]');
  const shortEl = node.querySelector('[data-role="short"]');
  const contentEl = node.querySelector('[data-role="content"]');
  const childrenEl = node.querySelector('[data-role="children"]');
  const toggleBtn = node.querySelector('[data-action="toggle"]');
  const addBtn = node.querySelector('[data-action="add"]');
  const editBtn = node.querySelector('[data-action="edit"]');
  const deleteBtn = node.querySelector('[data-action="delete"]');

  titleEl.textContent = branch.title || "Untitled Branch";
  shortEl.textContent = branch.short || "No short note yet";
  contentEl.innerHTML = branch.content || "No details added yet.";

  // Clicking the main branch area expands/collapses the content.
  toggleBtn.addEventListener("click", () => {
    const isOpen = node.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Adds a child branch under this branch.
  addBtn.addEventListener("click", () => {
    const title = prompt("New sub-branch title:");
    if (title === null) return;

    branch.children = branch.children || [];
    branch.children.push(createBranch(title.trim()));
    renderTree();
  });

  // Lets you edit title, short note, and details.
  editBtn.addEventListener("click", () => {
    const newTitle = prompt("Edit title:", branch.title || "");
    if (newTitle === null) return;

    const newShort = prompt("Short note shown under the title:", branch.short || "");
    if (newShort === null) return;

    const newContent = prompt("Details for this branch. HTML is allowed:", branch.content || "");
    if (newContent === null) return;

    branch.title = newTitle.trim() || "Untitled Branch";
    branch.short = newShort.trim();
    branch.content = newContent.trim() || "No details added yet.";
    renderTree();
  });

  // Deletes the branch after confirmation.
  deleteBtn.addEventListener("click", () => {
    const confirmed = confirm("Delete this branch and all branches inside it?");
    if (!confirmed) return;

    removeBranch(treeData, branch);
    renderTree();
  });

  // Recursively render all child branches.
  (branch.children || []).forEach((childBranch) => {
    childrenEl.appendChild(buildNode(childBranch));
  });

  return node;
}

// Finds and removes a branch from its parent.
function removeBranch(parent, targetBranch) {
  if (!parent.children) return false;

  const startLength = parent.children.length;
  parent.children = parent.children.filter((child) => child !== targetBranch);

  if (parent.children.length !== startLength) {
    return true;
  }

  return parent.children.some((child) => removeBranch(child, targetBranch));
}

// Add a new top-level branch.
addRootBtn.addEventListener("click", () => {
  const title = prompt("New branch title:");
  if (title === null) return;

  treeData.children.push(createBranch(title.trim()));
  renderTree();
});

// Restore the starter tree and remove local edits.
resetBtn.addEventListener("click", () => {
  const confirmed = confirm("Restore the default tree and clear your saved tree edits?");
  if (!confirmed) return;

  treeData = clone(defaultTree);
  renderTree();
});

// Expand every branch on screen.
expandAllBtn.addEventListener("click", () => {
  document.querySelectorAll(".tree-node").forEach((node) => {
    node.classList.add("is-open");
    const button = node.querySelector('[data-action="toggle"]');
    if (button) button.setAttribute("aria-expanded", "true");
  });
});

// Collapse every branch on screen.
collapseAllBtn.addEventListener("click", () => {
  document.querySelectorAll(".tree-node").forEach((node) => {
    node.classList.remove("is-open");
    const button = node.querySelector('[data-action="toggle"]');
    if (button) button.setAttribute("aria-expanded", "false");
  });
});

// Initial tree render when the page loads.
renderTree();
