# Math Notes Repository Structure

## File Naming Convention

All files must follow this standardized pattern:
```
{CourseCode}_{CourseName}_{ExamType}_{Semester}_{AcademicYear}_{MaterialType}.pdf
```
### Examples:
- MH1200_LinearAlgebraI_Finals_Sem1_23-24_QuestionPaper.pdf
- MH1200_LinearAlgebraI_Finals_Sem1_19-20_Solution by QRS.pdf
- MH1100_CalculusI_Midterm_Sem1_21-22_Solution.pdf
- MH1300_FoundationsofMathematics_Finals_Sem1_23-24_Solution Handwritten.pdf
- MH1200_LinearAlgebraI_RevisionNotes.pdf

#### Component Breakdown:
- **{CourseCode}**: Standard NTU course code (e.g. MH1200, HE2001)
- **{CourseName}**: Course name, no spaces (e.g. LinearAlgebraI, CalculusI)
- **{ExamType}**: 'Finals', 'Midterm'
- **{Semester}**: 'Sem1' or 'Sem2'
- **{AcademicYear}**: '23-24' for AY2023-2024
- **{MaterialType}**:
    - 'QuestionPaper': original exam
    - 'Solution': standard solution
        - 'Solution by QRS', 'Solution Handwritten', 'Solution Unofficial': modifier after a space for alternate formats/sources
    - "Examiner's Report": examiner feedback

## Folder Structure

Courses are **organized in folders** named:
```
{CourseCode} - {Course Full Name} - {ExamType}
```
### Examples:
- MH1200 - Linear Algebra I - Finals/
- MH1100 - Calculus I - Midterm/

Inside each folder, files follow the naming convention above.

**Revision Notes**: Placed directly in the course folder:
```
MH1200_LinearAlgebraI_RevisionNotes.pdf
```

## Academic Year Coverage

Each folder may contain multiple years’ material:
- Papers and solutions share the same naming and year
- Solution variants are grouped by material type

## Solution Types Priority

When multiple solution files exist for the same exam year:
1. Official solutions (no modifier)
2. QRS solutions ('Solution by QRS')
3. Unofficial solutions ('Solution Unofficial')
4. Handwritten solutions ('Solution Handwritten')

## Adding New Materials

1. Place in correct folder: e.g., Finals, Midterm
2. Use the **exact format** above, with underscores, case, and years
3. Solution modifiers go after “Solution” with a space
4. Update course README if needed

## Website Integration

- The website scans folders named `{Code} - {Name} - {Type}`
- Files are parsed to extract: year, type, modifier
- Materials are grouped by year and type in the UI
- Revision notes are detected and displayed independently

## Example Repository Structure (Merged)

```
Notes/
├── MH1100/
│   └── MH1100 - Calculus I - Midterm/
│       ├── MH1100_CalculusI_Midterm_Sem1_21-22_QuestionPaper.pdf
│       ├── MH1100_CalculusI_Midterm_Sem1_21-22_Solution.pdf
│       ├── MH1100_CalculusI_Midterm_Sem1_22-23_QuestionPaper.pdf
│       ├── MH1100_CalculusI_Midterm_Sem1_22-23_Solution.pdf
│       └── MH1100_CalculusI_Midterm_Sem1_23-24_QuestionPaper.pdf
├── MH1200/
│   ├── MH1200 - Linear Algebra I - Finals/
│   │   ├── MH1200_LinearAlgebraI_Finals_Sem1_19-20_Solution by QRS.pdf
│   │   ├── MH1200_LinearAlgebraI_Finals_Sem1_21-22_QuestionPaper.pdf
│   │   ├── MH1200_LinearAlgebraI_Finals_Sem1_21-22_Examiner's Report.pdf
│   │   └── MH1200_LinearAlgebraI_Finals_Sem1_23-24_QuestionPaper.pdf
│   └── MH1200_LinearAlgebraI_RevisionNotes.pdf
└── MH1300/
    └── MH1300 - Foundations of Mathematics - Finals/
        └── MH1300_FoundationsofMathematics_Finals_Sem1_23-24_Solution Handwritten.pdf
```

## Website Display

- Shows per-year, per-type indicators (Paper, Solution, Report) for each course/exam type
- Differentiates solution types with badges
- Enables searching by course code/name/year/type
- Supports direct linking to materials and folders
