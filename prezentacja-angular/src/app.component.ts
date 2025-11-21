import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core'; 
import Papa from 'papaparse';
 // W nowoczesnym Angularze dyrektywy strukturalne (if, for) są dostępne natywnie 
 // i używamy składni @if, @for. 
 
 // Dane ankiety (na podstawie analizy CSV) 
 interface PresentationData { 
   title: string; 
   value: number; 
   description: string; 
 } 
 
 interface SegmentData { 
   title: string; 
   value1: number; 
   label1: string; 
   value2: number; 
   label2: string; 
 } 
 
 @Component({ 
   selector: 'app-root', 
   standalone: true, 
   // Zostawiamy 'imports' puste, gdyż używamy natywnych dyrektyw @if i @for 
   template: ` 
     <div class="p-4 md:p-10 lg:p-16 min-h-screen bg-gray-50 font-sans"> 
       <header class="mb-12 text-center border-b-4 border-legiaGreen pb-4 bg-white rounded-xl shadow-lg"> 
         <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"> 
           ANALIZA POSTAW AI W KLUBIE LEGIA WARSZAWA 
         </h1> 
         <p class="text-xl md:text-2xl text-indigo-700 mt-3 font-semibold"> 
           Diagnoza, Ryzyka i Potencjał Wdrożenia (Raport z Ankiety Q4 2025) 
         </p> 
       </header> 
 
       <!-- Panel Nawigacji / Statusu --> 
       <nav class="sticky top-0 z-10 bg-white shadow-xl rounded-xl mb-12 p-4 border-t-4 border-legiaGreen"> 
         <div class="flex flex-wrap justify-between items-center text-sm md:text-lg font-medium"> 
           <div (click)="scrollToSection('diagnosis')" class="cursor-pointer p-3 flex items-center transition duration-300 rounded-lg hover:bg-legiaGreen/10" 
                [class]="activeSection() === 'diagnosis' ? 'font-extrabold text-legiaGreen border-b-2 border-legiaGreen' : 'text-gray-600'"> 
             <span class="mr-2 text-2xl">1.</span> 
             Diagnoza i Potencjał ROI 
           </div> 
 
           <div (click)="scrollToSection('challenge')" class="cursor-pointer p-3 flex items-center transition duration-300 rounded-lg hover:bg-legiaGreen/10" 
                [class]="activeSection() === 'challenge' ? 'font-extrabold text-legiaGreen border-b-2 border-legiaGreen' : 'text-gray-600'"> 
             <span class="mr-2 text-2xl">2.</span> 
             Kluczowe Ryzyka 
           </div> 
 
           <div (click)="scrollToSection('action')" class="cursor-pointer p-3 flex items-center transition duration-300 rounded-lg hover:bg-legiaGreen/10" 
                [class]="activeSection() === 'action' ? 'font-extrabold text-legiaGreen border-b-2 border-legiaGreen' : 'text-gray-600'"> 
             <span class="mr-2 text-2xl">3.</span> 
             Plan Strategiczny (90 Dni) 
           </div> 
         </div> 
       </nav> 
 
       <!-- Sekcja 1: Diagnoza i Potencjał --> 
       <section id="diagnosis" (mouseenter)="setActiveSection('diagnosis')" class="mb-20 p-8 bg-white rounded-xl shadow-2xl border-t-8 border-legiaGreen"> 
         <h2 class="text-3xl font-extrabold text-legiaGreen mb-8 border-b pb-2">1. Diagnoza: Wysoki Potencjał Adopcji AI</h2> 
 
         <div class="grid lg:grid-cols-3 gap-8 mb-10"> 
           <!-- 1.1 Fakt Użycia --> 
           <div class="bg-legiaGreen/10 p-6 rounded-lg shadow-md border-l-4 border-legiaGreen"> 
             <h3 class="text-xl font-semibold text-gray-800 mb-2">Penetracja Rynkowa (Adopcja)</h3> 
             <div class="text-5xl font-extrabold text-legiaGreen">70.5%</div> 
             <p class="text-sm text-gray-600 mt-1">Używa AI zarówno w życiu prywatnym, jak i w pracy.</p> 
             <p class="mt-4 text-sm font-bold text-indigo-800">Wniosek: Potencjał Inwestycyjny jest natychmiastowy.</p> 
           </div> 
           
           <!-- 1.2 Średni Sentyment --> 
           <div class="bg-legiaGreen/10 p-6 rounded-lg shadow-md border-l-4 border-legiaGreen"> 
             <h3 class="text-xl font-semibold text-gray-800 mb-2">Dominujący Sentyment</h3> 
             <div class="text-5xl font-extrabold text-legiaGreen">73.1%</div> 
             <p class="text-sm text-gray-600 mt-1">Postrzega AI jako szansę (43.6%) lub źródło ciekawości (29.5%).</p> 
             <p class="mt-4 text-sm font-bold text-green-800">Wniosek: Inwestycja ma pełne wsparcie społeczne.</p> 
           </div> 
 
           <!-- 1.3 Ocena UX --> 
           <div class="bg-legiaGold/10 p-6 rounded-lg shadow-md border-l-4 border-legiaGold"> 
             <h3 class="text-xl font-semibold text-gray-800 mb-2">Ocena Obsługi Narzędzi (UX)</h3> 
             <div class="text-5xl font-extrabold text-legiaGold">4.32 / 5.0</div> 
             <p class="text-sm text-gray-600 mt-1">Średnia ocena prostoty i efektywności użycia AI.</p> 
             <p class="mt-4 text-sm font-bold text-purple-800">Wniosek: Niski próg wejścia technicznego.</p> 
           </div> 
         </div> 
 
         <h3 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">1.4. Segmentacja Występowania Barier (Managerowie vs. Specjaliści)</h3> 
         
         <div class="grid md:grid-cols-2 gap-6"> 
           @for (item of segmentationData(); track item.title) { 
           <div class="bg-white p-5 rounded-xl shadow-lg border-t-2 border-gray-200"> 
             <h4 class="text-xl font-bold text-indigo-700 mb-3">{{ item.title }}</h4> 
             <div class="flex justify-between text-sm font-medium mb-1"> 
               <span class="text-gray-700">{{ item.label1 }}</span> 
               <span class="text-legiaGreen font-extrabold">{{ item.value1 }}%</span> 
             </div> 
             <div class="w-full bg-legiaGreen/20 rounded-full h-2.5 mb-4"> 
               <div class="bg-legiaGreen h-2.5 rounded-full transition-all duration-700" [style.width.%]="item.value1"></div> 
             </div> 

             <div class="flex justify-between text-sm font-medium mb-1"> 
               <span class="text-gray-700">{{ item.label2 }}</span> 
               <span class="text-red-600 font-extrabold">{{ item.value2 }}%</span> 
             </div> 
             <div class="w-full bg-red-200 rounded-full h-2.5"> 
               <div class="bg-red-600 h-2.5 rounded-full transition-all duration-700" [style.width.%]="item.value2"></div> 
             </div> 
           </div> 
           } 
         </div> 

         <div class="grid md:grid-cols-2 gap-6 mt-6"> 
           <div class="bg-white p-5 rounded-xl shadow-lg border-t-2 border-gray-200">
             <h4 class="text-xl font-bold text-gray-800 mb-3">Częstotliwość użycia (per rola)</h4>
             @for (r of freqUxData(); track r.role) {
             <div class="mb-2">
               <div class="flex justify-between text-sm font-medium mb-1">
                 <span class="text-gray-700">{{ r.role }}</span>
                 <span class="text-legiaGreen font-extrabold">{{ r.freqLabel }} — {{ r.freqPct }}%</span>
               </div>
               <div class="w-full bg-legiaGreen/20 rounded-full h-2.5 mb-2">
                 <div class="bg-legiaGreen h-2.5 rounded-full transition-all duration-700" [style.width.%]="r.freqPct"></div>
               </div>
             </div>
             }
           </div>
           <div class="bg-white p-5 rounded-xl shadow-lg border-t-2 border-gray-200">
             <h4 class="text-xl font-bold text-gray-800 mb-3">Średnia ocena UX (per rola)</h4>
             @for (r of freqUxData(); track r.role) {
             <div class="flex justify-between text-sm font-medium mb-2">
               <span class="text-gray-700">{{ r.role }}</span>
               <span class="text-legiaGold font-extrabold">{{ r.avgRating }}/5.0</span>
             </div>
             }
           </div>
         </div>
         
         <!-- NOWA SEKCJA: Projekcja ROI --> 
         <h3 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 mt-12">1.5. Projekcja ROI: Potencjalny Wzrost Efektywności</h3> 
         
         <div class="grid md:grid-cols-2 gap-6"> 
             @for (item of potentialROIData(); track item.title) { 
             <div class="bg-legiaGold/10 p-6 rounded-xl shadow-lg border-l-4 border-legiaGold"> 
                 <h4 class="text-xl font-bold text-gray-800 mb-1">{{ item.title }}</h4> 
                 <div class="text-5xl font-extrabold text-legiaGold">{{ item.value }}<span class="text-3xl font-medium" [class]="item.title.includes('czasu') ? 'text-4xl' : 'text-xl'">{{ item.title.includes('czasu') ? 'h' : '%' }}</span></div> 
                 <p class="text-sm text-gray-600 mt-2">{{ item.description }}</p> 
             </div> 
             } 
         </div> 

       </section> 

       <!-- Sekcja 2: Wyzwanie --> 
       <section id="challenge" (mouseenter)="setActiveSection('challenge')" class="mb-20 p-8 bg-white rounded-xl shadow-2xl border-t-8 border-legiaRed"> 
         <h2 class="text-3xl font-extrabold text-legiaRed mb-8 border-b pb-2">2. Kluczowe Bariery Wdrożenia (Obszary Ryzyka)</h2> 
         
         <p class="text-lg text-gray-700 mb-8 font-medium"> 
           Potencjał jest blokowany przez braki w infrastrukturze i regulacjach, generując **Ryzyko Shadow AI**. 
         </p> 

         <!-- TOP 3 Bariery --> 
         <div class="space-y-6"> 
           @for (item of barrierData(); track item.title) { 
           <div class="flex flex-col md:flex-row items-start p-6 rounded-lg transition duration-300 border-l-8 shadow-md" 
                [class]="item.value > 40 ? 'bg-red-50 border-red-700' : 'bg-yellow-50 border-yellow-700'"> 
             
             <div class="w-full md:w-1/4 mb-3 md:mb-0"> 
               <span class="text-4xl font-extrabold" [class]="item.value > 40 ? 'text-red-700' : 'text-yellow-700'">{{ item.value }}%</span> 
             </div> 
             
             <div class="w-full md:w-2/4"> 
               <h4 class="font-semibold text-gray-900 text-xl mb-1">{{ item.title }}</h4> 
               <p class="text-sm text-gray-600">{{ item.description }}</p> 
             </div> 

             <div class="w-full md:w-1/4 mt-3 md:mt-0 text-right"> 
               <span class="inline-block py-1 px-3 text-xs font-semibold rounded-full bg-gray-200 text-gray-800"> 
                 AKCJA LIDERÓW 
               </span> 
             </div> 
           </div> 
           } 
         </div> 

         <!-- Sekcja Interaktywna / Głosowanie --> 
         <div class="mt-12 p-6 bg-gray-100 rounded-xl shadow-inner border-t-2 border-gray-300"> 
           <h3 class="text-xl font-bold text-legiaGreen mb-4"> 
             ❓ Pytanie Decyzyjne: Priorytet Ryzyka 
           </h3> 
           <p class="text-gray-700 mb-6 italic"> 
             "Która bariera generuje największe ryzyko strategiczne, wymagając natychmiastowej interwencji?" 
           </p> 
           
           <div class="flex flex-wrap gap-4"> 
             
             <button (click)="selectPriority('Dostęp')" 
                     [class]="priority() === 'Dostęp' ? 'bg-legiaGreen text-white shadow-lg' : 'bg-white text-legiaGreen border border-legiaGreen'" 
                     class="flex-1 min-w-[150px] py-3 px-5 rounded-xl font-bold transition hover:bg-indigo-500 hover:text-white"> 
               Ryzyko #1: Brak Dostępu 
             </button> 
             
             <button (click)="selectPriority('Bezpieczeństwo')" 
                     [class]="priority() === 'Bezpieczeństwo' ? 'bg-legiaGreen text-white shadow-lg' : 'bg-white text-legiaGreen border border-legiaGreen'" 
                     class="flex-1 min-w-[150px] py-3 px-5 rounded-xl font-bold transition hover:bg-indigo-500 hover:text-white"> 
               Ryzyko #2: Bezpieczeństwo 
             </button> 
             
             <button (click)="selectPriority('Wytyczne')" 
                     [class]="priority() === 'Wytyczne' ? 'bg-legiaGreen text-white shadow-lg' : 'bg-white text-legiaGreen border border-legiaGreen'" 
                     class="flex-1 min-w-[150px] py-3 px-5 rounded-xl font-bold transition hover:bg-indigo-500 hover:text-white"> 
               Ryzyko #3: Wytyczne Etyczne 
             </button> 
           </div> 
           
           @if (priority()) { 
           <div class="mt-6 p-4 bg-legiaGreen/10 rounded-lg text-legiaGreen font-semibold"> 
             Wybrany Priorytet: {{ priority() }}. Kolejny krok to natychmiastowe wdrożenie planu strategicznego. 
           </div> 
           } 
         </div> 
       </section> 

       <!-- Sekcja 3: Ofensywa --> 
       <section id="action" (mouseenter)="setActiveSection('action')" class="p-8 bg-gray-50 rounded-xl shadow-2xl border-t-8 border-legiaGreen"> 
         <h2 class="text-3xl font-extrabold text-legiaGreen mb-8 border-b pb-2">3. Rekomendacje Strategiczne: Plan Wdrożenia 90-Dniowego</h2> 

         <p class="text-lg text-gray-700 mb-10"> 
           Dla maksymalizacji ROI i minimalizacji ryzyka, rekomendujemy plan trójfilarowy. 
         </p> 

         <div class="grid md:grid-cols-3 gap-8"> 
           <!-- Akcja 1: Wdrożenie Techniczne --> 
           <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-legiaGreen h-full"> 
             <div class="text-4xl mb-3 text-legiaGreen">⚙️</div> 
             <h3 class="text-2xl font-bold text-gray-800 mb-3"> 
               Filar I: Wektor Inwestycyjny 
             </h3> 
             <p class="text-gray-600 mb-4"> 
               <span class="font-semibold text-indigo-700">Adresuje:</span> Brak dostępu (47.4%) 
             </p> 
             <ul class="list-disc list-inside space-y-2 text-gray-600"> 
               <li><span class="font-medium">Wybór Narzędzia:</span> Licencja Enterprise/Corporate (np. Copilot/Gemini) skupiona na **Tworzeniu Treści i Wyszukiwaniu**.</li> 
               <li><span class="font-medium">Pilot:</span> Grupa Pilotażowa 20 osób, celująca w osiągnięcie **4 godzin oszczędności czasu tygodniowo**.</li> 
               <li><span class="font-medium">Cel:</span> Zastąpienie "Shadow AI" kontrolowanym systemem.</li> 
             </ul> 
           </div> 
 
           <!-- Akcja 2: Wdrożenie Proceduralne --> 
           <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-legiaRed h-full"> 
             <div class="text-4xl mb-3 text-legiaRed">⚖️</div> 
             <h3 class="text-2xl font-bold text-gray-800 mb-3"> 
               Filar II: Ram Prawnych & Compliance 
             </h3> 
             <p class="text-gray-600 mb-4"> 
               <span class="font-semibold text-red-700">Adresuje:</span> Obawy Bezpieczeństwa (44.9%) 
             </p> 
             <ul class="list-disc list-inside space-y-2 text-gray-600"> 
               <li><span class="font-medium">Karta AI:</span> Stworzenie prostej, 4-punktowej „Karty Zasad Użycia AI”.</li> 
               <li><span class="font-medium">Wymóg:</span> Mandatoryjna akceptacja karty dla wszystkich użytkowników.</li> 
               <li><span class="font-medium">Cel:</span> Zmniejszenie ryzyka prawnego i operacyjnego.</li> 
             </ul> 
           </div> 
           
           <!-- Akcja 3: Wdrożenie Kompetencyjne (NOWY FILAR) --> 
           <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-legiaGold h-full"> 
             <div class="text-4xl mb-3 text-legiaGold">🎓</div> 
             <h3 class="text-2xl font-bold text-gray-800 mb-3"> 
               Filar III: Rozwój Kompetencji 
             </h3> 
             <p class="text-gray-600 mb-4"> 
               <span class="font-semibold text-yellow-700">Adresuje:</span> Brak Wiedzy (17.9%) 
             </p> 
             <ul class="list-disc list-inside space-y-2 text-gray-600"> 
               <li><span class="font-medium">Szkolenie 101:</span> Sesje wprowadzające z prompt engineering (jak zadawać pytania).</li> 
               <li><span class="font-medium">Masterclass dla Liderów:</span> Zarządzanie zespołem z wykorzystaniem narzędzi AI.</li> 
               <li><span class="font-medium">Cel:</span> Pełne wykorzystanie możliwości narzędzi korporacyjnych.</li> 
             </ul> 
           </div> 
         </div> 
 
         <div class="mt-12 text-center p-8 bg-legiaGreen rounded-xl shadow-2xl"> 
           <h3 class="text-3xl font-bold text-white mb-3">WEZWANIE DO AKCJI</h3> 
           <p class="text-indigo-200 text-xl"> 
             Proponowany plan trójfilarowy przekształca wysoką gotowość pracowników w bezpieczną i efektywną **przewagę strategiczną**. 
           </p> 
         </div> 
       </section> 
 
       <!-- Stopka / Koniec --> 
       <footer class="mt-16 text-center text-gray-400 text-sm"> 
         Raport Analityczny Przygotowany przez IT Support Specialist. 
       </footer> 
     </div> 
   `,
  styles: [` 
    .font-sans { 
      font-family: 'Inter', sans-serif; 
    } 
  `], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  activeSection = signal<'diagnosis'|'challenge'|'action'>('diagnosis')
  priority = signal<string | null>(null)
  rows = signal<any[][]>([])
  rowsObj = signal<Record<string, any>[]>([])
  fields: string[] = []
  

  setActiveSection(sectionId: 'diagnosis'|'challenge'|'action'): void { this.activeSection.set(sectionId) }
  scrollToSection(sectionId: 'diagnosis'|'challenge'|'action'): void { const element = document.getElementById(sectionId); if (element) { element.scrollIntoView({ behavior: 'smooth' }) } this.activeSection.set(sectionId) }
  priorityValue = computed(() => this.priority())
  selectPriority(p: string): void { this.priority.set(p) }

  segmentationData = computed<SegmentData[]>(() => [
    { title: 'Użycie AI w Pracy', value1: 75, label1: 'Managerowie i Liderzy', value2: 65, label2: 'Specjaliści i Członkowie Zespołów' },
    { title: 'Postrzeganie AI jako Szansy (Pozytywny Sentyment)', value1: 55, label1: 'Managerowie i Liderzy', value2: 40, label2: 'Specjaliści i Członkowie Zespołów' },
    { title: 'Obawy o Bezpieczeństwo Danych', value1: 52, label1: 'Managerowie i Liderzy', value2: 38, label2: 'Specjaliści i Członkowie Zespołów' }
  ])

  potentialROIData = computed<PresentationData[]>(() => [
    { title: 'Potencjalna Oszczędność Czasu', value: 4, description: 'Średnia liczba godzin zaoszczędzonych tygodniowo na pracownika pilotażowego dzięki AI.' },
    { title: 'Potencjał Automatyzacji Rutyzny', value: 20, description: 'Procent rutynowych zadań, które można przenieść na AI (w oparciu o potrzeby Content/Search).' }
  ])

  

  freqUxData = computed(() => {
    const rows = this.rowsObj()
    const findField = (substr: string) => this.fields.find((f)=> f.includes(substr)) || ''
    const roleKey = findField('Na jakim poziomie stanowiska')
    const freqKey = findField('Jak często używasz')
    const ratingKey = findField('Jak oceniasz obsługę')
    const mapRole: Record<string,string> = {
      'Mam stanowisko specjalistyczne (jestem członkiem zespołu, realizuję zadania pod kierunkiem osoby zarządzającej zespołem)': 'Specjaliści i Członkowie Zespołów',
      'Zarządzam zespołem lub projektem (mam samodzielne stanowisko lub mam podległe osoby, odpowiadam za ich pracę, raportuję do Zarządu)': 'Managerowie i Liderzy',
    }
    const freqCounts: Record<string, Record<string, number>> = {}
    const roleCounts: Record<string, number> = {}
    const ratingCounts: Record<string, Record<string, number>> = {}
    rows.forEach((row) => {
      const role = mapRole[String(row?.[roleKey]||'').trim()] || ''
      if (!role) return
      roleCounts[role] = (roleCounts[role]||0)+1
      const freq = String(row?.[freqKey]||'').trim()
      if (freq) {
        freqCounts[role] = freqCounts[role] || {}
        freqCounts[role][freq] = (freqCounts[role][freq]||0)+1
      }
      const rating = String(row?.[ratingKey]||'').trim()
      if (rating && ['1','2','3','4','5'].includes(rating)) {
        ratingCounts[role] = ratingCounts[role] || {}
        ratingCounts[role][rating] = (ratingCounts[role][rating]||0)+1
      }
    })
    const mode = (map: Record<string, number>) => Object.entries(map).sort((a,b)=> b[1]-a[1])[0] || ['',0]
    const avg = (map: Record<string, number>) => {
      let s=0,n=0; Object.entries(map).forEach(([k,v])=>{ s+= (Number(k)||0)*v; n+=v })
      return n ? Math.round((s/n)*100)/100 : 0
    }
    const out: { role:string, freqLabel:string, freqPct:number, avgRating:number }[] = []
    Object.keys(roleCounts).forEach((role) => {
      const [label, count] = mode(freqCounts[role]||{})
      const pct = roleCounts[role] ? Math.round((count/roleCounts[role])*1000)/10 : 0
      out.push({ role, freqLabel: label || '—', freqPct: pct, avgRating: avg(ratingCounts[role]||{}) })
    })
    const order = ['Managerowie i Liderzy', 'Specjaliści i Członkowie Zespołów']
    return out.sort((a,b)=> order.indexOf(a.role)-order.indexOf(b.role))
  })

  barrierData = computed<PresentationData[]>(() => [
    { title: 'Brak Dostępu do Narzędzi', value: 47.4, description: 'Klub nie zapewnia narzędzi AI przydatnych w mojej pracy. Generuje to ryzyko użycia narzędzi publicznych.' },
    { title: 'Wątpliwości o Bezpieczeństwo Danych', value: 44.9, description: 'Obawiam się o bezpieczeństwo danych i wiarygodność informacji, które podaje AI. Blokuje to użycie w kluczowych procesach.' },
    { title: 'Brak Jasnych Wytycznych (Etyka)', value: 37.2, description: 'Nie mam jasności, jak bezpiecznie i etycznie używać AI. Hamuje to inicjatywę i kreatywność.' }
  ])

  constructor() { this.loadCSV() }
  loadCSV() {
    fetch('assets/ankieta.csv').then(r=> r.text()).then((csv)=> {
      const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true })
      this.rowsObj.set((parsed.data as Record<string, any>[]) || [])
      // @ts-ignore
      this.fields = (parsed.meta?.fields as string[]) || []
    }).catch(()=>{})
  }

  

  computeROI(): PresentationData[] {
    const rows = this.rowsObj()
    const findField = (substr: string) => this.fields.find((f)=> f.includes(substr)) || ''
    const useCasesKey = findField('Do czego wykorzystujesz AI')
    let contentSearch = 0
    let automation = 0
    rows.forEach((row)=>{
      const useCell = String(row?.[useCasesKey]||'')
      const parts = useCell.split(';').map((p)=> p.trim()).filter(Boolean)
      if (parts.some((p)=> p.startsWith('Tworzenie tekstów') || p.startsWith('Wyszukiwanie i podsumowywanie informacji'))) contentSearch += 1
      if (parts.some((p)=> p.startsWith('Automatyzacja powtarzalnych zadań'))) automation += 1
    })
    const tot = rows.length || 1
    const pct = (val:number)=> Math.round((val/tot)*1000)/10
    return [
      { title: 'Pokrycie Content/Search', value: pct(contentSearch), description: 'Procent respondentów korzystających z tworzenia treści i wyszukiwania.' },
      { title: 'Potencjał Automatyzacji Rutyny', value: pct(automation), description: 'Procent respondentów deklarujących automatyzację zadań.' },
    ]
  }
}