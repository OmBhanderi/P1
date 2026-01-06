let data = [];

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    const btn = e.target;

    if (!btn) return;

    const type = btn.dataset.type;
    const parentBox = btn.closest(
      ".schools-root ,.school-box ,.standard-box ,.class-box"
    );
    if (type === "school") {
      createSchool();
    }
    if (type === "standard") {
      createStandard(parentBox);
    }
    if (type === "class") {
      createClass(parentBox);
    }
    if (type === "student") {
      createStudent(parentBox);
    }
  } else return;
});

function createSchool() {
  const name = prompt("Enter School Name :");
  const schoolId = `school_${self.crypto.randomUUID()}`;
  const schoolObject = {
    id: schoolId,
    schoolName: name,
    standards: [],
  };
  data.push(schoolObject);
  localStorage.setItem("data", JSON.stringify(data));

  renderSchool(schoolObject);
}

function createStandard(schoolBox) {
  const name = prompt("Enter Standard Name :");
  const standardId = `standard_${self.crypto.randomUUID()}`;
  const standardObject = {
    id: standardId,
    standardName: name,
    classes: [],
  };

  const school = data.find(
    (school) => school.id == schoolBox.dataset.id
  );
  school.standards.push(standardObject);
  localStorage.setItem("data", JSON.stringify(data));
  renderStandard(standardObject, schoolBox);
}

function createClass(standardBox) {
  const name = prompt("Enter Class Name :");
  const classId = `class_${self.crypto.randomUUID()}`;
  const classObject = {
    id: classId,
    className: name,
    students: [],
  };

  const idofStandardBox = standardBox.dataset.id;
  const idOfSchoolBox = standardBox.closest(".school-box").dataset.id;

  const school = data.find((school) => school.id === idOfSchoolBox);
  const standard = school.standards.find(
    (standard) => standard.id === idofStandardBox
  );
  standard.classes.push(classObject);
  localStorage.setItem("data", JSON.stringify(data));

  renderClass(classObject, standardBox);
}

function createStudent(classBox) {
  const inputs =classBox.querySelector(".student-form").querySelectorAll("input");
  const cards = classBox.querySelector(".students-cards");
  const studentId = `student_${self.crypto.randomUUID()}`;

  const [studentName, age, rNo, grade, city] = Array.from(inputs).map(
    (i) => i.value
  );
  if (!studentName) {
    return alert("Please enter at least a name.");
  }

  const studentObject = {
    id: studentId,
    studentName,
    age,
    rNo,
    grade,
    city,
  };

  const idOfSchoolBox = classBox.closest(".school-box").dataset.id;
  const idofStandardBox = classBox.closest(".standard-box").dataset.id;
  const idOfClassBox = classBox.dataset.id;

  const school = data.find((school) => school.id === idOfSchoolBox);
  const standard = school.standards.find(
    (standard) => standard.id === idofStandardBox
  );
  const clas = standard.classes.find((clas) => clas.id === idOfClassBox);

  clas.students.push(studentObject);
  localStorage.setItem("data", JSON.stringify(data));
  renderStudent(studentObject, classBox);
  inputs.forEach((input) => (input.value = ""));
}

function renderSchool(school) {
  const schoolsContainer = document.querySelector(".schools-container");

  const div = `
    <div class="school-box" data-id="${school.id}">
      <div class="school-header">
        <h3>${school.schoolName}</h3>
        <button class="add-btn" data-type="standard">+ Add Standard</button>
      </div>
      <div class="standards-container"></div>
    </div>
  `;

  schoolsContainer.insertAdjacentHTML("beforeend", div);

  return schoolsContainer.lastElementChild;
}

function renderStandard(standard, schoolBox) {
  const container = schoolBox.querySelector(".standards-container");

  const div = `
    <div class="standard-box" data-id="${standard.id}">
      <div class="standard-header">
        <h4>${standard.standardName}</h4>
        <button class="add-btn" data-type="class">+ Add Class</button>
      </div>
      <div class="classes-container"></div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", div);
  return container.lastElementChild;
}

function renderClass(cls, standardBox) {
  const container = standardBox.querySelector(".classes-container");

  const div = `
    <div class="class-box" data-id="${cls.id}">
      <div class="class-header">
        <h5>${cls.className}</h5>
        <button class="add-btn" data-type="student">+ Add Student</button>
      </div>

      <div class="student-form">
        <input type="text" placeholder="Student Name" />
        <input type="number" placeholder="Age" />
        <input type="text" placeholder="Roll No" />
        <input type="text" placeholder="Grade" />
        <input type="text" placeholder="City" />
      </div>

      <div class="students-cards"></div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", div);
  return container.lastElementChild;
}

function renderStudent(student, classBox) {
  const cards = classBox.querySelector(".students-cards");

  const div = `
    <div class="student-card" data-id="${student.id}">
      <p>
        <strong>${student.studentName}</strong>
        | Roll: ${student.rNo}
        | Sec: ${student.grade}
      </p>
      <small>Age: ${student.age}, City: ${student.city}</small>
    </div>
  `;

  cards.insertAdjacentHTML("beforeend", div);
}

function renderAll() {
  const schoolsContainer = document.querySelector(".schools-container");
  schoolsContainer.innerHTML = "";

  data.forEach((school) => {
    const schoolBox = renderSchool(school);

    school.standards.forEach((standard) => {
      const standardBox = renderStandard(standard, schoolBox);

      standard.classes.forEach((cls) => {
        const classBox = renderClass(cls, standardBox);

        cls.students.forEach((student) => {
          renderStudent(student, classBox);
        });
      });
    });
  });
}

window.addEventListener("load", () => {
  const saved = localStorage.getItem("data");
  data = saved ? JSON.parse(saved) : [];

  renderAll();
});
