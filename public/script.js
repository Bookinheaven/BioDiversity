// ========== TIMELINE HANDLE DRAGGING ==========
const handle = document.getElementById("handle");
const wrapper = document.querySelector(".timeline-wrapper");
const events = document.querySelectorAll(".timeline-event");

let isDragging = false;
let startY;
let startTop;

function updateHandlePosition(y) {
  const dy = y - startY;
  let newTop = startTop + dy;

  const maxTop = wrapper.clientHeight - handle.clientHeight;
  newTop = Math.max(0, Math.min(newTop, maxTop));

  handle.style.top = newTop + "px";

  const handleCenter = newTop + handle.clientHeight / 2;

  events.forEach((event) => {
    const triggerPos = parseInt(event.getAttribute("data-pos"), 10);
    if (handleCenter >= triggerPos) {
      event.classList.add("visible");
    } else {
      event.classList.remove("visible");
    }
  });
}

// Mouse & touch start
handle.addEventListener("mousedown", (e) => {
  isDragging = true;
  startY = e.clientY;
  startTop = parseInt(window.getComputedStyle(handle).top, 10);
  e.preventDefault();
});

handle.addEventListener("touchstart", (e) => {
  isDragging = true;
  startY = e.touches[0].clientY;
  startTop = parseInt(window.getComputedStyle(handle).top, 10);
  e.preventDefault();
});

// Mouse & touch move
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  updateHandlePosition(e.clientY);
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  updateHandlePosition(e.touches[0].clientY);
});

// Stop dragging
document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("touchend", () => {
  isDragging = false;
});

// ========== CAMPAIGN JOIN FUNCTION ==========
function joinCampaign(campaignName) {
  alert(`Thank you for joining the ${campaignName} campaign!`);
}

// ========== CONTACT FORM SUBMISSION ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    if (!formData.name || !formData.email || !formData.message) {
      document.getElementById('responseMsg').textContent = 'Please fill in all fields.';
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      document.getElementById('responseMsg').textContent = result.message;
      contactForm.reset();
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('responseMsg').textContent = 'An error occurred. Please try again later.';
    }
  });
}

// ========== INITIALIZE TIMELINE TO FIRST EVENT ==========
function initializeTimelineHandle() {
  if (events.length > 0) {
    const firstEvent = events[0];
    const firstPos = parseInt(firstEvent.getAttribute("data-pos"), 10);
    const handleTop = firstPos - handle.clientHeight / 2;

    const maxTop = wrapper.clientHeight - handle.clientHeight;
    const newTop = Math.max(0, Math.min(handleTop, maxTop));

    handle.style.top = newTop + "px";

    const handleCenter = newTop + handle.clientHeight / 2;
    events.forEach((event) => {
      const triggerPos = parseInt(event.getAttribute("data-pos"), 10);
      if (handleCenter >= triggerPos) {
        event.classList.add("visible");
      } else {
        event.classList.remove("visible");
      }
    });
  }
}

// ========== LEAFLET MAP & SCROLL REVEAL ==========
window.addEventListener('DOMContentLoaded', () => {
  // Init timeline handle
  initializeTimelineHandle();

  // ========== LEAFLET MAP SETUP ==========
    const map = L.map('biodiversityMap').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // ========== BIODIVERSITY HOTSPOTS ==========
    fetch('../resources/data/locations.json')
    .then(response => response.json())
    .then(hotspots => {
      hotspots = hotspots["locations"];

      // ========== CUSTOM ICONS BASED ON TYPE ==========
      const iconMap = {
        forest: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/4273/4273786.png', iconSize: [32, 32] }),
        marine: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/4273/4273813.png', iconSize: [32, 32] }),
        mountain: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/4273/4273811.png', iconSize: [32, 32] }),
        island: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/4273/4273795.png', iconSize: [32, 32] })
      };

      let markerGroup = L.layerGroup().addTo(map);
      showHotspots();

      document.getElementById('continentFilter').addEventListener('change', (e) => {
        showHotspots(e.target.value);
      });

      // ========== FUNCTION TO SHOW MARKERS ==========
      function showHotspots(continent = "all") {
        markerGroup.clearLayers();
        hotspots.forEach(site => {
          if (continent === "all" || site.continent === continent) {
            const marker = L.marker(site.coords, { icon: iconMap[site.type] })
              .bindTooltip(site.name, { permanent: false, direction: "top" })
              .bindPopup(`
                <strong>${site.name}</strong><br>
                <em>${site.description}</em><br>
                <strong>Threats:</strong> ${site.threats}<br>
                <strong>Protection:</strong> ${site.protection}
              `);
            markerGroup.addLayer(marker);
          }
        });
      }
    }) .catch(error => console.error("Error loading hotspots:", error)); // ✅ Works as expected now


  const sections = document.querySelectorAll('section');
  const revealOnScroll = () => {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);
  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  function formatNumber(num) {
    return num.toLocaleString(); // Adds commas
  }

  function animateCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const duration = 4000;
      const step = Math.ceil(target / (duration / 20));

      const updateCount = () => {
        count += step;
        if (count < target) {
          counter.innerText = formatNumber(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = formatNumber(target);
        }
      };

      updateCount();
    });
  }

  // Only trigger once
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(document.querySelector('#statistics'));
  document.getElementById("typing-header").innerHTML = ""
  const text = "Biodiversity";  
  const speed = 250; 
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      document.getElementById("typing-header").innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  window.onload = typeWriter;
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  const factsCounters = document.querySelectorAll('.Fcounter');

factsCounters.forEach(counter => {
  const target = parseFloat(counter.getAttribute('data-target'));
  const isInteger = Number.isInteger(target); 
  const factSpeed = target < 10 ? 100 : 400;

  const updateCount = () => {
    let count = parseFloat(counter.innerText);
    const increment = target / factSpeed;

    if (count < target) {
      count += increment;

      counter.innerText = isInteger
        ? Math.floor(count) 
        : count.toFixed(2);

      setTimeout(updateCount, 20);
    } else {
      counter.innerText = isInteger
        ? target
        : target.toFixed(2);
    }
  };

  const factObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      updateCount();
      factObserver.disconnect();
    }
  }, { threshold: 0.5 });

  factObserver.observe(counter);
});

  
});
