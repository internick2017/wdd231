document.addEventListener("DOMContentLoaded", () => {
  // Course data - as provided in the assignment
  const courses = [
    {
      subject: "CSE",
      number: 110,
      title: "Introduction to Programming",
      credits: 2,
      certificate: "Web and Computer Programming",
      description:
        "This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.",
      technology: ["Python"],
      completed: true,
    },
    {
      subject: "WDD",
      number: 130,
      title: "Web Fundamentals",
      credits: 2,
      certificate: "Web and Computer Programming",
      description:
        "This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.",
      technology: ["HTML", "CSS"],
      completed: true,
    },
    {
      subject: "CSE",
      number: 111,
      title: "Programming with Functions",
      credits: 2,
      certificate: "Web and Computer Programming",
      description:
        "CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.",
      technology: ["Python"],
      completed: true,
    },
    {
      subject: "CSE",
      number: 210,
      title: "Programming with Classes",
      credits: 2,
      certificate: "Web and Computer Programming",
      description:
        "This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.",
      technology: ["C#"],
      completed: false,
    },
    {
      subject: "WDD",
      number: 131,
      title: "Dynamic Web Fundamentals",
      credits: 2,
      certificate: "Web and Computer Programming",
      description:
        "This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.",
      technology: ["HTML", "CSS", "JavaScript"],
      completed: false,
    },
    {
      subject: "WDD",
      number: 231,
      title: "Frontend Web Development I",
      credits: 2,
      certificate: "Web and Computer Programming",
      description:
        "This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.",
      technology: ["HTML", "CSS", "JavaScript"],
      completed: false,
    },
  ];

  // Get DOM elements
  const coursesContainer = document.getElementById("courses-container");
  const totalCreditsElement = document.getElementById("total-credits");
  const allButton = document.getElementById("all-btn");
  const cseButton = document.getElementById("cse-btn");
  const wddButton = document.getElementById("wdd-btn");
  const modal = document.getElementById("course-modal");
  const closeButton = document.getElementById("close-modal");

  // Function to display the modal with course details
  function displayCourseModal(course) {
    // Populate modal with course data
    document.getElementById(
      "modal-subject-number"
    ).textContent = `${course.subject} ${course.number}`;
    document.getElementById("modal-title").textContent = course.title;
    document.getElementById("modal-credits").textContent = course.credits;
    document.getElementById("modal-description").textContent =
      course.description;
    document.getElementById("modal-certificate").textContent =
      course.certificate;

    // Clear and populate tech stack
    const techStackList = document.getElementById("modal-tech-stack");
    techStackList.innerHTML = "";
    course.technology.forEach((tech) => {
      const li = document.createElement("li");
      li.textContent = tech;
      techStackList.appendChild(li);
    });

    // Show the modal
    modal.showModal();
  }

  // Function to display courses
  function displayCourses(courseList) {
    // Clear the container
    coursesContainer.innerHTML = "";

    // Create course cards
    courseList.forEach((course) => {
      const courseCard = document.createElement("div");
      courseCard.className = `course-card ${
        course.completed ? "completed" : "not-completed"
      }`;

      // Create course code by combining subject and number
      const courseCode = `${course.subject} ${course.number}`;

      // Create course content
      courseCard.innerHTML = `
          <p class="course-code">${courseCode}</p>
          <p class="course-title">${course.title}</p>
          <p class="course-credits">${course.credits} credits</p>
        `;

      // Add click event listener to open modal when card is clicked
      courseCard.addEventListener("click", () => {
        displayCourseModal(course);
      });

      coursesContainer.appendChild(courseCard);
    });

    // Calculate and display total credits using reduce
    const totalCredits = courseList.reduce(
      (total, course) => total + course.credits,
      0
    );
    totalCreditsElement.textContent = totalCredits;
  }

  // Function to set active button
  function setActiveButton(button) {
    // Remove active class from all buttons
    [allButton, cseButton, wddButton].forEach((btn) => {
      btn.classList.remove("active");
    });
    // Add active class to selected button
    button.classList.add("active");
  }

  // Event listeners for filter buttons
  allButton.addEventListener("click", () => {
    setActiveButton(allButton);
    displayCourses(courses);
  });

  cseButton.addEventListener("click", () => {
    setActiveButton(cseButton);
    // Use filter method to get CSE courses
    const cseList = courses.filter((course) => course.subject === "CSE");
    displayCourses(cseList);
  });

  wddButton.addEventListener("click", () => {
    setActiveButton(wddButton);
    // Use filter method to get WDD courses
    const wddList = courses.filter((course) => course.subject === "WDD");
    displayCourses(wddList);
  });

  // Close modal when clicking the close button
  closeButton.addEventListener("click", () => {
    modal.close();
  });

  // Close modal when clicking outside the modal
  modal.addEventListener("click", (event) => {
    // Check if the click is on the dialog itself (backdrop) and not its content
    if (event.target === modal) {
      modal.close();
    }
  });

  // Initial display of all courses
  displayCourses(courses);
});
