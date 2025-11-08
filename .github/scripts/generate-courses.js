const fs = require('fs');
const path = require('path');

// Course metadata mapping
const COURSE_NAMES = {
    'HE1001': 'Microeconomics I',
    'HE1002': 'Macroeconomics I',
    'CC0003': 'Ethics & Civics in a Multi-Cultural World',
    'MH1100': 'Calculus I',
    'MH1200': 'Linear Algebra I',
    'MH1300': 'Foundations of Mathematics',
    'HE2001': 'Microeconomics II',
    'HE2002': 'Macroeconomics II',
    'CC0001': 'Inquiry and Communication in an Interdisciplinary World',
    'CC0015': 'Health & Wellbeing',
    'MH1101': 'Calculus II',
    'MH1201': 'Linear Algebra II',
    'MH1301': 'Discrete Mathematics',
    'MH4913': 'Professional Attachment',
    'HE2003': 'Econometrics I',
    'ML0004': 'Career Design & Workplace Readiness in the V.U.C.A World',
    'MH2100': 'Calculus III',
    'MH2500': 'Probability',
    'MH3100': 'Real Analysis I',
    'PS0001': 'Introduction to Computational Thinking',
    'CSL': 'Care, Serve, Learn',
    'CC0006': 'Sustainability: Society, Economy & Environment',
    'CC0007': 'Science & Technology for Humanity',
    'MH2220': 'Algebra I',
    'MH1403': 'Algorithms and Computing',
    'MH2510': 'Statistics I',
    'HE3001': 'Microeconomics III',
    'MH3101': 'Complex Analysis',
    'MH3210': 'Number Theory',
    'MH3220': 'Algebra II',
    'MH3300': 'Graph Theory',
    'MH3320': 'Dynamical System Theory with Chaos and Fractals',
    'MH3400': 'Algorithms for the Real World',
    'MH3401': 'Signal and Noise in Biology',
    'MH3510': 'Regression Analysis',
    'MH3511': 'Data Analysis with Computer',
    'MH3512': 'Stochastic Processes',
    'MH3515': 'Stochastic Geometry',
    'MH3520': 'Mathematics of Deep Learning',
    'MH3700': 'Numerical Analysis I',
    'MH3701': 'Basic Optimization',
    'MH4100': 'Real Analysis II',
    'MH4110': 'Partial Differential Equations',
    'MH4200': 'Abstract Algebra II',
    'MH4300': 'Combinatorics',
    'MH4301': 'Set Theory and Logic',
    'MH4302': 'Theory of Computing',
    'MH4310': 'Coding Theory',
    'MH4311': 'Cryptography',
    'MH4320': 'Computational Economics',
    'MH4500': 'Time Series Analysis',
    'MH4510': 'Statistical Learning and Data Mining',
    'MH4511': 'Sampling & Survey',
    'MH4512': 'Clinical Trials',
    'MH4513': 'Survival Analysis',
    'MH4514': 'Financial Mathematics',
    'MH4515': 'Applied Bayesian Statistics',
    'MH4516': 'Applied Categorical Data Analysis',
    'MH4517': 'Data Applications in Natural Sciences',
    'MH4518': 'Simulation Techniques in Finance',
    'MH4519': 'Financial Econometrics',
    'MH4520': 'High Dimensional Probability',
    'MH4521': 'Reinforcement Learning',
    'MH4601': 'Differential Geometry',
    'MH4700': 'Numerical Analysis II',
    'MH4701': 'Mathematical Programming',
    'MH4702': 'Probabilistic Methods in OR',
    'MH4712': 'Geometric Methods in Mathematical Physics',
    'HE3002': 'Macroeconomics III',
    'HW0218': 'Communication Across the Sciences',
    'MH7002': 'Discrete Methods',
    'HE3003': 'Econometrics II',
    'PS0002': 'Introduction to Data Science and Artificial Intelligence'
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
