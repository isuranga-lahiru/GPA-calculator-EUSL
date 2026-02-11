# EUSL GPA Calculator - Faculty of Science

A comprehensive, fully responsive web application for calculating Grade Point Average (GPA) according to Eastern University, Sri Lanka (EUSL) Faculty of Science academic regulations.

## Overview

This GPA Calculator is designed specifically for students of the Faculty of Science at EUSL and follows the official grading rules and academic standards outlined in the EUSL Handbook. It supports both 3-Year General Degree and 4-Year Honours/Special Degree programs.

## Features

### Core Functionality
- **Multi-Level Support**: Calculate GPA across Levels 100, 200, 300, and optionally 400
- **Degree Mode Selection**: Choose between 3-Year General or 4-Year Honours/Special degrees
- **Dynamic Subject Selection**: Browse subjects by level with real-time grade selection
- **Custom Subject Addition**: Add subjects not in the standard curriculum
- **Real-Time Calculations**: Instant GPA updates as grades are entered

### Grading System
- **EUSL Grading Scale**: A+ (4.0), A (4.0), A- (3.7), B+ (3.3), B (3.0), B- (2.7), C+ (2.3), C (2.0), C- (1.7), D+ (1.3), D (1.0), E (0.0)
- **Exclusion Rule**: Courses starting with ENG, CPD, or SLV are automatically excluded from GPA calculations
- **Inclusion Rule**: All PH, CH, MT, CS, and EN subjects are included in GPA calculations

### Results Dashboard
- **Cumulative GPA**: Overall GPA including all courses
- **Final GPA**: GPA calculated only from included (non-excluded) subjects
- **Academic Classification**: First Class, Second Upper Division, Second Lower Division, Pass Class, or Below Pass
- **Detailed Statistics**:
  - Subjects Completed
  - Credits Earned
  - Quality Points
  - Excluded Subjects Count

### User Experience
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean card-based layout with easy-to-use grade selectors
- **Real-Time Feedback**: Instant GPA updates with color-coded results
- **Reset Functionality**: Clear all data with a single click
- **Grading Reference**: Built-in grading scale reference table

## Subject Database

### Level 100 (Year 1)
- **Physics**: PH1013, PH1021, PH1033, PH1041
- **Chemistry**: CH1013, CH1021, CH1033, CH1041
- **Mathematics**: MT1012, MT1022, MT1032, MT1042, MT1052, MT1062
- **Computer Science**: CS1013, CS1021, CS1032, CS1042
- **Enhancement Courses**: EN1012, EN1022, EN1032, EN1042, EN1052

### Level 200 (Year 2)
- **Physics**: 8 courses
- **Chemistry**: 6 courses
- **Mathematics**: 6 courses
- **Computer Science**: 5 courses
- **Enhancement Courses**: 2 courses

### Level 300 (Year 3)
- **Physics**: 9 courses
- **Chemistry**: 9 courses
- **Mathematics**: 10 courses
- **Computer Science**: 9 courses
- **Enhancement Courses**: 2 courses

### Level 400 (Year 4 - Honours/Special Only)
- **Physics**: 9 courses (including 6-credit Research Project)
- **Chemistry**: 9 courses (including 6-credit Research Project)
- **Mathematics**: 9 courses (including 6-credit Research Project)
- **Computer Science**: 9 courses (including 6-credit Research Project)

**Total**: 165+ pre-configured subjects across all levels and departments.

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required

### Installation

1. **Download Files**: Ensure all four files are in the same directory:
   - `index.html`
   - `style.css`
   - `script.js`
   - `subjects.json`
   - `README.md` (documentation)

2. **Open in Browser**: Double-click `index.html` or open it in your web browser via:
   - File → Open or Ctrl+O (Windows/Linux)
   - Cmd+O (macOS)
   - Or drag and drop the file into your browser

### File Structure
```
GPA calculator website/
├── index.html
├── style.css
├── script.js
├── subjects.json
└── README.md
```

## Usage Guide

### Step 1: Select Degree Mode
- Choose between **3-Year General Degree** or **4-Year Honours/Special Degree**
- Level 400 is automatically disabled for 3-year programs

### Step 2: Choose a Level/Year
- Select the academic level (100, 200, 300, or 400)
- All subjects for that level will be displayed

### Step 3: Enter Grades
- For each subject, click the grade dropdown
- Select the grade you received (A+ through E)
- Leave as "No Grade" if you haven't taken the subject yet

### Step 4: Add Custom Subjects (Optional)
- Use the "Add Subject Not in List" form to add courses not in the database
- Enter:
  - Course Code (e.g., PH3012, CS2022)
  - Subject Name (e.g., "Quantum Mechanics II")
  - Credits (1-10)
  - Grade (A+ through E)
- Click "Add Custom Subject"

### Step 5: View Results
- **Cumulative GPA**: Shows overall weighted average
- **Final GPA**: Shows GPA excluding ENG, CPD, SLV courses
- **Academic Class**: Automatic classification based on Final GPA
- **Statistics Panel**: Detailed breakdown of your academic performance

### Step 6: Reset (if needed)
- Click "Reset All" to clear all entered grades and custom subjects
- Confirm the action when prompted

## Grading Scale Reference

| Grade | GPA Value | Grade | GPA Value |
|-------|-----------|-------|-----------|
| A+    | 4.0       | B-    | 2.7       |
| A     | 4.0       | C+    | 2.3       |
| A-    | 3.7       | C     | 2.0       |
| B+    | 3.3       | C-    | 1.7       |
| B     | 3.0       | D+    | 1.3       |
|       |           | D     | 1.0       |
|       |           | E     | 0.0       |

## Academic Classification

| GPA Range | Classification           |
|-----------|--------------------------|
| 3.8+      | First Class              |
| 3.3-3.79  | Second Class (Upper)     |
| 2.8-3.29  | Second Class (Lower)     |
| 2.0-2.79  | Pass Class               |
| Below 2.0 | Below Pass               |

## Key Rules Applied

### Exclusion Rule
The following course codes are **excluded from GPA calculations**:
- Courses starting with **ENG** (English courses)
- Courses starting with **CPD** (Continuing Professional Development)
- Courses starting with **SLV** (Sinhala/Language courses)

*Note: These courses appear with an "EXCLUDED" badge but their grades are not counted in the final GPA.*

### Inclusion Rule
The following courses are **always included in GPA calculations**:
- All **Physics (PH)** courses
- All **Chemistry (CH)** courses
- All **Mathematics (MT)** courses
- All **Computer Science (CS)** courses
- All **Enhancement (EN)** courses (marked as EN1012, EN2013, etc.)

## Technical Details

### Files Explained

**index.html**
- Semantic HTML5 structure
- Responsive grid layout
- Accessible form elements
- Section organization (configuration, subjects, results)

**style.css**
- Mobile-first responsive design
- CSS Grid and Flexbox layouts
- Modern gradient backgrounds
- Smooth transitions and animations
- Print-friendly styles
- Mobile breakpoints: 480px, 768px

**script.js**
- Fetch and parse subjects.json
- Event-driven grade selection
- Real-time GPA calculations
- Custom subject management
- Validation and error handling
- LocalStorage support (optional enhancement)

**subjects.json**
- Complete subject database
- Grade mapping
- Academic classification thresholds
- Organized by level and department

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy & Data

- **No Server Required**: All calculations happen locally in your browser
- **No Data Transmission**: Your grades are never sent anywhere
- **Data Persistence**: Optional – you can enable LocalStorage to save your data between sessions
  - Currently disabled by default
  - Uncomment lines in `script.js` to enable auto-save

## Responsive Design

### Desktop (1200px+)
- Multi-column subject grid
- Full results dashboard
- Side-by-side configuration panels

### Tablet (768px - 1199px)
- 2-column subject grid
- Stacked result cards
- Optimized form layout

### Mobile (480px - 767px)
- Single-column subject grid
- Full-width buttons
- Optimized font sizes
- Larger touch targets

### Small Mobile (<480px)
- Single-column layout
- Simplified header
- Minimized spacing
- Touch-friendly controls

## Tips for Best Results

1. **Start with Level 100**: Begin calculating from your first year to get comprehensive GPA
2. **Enter All Grades**: For accurate GPA, enter grades for all completed subjects
3. **Use Correct Codes**: Ensure custom subject codes match official university codes
4. **Check Exclusions**: Pay attention to the excluded badges on certain courses
5. **Review Results**: Cross-check your calculated GPA with official records

## Frequently Asked Questions

**Q: Why is my GPA calculated from only some courses?**
A: Courses starting with ENG, CPD, or SLV are excluded per EUSL policy. Check for the "EXCLUDED" badge on these courses.

**Q: Can I add multiple custom subjects?**
A: Yes! Add as many as needed. Each custom subject will be included in calculations.

**Q: Does the calculator save my data?**
A: Not by default. Your grades are stored only during your session. To enable saving, you would need to modify the JavaScript code.

**Q: What's the difference between Cumulative and Final GPA?**
A: **Cumulative** includes all subjects. **Final** excludes ENG, CPD, SLV courses per EUSL regulations.

**Q: Can I calculate GPA for only one level?**
A: Currently, the calculator includes all levels selected in your degree mode. You can leave subjects without grades to exclude them.

**Q: Is this calculator officially endorsed by EUSL?**
A: This calculator is a student tool designed to follow EUSL grading rules. Always verify your official GPA with the Registrar's Office.

## Support & Feedback

For issues or suggestions, ensure:
- All files are in the same directory
- `subjects.json` is properly formatted
- Your browser supports modern JavaScript (ES6+)
- JavaScript is enabled in your browser

## Credits

Developed for **Faculty of Science, Eastern University, Sri Lanka**
- Comprehensive subject database
- EUSL Handbook grading standards
- Responsive, modern UI/UX
- Fully functional offline application

## License

This GPA calculator is provided as-is for educational purposes at EUSL. Users are responsible for verifying calculations against official university records.

---

**Last Updated**: February 11, 2026

For the most current academic regulations, always refer to the official [EUSL Faculty of Science Handbook](https://www.easternu.edu.lk).
