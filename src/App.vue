<template>
  <div>
    <!-- Home Screen -->
    <div v-if="!isGameStarted" id="home">
      <h1 class="app-title">A cosa giochiamo?</h1>
      <div id="categories">
        <label v-for="(category, index) in categories" :key="index">
          <input 
            type="radio" 
            name="category" 
            :value="category" 
            v-model="selectedCategory" 
            :class="{ active: selectedCategory === category }" 
          />
          <span>{{ categoryLabels[category] }}</span>
        </label>
      </div>
      <button @click="startGame" id="start-button">Iniziamo</button>
      <a href="#" class="home-button" @click.prevent="settings">Settings</a>

    </div>

    <!-- Game Screen -->
    <div v-else id="content">
      <h1 v-if="currentPhrase" id="text">{{ currentPhrase }}</h1>

      <button 
          class="countdown-button" 
          @click="startCountdown" 
        >
          {{ countdownActive ? countdown  : 'Start Timer' }}
        </button>
        

      <div
        v-if="selectedCategory === 'cracklist'"
        id="cracklist-words"
        :class="['cracklist-card', { flip: flipped, shuffle: isShuffling }]"
      >
        <div class="card-inner">
          <!-- Fronte -->
          <div class="card-front">
            <div 
              v-for="(word, index) in randomWords" 
              :key="index"
              class="word"
              :class="{ active: activeWordIndex === index }"
              @click="activeWordIndex = index"
            >
              {{ word }}
            </div>
          </div>

          <!-- Retro -->
          <div class="card-back">
            <img src="/back.png" alt="Immagine retro" />
          </div>
        </div>

      
        <button @click="loadRandomPhrase" class="shuffle-button">Shuffle</button>
      </div>


      <a href="#" class="home-button" @click.prevent="goHome">Home</a>
    </div>


<!-- SETTINGS MODAL -->
<div v-if="showSettings" class="settings-modal">
  <div class="settings-content">
    <h2>Modifica Frasi</h2>

    <!-- Tabs -->
    <div class="settings-tabs">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectCategory(cat)"
        :class="{ active: selectedTab === cat }"
      >
        {{ cat.replace(/_/g, ' ') }}
      </button>
    </div>

    <!-- Textarea per la categoria attiva -->
    <textarea v-model="newPhrasesText" placeholder="Inserisci frasi, una per riga"></textarea>

    <div class="settings-actions">
      <button @click="saveSettings">Salva</button>
      <button @click="closeSettings">Chiudi</button>
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const categories = ['cracklist', 'verita_pegno', 'picolo', 'non_ho_mai', 'chi_e_piu_propenso_a', 'gioco_della_bottiglia', 'fai'];
const categoryLabels = {
  cracklist: 'Cracklist',
  verita_pegno: 'Verità o pegno',
  picolo: 'Picolo',
  non_ho_mai: 'Non Ho Mai',
  chi_e_piu_propenso_a: 'Chi è più propenso a',
  gioco_della_bottiglia: 'Gioco della Bottiglia',
  fai: 'FAI'
};

// Stato delle categorie caricate
const categoriesData = reactive({
  cracklist: [],
  verita_pegno: [],
  picolo: [],
  non_ho_mai: [],
  chi_e_piu_propenso_a: [],
  gioco_della_bottiglia: [],
  fai: []
});

// Stato per la selezione della categoria e del gioco
const selectedCategory = ref(null);
const isGameStarted = ref(false);
const currentPhrase = ref('Placeholder');
const randomWords = ref([]);
const isShuffling = ref(false);
const activeWordIndex = ref(null);
const flipped = ref(false);
const countdown = ref(20)
const countdownActive = ref(false)
const showSettings = ref(false)
const newPhrasesText = ref('')
const selectedTab = ref('cracklist')

let countdownInterval = null


function startCountdown() {
  // Se il timer è già attivo, resetta tutto
  if (countdownActive.value) {
    clearInterval(countdownInterval)
    countdownActive.value = false
    return
  }

  // Avvia il countdown
  countdown.value = 20
  countdownActive.value = true

  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(countdownInterval)
      countdownActive.value = false
      alert("Tempo scaduto!")
    }
  }, 1000)
}

// Funzione per caricare le frasi
async function loadPhrases(filePath) {
  try {
    const response = await fetch(`content/${filePath}`);
    if (response.ok) {
      const text = await response.text();
      return text.split('\n').filter(line => line.trim() !== '');
    } else {
      throw new Error(`Error fetching file: ${filePath}`);
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Funzione per inizializzare le categorie
async function initializeCategories() {
  for (const category of categories) {
    const saved = loadFromLocalStorage(category);
    if (saved) {
      categoriesData[category] = saved;
    } else {
      const data = await loadPhrases(`${category}.txt`);
      categoriesData[category] = data;
      saveToLocalStorage(category, data);
    }
  }
}

onMounted(() => {
  initializeCategories();
});

// Funzione per avviare il gioco
function startGame() {
  if (selectedCategory.value) {
    isGameStarted.value = true;
    loadRandomPhrase(false);
  } else {
    alert('Seleziona una categoria per continuare!');
  }
}

// Funzione per caricare una frase casuale o parole
// Funzione per caricare una frase casuale o parole
function loadRandomPhrase(flip=true) {
  activeWordIndex.value = null;

  if (selectedCategory.value === 'cracklist') {
    currentPhrase.value = null;

    if(flip){
    // Attiviamo l'animazione flip
    flipped.value = true; // <-- questa è la nuova parte

    isShuffling.value = true;

    }

    if(flip){
    // Cambiamo le parole dopo mezzo secondo
    setTimeout(() => {
      randomWords.value = getRandomPhrases(categoriesData[selectedCategory.value], 3);
    }, 300);
  }else{
    randomWords.value = getRandomPhrases(categoriesData[selectedCategory.value], 3);
  }

    // Disattiviamo l'animazione flip + shuffle
    if(flip){
         setTimeout(() => {
      flipped.value = false;
      isShuffling.value = false;
    }, 600); // Durata dell'animazione 3D
    }
 
  } else {
    currentPhrase.value = getRandomPhrases(categoriesData[selectedCategory.value], 1)[0];
  }
}

// Funzione per ottenere N frasi casuali da una lista
function getRandomPhrases(phrases, count) {
  const shuffled = phrases.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Funzione per tornare alla home
function goHome() {
  isGameStarted.value = false;
  selectedCategory.value = null;
  currentPhrase.value = 'Placeholder';
  randomWords.value = [];
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}



function settings() {
  showSettings.value = true
  loadCategoryPhrases(selectedTab.value)
}

function closeSettings() {
  showSettings.value = false
}

function selectCategory(cat) {
  selectedTab.value = cat
  loadCategoryPhrases(cat)
}

function loadCategoryPhrases(cat) {
  const phrases = categoriesData[cat] || []
  newPhrasesText.value = phrases.join('\n')
}

function saveSettings() {
  const phrases = newPhrasesText.value
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0)

  categoriesData[selectedTab.value] = phrases
  saveToLocalStorage(selectedTab.value, phrases)
  closeSettings()
}






</script>

<style scoped>
  
</style>
