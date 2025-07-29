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

// Age calculation
document.getElementById('age-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const day = parseInt(document.getElementById('day').value);
  const month = parseInt(document.getElementById('month').value);
  const year = parseInt(document.getElementById('year').value);
  const output = document.getElementById('output');
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = "";

  if (!isValidDate(day, month, year)) {
    output.innerHTML = "<li>⚠️ Please enter a valid date of birth!</li>";
    output.style.color = "red";
    return;
  }

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

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
  localStorage.removeItem('lastAge');
});

// Validate input date
function isValidDate(day, month, year) {
  if (!day || !month || !year) return false;
  const date = new Date(year, month - 1, day);
  const today = new Date();
  return (
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year &&
    date <= today
  );
}
