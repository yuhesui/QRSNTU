const fs = require('fs');
const path = require('path');

const COURSE_NAMES = {
    'HE1001': 'Microeconomics I',
    'HE1002': 'Macroeconomics I',
    'CC0003': 'Ethics & Civics in a Multi-Cultural World',
    'MH1100': 'Calculus I',
    'MH1200': 'Linear Algebra I',
    'MH1300': 'Foundations of Mathematics',
    // ... add all your course codes here
};

function extractAcademicYear(name) {
    const match = name.match(/_(\d{2}-\d{2})_/);
    return match ? match[1] : null;
}

function extractMaterialType(name) {
    if (name.includes('QuestionPaper')) return 'QuestionPaper';
    if (name.includes("Examiner's Report")) return 'ExaminerReport';
    if (name.includes('Solution')) {
        if (name.includes('by QRS')) return 'SolutionByQRS';
        if (name.includes('Unofficial')) return 'SolutionUnofficial';
        if (name.includes('Handwritten')) return 'SolutionHandwritten';
        return 'SolutionOfficial';
    }
    return '';
}

function isRevisionNote(name) {
    return name.includes('RevisionNotes');
}

function scanDirectory(dirPath) {
    const courses = [];
    const notesPath = path.join(__dirname, '../../Notes');
    
    if (!fs.existsSync(notesPath)) {
        console.error('Notes directory not found');
        return courses;
    }
    
    const folders = fs.readdirSync(notesPath);
    
    folders.forEach(folderName => {
        const folderPath = path.join(notesPath, folderName);
        const stat = fs.statSync(folderPath);
        
        if (!stat.isDirectory()) return;
        if (!folderName.match(/^[A-Z]{2}\d{4}/)) return;
        
        const courseCode = folderName;
        const courseName = COURSE_NAMES[courseCode] || 'Unknown Course';
        
        let finals = {};
        let midterms = {};
        let revisionNotes = [];
        let pastYearZips = [];
        
        // Scan course folder contents
        const courseContents = fs.readdirSync(folderPath);
        
        courseContents.forEach(itemName => {
            const itemPath = path.join(folderPath, itemName);
            const itemStat = fs.statSync(itemPath);
            
            // Direct files in course root
            if (itemStat.isFile()) {
                if (isRevisionNote(itemName)) {
                    revisionNotes.push({
                        name: itemName,
                        path: `Notes/${courseCode}/${itemName}`,
                        downloadUrl: `https://raw.githubusercontent.com/yuhesui/QRSNTU/main/Notes/${courseCode}/${itemName}`
                    });
                }
                if (itemName.endsWith('.zip')) {
                    pastYearZips.push({
                        name: itemName,
                        path: `Notes/${courseCode}/${itemName}`,
                        downloadUrl: `https://github.com/yuhesui/QRSNTU/raw/main/Notes/${courseCode}/${encodeURIComponent(itemName)}`
                    });
                }
            }
            
            // Exam folders (Finals/Midterms)
            if (itemStat.isDirectory()) {
                const examType = itemName.includes('Finals') ? 'Finals'
                    : itemName.includes('Midterm') ? 'Midterm'
                    : '';
                
                if (!examType) return;
                
                const examFiles = fs.readdirSync(itemPath);
                
                examFiles.forEach(fileName => {
                    const filePath = path.join(itemPath, fileName);
                    if (!fs.statSync(filePath).isFile()) return;
                    
                    if (fileName.endsWith('.zip')) {
                        pastYearZips.push({
                            name: fileName,
                            path: `Notes/${courseCode}/${itemName}/${fileName}`,
                            downloadUrl: `https://github.com/yuhesui/QRSNTU/raw/main/Notes/${courseCode}/${encodeURIComponent(itemName)}/${encodeURIComponent(fileName)}`
                        });
                        return;
                    }
                    
                    if (!fileName.endsWith('.pdf')) return;
                    
                    const year = extractAcademicYear(fileName);
                    const materialType = extractMaterialType(fileName);
                    
                    if (!year) return;
                    
                    const fileData = {
                        name: fileName,
                        path: `Notes/${courseCode}/${itemName}/${fileName}`,
                        downloadUrl: `https://raw.githubusercontent.com/yuhesui/QRSNTU/main/Notes/${courseCode}/${encodeURIComponent(itemName)}/${encodeURIComponent(fileName)}`
                    };
                    
                    if (examType === 'Finals') {
                        if (!finals[year]) finals[year] = { papers: [], solutions: [], reports: [] };
                        if (materialType === 'QuestionPaper') finals[year].papers.push(fileData);
                        else if (materialType.startsWith('Solution')) finals[year].solutions.push(fileData);
                        else if (materialType === 'ExaminerReport') finals[year].reports.push(fileData);
                    } else if (examType === 'Midterm') {
                        if (!midterms[year]) midterms[year] = { papers: [], solutions: [], reports: [] };
                        if (materialType === 'QuestionPaper') midterms[year].papers.push(fileData);
                        else if (materialType.startsWith('Solution')) midterms[year].solutions.push(fileData);
                    }
                });
            }
        });
        
        courses.push({
            code: courseCode,
            name: courseName,
            githubUrl: `https://github.com/yuhesui/QRSNTU/tree/main/Notes/${courseCode}`,
            materials: {
                finals,
                midterms,
                revisionNotes,
                pastYearZips
            }
        });
    });
    
    return courses;
}

// Generate JSON
const courses = scanDirectory();
const outputPath = path.join(__dirname, '../../Website/v1/courses.json');
fs.writeFileSync(outputPath, JSON.stringify({ courses, generatedAt: new Date().toISOString() }, null, 2));
console.log(`Generated courses.json with ${courses.length} courses`);
