// State Aplikasi
let currentMonth = 0; // 0 = Januari, 11 = Desember
const currentYear = 2026; // Terkunci khusus tahun 2026
let selectedDateKey = null;

// Simpan data agenda di LocalStorage browser agar tidak hilang saat di-refresh
let events = JSON.parse(localStorage.getItem('events_2026')) || {};

// Elemen DOM
const monthYearDisplay = document.getElementById('month-year-display');
const calendarDays = document.getElementById('calendar-days');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const modal = document.getElementById('event-modal');
const modalTitle = document.getElementById('modal-title');
const selectedDateText = document.getElementById('selected-date-text');
const eventInput = document.getElementById('event-input');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');
const closeBtn = document.getElementById('close-btn');

const monthNames = [
  '🍓Januari', '🍓Februari', '🍓Maret', '🍓April', '🍓Mei', '🍓Juni',
  '🍓Juli', '🍓Agustus', '🍓September', '🍓Oktober', '🍓November', '🍓Desember'
];

// Inisialisasi Tampilan
function renderCalendar() {
  monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  calendarDays.innerHTML = '';

  // Dapatkan hari pertama & jumlah hari pada bulan tersebut di tahun 2026
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Kolom kosong sebelum tanggal 1
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'empty');
    calendarDays.appendChild(emptyDiv);
  }

  // Render Tanggal
  for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dayNumber = document.createElement('span');
    dayNumber.classList.add('day-number');
    dayNumber.textContent = day;
    dayDiv.appendChild(dayNumber);

    // Kunci unik tanggal: "YYYY-MM-DD"
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Fitur [MELIHAT]: Tampilkan indikator jika ada agenda
    if (events[dateKey]) {
      const eventTag = document.createElement('div');
      eventTag.classList.add('event-indicator');
      eventTag.textContent = events[dateKey];
      dayDiv.appendChild(eventTag);
    }

    // Event Klik untuk Tambah/Edit/Hapus
    dayDiv.addEventListener('click', () => openModal(dateKey, day));

    calendarDays.appendChild(dayDiv);
  }
}

// Buka Modal Form
function openModal(dateKey, day) {
  selectedDateKey = dateKey;
  selectedDateText.textContent = `${day} ${monthNames[currentMonth]} ${currentYear}`;

  if (events[dateKey]) {
    // Fitur [MENGEDIT]: Isi input dengan agenda yang ada
    modalTitle.textContent = 'Edit Agenda';
    eventInput.value = events[dateKey];
    deleteBtn.classList.remove('hidden'); // Tampilkan tombol hapus
  } else {
    // Fitur [MENAMBAH]: Kosongkan input
    modalTitle.textContent = 'Tambah Agenda';
    eventInput.value = '';
    deleteBtn.classList.add('hidden'); // Sembunyikan tombol hapus
  }

  modal.classList.remove('hidden');
}

// Tutup Modal
function closeModal() {
  modal.classList.add('hidden');
  selectedDateKey = null;
  eventInput.value = '';
}

// Fitur [MENAMBAH] & [MENGEDIT]
saveBtn.addEventListener('click', () => {
  const text = eventInput.value.trim();
  if (selectedDateKey) {
    if (text !== '') {
      events[selectedDateKey] = text;
    } else {
      delete events[selectedDateKey];
    }
    localStorage.setItem('events_2026', JSON.stringify(events));
    renderCalendar();
    closeModal();
  }
});

// Fitur [MENGHAPUS]
deleteBtn.addEventListener('click', () => {
  if (selectedDateKey && events[selectedDateKey]) {
    delete events[selectedDateKey];
    localStorage.setItem('events_2026', JSON.stringify(events));
    renderCalendar();
    closeModal();
  }
});

// Navigasi Bulan
prevBtn.addEventListener('click', () => {
  if (currentMonth > 0) {
    currentMonth--;
    renderCalendar();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentMonth < 11) {
    currentMonth++;
    renderCalendar();
  }
});

closeBtn.addEventListener('click', closeModal);

// Jalankan kalender pertama kali
renderCalendar();