// Theme toggle
const themeToggleBtn = document.getElementById('toggle-theme');
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Load saved theme and age on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const savedAge = localStorage.getItem('lastAge');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggleBtn.textContent = '☀️ Light Mode';
  }

  if (savedAge) {
    document.getElementById('output').innerHTML = savedAge;
  }
});

// Age calculation with calendar selection
document.getElementById('age-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const day = parseInt(document.getElementById('day').value);
  const month = parseInt(document.getElementById('month').value);
  const year = parseInt(document.getElementById('year').value);
  const calendar = document.getElementById('calendar')?.value || 'gc'; // default GC

  const output = document.getElementById('output');
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = "";

  if (!isValidDate(day, month, year, calendar)) {
    output.innerHTML = "<li>⚠️ Please enter a valid date of birth!</li>";
    output.style.color = "red";
    return;
  }

  let birthDate;

  if (calendar === 'ec') {
    birthDate = convertECtoGC(year, month, day);
  } else {
    birthDate = new Date(year, month - 1, day);
  }

  const today = new Date();

  if (birthDate > today) {
    output.innerHTML = "<li>⚠️ Birth date cannot be in the future!</li>";
    output.style.color = "red";
    return;
  }

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();
  let ageDays = today.getDate() - birthDate.getDate();

  if (ageDays < 0) {
    ageMonths--;
    ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  const resultText = `${ageYears} Years, ${ageMonths} Months, ${ageDays} Days`;
  output.innerHTML = `<li>${resultText}</li>`;
  output.style.color = ""; // Reset to default
  localStorage.setItem('lastAge', `<li>${resultText}</li>`);

  document.getElementById('age-form').reset();
});

// Reset button
document.getElementById('reset-btn').addEventListener('click', () => {
  document.getElementById('age-form').reset();
  document.getElementById('output').innerHTML = "<li>--</li>";
  document.getElementById('output').style.color = "#333";
  document.getElementById('error').textContent = "";
  localStorage.removeItem('lastAge');
});

// Validate input date for both GC and EC
function isValidDate(day, month, year, calendar) {
  if (!day || !month || !year) return false;

  if (calendar === 'ec') {
    // Basic validation for Ethiopian calendar dates
    if (month < 1 || month > 13) return false;
    if (day < 1) return false;

    // Months 1-12 have 30 days, 13th month has 5 or 6 days
    if (month <= 12 && day > 30) return false;

    if (month === 13) {
      // Leap year check in EC (every 4 years)
      const isLeap = (year + 1) % 4 === 0;
      if (isLeap && day > 6) return false;
      if (!isLeap && day > 5) return false;
    }

    return true;
  } else {
    // Gregorian validation
    const date = new Date(year, month - 1, day);
    const today = new Date();
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year &&
      date <= today
    );
  }
}

// Approximate Ethiopian to Gregorian date converter
function convertECtoGC(ecYear, ecMonth, ecDay) {
  // Ethiopian new year is usually on Sept 11 GC, or Sept 12 in GC leap years.
  // This simple method adds 7 or 8 years and adjusts months.
  // For better accuracy, consider a dedicated library.

  // Offset between Ethiopian and Gregorian years
  const gcYear = ecYear + 7;

  // Months offset: EC is about 8 months behind GC
  let gcMonth = ecMonth + 8;
  let gcYearAdjusted = gcYear;

  if (gcMonth > 12) {
    gcMonth -= 12;
    gcYearAdjusted += 1;
  }

  return new Date(gcYearAdjusted, gcMonth - 1, ecDay);
}
