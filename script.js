const SERVER_IP = "play.siestasmp.net";
const STATUS_ENDPOINT = `https://api.mcsrvstat.us/3/${SERVER_IP}`;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

const navToggle = $(".nav-toggle");
const siteNav = $(".site-nav");
navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const toast = $("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

$("[data-copy-ip]").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(SERVER_IP);
    showToast("IP server disalin.");
  } catch {
    showToast(`IP: ${SERVER_IP}`);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.13 }
);

$$(".reveal").forEach((element) => revealObserver.observe(element));

async function loadServerStatus() {
  const state = $("#onlineState");
  const playerCount = $("#playerCount");
  const maxPlayers = $("#maxPlayers");
  const ping = $("#ping");
  const version = $("#version");
  const motd = $("#motd");
  const playerList = $("#playerList");
  const lastRefresh = $("#lastRefresh");
  const serverIcon = $("#serverIcon");

  state.textContent = "Memuat...";
  state.classList.remove("offline");

  try {
    const response = await fetch(STATUS_ENDPOINT, { cache: "no-store" });
    if (!response.ok) throw new Error("Status request failed");
    const data = await response.json();

    if (!data.online) {
      state.textContent = "Offline";
      state.classList.add("offline");
      playerCount.textContent = "0";
      maxPlayers.textContent = "maks --";
      ping.textContent = "-- ms";
      version.textContent = "--";
      motd.textContent = "Server sedang tidak dapat dijangkau.";
      playerList.textContent = "Tidak ada pemain online.";
      return;
    }

    state.textContent = "Online";
    state.classList.remove("offline");
    playerCount.textContent = data.players?.online ?? "--";
    maxPlayers.textContent = `maks ${data.players?.max ?? "--"}`;
    ping.textContent = data.debug?.ping ? `${Math.round(data.debug.ping)} ms` : "-- ms";
    version.textContent = data.version || "--";
    motd.textContent = Array.isArray(data.motd?.clean) ? data.motd.clean.join(" ") : "Selamat datang di Siesta SMP.";

    if (data.icon) {
      serverIcon.textContent = "";
      serverIcon.style.backgroundImage = `url(${data.icon})`;
      serverIcon.style.backgroundSize = "cover";
    }

    const names = data.players?.list?.map((player) => player.name || player).filter(Boolean);
    playerList.textContent = names?.length ? names.join(", ") : "API tidak menampilkan nama pemain saat ini.";
  } catch {
    state.textContent = "Offline";
    state.classList.add("offline");
    playerCount.textContent = "0";
    maxPlayers.textContent = "maks --";
    ping.textContent = "-- ms";
    version.textContent = "--";
    motd.textContent = "Status belum tersedia. Pastikan alamat server sudah benar.";
    playerList.textContent = "Daftar pemain belum tersedia.";
  } finally {
    lastRefresh.textContent = `Terakhir refresh ${new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
}

$("#refreshStatus").addEventListener("click", loadServerStatus);
loadServerStatus();
setInterval(loadServerStatus, 60000);

const shots = $$(".shot");
let activeShot = 0;

function setShot(index) {
  shots[activeShot].classList.remove("active");
  activeShot = (index + shots.length) % shots.length;
  shots[activeShot].classList.add("active");
}

$(".prev").addEventListener("click", () => setShot(activeShot - 1));
$(".next").addEventListener("click", () => setShot(activeShot + 1));
setInterval(() => setShot(activeShot + 1), 5200);

const canvas = $("#particleCanvas");
const context = canvas.getContext("2d");
let particles = [];
let animationFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  particles = Array.from({ length: Math.min(110, Math.floor(window.innerWidth / 12)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2.6 + 0.8,
    speed: Math.random() * 0.28 + 0.12,
    drift: Math.random() * 0.4 - 0.2,
    alpha: Math.random() * 0.45 + 0.18,
  }));
}

function drawParticles() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += particle.drift;

    if (particle.y < -8) particle.y = window.innerHeight + 8;
    if (particle.x < -8) particle.x = window.innerWidth + 8;
    if (particle.x > window.innerWidth + 8) particle.x = -8;

    context.fillStyle = `rgba(171, 238, 255, ${particle.alpha})`;
    context.fillRect(particle.x, particle.y, particle.size, particle.size);
  });
  animationFrame = requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawParticles();

window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));



const bgm=document.getElementById("bgm");
const btn=document.getElementById("musicBtn");

bgm.volume=.25;

let playing=false;

function playMusic(){

if(!playing){

bgm.play();

playing=true;

}

}

document.addEventListener("click",playMusic,{once:true});

btn.onclick=()=>{

if(bgm.paused){

bgm.play();

btn.textContent="🔊";

}else{

bgm.pause();

btn.textContent="🔇";

}

}