// ========== TIMELINE HANDLE DRAGGING ==========
const handle = document.getElementById("handle");
const wrapper = document.querySelector(".timeline-wrapper");
const events = document.querySelectorAll(".timeline-event");

let isDragging = false;
let startY;
let startTop;

// Update position while dragging (mouse and touch)
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
    const hotspots = [
    {
        name: "Amazon Rainforest",
        coords: [-3.4653, -62.2159],
        description: "The world's largest tropical rainforest, rich in flora and fauna.",
        threats: "Deforestation, illegal mining, wildfires",
        protection: "Partially protected by national parks and reserves",
        continent: "South America",
        type: "forest"
    },
    {
        name: "Congo Basin",
        coords: [-1.4419, 15.5562],
        description: "The second-largest rainforest, home to gorillas and forest elephants.",
        threats: "Logging, poaching, agricultural expansion",
        protection: "Various conservation programs active",
        continent: "Africa",
        type: "forest"
    },
    {
        name: "Sundaland",
        coords: [-0.7893, 113.9213],
        description: "Southeast Asian hotspot with dense rainforests and endangered species.",
        threats: "Palm oil plantations, habitat loss",
        protection: "Limited; key areas like Borneo have protected zones",
        continent: "Asia",
        type: "forest"
    },
    {
        name: "Himalayas",
        coords: [27.9878, 86.9250],
        description: "Mountain range with extreme biodiversity and endemic species.",
        threats: "Climate change, overgrazing, deforestation",
        protection: "Protected by several national parks and sanctuaries",
        continent: "Asia",
        type: "mountain"
    },
    {
        name: "Coral Triangle",
        coords: [-1.5, 130.0],
        description: "Marine hotspot with highest diversity of coral reef species.",
        threats: "Coral bleaching, overfishing, pollution",
        protection: "Marine protected areas and regional efforts",
        continent: "Asia",
        type: "marine"
    },
    {
        name: "Madagascar and the Indian Ocean Islands",
        coords: [-18.7669, 46.8691],
        description: "Isolated ecosystems with 90% species endemism.",
        threats: "Slash-and-burn agriculture, logging",
        protection: "Some areas under conservation but enforcement is weak",
        continent: "Africa",
        type: "island"
    },
    {
        name: "Indo-Burma Region",
        coords: [20.5937, 105.1571],
        description: "One of the most threatened biodiversity hotspots in Asia.",
        threats: "Damming, agriculture, urbanization",
        protection: "Fragmented protection through scattered reserves",
        continent: "Asia",
        type: "forest"
    },
    {
        name: "Western Ghats and Sri Lanka",
        coords: [10.1927, 76.6413],
        description: "High biodiversity with many endemic species of amphibians and plants.",
        threats: "Habitat loss, invasive species",
        protection: "Several UNESCO World Heritage Sites",
        continent: "Asia",
        type: "mountain"
    },
    {
        name: "Mesoamerican Forests",
        coords: [15.7835, -90.2308],
        description: "Stretching from Mexico to Panama, rich in primates and birds.",
        threats: "Deforestation, drug trafficking routes, climate change",
        protection: "Numerous eco-parks and cross-border conservation projects",
        continent: "Central America",
        type: "forest"
    },
    {
        name: "New Guinea Rainforests",
        coords: [-5.6816, 144.2489],
        description: "One of the last untouched rainforests with tribal cultures and unique species.",
        threats: "Logging, mining, road construction",
        protection: "Traditional land management + some formal protection",
        continent: "Oceania",
        type: "forest"
    },
    {
        name: "Borneo",
        coords: [0.7893, 113.9213],
        description: "Tropical rainforest home to orangutans, pygmy elephants, and rare flora.",
        threats: "Logging, palm oil industry, fire",
        protection: "Protected zones exist but under pressure",
        continent: "Asia",
        type: "forest"
    },
    {
        name: "Atlantic Forest (Mata Atlântica)",
        coords: [-22.9068, -43.1729],
        description: "Brazilian coastal rainforest with extreme deforestation but high biodiversity.",
        threats: "Urban expansion, agriculture",
        protection: "Small protected areas; active restoration projects",
        continent: "South America",
        type: "forest"
    },
    {
        name: "New Caledonia",
        coords: [-20.9043, 165.6180],
        description: "Pacific island with ancient species and isolated evolution.",
        threats: "Nickel mining, invasive species, fire",
        protection: "Partially protected; conservation initiatives growing",
        continent: "Oceania",
        type: "island"
    },{
        name: "Philippines",
        coords: [13.4125, 122.5621],
        description: "Archipelago with high biodiversity and over 6,000 endemic species.",
        threats: "Deforestation, mining, typhoons",
        protection: "Protected areas exist but enforcement is weak",
        continent: "Asia",
        type: "island"
    },
    {
        name: "Japan",
        coords: [36.2048, 138.2529],
        description: "Mountainous islands with unique species adapted to all climate zones.",
        threats: "Urbanization, invasive species, habitat fragmentation",
        protection: "National parks and community forests",
        continent: "Asia",
        type: "island"
    },
    {
        name: "Caribbean Islands",
        coords: [18.2208, -66.5901],
        description: "A chain of islands with high species endemism, especially reptiles and plants.",
        threats: "Tourism, hurricanes, invasive species",
        protection: "Scattered marine and terrestrial parks",
        continent: "North America",
        type: "island"
    },
    {
        name: "Irano-Anatolian Region",
        coords: [38.9637, 35.2433],
        description: "Highlands and plateaus with diverse endemic flora.",
        threats: "Overgrazing, agriculture, water scarcity",
        protection: "Low; scattered efforts",
        continent: "Asia",
        type: "mountain"
    },
    {
        name: "Eastern Afromontane",
        coords: [0.3476, 32.5825],
        description: "Chain of mountains running from Saudi Arabia to Mozambique, rich in endemic species.",
        threats: "Agricultural encroachment, deforestation",
        protection: "Some national parks and reserves",
        continent: "Africa",
        type: "mountain"
    },
    {
        name: "Tumbes-Chocó-Magdalena",
        coords: [1.3969, -78.9018],
        description: "A moist forest hotspot stretching from Panama to Ecuador.",
        threats: "Oil extraction, deforestation, road construction",
        protection: "Fragmented; some key zones protected",
        continent: "South America",
        type: "forest"
    },
    {
        name: "Wallacea",
        coords: [-2.5479, 118.0149],
        description: "Indonesian region between Asia and Australia, full of endemic wildlife.",
        threats: "Habitat loss, wildlife trade",
        protection: "Limited marine and forest reserves",
        continent: "Asia",
        type: "island"
    },
    {
        name: "Mountains of Central Asia",
        coords: [39.3206, 66.9537],
        description: "Harsh but biodiverse landscapes including deserts, steppes, and alpine zones.",
        threats: "Climate change, overgrazing, mining",
        protection: "Low protection but increasing conservation interest",
        continent: "Asia",
        type: "mountain"
    },
    {
        name: "Chilean Winter Rainfall-Valdivian Forests",
        coords: [-39.8196, -73.2452],
        description: "Temperate forests with ancient tree species and high endemism.",
        threats: "Logging, invasive species",
        protection: "Some parts protected, growing awareness",
        continent: "South America",
        type: "forest"
    },
    
    ];

    // ========== CUSTOM ICONS BASED ON TYPE ==========
    const iconMap = {
    forest: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/4273/4273786.png', iconSize: [32, 32] }),
    marine: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/4273/4273813.png', iconSize: [32, 32] }),
    mountain: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/4273/4273811.png', iconSize: [32, 32] }),
    island: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/4273/4273795.png', iconSize: [32, 32] })
    };

    let markerGroup = L.layerGroup().addTo(map);

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

    // Initial load
    showHotspots();

    // Filter on change
    document.getElementById('continentFilter').addEventListener('change', (e) => {
    showHotspots(e.target.value);
    });

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
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active');
  });

  const factsCounters = document.querySelectorAll('.Fcounter');

factsCounters.forEach(counter => {
  const target = parseFloat(counter.getAttribute('data-target'));
  const isInteger = Number.isInteger(target); // ✅ Detect if it's a whole number
  const factSpeed = target < 10 ? 100 : 400;

  const updateCount = () => {
    let count = parseFloat(counter.innerText);
    const increment = target / factSpeed;

    if (count < target) {
      count += increment;

      counter.innerText = isInteger
        ? Math.floor(count) // 👈 Keep it smooth until final step
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
