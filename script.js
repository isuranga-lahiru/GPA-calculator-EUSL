// Global Variables
let subjectsData = {};
let gradeValues = {};
let academicClassRules = {};
let userGrades = {}; // Store selected grades: { code: grade }
let customSubjects = []; // Store custom subjects

// Subject Selection (for tracking which subjects user is working with)
let selectedSubjects = new Set();

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
    await loadSubjectsData();
    setupEventListeners();
    updateSubjectsDisplay();
    calculateGPA();
});

// Load Subjects from JSON
async function loadSubjectsData() {
    try {
        const response = await fetch('subjects.json');
        const data = await response.json();
        subjectsData = data.levels;
        gradeValues = data.grades;
        academicClassRules = data.academicClass;
    } catch (error) {
        console.error('Error loading subjects data:', error);
        alert('Error loading subjects data. Please refresh the page.');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    const degreeMode = document.getElementById('degreeMode');
    const levelSelect = document.getElementById('levelSelect');
    const resetButton = document.getElementById('resetButton');
    const addCustomButton = document.getElementById('addCustomButton');

    degreeMode.addEventListener('change', handleDegreeModeChange);
    levelSelect.addEventListener('change', updateSubjectsDisplay);
    resetButton.addEventListener('click', resetAll);
    addCustomButton.addEventListener('click', addCustomSubject);

    // Disable Level 400 for 3-year degree
    handleDegreeModeChange();
}

// Handle Degree Mode Change
function handleDegreeModeChange() {
    const degreeMode = document.getElementById('degreeMode');
    const levelSelect = document.getElementById('levelSelect');

    const option400 = levelSelect.querySelector('option[value="400"]');
    if (degreeMode.value === '3-year') {
        option400.disabled = true;
        if (levelSelect.value === '400') {
            levelSelect.value = '300';
            updateSubjectsDisplay();
        }
    } else {
        option400.disabled = false;
    }
}

// Update Subjects Display
function updateSubjectsDisplay() {
    const levelSelect = document.getElementById('levelSelect');
    const level = levelSelect.value;
    const levelData = subjectsData[level];

    // Update level title
    document.getElementById('levelTitle').textContent = levelData.name;

    // Clear container
    const container = document.getElementById('subjectsContainer');
    container.innerHTML = '';

    // Add subject cards
    levelData.subjects.forEach(subject => {
        const card = createSubjectCard(subject);
        container.appendChild(card);
    });
}

// Create Subject Card
function createSubjectCard(subject) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.id = `card-${subject.code}`;

    const isExcluded = isSubjectExcluded(subject.code);
    const storedGrade = userGrades[subject.code] || '';

    const excludedBadge = isExcluded 
        ? '<div class="excluded-badge">EXCLUDED</div>' 
        : '';

    card.innerHTML = `
        <div class="subject-header">
            <span class="subject-code">${subject.code}</span>
            <span class="subject-credits">${subject.credits} cr</span>
        </div>
        <div class="subject-name">${subject.name}</div>
        <div class="subject-department">${subject.department}</div>
        ${excludedBadge}
        <div class="subject-grade-group">
            <label for="grade-${subject.code}">Grade:</label>
            <select id="grade-${subject.code}" class="subject-grade-select">
                <option value="">No Grade</option>
                <option value="A+" ${storedGrade === 'A+' ? 'selected' : ''}>A+ (4.0)</option>
                <option value="A" ${storedGrade === 'A' ? 'selected' : ''}>A (4.0)</option>
                <option value="A-" ${storedGrade === 'A-' ? 'selected' : ''}>A- (3.7)</option>
                <option value="B+" ${storedGrade === 'B+' ? 'selected' : ''}>B+ (3.3)</option>
                <option value="B" ${storedGrade === 'B' ? 'selected' : ''}>B (3.0)</option>
                <option value="B-" ${storedGrade === 'B-' ? 'selected' : ''}>B- (2.7)</option>
                <option value="C+" ${storedGrade === 'C+' ? 'selected' : ''}>C+ (2.3)</option>
                <option value="C" ${storedGrade === 'C' ? 'selected' : ''}>C (2.0)</option>
                <option value="C-" ${storedGrade === 'C-' ? 'selected' : ''}>C- (1.7)</option>
                <option value="D+" ${storedGrade === 'D+' ? 'selected' : ''}>D+ (1.3)</option>
                <option value="D" ${storedGrade === 'D' ? 'selected' : ''}>D (1.0)</option>
                <option value="E" ${storedGrade === 'E' ? 'selected' : ''}>E (0.0)</option>
            </select>
        </div>
    `;

    const gradeSelect = card.querySelector('.subject-grade-select');
    gradeSelect.addEventListener('change', (e) => {
        handleGradeChange(subject.code, e.target.value);
    });

    return card;
}

// Check if Subject is Excluded
function isSubjectExcluded(code) {
    // Exclusion rule: ENG, CPD, SLV starting codes are excluded
    const excludedPrefixes = ['ENG', 'CPD', 'SLV'];
    return excludedPrefixes.some(prefix => code.startsWith(prefix));
}

// Handle Grade Change
function handleGradeChange(code, grade) {
    if (grade === '') {
        delete userGrades[code];
    } else {
        userGrades[code] = grade;
    }
    calculateGPA();
}

// Add Custom Subject
function addCustomSubject() {
    const code = document.getElementById('customCode').value.trim().toUpperCase();
    const name = document.getElementById('customName').value.trim();
    const credits = parseInt(document.getElementById('customCredits').value);
    const grade = document.getElementById('customGrade').value;

    // Validation
    if (!code || !name || !credits || !grade) {
        alert('Please fill in all fields.');
        return;
    }

    if (isNaN(credits) || credits < 1 || credits > 10) {
        alert('Credits must be between 1 and 10.');
        return;
    }

    // Check if subject code already exists
    if (userGrades.hasOwnProperty(code)) {
        alert(`Subject code ${code} already exists.`);
        return;
    }

    // Add custom subject
    const customSubject = { code, name, credits, department: 'Custom' };
    customSubjects.push(customSubject);
    userGrades[code] = grade;

    // Clear form
    document.getElementById('customCode').value = '';
    document.getElementById('customName').value = '';
    document.getElementById('customCredits').value = '';
    document.getElementById('customGrade').value = '';

    // Add custom subject card to the current level display
    const container = document.getElementById('subjectsContainer');
    const editableCard = createCustomSubjectCard(customSubject);
    container.appendChild(editableCard);

    calculateGPA();
}

// Create Custom Subject Card
function createCustomSubjectCard(subject) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.id = `card-${subject.code}`;

    const isExcluded = isSubjectExcluded(subject.code);
    const storedGrade = userGrades[subject.code] || '';

    const excludedBadge = isExcluded 
        ? '<div class="excluded-badge">EXCLUDED</div>' 
        : '';

    card.innerHTML = `
        <div class="subject-header">
            <span class="subject-code">${subject.code}</span>
            <span class="subject-credits">${subject.credits} cr</span>
        </div>
        <div class="subject-name">${subject.name}</div>
        <div class="subject-department">${subject.department}</div>
        ${excludedBadge}
        <div class="subject-grade-group">
            <label for="grade-${subject.code}">Grade:</label>
            <select id="grade-${subject.code}" class="subject-grade-select">
                <option value="">No Grade</option>
                <option value="A+" ${storedGrade === 'A+' ? 'selected' : ''}>A+ (4.0)</option>
                <option value="A" ${storedGrade === 'A' ? 'selected' : ''}>A (4.0)</option>
                <option value="A-" ${storedGrade === 'A-' ? 'selected' : ''}>A- (3.7)</option>
                <option value="B+" ${storedGrade === 'B+' ? 'selected' : ''}>B+ (3.3)</option>
                <option value="B" ${storedGrade === 'B' ? 'selected' : ''}>B (3.0)</option>
                <option value="B-" ${storedGrade === 'B-' ? 'selected' : ''}>B- (2.7)</option>
                <option value="C+" ${storedGrade === 'C+' ? 'selected' : ''}>C+ (2.3)</option>
                <option value="C" ${storedGrade === 'C' ? 'selected' : ''}>C (2.0)</option>
                <option value="C-" ${storedGrade === 'C-' ? 'selected' : ''}>C- (1.7)</option>
                <option value="D+" ${storedGrade === 'D+' ? 'selected' : ''}>D+ (1.3)</option>
                <option value="D" ${storedGrade === 'D' ? 'selected' : ''}>D (1.0)</option>
                <option value="E" ${storedGrade === 'E' ? 'selected' : ''}>E (0.0)</option>
            </select>
        </div>
        <div class="subject-remove">
            <button class="btn-remove">Remove</button>
        </div>
    `;

    const gradeSelect = card.querySelector('.subject-grade-select');
    gradeSelect.addEventListener('change', (e) => {
        handleGradeChange(subject.code, e.target.value);
    });

    const removeBtn = card.querySelector('.btn-remove');
    removeBtn.addEventListener('click', () => {
        removeCustomSubject(subject.code);
    });

    return card;
}

// Remove Custom Subject
function removeCustomSubject(code) {
    customSubjects = customSubjects.filter(s => s.code !== code);
    delete userGrades[code];
    
    const card = document.getElementById(`card-${code}`);
    if (card) {
        card.remove();
    }
    
    calculateGPA();
}

// Calculate GPA
function calculateGPA() {
    const degreeMode = document.getElementById('degreeMode').value;
    const levelSelect = document.getElementById('levelSelect');
    
    // Determine levels to include
    let levelsToInclude = ['100', '200', '300'];
    if (degreeMode === '4-year') {
        levelsToInclude = ['100', '200', '300', '400'];
    }

    // Collect all subjects from specified levels
    let allSubjects = [];
    levelsToInclude.forEach(level => {
        if (subjectsData[level]) {
            allSubjects.push(...subjectsData[level].subjects);
        }
    });

    // Add custom subjects
    allSubjects.push(...customSubjects);

    // Calculate metrics
    let includedCredits = 0;
    let includedQualityPoints = 0;
    let totalCredits = 0;
    let excludedCount = 0;
    let subjectsWithGrades = 0;

    allSubjects.forEach(subject => {
        const grade = userGrades[subject.code];

        if (!grade) return; // No grade entered

        totalCredits += subject.credits;
        subjectsWithGrades++;
        const gpaValue = gradeValues[grade] || 0;
        const qualityPoints = subject.credits * gpaValue;

        if (isSubjectExcluded(subject.code)) {
            excludedCount++;
        } else {
            includedCredits += subject.credits;
            includedQualityPoints += qualityPoints;
        }
    });

    // Calculate GPAs
    const cumulativeGPA = totalCredits > 0 ? (includedQualityPoints / totalCredits).toFixed(2) : '0.00';
    const finalGPA = includedCredits > 0 ? (includedQualityPoints / includedCredits).toFixed(2) : '0.00';

    // Determine Academic Class
    const gpaForClass = parseFloat(finalGPA);
    let academicClass = '—';

    for (const [key, rule] of Object.entries(academicClassRules)) {
        if (gpaForClass >= rule.min) {
            academicClass = rule.label;
            break;
        }
    }

    // Update Display
    document.getElementById('cumulativeGpa').textContent = cumulativeGPA;
    document.getElementById('finalGpa').textContent = finalGPA;
    document.getElementById('academicClass').textContent = academicClass;
    document.getElementById('totalCredits').textContent = totalCredits;
    document.getElementById('subjectsCompleted').textContent = subjectsWithGrades;
    document.getElementById('creditsEarned').textContent = includedCredits;
    document.getElementById('qualityPoints').textContent = includedQualityPoints.toFixed(2);
    document.getElementById('excludedCount').textContent = excludedCount;
}

// Reset All
function resetAll() {
    if (confirm('Are you sure you want to reset all grades? This cannot be undone.')) {
        userGrades = {};
        customSubjects = [];

        // Clear all grade selects
        const gradeSelects = document.querySelectorAll('.subject-grade-select');
        gradeSelects.forEach(select => {
            select.value = '';
        });

        // Remove custom subject cards
        const customCards = document.querySelectorAll('.subject-card');
        customCards.forEach(card => {
            const code = card.id.replace('card-', '');
            if (customSubjects.some(s => s.code === code)) {
                card.remove();
            }
        });

        // Clear custom form
        document.getElementById('customCode').value = '';
        document.getElementById('customName').value = '';
        document.getElementById('customCredits').value = '';
        document.getElementById('customGrade').value = '';

        calculateGPA();
    }
}

// Utility: Save Data to LocalStorage (Optional Enhancement)
function saveUserData() {
    const data = {
        userGrades,
        customSubjects,
        degreeMode: document.getElementById('degreeMode').value,
        level: document.getElementById('levelSelect').value
    };
    localStorage.setItem('gpaCalculatorData', JSON.stringify(data));
}

// Utility: Load Data from LocalStorage (Optional Enhancement)
function loadUserData() {
    const saved = localStorage.getItem('gpaCalculatorData');
    if (saved) {
        const data = JSON.parse(saved);
        userGrades = data.userGrades || {};
        customSubjects = data.customSubjects || [];
        document.getElementById('degreeMode').value = data.degreeMode || '3-year';
        document.getElementById('levelSelect').value = data.level || '100';
    }
}

// Auto-save on changes (Optional)
window.addEventListener('beforeunload', () => {
    // Uncomment to enable auto-save
    // saveUserData();
});
