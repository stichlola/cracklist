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
    </div>

    <!-- Game Screen -->
    <div v-else id="content">
      <h1 v-if="currentPhrase" id="text">{{ currentPhrase }}</h1>

      <!-- Aggiungiamo una carta con un bordo per la sezione cracklist -->
      <div v-if="selectedCategory === 'cracklist'" id="cracklist-words"    :class="['cracklist-card', { shuffle: isShuffling }]">
        <div 
  v-for="(word, index) in randomWords" 
  :key="index"
>
  <div 
    class="word" 
    :class="{ active: activeWordIndex === index }"
    @click="activeWordIndex = index"
  >
    {{ word }}
  </div>
</div>
        <button @click="loadRandomPhrase"  class="shuffle-button">Shuffle</button> <!-- Button per triggerare lo shuffle -->
      </div>

      <a href="#" class="home-button" @click.prevent="goHome">Home</a>
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
  console.log("pippo")
  initializeCategories();
});

// Funzione per avviare il gioco
function startGame() {
  if (selectedCategory.value) {
    isGameStarted.value = true;
    loadRandomPhrase();
  } else {
    alert('Seleziona una categoria per continuare!');
  }
}

// Funzione per caricare una frase casuale o parole
// Funzione per caricare una frase casuale o parole
function loadRandomPhrase() {
  activeWordIndex.value = null
  if (selectedCategory.value === 'cracklist') {
    // Prima settiamo il valore su null per nascondere la frase
    currentPhrase.value = null;
    
    // Attiviamo l'animazione shuffle
    isShuffling.value = true;
    
    // Selezioniamo le 3 parole casuali
    randomWords.value = getRandomPhrases(categoriesData[selectedCategory.value], 3);

    // Disattiviamo l'animazione dopo il tempo dell'animazione (600ms)
    setTimeout(() => {
      isShuffling.value = false;
    }, 600);
  } else {
    // Per altre categorie, carichiamo una sola frase casuale
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



</script>

<style scoped>
  
</style>
