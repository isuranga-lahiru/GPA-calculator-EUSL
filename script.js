// Global Variables
let subjectsData = {};
let combinationsData = {};
let gradeValues = {};
let academicClassRules = {};
let userGrades = {}; // Store selected grades: { code: grade }
let customSubjects = []; // Store custom subjects
let selectedCombination = ''; // Track selected combination

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
        combinationsData = data.combinations;
        gradeValues = data.grades;
        academicClassRules = data.academicClass;
    } catch (error) {
        console.error('Error loading subjects data:', error);
        alert('Error loading subjects data. Please refresh the page.');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    const combinationSelect = document.getElementById('combinationSelect');
    const degreeMode = document.getElementById('degreeMode');
    const levelSelect = document.getElementById('levelSelect');
    const resetButton = document.getElementById('resetButton');
    const addCustomButton = document.getElementById('addCustomButton');
    const printButton = document.getElementById('printButton');
    const shareButton = document.getElementById('shareButton');
    const closeModal = document.getElementById('closeModal');
    const shareModal = document.getElementById('shareModal');
    const copyLinkButton = document.getElementById('copyLinkButton');

    console.log('Setup Event Listeners:', {
        printButton: !!printButton,
        shareButton: !!shareButton,
        closeModal: !!closeModal,
        shareModal: !!shareModal,
        copyLinkButton: !!copyLinkButton
    });

    if (combinationSelect) combinationSelect.addEventListener('change', handleCombinationChange);
    if (degreeMode) degreeMode.addEventListener('change', handleDegreeModeChange);
    if (levelSelect) levelSelect.addEventListener('change', updateSubjectsDisplay);
    if (resetButton) resetButton.addEventListener('click', resetAll);
    if (addCustomButton) addCustomButton.addEventListener('click', addCustomSubject);
    if (printButton) {
        printButton.addEventListener('click', printResults);
        console.log('Print button listener attached');
    }
    if (shareButton) {
        shareButton.addEventListener('click', openShareModal);
        console.log('Share button listener attached');
    }
    if (closeModal) closeModal.addEventListener('click', closeShareModal);
    if (copyLinkButton) copyLinkButton.addEventListener('click', copyShareLink);
    
    // Close modal when clicking outside
    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) closeShareModal();
        });
    }

    // Disable Level 400 for 3-year degree
    if (degreeMode) handleDegreeModeChange();
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

// Handle Combination Change
function handleCombinationChange(event) {
    selectedCombination = event.target.value;
    updateSubjectsDisplay();
}

// Update Subjects Display
function updateSubjectsDisplay() {
    const levelSelect = document.getElementById('levelSelect');
    const level = levelSelect.value;
    const levelData = subjectsData[level];

    // Update level title
    document.getElementById('levelTitle').textContent = levelData.name;

    // Get filtered subjects based on combination
    let subjectsToDisplay = levelData.subjects;
    
    if (selectedCombination) {
        subjectsToDisplay = levelData.subjects.filter(subject => 
            subject.combinations && subject.combinations.includes(selectedCombination)
        );
    }

    // Clear container
    const container = document.getElementById('subjectsContainer');
    container.innerHTML = '';

    // Add section info if combination is selected
    if (selectedCombination && combinationsData[selectedCombination]) {
        const combinationInfo = document.createElement('div');
        combinationInfo.className = 'combination-info';
        combinationInfo.innerHTML = `
            <h4>${combinationsData[selectedCombination].name}</h4>
            <p>${combinationsData[selectedCombination].description}</p>
        `;
        container.appendChild(combinationInfo);
    }

    // Add subject cards
    subjectsToDisplay.forEach(subject => {
        const card = createSubjectCard(subject);
        container.appendChild(card);
    });

    // Show message if no subjects available
    if (subjectsToDisplay.length === 0 && selectedCombination) {
        const noSubjectsMsg = document.createElement('div');
        noSubjectsMsg.className = 'no-subjects-message';
        noSubjectsMsg.innerHTML = '<p>No subjects available for this combination at this level.</p>';
        container.appendChild(noSubjectsMsg);
    }
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

// Print Results
function printResults() {
    const degreeMode = document.getElementById('degreeMode').value;
    const level = document.getElementById('levelSelect').value;
    const combination = document.getElementById('combinationSelect').value || 'All';
    const cumulativeGpa = document.getElementById('cumulativeGpa').textContent;
    const finalGpa = document.getElementById('finalGpa').textContent;
    const academicClass = document.getElementById('academicClass').textContent;
    const totalCredits = document.getElementById('totalCredits').textContent;
    const subjectsCompleted = document.getElementById('subjectsCompleted').textContent;
    const creditsEarned = document.getElementById('creditsEarned').textContent;
    const qualityPoints = document.getElementById('qualityPoints').textContent;
    
    const degreeText = degreeMode === '3-year' ? '3-Year General Degree' : '4-Year Honours/Special Degree';
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
    
    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>EUSL GPA Calculator - Results</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #333;
                    padding: 40px;
                    background: white;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #3f51b5;
                    padding-bottom: 20px;
                }
                .header h1 {
                    color: #1a237e;
                    font-size: 24px;
                    margin-bottom: 5px;
                }
                .header h3 {
                    color: #3f51b5;
                    font-size: 16px;
                    font-weight: 300;
                    margin-bottom: 10px;
                }
                .date {
                    color: #666;
                    font-size: 12px;
                }
                .info-box {
                    background: #f5f7ff;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border-left: 4px solid #3f51b5;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                .info-label { font-weight: 600; color: #333; }
                .info-value { color: #3f51b5; font-weight: 700; }
                .results-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .result-box {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                }
                .result-label {
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    opacity: 0.9;
                    margin-bottom: 8px;
                }
                .result-value {
                    font-size: 32px;
                    font-weight: 800;
                }
                .stats {
                    background: #f5f7ff;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                .stat-item:last-child { border-bottom: none; }
                .stat-label { font-weight: 600; color: #333; }
                .stat-value { color: #3f51b5; font-weight: 700; }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 12px;
                    color: #666;
                }
                @media print {
                    body { padding: 20px; }
                    .results-grid { gap: 15px; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Faculty of Science, Eastern University, Sri Lanka</h1>
                <h3>GPA Calculator Results</h3>
                <div class="date">Generated on ${currentDate}</div>
            </div>
            
            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Degree Mode:</span>
                    <span class="info-value">${degreeText}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Combination:</span>
                    <span class="info-value">${combination}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Current Level:</span>
                    <span class="info-value">Level ${level}</span>
                </div>
            </div>
            
            <div class="results-grid">
                <div class="result-box">
                    <div class="result-label">Cumulative GPA</div>
                    <div class="result-value">${cumulativeGpa}</div>
                </div>
                <div class="result-box">
                    <div class="result-label">Final GPA</div>
                    <div class="result-value">${finalGpa}</div>
                </div>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-label">Academic Classification</span>
                    <span class="stat-value">${academicClass}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Credits</span>
                    <span class="stat-value">${totalCredits}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Subjects Completed</span>
                    <span class="stat-value">${subjectsCompleted}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Credits Earned</span>
                    <span class="stat-value">${creditsEarned}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Quality Points</span>
                    <span class="stat-value">${qualityPoints}</span>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an unofficial GPA calculation tool. Please verify results with the official EUSL Registrar's Office.</p>
                <p>EUSL GPA Calculator | Powered by HiruNova-X</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Share Functions
function openShareModal() {
    const modal = document.getElementById('shareModal');
    const finalGpa = document.getElementById('finalGpa').textContent;
    const academicClass = document.getElementById('academicClass').textContent;
    const cumulativeGpa = document.getElementById('cumulativeGpa').textContent;
    
    const message = `Check my GPA Calculation from EUSL GPA Calculator:\nCumulative GPA: ${cumulativeGpa}\nFinal GPA: ${finalGpa}\nClass: ${academicClass}\n\nCalculate yours now!`;
    const shareUrl = encodeURIComponent(window.location.href);
    const encodedMessage = encodeURIComponent(message);
    
    document.getElementById('shareWhatsApp').href = `https://wa.me/?text=${encodedMessage}%20${shareUrl}`;
    document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    document.getElementById('shareLink').value = window.location.href;
    
    modal.classList.remove('hidden');
}

function closeShareModal() {
    document.getElementById('shareModal').classList.add('hidden');
}

function copyShareLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    
    const button = document.getElementById('copyLinkButton');
    const originalText = button.textContent;
    button.textContent = '✓ Copied!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}
