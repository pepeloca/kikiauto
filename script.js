/* =========================================================
   INVENTARIO + MODAL + CHAT (JS MEJORADO CON CONFIRMACIONES)
   ---------------------------------------------------------
   - Inventario: 6 al inicio, +10 por “Cargar más”.
   - Precios: DOP por defecto; cambia a USD en el filtro.
   - Modal: carrusel con contador 1/3, flechas, swipe, thumbs.
   - Chat:
      * Motor de intenciones + confirmaciones.
      * Si el bot ofrece mostrar algo y respondes “sí/ok/oky/yes…”
        muestra el contenido de inmediato.
      * Comandos directos: “muéstrame inventario/mapa/SUVs/Toyota/
        vehículo 3 / requisitos / contacto / financiamiento…”
      * Botones en chat para abrir modal (data-open).
   - Cómo agregar un vehículo: ver bloque de ejemplo en CARS.
   ========================================================= */

/* ====== Config ====== */
const EXCHANGE_RATE = 59;   // RD$ por USD
const INITIAL_SIZE = 6;     // tarjetas al inicio
const LOAD_MORE_STEP = 10;  // tarjetas por clic en "Cargar más"

/* ====== Data (ejemplos, agrega más siguiendo el formato) ====== */
const CARS = [
  {
    id:1, brand:"Chevrolet", model:"Tracker", year:2023,
    priceUSD:16900, km:12000, transmission:"Automática", fuel:"Gasolina", drive:"4x2", body:"SUV", color:"Gris",
    description:"Chevrolet Tracker 2023 en excelentes condiciones, mantenimiento al día.",
    images:[
      "https://img.supercarros.com/AdsPhotos/1024x768/0/9734651.jpg?wmo=7c4cc24e0f307a3d26ccdceb243fe4bce43b1d9b6fe01a628e676a1b5cb5a2cb3edcc73dfe4484af8017fce95d61913eda39de062475090f9f51caec2d805cdd",
      "https://i.ytimg.com/vi/wQIq30hwRkk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCHSSJt3hJ8ejXGiN_rwRG_3yUQqg",
      "https://automarket.bbva.mx/media/catalog/product/3/7/3720233433318-32913-0468-185-dgai.jpg?optimize=high&bg-color=255%2C255%2C255&fit=cover&height=&width=&auto=webp&format=pjpg",
      "https://automarket.bbva.mx/media/catalog/product/3/7/3720233433318-32913-0468-581-dgfd.jpg?optimize=high&bg-color=255%2C255%2C255&fit=cover&height=&width=&auto=webp&format=pjpg"
    ]
  },
  {
    id:2, brand:"Nissan", model:"Note", year:2019,
    priceDOP:675000, km:65000, transmission:"Automática", fuel:"Gasolina", drive:"4x2", body:"Hatchback", color:"Plata",
    description:"Nissan Note 2019 cómodo y económico, ideal ciudad.",
    images:[
      "https://img.supercarros.com/AdsPhotos/1024x768/0/12615804.jpg?wmo=8ddfb911445d36d16c34c82226203411742560bacf9b32b2324ec21bcb279fe00ecdf9c759d780d7cef46fb728a6f724adf79134761f79f28065c6d1b42e722a",
      "https://dashboard.montao.do/images/car/20241228091925165800613.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8VymnB0enWluWYci-XKYWs_94aZq3vhDnRsQf4wA2eg245bjedw4stXrT7I3u-mCYtuc&usqp=CAU"
    ]
  },
  {
    id:3, brand:"Toyota", model:"Vitz", year:2019,
    priceDOP:685000, km:52000, transmission:"Automática", fuel:"Gasolina", drive:"4x2", body:"Hatchback", color:"Blanco",
    description:"Toyota Vitz 2019 con bajo consumo y mantenimiento económico.",
    images:[
      "https://image-cdn.beforward.jp/large/202008/1938015/BH406269_3feabd.JPG",
      "https://img.supercarros.com/AdsPhotos/1024x768/0/12923372.jpg?wmo=d6ca4beac2ddad607f838c2d365251fbe93f695ed080642ad0fcdabe40a22a0b3c9958ce1642d2a2f631910d173d9f85a71ac900ca5ccb99f75b70ea025c3568",
      "https://dashboard.montao.do/images/car/20241118122517231228450.jpg",
      "https://i.pinimg.com/736x/87/be/41/87be41092eccb01314d85d5d22917241.jpg"
    ]
  },
  {
    id:4, brand:"Nissan", model:"March", year:2019,
    priceDOP:585000, km:70000, transmission:"Automática", fuel:"Gasolina", drive:"4x2", body:"Hatchback", color:"Negro",
    description:"Nissan March 2019, compacto, cómodo y confiable.",
    images:[
      "https://img.supercarros.com/AdsPhotos/1024x768/0/12543208.jpg?wmo=d13e8098e73b35801c7c21b7ee3aa485c3cbcd3c81d6b74f1bac252bbd0dda1ccdbbf32be87786d65a68f6ff14d8e06459222619455d862b773448e3a1c9923f",
      "https://img.supercarros.com/AdsPhotos/1024x768/0/12604972.jpg?wmo=0090dee53e0e279681774c0a9b636c05c574918bd3daa1918a4d8bdf05f8e68cdf07e44d22d909a4ccd13344c58915387212ac76befd026694dcb9d03a6a4984",
      "https://http2.mlstatic.com/D_NQ_NP_834158-MCO89439424075_082025-O.webp"
    ]
  },
  {
    id:5, brand:"Kia", model:"Sorento", year:2021,
    priceUSD:29000, km:28000, transmission:"Automática", fuel:"Gasolina", drive:"4x4", body:"SUV", color:"Azul",
    description:"Kia Sorento 2021 4x4, ideal para familia y viajes.",
    images:[
      "https://acnews.blob.core.windows.net/imgnews/large/NAZ_01704c5c97214ce2b9d0a363ce7d4a41.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEEbJ-ivuVVCzJ2HQRE7iW2KTtr7gHVCLhhmb8rvpHqtnIXIrqZJM7wBDYhWTeIECKxnw&usqp=CAU",
      "https://tashdata.s3.me-south-1.amazonaws.com/public/dooz/UploadedFiles/8e18e630-43ea-44e3-af73-0d474b371246.jpg"
    ]
  },
  {
    id:6, brand:"Toyota", model:"RAV4", year:2018,
    priceUSD:22500, km:82000, transmission:"Automática", fuel:"Gasolina", drive:"4x4", body:"SUV", color:"Rojo",
    description:"Toyota RAV4 2018 LE AWD en perfecto estado general.",
    images:[
      "https://cdn.buttercms.com/QzzWk6esTOC6cE7uURrJ",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdu6sELwnU1xLO-ZW9X6-RWoaIijeo02xXXpu6gmIV-Xwpdo00XUXWHOTCL0U4eKFgsns&usqp=CAU",
      "https://scout.customerscout.net/Gallery/IMAGES/2018/Toyota18/Rav4-Limited/2018-Toyota-RAV4-Limited-interior-5-edited.jpg",
      "https://es.digitaltrends.com/wp-content/uploads/2018/02/Toyota-RAV4-Adventure-24.jpg?p=1"
    ]
  },

  {
    id:7,                      // 🔴 único y numérico
    brand:"Hyundai",
    model:"Accent",
    year:2020,
    priceDOP:985000,           // O: priceUSD: 17500 (uno basta)
    km:45000,
    transmission:"Automática",
    fuel:"Gasolina",
    drive:"4x2",
    body:"Sedán",
    color:"Negro",
    description:"Hyundai Accent 2020, económico y confiable.",
    images:[
      "https://carrosrd-media.s3.amazonaws.com/listings/71134/m_17419636560492947.jpg?1",
      "https://carrosrd-media.s3.amazonaws.com/listings/51790/m_16863419670134547.jpg"
    ]
  },
  
  /* ============ CÓMO AGREGAR UN VEHÍCULO NUEVO ============
  Copia y pega este bloque, edita los campos y usa un id único:

  {
    id:7,                      // 🔴 único y numérico
    brand:"Hyundai",
    model:"Accent",
    year:2020,
    priceDOP:985000,           // O: priceUSD: 17500 (uno basta)
    km:45000,
    transmission:"Automática",
    fuel:"Gasolina",
    drive:"4x2",
    body:"Sedán",
    color:"Negro",
    description:"Hyundai Accent 2020, económico y confiable.",
    images:[
      "https://source.unsplash.com/1200x750/?hyundai,accent&sig=71",
      "https://source.unsplash.com/1200x750/?hyundai,sedan&sig=72"
    ]
  },
  ========================================================== */
];

/* Completar precios faltantes según tasa */
function ensurePrices(list){
  list.forEach(c=>{
    if(c.priceDOP == null && c.priceUSD != null) c.priceDOP = Math.round(c.priceUSD * EXCHANGE_RATE);
    if(c.priceUSD == null && c.priceDOP != null) c.priceUSD = Math.round(c.priceDOP / EXCHANGE_RATE);
  });
}
ensurePrices(CARS);

/* ====== Horario (para “Abierto ahora”) ====== */
const HOURS = { 0:null, 1:["09:00","18:00"], 2:["09:00","18:00"], 3:["09:00","18:00"], 4:["09:00","18:00"], 5:["09:00","18:00"], 6:["09:00","14:00"] };

/* =================== Helpers =================== */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const nfDO = new Intl.NumberFormat('es-DO');

function formatPriceDOP(p){return new Intl.NumberFormat("es-DO",{style:"currency",currency:"DOP", maximumFractionDigits:0}).format(p)}
function formatPriceUSD(p){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD", maximumFractionDigits:0}).format(p)}

/* Header responsive */
const navToggle = $(".nav__toggle");
const navMenu = $(".nav__menu");
if(navToggle && navMenu){
  navToggle.addEventListener("click", ()=>{
    const open = navMenu.style.display === "flex";
    navMenu.style.display = open ? "none" : "flex";
    navToggle.setAttribute("aria-expanded", String(!open));
  });
}

/* Footer year */
const yearEl = $("#year");
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* =================== Inventario + Filtros =================== */
const cards = $("#cards");
const q = $("#q");
const currencySel = $("#currency");      // DOP por defecto en el HTML
const brandSel = $("#brand");
const priceRange = $("#priceRange");
const btnLoadMore = $("#loadMore");
const btnClear = $("#clear");

/* Precio por moneda (para el filtro de precio) */
const PRICE_OPTIONS = {
  DOP: [
    {v:"all", t:"Todos"},
    {v:"0-700000", t:"Hasta RD$700,000"},
    {v:"700000-1000000", t:"RD$700k–1M"},
    {v:"1000000-99999999", t:"Más de RD$1M"}
  ],
  USD: [
    {v:"all", t:"Todos"},
    {v:"0-25000", t:"Hasta $25k"},
    {v:"25000-50000", t:"$25k–$50k"},
    {v:"50000-999999", t:"$50k+"}
  ]
};

function populatePriceOptions(){
  if(!priceRange) return;
  const cur = state.currencyDisplay;
  priceRange.innerHTML = "";
  PRICE_OPTIONS[cur].forEach(o=>{
    const opt = document.createElement("option");
    opt.value = o.v; opt.textContent = o.t;
    priceRange.appendChild(opt);
  });
}

/* Poblar marcas */
if(brandSel){
  const brands = Array.from(new Set(CARS.map(c=>c.brand))).sort();
  brands.forEach(b=>{
    const opt = document.createElement("option");
    opt.value = b; opt.textContent = b;
    brandSel.appendChild(opt);
  });
}

/* Estado de filtros/paginación */
let state = { page:1, q:"", currencyDisplay:"DOP", brand:"all", priceRange:"all" };

function passPriceRange(car){
  const val = state.priceRange;
  if(val==="all") return true;
  const [min,max] = val.split("-").map(Number);
  const price = state.currencyDisplay==="USD" ? car.priceUSD : car.priceDOP;
  return price >= min && price <= max;
}

function filterCars(){
  const qLower = (state.q||"").toLowerCase().trim();
  return CARS.filter(car=>{
    const matchQ = `${car.brand} ${car.model} ${car.year}`.toLowerCase().includes(qLower);
    const matchBrand = state.brand==="all" || car.brand===state.brand;
    const matchPrice = passPriceRange(car);
    return matchQ && matchBrand && matchPrice;
  });
}

function currentLimit(total){
  const extra = Math.max(0, state.page-1) * LOAD_MORE_STEP;
  return Math.min(INITIAL_SIZE + extra, total);
}

function renderCars(reset=false){
  if(!cards) return;
  const list = filterCars();
  const total = list.length;
  const end = currentLimit(total);
  const slice = list.slice(0, end);

  if(reset){ cards.innerHTML=""; }
  slice.forEach(car=>{
    if(document.getElementById("car-"+car.id)) return; // evitar duplicados al paginar
    const el = document.createElement("article");
    el.className="card";
    el.id = "car-"+car.id;
    el.setAttribute("data-id", car.id);
    el.setAttribute("tabindex","0");

    const firstImg = (car.images && car.images.length ? car.images[0] : `https://source.unsplash.com/1200x750/?car&sig=${car.id}`);
    const priceToShow = state.currencyDisplay==="USD" ? formatPriceUSD(car.priceUSD) : formatPriceDOP(car.priceDOP);

    el.innerHTML = `
      <div class="card__media">
        <img src="${firstImg}" alt="${car.brand} ${car.model} ${car.year}">
      </div>
      <div class="card__body">
        <h3 class="card__title">${car.brand} ${car.model} ${car.year}</h3>
        <div class="card__meta">
          <span class="price">${priceToShow}</span>
          <span>${car.km ? (nfDO.format(car.km) + " km") : ""}</span>
          <span>${car.transmission || ""}</span>
        </div>
      </div>
      <div class="card__footer">
        <a class="btn btn--outline" target="_blank" rel="noopener" href="https://wa.me/18096222328?text=Hola%20Kiki%20Auto,%20me%20interesa%20${encodeURIComponent(car.brand+' '+car.model+' '+car.year)}">WhatsApp</a>
        <a class="btn open-details" href="#vehiculo-${car.id}" data-id="${car.id}">Ver detalles</a>
      </div>
    `;
    cards.appendChild(el);
  });

  // Mostrar/ocultar "Cargar más"
  if(btnLoadMore){
    btnLoadMore.classList.toggle("hidden", end >= total || total===0);
  }

  if(total===0){
    cards.innerHTML = `<p class="muted">No encontramos resultados con esos filtros.</p>`;
  }
}

/* Listeners de filtros */
if(q){ q.addEventListener("input", e => { state.q = e.target.value; state.page = 1; renderCars(true); }); }
if(currencySel){
  currencySel.addEventListener("change", e => {
    state.currencyDisplay = e.target.value;
    state.page = 1;
    populatePriceOptions();
    state.priceRange = "all";
    renderCars(true);
  });
}
if(brandSel){ brandSel.addEventListener("change", e => { state.brand = e.target.value; state.page = 1; renderCars(true); }); }
if(priceRange){ priceRange.addEventListener("change", e => { state.priceRange = e.target.value; state.page = 1; renderCars(true); }); }

if(btnLoadMore){
  btnLoadMore.addEventListener("click", ()=>{
    state.page++; // +10 por clic
    renderCars();
  });
}
if(btnClear){
  btnClear.addEventListener("click", (e)=>{
    e.preventDefault();
    if(q) q.value="";
    if(currencySel) currencySel.value="DOP";
    state.currencyDisplay="DOP";
    populatePriceOptions();
    if(priceRange) priceRange.value="all";
    if(brandSel) brandSel.value="all";
    state={...state, page:1, q:"", brand:"all", priceRange:"all"};
    renderCars(true);
  });
}

/* Inicializar inventario */
populatePriceOptions();
renderCars(true);

/* =================== Estado “Abierto ahora” =================== */
function parseHM(hm){ const [h,m]=hm.split(":").map(Number); const d=new Date(); d.setHours(h,m,0,0); return d; }
function formatHM(d){ return d.toLocaleTimeString('es-DO', {hour:'2-digit', minute:'2-digit'}); }
function updateOpenStatus(){
  const el = $("#openStatus");
  if(!el) return;
  const now = new Date();
  const day = now.getDay();
  const range = HOURS[day];
  if(!range){
    let offset=1, nextRange=null;
    while(offset<=7){ const d=(day+offset)%7; if(HOURS[d]){ nextRange={day:d, range:HOURS[d]}; break; } offset++; }
    let label="Cerrado ahora";
    if(nextRange){ label += ` · Abre ${["dom","lun","mar","mié","jue","vie","sáb"][nextRange.day]} ${nextRange.range[0]}`; }
    el.textContent=label; return;
  }
  const start=parseHM(range[0]), end=parseHM(range[1]);
  if(now>=start && now<=end){ el.textContent=`Abierto ahora · Hoy ${formatHM(start)}–${formatHM(end)}`; }
  else{
    let label=`Cerrado ahora · Hoy ${formatHM(start)}–${formatHM(end)}`; if(now<start){ label+=` · Abre ${formatHM(start)}`; }
    el.textContent=label;
  }
}
updateOpenStatus(); setInterval(updateOpenStatus, 60*1000);

/* =================== Toast =================== */
function showToast(msg){
  const t = $("#toast");
  if(!t) return;
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(()=>t.classList.add("hidden"), 3500);
}

/* =================== Modal de Detalles con Carrusel =================== */
const modal = $("#modal");
const modalOverlay = modal?.querySelector(".modal__overlay");
const modalCloseBtn = modal?.querySelector(".modal__close");
const titleEl = $("#modalTitle");
const priceEl = $("#modalPrice");
const specsEl = $("#modalSpecs");
const descEl = $("#modalDesc");
const whatsEl = $("#modalWhats");
const mainImg = $("#modalMainImg");
const thumbs = $("#modalThumbs");
const prevBtn = $("#prevImg");
const nextBtn = $("#nextImg");
const shareBtn = $("#shareBtn");
const stage = $("#carouselStage");
const countEl = $("#carouselCount");

let current = { car:null, index:0, images:[] };
let keyNavHandler = null;
let onDownHandler = null;
let onUpHandler = null;

function updateCount(){
  if(countEl && current.images.length){
    countEl.textContent = `${current.index+1}/${current.images.length}`;
  }
}

function openModal(id){
  const car = CARS.find(c=>c.id===+id);
  if(!car){ showToast("Vehículo no encontrado"); return; }
  current.car = car;
  current.index = 0;
  current.images = (car.images && car.images.length ? car.images : ["https://source.unsplash.com/1200x750/?car&sig=r"]);

  // Título y precio según moneda elegida
  if(titleEl) titleEl.textContent = `${car.brand} ${car.model} ${car.year}`;
  const cur = state.currencyDisplay;
  const priceShown = (cur==="USD") ? formatPriceUSD(car.priceUSD) : formatPriceDOP(car.priceDOP);
  if(priceEl) priceEl.textContent = priceShown;

  // Especificaciones
  if(specsEl){
    const specItems = [
      ["Kilometraje", car.km ? `${nfDO.format(car.km)} km` : "—"],
      ["Transmisión", car.transmission || "—"],
      ["Combustible", car.fuel || "—"],
      ["Tracción", car.drive || "—"],
      ["Carrocería", car.body || "—"],
      ["Color", car.color || "—"]
    ];
    specsEl.innerHTML = specItems.map(([k,v])=>`<li><strong>${k}:</strong> ${v}</li>`).join("");
  }

  // Descripción
  if(descEl) descEl.innerHTML = `<h3 style="margin:.2rem 0 .6rem">Descripción</h3><p class="muted">${car.description || "Sin descripción."}</p>`;

  // WhatsApp CTA
  if(whatsEl) whatsEl.href = `https://wa.me/18096222328?text=${encodeURIComponent(`Hola Kiki Auto, me interesa: ${car.brand} ${car.model} ${car.year} (${priceShown})`)}`;

  // Thumbs + imagen principal
  if(thumbs){
    thumbs.innerHTML = current.images.map((src,i)=>`<img src="${src}" alt="Miniatura ${i+1}" data-i="${i}">`).join("");
  }
  function renderMain(){
    if(mainImg){
      mainImg.src = current.images[current.index];
      mainImg.alt = `${car.brand} ${car.model} ${car.year} – foto ${current.index+1}`;
    }
    if(thumbs){
      [...thumbs.querySelectorAll("img")].forEach((t,i)=>{ t.classList.toggle("active", i===current.index); });
    }
    updateCount();
  }
  renderMain();

  // Thumbs click
  if(thumbs){
    thumbs.querySelectorAll("img").forEach(img=>{
      img.addEventListener("click", ()=>{ current.index = +img.dataset.i; renderMain(); });
    });
  }

  // Nav prev/next + teclado
  if(prevBtn) prevBtn.onclick = ()=>{ current.index = (current.index-1+current.images.length)%current.images.length; renderMain(); };
  if(nextBtn) nextBtn.onclick = ()=>{ current.index = (current.index+1)%current.images.length; renderMain(); };

  keyNavHandler = (e)=>{
    if(!modal?.classList.contains("open")) return;
    if(e.key==="ArrowLeft") prevBtn?.click();
    if(e.key==="ArrowRight") nextBtn?.click();
    if(e.key==="Escape") closeModal();
  };
  document.addEventListener("keydown", keyNavHandler);

  // Swipe en móvil
  let startX=null;
  onDownHandler = e => { startX = (e.touches? e.touches[0].clientX : e.clientX); };
  onUpHandler = e => {
    if(startX===null) return;
    const x = (e.changedTouches? e.changedTouches[0].clientX : e.clientX);
    const dx = x - startX;
    if(Math.abs(dx) > 50){ dx>0 ? prevBtn?.click() : nextBtn?.click(); }
    startX = null;
  };
  if(stage){
    stage.addEventListener("pointerdown", onDownHandler);
    stage.addEventListener("pointerup", onUpHandler);
    stage.addEventListener("touchstart", onDownHandler, {passive:true});
    stage.addEventListener("touchend", onUpHandler);
  }

  // Compartir
  if(shareBtn){
    shareBtn.onclick = async ()=>{
      const text = `${car.brand} ${car.model} ${car.year} – ${priceShown}`;
      if(navigator.share){
        try{ await navigator.share({ title: titleEl?.textContent || "Vehículo", text, url: location.href }); }catch(_e){}
      }else{
        try{ await navigator.clipboard.writeText(text); showToast("Información copiada."); }catch(_e){ showToast("No se pudo copiar."); }
      }
    };
  }

  // Abrir modal
  modal?.classList.add("open");
  document.body.style.overflow = "hidden";
  modalCloseBtn?.focus();
}

function closeModal(){
  modal?.classList.remove("open");
  document.body.style.overflow = "";
  if(keyNavHandler){ document.removeEventListener("keydown", keyNavHandler); keyNavHandler = null; }
  if(stage && onDownHandler){ stage.removeEventListener("pointerdown", onDownHandler); stage.removeEventListener("touchstart", onDownHandler); onDownHandler = null; }
  if(stage && onUpHandler){ stage.removeEventListener("pointerup", onUpHandler); stage.removeEventListener("touchend", onUpHandler); onUpHandler = null; }
  if(history.pushState){
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }else{
    location.hash = "";
  }
}
modalOverlay?.addEventListener("click", closeModal);
modalCloseBtn?.addEventListener("click", closeModal);

/* Abrir modal desde tarjetas (clic en tarjeta o botón) */
if(cards){
  cards.addEventListener("click", (e)=>{
    const btn = e.target.closest(".open-details");
    if(btn){ /* el hash ya lleva #vehiculo-ID */ return; }
    const a = e.target.closest("a");
    if(a && a.href && a.href.includes("wa.me")) return; // no interceptar WhatsApp
    const card = e.target.closest(".card");
    if(card && card.dataset.id){
      location.hash = `vehiculo-${card.dataset.id}`;
    }
  });
  // Teclado
  cards.addEventListener("keydown", (e)=>{
    if((e.key==="Enter" || e.key===" ") && e.target.classList.contains("card")){
      e.preventDefault();
      location.hash = `vehiculo-${e.target.dataset.id}`;
    }
  });
}

/* Abrir modal por hash (#vehiculo-3) */
function idFromHash(){ const m = location.hash.match(/^#?vehiculo-(\d+)$/i); return m ? Number(m[1]) : null; }
function handleHash(){ const id = idFromHash(); if(id){ openModal(id); } else if(modal && modal.classList.contains("open")){ closeModal(); } }
window.addEventListener("hashchange", handleHash);
handleHash();

/* =================== MINI CHAT ENTRENABLE ===================
   - Responde saludos, financiamiento, requisitos, mapa, horario,
     inventario (por tipo/marca), contacto, abrir vehículo.
   - Confirmaciones: si hay una oferta pendiente y dices “sí/ok/oky/
     yes/dale/claro…”, ejecuta la acción inmediatamente.
   - Botones (data-open="vehiculo-#") abren el modal desde el chat.
   =========================================================== */

const RANDOM_GREETINGS = [
  "¡Hola! 👋 ¿En qué te ayudo hoy?",
  "¡Bienvenido a Kiki Auto! 🚗",
  "¡Hola! ¿Buscas algo en específico?",
  "¡Qué tal! Soy el asistente de Kiki Auto.",
  "¡Buenas! ¿Te muestro opciones de vehículos?"
];

const chat = $("#chat");
const chatMsgs = $("#chatMessages");
const chatForm = $("#chatForm");
const chatInput = $("#chatInput");
const chatToggle = $("#waToggle");
const chatClose = $("#chatClose");

let chatState = { activeFlow:null, stepIndex:0, answers:{} };
let pendingOffer = null; // {type, payload}

/* ====== Botones del chat y quick actions ====== */
function openChat(){
  chat?.classList.add("open");
  if(chatMsgs && chatMsgs.children.length===0){
    botSay({
      type:"html",
      html:`<div>${RANDOM_GREETINGS[Math.floor(Math.random()*RANDOM_GREETINGS.length)]}</div>
      <div class="quick" style="margin-top:.5rem">
        <button data-start="recomendador">Recomiéndame un vehículo</button>
        <button data-intent="show-inventory">Inventario</button>
        <button data-intent="show-map">Mapa</button>
        <button data-k="financiamiento">Financiamiento</button>
        <button data-k="contacto">Contacto</button>
      </div>`
    });
  }
}
function closeChat(){ chat?.classList.remove("open"); }

chatToggle?.addEventListener("click", openChat);
chatClose?.addEventListener("click", closeChat);

chatMsgs?.addEventListener("click", (e)=>{
  if(e.target.matches(".quick button[data-start]")){
    startFlow(e.target.dataset.start);
  }else if(e.target.matches(".quick button[data-k]")){
    const k = e.target.dataset.k;
    userSay(k);
    respondTo(k);
  }else if(e.target.matches(".quick button[data-intent]")){
    const intent = e.target.dataset.intent;
    userSay(e.target.textContent || intent);
    if(intent === "show-inventory") {
      ACTIONS.showInventory({});
    } else if(intent === "show-map"){
      ACTIONS.showMap();
    }
  }else if(e.target.matches("[data-open^='vehiculo-']")){
    const id = Number((e.target.getAttribute("data-open")||"").replace("vehiculo-",""));
    if(id) openModal(id);
  }
});

/* Envío del formulario del chat */
chatForm?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const text = (chatInput?.value || "").trim();
  if(!text) return;
  userSay(text);
  chatInput.value = "";
  respondTo(text);
});

/* ====== Utilidades del chat ====== */
function userSay(text){
  if(!chatMsgs) return;
  const div = document.createElement("div");
  div.className="msg user";
  div.textContent = text;
  chatMsgs.appendChild(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}
function botSay(payload){
  if(!chatMsgs) return;
  const wrap = document.createElement("div");
  wrap.className="msg bot";
  if(typeof payload === "string"){
    wrap.textContent = payload;
  }else if(payload.type==="html"){
    wrap.innerHTML = payload.html;
  }else if(payload.type==="kb"){
    wrap.innerHTML = `<div>${payload.text}</div>`;
    if(payload.media && payload.media.length){
      payload.media.forEach(m=>{
        const mdiv = document.createElement("div");
        mdiv.className="media";
        mdiv.innerHTML = `<img src="${m.src}" alt="${m.caption||''}">${m.caption?`<div style="padding:.4rem .5rem">${m.caption}</div>`:""}`;
        wrap.appendChild(mdiv);
      });
    }
    if(payload.links && payload.links.length){
      const ldiv = document.createElement("div");
      ldiv.className="links";
      ldiv.innerHTML = payload.links.map(l=>`<a target="_blank" rel="noopener" href="${l.url}">${l.text}</a>`).join(" · ");
      wrap.appendChild(ldiv);
    }
  }
  chatMsgs.appendChild(wrap);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

/* ====== Detección afirmaciones/negaciones ====== */
const YES_RE = /^\s*(si|sí|ok|okay|oky|dale|claro|perfecto|va|de una|yes|yep|yeah|correcto|affirmative)\s*[.!?]*\s*$/i;
const NO_RE  = /^\s*(no|nop|nel|no gracias|ahora no|luego)\s*[.!?]*\s*$/i;

/* ====== Acciones que el bot puede ejecutar ====== */
const ACTIONS = {
  showMap(){
    botSay({
      type:"kb",
      text:"Estamos en Av. Jacobo Majluta #70, Marañon II, Santo Domingo Norte.",
      links:[{text:"Abrir en Google Maps", url:"https://maps.google.com/?q=Av.+Jacobo+Majluta+70+Santo+Domingo+Norte"}],
      media:[{src:"https://source.unsplash.com/800x500/?map,location&sig=900", caption:"Ubicación referencial"}]
    });
    clearOffer();
  },

  showRequirements(){
    botSay({
      type:"kb",
      text:"Para evaluar financiamiento pedimos: cédula, carta laboral o RNC, últimos 3 extractos bancarios y recibo de ingresos.",
      links:[{text:"Enviar por WhatsApp", url:"https://wa.me/18096222328"}],
      media:[{src:"https://source.unsplash.com/800x500/?documents,paper&sig=901", caption:"Requisitos básicos"}]
    });
    clearOffer();
  },

  showFinancing(){
    botSay({
      type:"kb",
      text:"Ofrecemos financiamiento con aprobación rápida. Inicial típico 20%–30%, plazos 24–60 meses (según perfil y banco).",
      links:[{text:"Simular por WhatsApp", url:"https://wa.me/18096222328"}],
      media:[{src:"https://source.unsplash.com/800x500/?car,keys&sig=902", caption:"Te ayudamos a estrenar rápido"}]
    });
    // Ofrecer requisitos
    offer("showRequirements", null, "¿Te muestro los requisitos para aplicar?");
  },

  showContact(){
    botSay({
      type:"kb",
      text:"Puedes escribir o llamar ahora mismo.",
      links:[
        {text:"WhatsApp", url:"https://wa.me/18096222328"},
        {text:"Llamar 809-622-2328", url:"tel:+18096222328"},
        {text:"Email", url:"mailto:kikiautord@gmail.com"}
      ]
    });
    clearOffer();
  },

  showInventory({brand=null, body=null}={}){
    // Filtrar según parámetros (marca o tipo de carrocería)
    let list = [...CARS];
    if(brand) list = list.filter(c=>c.brand.toLowerCase()===brand.toLowerCase());
    if(body)  list = list.filter(c=> (c.body||"").toLowerCase()===body.toLowerCase());

    if(list.length===0){
      botSay("No encontré vehículos con ese criterio. ¿Te muestro todo el inventario?");
      offer("showInventory", {}, null); // volver a ofrecer todo
      return;
    }

    // Mostrar hasta 6 en el chat, con botones para abrir el modal
    const items = list.slice(0,6).map(c=>{
      const priceShown = (state.currencyDisplay==="USD") ? formatPriceUSD(c.priceUSD) : formatPriceDOP(c.priceDOP);
      const img = (c.images && c.images[0]) || `https://source.unsplash.com/1200x750/?car&sig=${c.id}`;
      return `
        <div class="sugg" style="display:grid;grid-template-columns:72px 1fr;gap:.6rem;align-items:center;margin:.4rem 0">
          <img src="${img}" alt="${c.brand} ${c.model}" style="width:72px;height:48px;object-fit:cover;border-radius:8px;border:1px solid #223"/>
          <div>
            <div><strong>${c.brand} ${c.model} ${c.year}</strong> – ${priceShown}</div>
            <div class="links">
              <a href="#vehiculo-${c.id}">Ver detalles</a> ·
              <button data-open="vehiculo-${c.id}" style="background:transparent;border:1px solid #2a3b5f;border-radius:10px;color:#cfe7ff;padding:.15rem .45rem;cursor:pointer">Abrir aquí</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    botSay({type:"html", html:`<div>Aquí tienes opciones:</div>${items}`});
    // Si se filtró por marca/tipo, ofrecer ver “todo”
    if(brand || body){
      offer("showInventory", {}, "¿Quieres que te muestre todo el inventario?");
    }else{
      clearOffer();
    }
  },

  showVehicle(id){
    const car = CARS.find(c=>c.id===Number(id));
    if(!car){ botSay("No encuentro ese vehículo. ¿Quieres ver el inventario completo?"); offer("showInventory", {}); return; }
    // Abrir modal directamente
    openModal(car.id);
    botSay({type:"html", html:`Abriendo <strong>${car.brand} ${car.model} ${car.year}</strong>…`});
    clearOffer();
  },

  showGallery(id){
    const car = CARS.find(c=>c.id===Number(id));
    if(!car){ botSay("No encuentro ese vehículo para la galería."); return; }
    const thumbs = (car.images||[]).slice(0,6).map(src=>`<img src="${src}" alt="Foto" style="width:100%;height:auto;border-radius:8px;border:1px solid #223">`);
    botSay({type:"html", html:`<div>Galería rápida de <strong>${car.brand} ${car.model}</strong>:</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem;margin-top:.4rem">${thumbs.join("")}</div>`});
    // Ofrecer abrir modal
    offer("showVehicle", car.id, "¿Quieres abrir los detalles en grande?");
  }
};

/* ====== Ofertas/confirmaciones ====== */
function offer(type, payload=null, promptText=null){
  pendingOffer = {type, payload};
  if(promptText){
    botSay({type:"html", html:`<div>${promptText}</div><div class="quick" style="margin-top:.4rem"><button data-confirm="yes">Sí</button><button data-confirm="no">No</button></div>`});
  }
}
function clearOffer(){ pendingOffer = null; }

/* Botones de confirmación en ofertas */
chatMsgs?.addEventListener("click", (e)=>{
  if(e.target.matches("button[data-confirm]")){
    const v = e.target.getAttribute("data-confirm");
    if(v==="yes" && pendingOffer){
      const act = pendingOffer.type, pl = pendingOffer.payload;
      const fn = ACTIONS[act];
      clearOffer();
      if(typeof fn==="function"){ fn(pl); }
    }else{
      clearOffer();
      botSay("¡Listo! Si necesitas otra cosa, dime.");
    }
  }
});

/* ====== Conocimiento base + intenciones ====== */
const KB = [
  { keys:["hola","buenas","saludo","hey","qué tal","que tal"], reply:()=> RANDOM_GREETINGS[Math.floor(Math.random()*RANDOM_GREETINGS.length)] },
  { keys:["contacto","tel","telefono","whatsapp","email","correo"], action:()=>ACTIONS.showContact() },
  { keys:["ubicacion","ubicación","direccion","dirección","donde estan","dónde están","mapa"], action:()=>ACTIONS.showMap() },
  { keys:["horario","abren","abiertos","cierran","hora"], reply: () => $("#openStatus")?.textContent || "Lun–Vie: 9:00–18:00 · Sáb: 9:00–14:00 · Dom: Cerrado" },
  { keys:["requisitos","documentos","papeles"], action:()=>ACTIONS.showRequirements() },
  { keys:["financiamiento","credito","crédito","cuotas","prestamo","préstamo","banco"], action:()=>ACTIONS.showFinancing() },
  { keys:["inventario","carros","vehiculos","vehículos","autos"], action:()=>ACTIONS.showInventory({}) },
];

/* ====== Parser de comandos naturales ====== */
function parseCommand(text){
  const t = text.toLowerCase();

  // Afirmación/negación para ofertas pendientes
  if(pendingOffer && YES_RE.test(t)) return {intent:"confirm-yes"};
  if(pendingOffer && NO_RE.test(t))  return {intent:"confirm-no"};

  // Afirmaciones generales (sin oferta): mostrar inventario
  if(YES_RE.test(t)) return {intent:"fallback-yes"};
  if(NO_RE.test(t))  return {intent:"fallback-no"};

  // Mostrar algo (comandos directos)
  if(/(muestrame|muéstrame|muestra|ensename|enséñame|ver|verme|quiero ver|ensena|enséname)/.test(t)){
    if(/mapa|ubicaci[oó]n|direccion|direcci[oó]n/.test(t)) return {intent:"show-map"};
    if(/inventario|carros|veh[ií]culos|autos|todo/.test(t)){
      // por marca o tipo
      const body = /\b(suv|sed[aá]n|hatchback|pickup|camioneta)\b/i.exec(t)?.[1];
      const brand = /\b(chevrolet|toyota|nissan|kia|honda|hyundai|ford|bmw|mercedes|audi)\b/i.exec(t)?.[1];
      return {intent:"show-inventory", params:{body: body?capitalize(body):null, brand: brand?capitalize(brand):null}};
    }
    if(/veh[ií]culo\s*(\d{1,5})/.test(t)) {
      const id = Number(t.match(/veh[ií]culo\s*(\d{1,5})/)[1]);
      return {intent:"show-vehicle", params:{id}};
    }
    if(/galer[ií]a|fotos?/.test(t) && /(\d{1,5})/.test(t)){
      const id = Number(t.match(/(\d{1,5})/)[1]);
      return {intent:"show-gallery", params:{id}};
    }
    if(/requisitos/.test(t)) return {intent:"show-requirements"};
    if(/financiamiento|cr[eé]dito|cuotas?/.test(t)) return {intent:"show-financing"};
    if(/contacto|whatsapp|tel[eé]fono|email|correo/.test(t)) return {intent:"show-contact"};
  }

  // Filtros simples por marca/tipo sin verbo
  const mBody = /\b(suv|sed[aá]n|hatchback|pickup|camioneta)\b/i.exec(t);
  if(mBody) return {intent:"show-inventory", params:{body: capitalize(mBody[1])}};
  const mBrand = /\b(chevrolet|toyota|nissan|kia|honda|hyundai|ford|bmw|mercedes|audi)\b/i.exec(t);
  if(mBrand) return {intent:"show-inventory", params:{brand: capitalize(mBrand[1])}};

  // Arrancar recomendador
  if(/recomi|suger|ayuda.*vehic|quiero.*vehic|c[uú]al me conviene/i.test(t)){
    return {intent:"start-flow", params:{name:"recomendador"}};
  }

  // KB simple
  for(const item of KB){
    if(item.keys.some(k=>t.includes(k))) return {intent:"kb", params:{item}};
  }

  return {intent:"none"};
}
function capitalize(s){ return s ? s[0].toUpperCase()+s.slice(1).toLowerCase() : s; }

/* ====== Respuesta principal ====== */
function respondTo(text){
  // Flujo activo (recomendador)
  if(chatState.activeFlow){
    const flow = BOT_FLOWS[chatState.activeFlow];
    const step = flow.steps[chatState.stepIndex];
    chatState.answers[step.id] = text;
    chatState.stepIndex++;

    if(chatState.stepIndex < flow.steps.length){
      const next = flow.steps[chatState.stepIndex];
      botSay(next.text);
    }else{
      const res = flow.onFinish(chatState.answers);
      chatState = {activeFlow:null, stepIndex:0, answers:{}};
      if(res.type==="text") botSay(res.text);
      else if(res.type==="html") botSay({type:"html", html:res.html});
    }
    return;
  }

  // Parsear intención
  const {intent, params} = parseCommand(text);

  // Confirmaciones
  if(intent==="confirm-yes"){
    const act = pendingOffer?.type;
    const pl  = pendingOffer?.payload;
    const fn  = act ? ACTIONS[act] : null;
    clearOffer();
    if(typeof fn==="function"){ fn(pl); } else { botSay("¡Listo!"); }
    return;
  }
  if(intent==="confirm-no"){
    clearOffer();
    botSay("Sin problema. ¿Quieres que te muestre el inventario o el mapa?");
    return;
  }

  // Afirmación sin oferta -> sugerir inventario
  if(intent==="fallback-yes"){
    ACTIONS.showInventory({});
    return;
  }
  if(intent==="fallback-no"){
    botSay("Ok. Si necesitas algo, dime “inventario”, “mapa” o “financiamiento”.");
    return;
  }

  // Intenciones directas
  if(intent==="show-map"){ ACTIONS.showMap(); return; }
  if(intent==="show-requirements"){ ACTIONS.showRequirements(); return; }
  if(intent==="show-financing"){ ACTIONS.showFinancing(); return; }
  if(intent==="show-contact"){ ACTIONS.showContact(); return; }
  if(intent==="show-inventory"){ ACTIONS.showInventory(params||{}); return; }
  if(intent==="show-vehicle"){ ACTIONS.showVehicle(params.id); return; }
  if(intent==="show-gallery"){ ACTIONS.showGallery(params.id); return; }
  if(intent==="start-flow"){ startFlow(params.name); return; }

  // KB
  if(intent==="kb"){
    const it = params.item;
    if(it.action){ it.action(); return; }
    if(it.reply){
      const out = (typeof it.reply==="function")? it.reply() : it.reply;
      botSay(out);
      // Ofrecer algo relacionado si aplica
      if(it.keys.includes("financiamiento")) offer("showRequirements", null, "¿Te muestro los requisitos?");
      return;
    }
  }

  // Fallback robusto
  botSay({
    type:"html",
    html:`No estoy seguro de eso, pero puedo ayudarte con:<div class="quick" style="margin-top:.4rem">
      <button data-intent="show-inventory">Ver inventario</button>
      <button data-intent="show-map">Ver mapa</button>
      <button data-k="financiamiento">Financiamiento</button>
      <button data-k="contacto">Contacto</button>
    </div>`
  });
}

/* ====== Flujo de recomendación ====== */
const BOT_FLOWS = {
  recomendador: {
    steps: [
      {id:"budget", text:"¿Cuál es tu presupuesto? (ej: 900000 o $18000)"},
      {id:"use", text:"¿Uso principal? (ciudad / familia / trabajo / viajar)"},
      {id:"fuel", text:"¿Prefieres gasolina o diésel? (o cualquiera)"},
      {id:"trans", text:"¿Transmisión automática o manual? (o cualquiera)"}
    ],
    onFinish: (answers)=>{
      // Presupuesto a DOP
      let budgetDOP = null;
      const b = (answers.budget||"").toString().trim();
      if(b.startsWith("$")) budgetDOP = Math.round(parseFloat(b.replace(/[^0-9.]/g,"")) * EXCHANGE_RATE);
      else budgetDOP = parseInt(b.replace(/\D/g,"") || "0",10);

      const wantFuel = (answers.fuel||"").toLowerCase();
      const wantTrans = (answers.trans||"").toLowerCase();
      const use = (answers.use||"").toLowerCase();

      // Scoring simple
      const scored = CARS.map(c=>{
        let score = 0;
        if(budgetDOP>0){
          const price = c.priceDOP;
          const diff = Math.abs(price - budgetDOP) / Math.max(price, budgetDOP);
          score += (diff <= 0.15) ? 3 : (diff <= 0.30 ? 1 : 0);
        } else { score += 1; }

        if(wantFuel && wantFuel!=="cualquiera" && c.fuel) {
          if(c.fuel.toLowerCase().includes(wantFuel)) score += 2;
        } else score += 1;

        if(wantTrans && wantTrans!=="cualquiera" && c.transmission){
          if(c.transmission.toLowerCase().includes(wantTrans)) score += 2;
        } else score += 1;

        if(use){
          if(use.includes("famil") && c.body==="SUV") score += 2;
          if(use.includes("ciudad") && (c.body==="Hatchback"||c.body==="Sedán")) score += 2;
          if(use.includes("viaj") && (c.drive==="4x4"||c.body==="SUV")) score += 2;
          if(use.includes("trab") && (c.body!=="Coupé")) score += 1;
        }

        return {car:c, score};
      }).sort((a,b)=>b.score-a.score).slice(0,3);

      if(scored.length===0) return {type:"text", text:"No encontré opciones con esos criterios. Pruébalo con otro presupuesto o preferencias."};

      // Auto-abrir el mejor y listar top 3
      const best = scored[0].car;
      setTimeout(()=>{ openModal(best.id); }, 300);

      const html = scored.map(({car})=>{
        const priceShown = (state.currencyDisplay==="USD") ? formatPriceUSD(car.priceUSD) : formatPriceDOP(car.priceDOP);
        return `
          <div class="sugg" style="display:grid;grid-template-columns:72px 1fr;gap:.6rem;align-items:center;margin:.4rem 0">
            <img src="${(car.images&&car.images[0])||`https://source.unsplash.com/1200x750/?car&sig=${car.id}`}" style="width:72px;height:48px;object-fit:cover;border-radius:8px;border:1px solid #223" alt="${car.brand}">
            <div>
              <div><strong>${car.brand} ${car.model} ${car.year}</strong> – ${priceShown}</div>
              <div class="links">
                <a href="#vehiculo-${car.id}">Ver detalles</a> ·
                <button data-open="vehiculo-${car.id}" style="background:transparent;border:1px solid #2a3b5f;border-radius:10px;color:#cfe7ff;padding:.15rem .45rem;cursor:pointer">Abrir aquí</button>
              </div>
            </div>
          </div>
        `;
      }).join("");

      return {type:"html", html:`<div>Te recomiendo estas opciones:</div>${html}`};
    }
  }
};

/* ====== Inicio/atajos ====== */
const BOT_KB = []; // (mantenemos KB ligera porque usamos parseCommand+KB)
function startFlow(name){
  const flow = BOT_FLOWS[name];
  if(!flow) return;
  chatState = {activeFlow:name, stepIndex:0, answers:{}};
  botSay(flow.steps[0].text);
}

