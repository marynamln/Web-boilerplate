const testModules = require('./test-module');
require('../css/app.css');
//import { teachers } from './test-module.js';

document.addEventListener('DOMContentLoaded', function () {

// ======================================= teachers cards =============================================================

  const teacherList = document.querySelector('.teachers');
  const favoriteTeacherList = document.getElementById('favoriteTeachersList');
  const dialogTeacherInfo = document.getElementById('infoTeacher');
  const closeInfoButton = dialogTeacherInfo.querySelector('.closeInfo');
  const starInfoButton = dialogTeacherInfo.querySelector('.t-star');
  let currentTeacher;
  let teachers = [];

  // teachers.forEach(teacher => {
  //   const teacherCard = createTeacherCard(teacher);
  //   teacherList.appendChild(teacherCard);

  //   if(teacher.favorite){
  //     const favoriteTeacherCard = createFavoriteTeacherCard(teacher);
  //     favoriteTeacherList.appendChild(favoriteTeacherCard);
  //   }
  // });

  fetch('https://randomuser.me/api/?results=50')
    .then(response => response.json())
    .then(data => {
      teachers = data.results.map(user => ({
        full_name: `${user.name.first} ${user.name.last}`,
        picture_large: user.picture.large,
        course: getRandomCourse(),
        country: user.location.country,
        age: user.dob.age,
        gender: capitalize(user.gender),
        email: user.email,
        phone: user.phone,
        favorite: getRandomFavorite(), 
        bg_color: getRandomColor(), 
        note: "No additional information"
    }));

    teachers.forEach(teacher => {
      const teacherCard = createTeacherCard(teacher);
      teacherList.appendChild(teacherCard);

      if(teacher.favorite){
        const favoriteTeacherCard = createFavoriteTeacherCard(teacher);
        favoriteTeacherList.appendChild(favoriteTeacherCard);
      }
    });

    fillTablePaginated(teachers, currentPage);
    setupPagination(teachers);
    setupSorting();
  })
  .catch(error => console.error('Error fetching data:', error));

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  function getRandomCourse() {
    const courses = [
      "Mathematics", "Physics", "English", "Computer Science", "Dancing", 
      "Chess", "Biology", "Chemistry", "Law", "Art", "Medicine", "Statistics"
    ];
    return courses[Math.floor(Math.random() * courses.length)];
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getRandomFavorite() {
    const favorite = [
      true, false
    ];
    return favorite[Math.floor(Math.random() * favorite.length)];
  }

  function createTeacherCard(teacher) {
    const techerCard = document.createElement('li');
    techerCard.classList.add('teacherCard');
      
    if (teacher.favorite) {
      techerCard.id = 'stared';
    }
  
    techerCard.innerHTML = `
      <div class="avatar">
        <div class="avatarImg" style="border-color: ${teacher.bg_color};">
          <img src="${teacher.picture_large}" alt="${teacher.full_name[0]}${teacher.full_name.split(' ')[1][0]}">
          <div class="initials">${teacher.full_name[0]}${teacher.full_name.split(' ')[1][0]}</div>
        </div>
        ${teacher.favorite ? '<span class="star">★</span>' : ''}
      </div>
      <h3 class="teachersName">${teacher.full_name.split(' ')[0]}<br>${teacher.full_name.split(' ')[1]}</h3>
      <h4 class="teachersSpeciality">${teacher.course}</h4>
      <h5 class="teachersCountry">${teacher.country}</h5>
    `;
  
    techerCard.addEventListener('click', () => {
      dialogTeacherInfo.querySelector('.teacherPhoto').src = teacher.picture_large;
      dialogTeacherInfo.querySelector('.teacherName').textContent = teacher.full_name;
      dialogTeacherInfo.querySelector('.teacherSpeciality').textContent = teacher.course;
      dialogTeacherInfo.querySelector('.teacherCountry').textContent = teacher.country;
      dialogTeacherInfo.querySelector('.teacherAge').textContent = `${teacher.age}, ${teacher.gender}`;
      dialogTeacherInfo.querySelector('.teacherEmail').textContent = teacher.email;
      dialogTeacherInfo.querySelector('.teacherEmail').href = `mailto:${teacher.email}`;
      dialogTeacherInfo.querySelector('.teacherTel').textContent = teacher.phone;
      dialogTeacherInfo.querySelector('.infoDescription').textContent = teacher.note;
  
      currentTeacher = teacher;
      starInfoButton.textContent = teacher.favorite ? '★' : '☆';
  
      dialogTeacherInfo.showModal();
      dialogTeacherInfo.style.display = 'block';
    });
  
    return techerCard;
  }

  function createFavoriteTeacherCard(teacher){
    const favoriteTeacherCard = document.createElement('li');
    favoriteTeacherCard.classList.add('teacherCardFavorite');

    favoriteTeacherCard.innerHTML = `
      <div class="avatar">
        <div class="avatarImg" style="border-color: ${teacher.bg_color};">
          <img src="${teacher.picture_large}" alt="${teacher.full_name[0]}${teacher.full_name.split(' ')[1][0]}">
          <div class="initials">${teacher.full_name[0]}${teacher.full_name.split(' ')[1][0]}</div>
        </div>
      </div>
      <h3 class="teachersName">${teacher.full_name.split(' ')[0]}<br>${teacher.full_name.split(' ')[1]}</h3>
      <h5 class="teachersCountry">${teacher.country}</h5>
    `;

    favoriteTeacherCard.addEventListener('click', () => {
      dialogTeacherInfo.querySelector('.teacherPhoto').src = teacher.picture_large;
      dialogTeacherInfo.querySelector('.teacherName').textContent = teacher.full_name;
      dialogTeacherInfo.querySelector('.teacherSpeciality').textContent = teacher.course;
      dialogTeacherInfo.querySelector('.teacherCountry').textContent = teacher.country;
      dialogTeacherInfo.querySelector('.teacherAge').textContent = `${teacher.age}, ${teacher.gender}`;
      dialogTeacherInfo.querySelector('.teacherEmail').textContent = teacher.email;
      dialogTeacherInfo.querySelector('.teacherEmail').href = `mailto:${teacher.email}`;
      dialogTeacherInfo.querySelector('.teacherTel').textContent = teacher.phone;
      dialogTeacherInfo.querySelector('.infoDescription').textContent = teacher.note;
  
      currentTeacher = teacher;
      starInfoButton.textContent = teacher.favorite ? '★' : '☆';
  
      dialogTeacherInfo.showModal();
      dialogTeacherInfo.style.display = 'block';
    });

    return favoriteTeacherCard;      
  }
  
  closeInfoButton.addEventListener('click', () => {
    dialogTeacherInfo.close();
    dialogTeacherInfo.style.display = 'none';
  });
  
  starInfoButton.addEventListener('click', () => {
    currentTeacher.favorite = !currentTeacher.favorite;
    starInfoButton.textContent = currentTeacher.favorite ? '★' : '☆';
  
    const teacherCard = Array.from(teacherList.children).find(card =>       
      card.querySelector('.teachersName').textContent === currentTeacher.full_name.replace(/\s+/, '')
    );

    if (teacherCard) {

      let starSpan = teacherCard.querySelector('.star');
        
      if (currentTeacher.favorite) {
        if (!starSpan) {
          starSpan = document.createElement('span');
          starSpan.classList.add('star');
          teacherCard.querySelector('.avatar').appendChild(starSpan);
        }
        starSpan.textContent = '★';
        teacherCard.id = 'stared';

        const favoriteTeacherCard = createFavoriteTeacherCard(currentTeacher);
        favoriteTeacherList.appendChild(favoriteTeacherCard);

      } else {
        starSpan.textContent = '';
        teacherCard.removeAttribute('id');
  
        const favoriteTeacherCard = Array.from(favoriteTeacherList.children).find(card => 
          card.querySelector('.teachersName').textContent === currentTeacher.full_name.replace(/\s+/, '')
        );

        if (favoriteTeacherCard) {
          favoriteTeacherList.removeChild(favoriteTeacherCard);
        }
      }
    }
  });

  const sliderBody = document.querySelector('.sliderBody');
  const prevBtn = document.querySelector('.prevBtn');
  const nextBtn = document.querySelector('.nextBtn');
    
  const scrollAmount = 165;

  prevBtn.addEventListener('click', () => {
    sliderBody.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });

  nextBtn.addEventListener('click', () => {
    sliderBody.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });

// ================================================= filters =======================================================================
    
  document.getElementById('selectAge').addEventListener('change', filterTeachers);
  document.getElementById('selectRegion').addEventListener('change', filterTeachers);
  document.getElementById('selectSex').addEventListener('change', filterTeachers);
  document.getElementById('checkboxPhoto').addEventListener('change', filterTeachers);
  document.getElementById('checkboxFavorites').addEventListener('change', filterTeachers);
    
  function filterTeachers() {
    const selectedAge = document.getElementById('selectAge').value;
    const selectedCountry = document.getElementById('selectRegion').value;
    const selectedGender = document.getElementById('selectSex').value;
    const onlyWithPhoto = document.getElementById('checkboxPhoto').checked;
    const onlyFavorites = document.getElementById('checkboxFavorites').checked;
  
    const filteredTeachers = teachers.filter(teacher => {
        const matchesAge = !selectedAge || checkAgeRange(teacher.age, selectedAge);
        const matchesCountry = !selectedCountry || teacher.country === selectedCountry;
        const matchesGender = !selectedGender || teacher.gender.toLocaleLowerCase() === selectedGender;
        const matchesPhoto = !onlyWithPhoto || teacher.picture_large !== "";
        const matchesFavorites = !onlyFavorites || teacher.favorite;
  
        return matchesAge && matchesCountry && matchesGender && matchesPhoto && matchesFavorites;
    });
  
    teacherList.innerHTML = "";
  
    filteredTeachers.forEach(teacher => {
        const teacherCard = createTeacherCard(teacher);
        teacherList.appendChild(teacherCard);
    });

    fillTablePaginated(filteredTeachers, currentPage);
    setupPagination(filteredTeachers);
  }
  
  function checkAgeRange(age, range) {
      const [min, max] = range.split('-').map(Number);
      return age >= min && age <= max;
  }

// ========================================= search ==================================================================
// Vestibulum

  document.querySelector('.searchButton').addEventListener('click', function() {
    const searchInput = document.querySelector('.searchInput').value.trim();
    searchTeachers(searchInput);
  });
    
  function searchTeachers(query) {
      const regexForAge = /([<>]=?|=)?\s*(\d+)/;
      let ageCondition = null;
        
      if (regexForAge.test(query)) {
          const [, operator, value] = query.match(regexForAge);
          ageCondition = { operator: operator || '=', value: Number(value) };
      }
    
      const filteredTeachers = teachers.filter(teacher => {
          const matchesNameOrNote = teacher.full_name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
                                    teacher.note.toLocaleLowerCase().includes(query.toLocaleLowerCase());
          const matchesAge = !ageCondition || checkAge(teacher.age, ageCondition);
    
          if (ageCondition) {
            return matchesAge; 
          } else {
            return matchesNameOrNote;
          }
      });
    
      teacherList.innerHTML = "";
    
      filteredTeachers.forEach(teacher => {
        const teacherCard = createTeacherCard(teacher);
        teacherList.appendChild(teacherCard);
      });

      fillTablePaginated(filteredTeachers, currentPage);
      setupPagination(filteredTeachers);

  }
    
    function checkAge(age, condition) {
        const { operator, value } = condition;
    
        switch (operator) {
            case '>':
                return age > value;
            case '>=':
                return age >= value;
            case '<':
                return age < value;
            case '<=':
                return age <= value;
            case '=':
            case '':
                return age === value;
            default:
                return false;
        }
    }
    
// =================================================== table =========================================================================

  let currentPage = 1;
  const rowsPerPage = 10;
  let currentSort = { field: '', direction: 'asc' };

  // fillTablePaginated(teachers, currentPage);
  // setupPagination(teachers);
  // setupSorting();

  function fillTablePaginated(teachers, page) {
    const tableBody = document.querySelector('.statisticsTable tbody');
    tableBody.innerHTML = ""; 

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedTeachers = teachers.slice(start, end);

    paginatedTeachers.forEach(teacher => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="t-name">${teacher.full_name}</td>
        <td class="t-speciality">${teacher.course}</td>
        <td class="t-age">${teacher.age}</td>
        <td class="t-gender">${teacher.gender}</td>
        <td class="t-nationality">${teacher.country}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  const paginationContainer = document.querySelector('.pagination');

  function setupPagination(teachers) {
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(teachers.length / rowsPerPage);

    const firstPageLink = document.createElement('a');
    firstPageLink.href = "#";
    firstPageLink.classList.add('page-link');
    firstPageLink.textContent = "First";

    firstPageLink.addEventListener('click', function(e) {
      e.preventDefault();
      currentPage = 1;
      fillTablePaginated(teachers, currentPage);
      setupPagination(teachers);
    });
    paginationContainer.appendChild(firstPageLink);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = "#";
      pageLink.classList.add('page-link');
      pageLink.textContent = i;

      if (i === currentPage) {
        pageLink.classList.add('active');
      }

      pageLink.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = i;
        fillTablePaginated(teachers, currentPage);
        setupPagination(teachers);
      });

      paginationContainer.appendChild(pageLink);
    }

    const lastPageLink = document.createElement('a');
    lastPageLink.href = "#";
    lastPageLink.classList.add('page-link');
    lastPageLink.textContent = "Last";
    lastPageLink.addEventListener('click', function(event) {
        event.preventDefault();
        currentPage = totalPages;
        fillTablePaginated(teachers, currentPage);
        setupPagination(teachers);
    });

    paginationContainer.appendChild(lastPageLink);
  }

  function sortTeachers(teachers, field, direction) {
    return teachers.sort((a, b) => {
      let fieldA = a[field];
      let fieldB = b[field];

      if (field === 'age') {
        fieldA = parseInt(fieldA);
        fieldB = parseInt(fieldB);
      }

      if (fieldA < fieldB) return direction === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return direction === 'asc' ? 1 : -1;

      return 0;
   });
  }

  function setupSorting() {
    const nameHeader = document.getElementById('t-title'); 
    const courseHeader = document.getElementById('t-speciality'); 
    const ageHeader = document.getElementById('t-age'); 
    const countryHeader = document.getElementById('t-country');

    nameHeader.addEventListener('click', () => handleSort('full_name'));
    courseHeader.addEventListener('click', () => handleSort('course'));
    ageHeader.addEventListener('click', () => handleSort('age'));
    countryHeader.addEventListener('click', () => handleSort('country'));
  }

  function handleSort(field) {
    if (currentSort.field === field) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.field = field;
      currentSort.direction = 'asc';
    }

    const sortedTeachers = sortTeachers(teachers, currentSort.field, currentSort.direction);
    fillTablePaginated(sortedTeachers, currentPage);
    setupPagination(sortedTeachers);
  }

// ================================================ load more =================================================================
  const nextTeachers = document.querySelector('.nextButton');

  nextTeachers.addEventListener('click', function(e) {
    e.preventDefault();
    fetchMoreUsers();
  });

  function fetchMoreUsers() {
    fetch('https://randomuser.me/api/?results=10')
      .then(response => response.json())
      .then(data => {
        const newTeachers = data.results.map(user => ({
          full_name: `${user.name.first} ${user.name.last}`,
          picture_large: user.picture.large,
          course: getRandomCourse(),
          country: user.location.country,
          age: user.dob.age,
          gender: capitalize(user.gender),
          email: user.email,
          phone: user.phone,
          favorite: getRandomFavorite(),
          bg_color: getRandomColor(),
          note: "No additional information"
        }));
  
        teachers = [...teachers, ...newTeachers];
  
        fillTablePaginated(teachers, currentPage);
  
        newTeachers.forEach(teacher => {
          const teacherCard = createTeacherCard(teacher);
          teacherList.appendChild(teacherCard);
  
          if(teacher.favorite) {
            const favoriteTeacherCard = createFavoriteTeacherCard(teacher);
            favoriteTeacherList.appendChild(favoriteTeacherCard);
          }
        });
  
        setupPagination(teachers);
      })
      .catch(error => console.error('Error fetching more users:', error));
  }
  

// ================================================ add teacher ===============================================================

  const addTeacherButtons = document.querySelectorAll('.addTeacherButton'); 
  const createTeacherDialog = document.querySelector('#createTeacher');
  const closeFormButton = createTeacherDialog.querySelector('.close');

  addTeacherButtons.forEach(button => {
    button.addEventListener('click', function () {
      createTeacherDialog.showModal();
    });
  });

  closeFormButton.addEventListener('click', function() {
      createTeacherDialog.close();
  });

  document.querySelector('.form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const speciality = document.getElementById('formSpeciality').value;
    const country = document.getElementById('formCountry').value;
    const city = document.getElementById('formCity').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const dob = document.getElementById('formDate').value;
    const genderInput = document.querySelector('input[name="sex"]:checked');
    const gender = genderInput ? genderInput.value : '';
    const backgroundColor = document.getElementById('formBackgroung').value;
    const notes = document.getElementById('formNotes').value.trim();

    if (!name || !speciality || !country || !city || !email || !phone || !dob || !gender) {
        alert("Please fill all the required fields!");
        return;
    }

    if (!email.includes('@')) {
      alert("Please enter a valid email address!");
      return;
    }
    
    if (!/^\d+$/.test(phone)) {
        alert("Please enter a valid phone number (digits only)!");
        return;
    }

    if (calculateAge(dob) < 18) {
        alert("You must be at least 18 years old!");
        return;
    }

    const formattedName = name.split(' ').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLocaleLowerCase()).join(' ');
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1).toLocaleLowerCase();

    const newTeacher = {
        full_name: formattedName,
        course: speciality,
        country: country,
        city: formattedCity,
        email: email,
        phone: phone,
        b_day: dob,
        age: calculateAge(dob),
        gender: gender,
        bg_color: backgroundColor || 'rgb(246,99,78)',
        note: notes,
        picture_large: '',
        favorite: false
    };

    // teachers.push(newTeacher);
    // updateTeacherList();

    // fillTablePaginated(teachers, currentPage);
    // setupPagination(teachers);

    // document.querySelector('.form').reset();

    fetch('http://localhost:3000/teachers', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTeacher)
    })
    .then(response => response.json())
    .then(data => {
        teachers.push(data);
        updateTeacherList();

        fillTablePaginated(teachers, currentPage);
        setupPagination(teachers);

        document.querySelector('.form').reset();
    })
    .catch(error => console.error('Error:', error));
  });

  function calculateAge(birthDate) {
    const dob = new Date(birthDate);
    const today = new Date();
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age;
  }

  function updateTeacherList() {
    teacherList.innerHTML = "";
    teachers.forEach(teacher => {
        const teacherCard = createTeacherCard(teacher);
        teacherList.appendChild(teacherCard);
    });
  }

});