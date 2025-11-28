const input = document.getElementById("textInput");
const button = document.getElementById("analyzeBtn");
const box2 = document.getElementById("box2");
const box3 = document.getElementById("box3");
const box1Output = document.getElementById("output");

let wordsData = [];
let elementWidth = 120; 
let elementHeight = 40; 

button.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;

    const rawWords = text.split("-").map(w => w.trim()).filter(Boolean);

    const lowercase = rawWords.filter(w => /^[a-zа-я]/.test(w));
    const uppercase = rawWords.filter(w => /^[A-ZА-Я]/.test(w));
    const numbers = rawWords.filter(w => /^\d+$/.test(w));

    const sorted = [
        ...lowercase.sort(),
        ...uppercase.sort(),
        ...numbers.sort((a, b) => Number(a) - Number(b))
    ];

    let aCount = 0, bCount = 0, nCount = 0;
    wordsData = sorted.map(word => {
        let key;
        if (/^[a-zа-я]/.test(word)) key = `a${++aCount}`;
        else if (/^[A-ZА-Я]/.test(word)) key = `b${++bCount}`;
        else key = `n${++nCount}`;
        return { key, value: word, color: getRandomColor() };
    });

    renderBox2();
    box3.innerHTML = "";
    box1Output.innerHTML = "";
});

function getRandomColor() {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgb(${r},${g},${b})`;
}

function renderBox2() {
    box2.innerHTML = "";
    const sorted = [...wordsData].sort((a, b) => a.key.localeCompare(b.key));
    sorted.forEach(item => {
        const el = createWordElement(item, false);
        box2.appendChild(el);
    });
}

function createWordElement(item, inBox3) {
    const el = document.createElement("div");
    el.textContent = `${item.key} ${item.value}`;
    el.classList.add("word");
    el.draggable = true;

    if (inBox3) {
        el.style.backgroundColor = "#f3f3f3ff";
        el.style.color = "black";
        el.style.position = "absolute";
    } else {
        el.style.backgroundColor = item.color;
        el.style.color = "white";
        el.style.position = "relative";
    }

    el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", item.key);
    });

    el.addEventListener("click", () => {
        if (el.parentElement === box3) {
            const p = document.createElement("p");
            p.textContent = item.value;
            p.style.color = item.color;
            box1Output.appendChild(p);
        }
    });

    return el;
}

box2.addEventListener("dragover", (e) => e.preventDefault());
box2.addEventListener("drop", (e) => {
    e.preventDefault();
    const key = e.dataTransfer.getData("text/plain");
    const item = wordsData.find(i => i.key === key);
    if (!item) return;
    
    // удалить старую копию (из box3 или box2)
    const existing = [...box2.children, ...box3.children]
    .find(c => c.textContent.startsWith(key + " "));
    if (existing) existing.remove();
    
    // вставляем на своё место по ключу
    const sortedKeys = [...box2.children].map(c => c.textContent.split(" ")[0]);
    const insertIndex = sortedKeys.findIndex(k => k.localeCompare(item.key) > 0);
    const newEl = createWordElement(item, false);
    if (insertIndex === -1) box2.appendChild(newEl);
    else box2.insertBefore(newEl, box2.children[insertIndex]);
});

box3.addEventListener("dragover", (e) => e.preventDefault());
box3.addEventListener("drop", (e) => {
    e.preventDefault();
    const key = e.dataTransfer.getData("text/plain");
    const item = wordsData.find(i => i.key === key);
    if (!item) return;


    // удаляем старую копию (из box2 или box3)
    const existing = [...box2.children, ...box3.children]
        .find(c => c.textContent.startsWith(key + " "));
    if (existing) existing.remove();

    // создаем новый элемент
    const newEl = createWordElement(item, true);
    const rect = box3.getBoundingClientRect();

    // вычисляем и ограничиваем координаты 
    const offsetX = 50; 
    const offsetY = 15;

    let x = e.clientX - rect.left - offsetX;
    let y = e.clientY - rect.top - offsetY;

    x = Math.max(0, x);
    y = Math.max(0, y);

    const maxX = rect.width - elementWidth;
    x = (maxX > 0) ? Math.min(x, maxX) : 0; 

    const maxY = rect.height - elementHeight;
    y = (maxY > 0) ? Math.min(y, maxY) : 0;
    
    // присваиваем ограниченные координаты и добавляем элемент
    newEl.style.left = `${x}px`;
    newEl.style.top = `${y}px`;
    box3.appendChild(newEl); 
});