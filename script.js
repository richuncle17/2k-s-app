document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let birthdays = {};
    let monthImages = {};

    function updateCalendar() {
        const monthDisplay = document.getElementById('monthDisplay');
        const calendarGrid = document.getElementById('calendarGrid');
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Set month and year
        monthDisplay.textContent = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;
        
        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });
        
        // Add calendar days
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Check for birthdays
            const birthdayKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            if (birthdays[birthdayKey]) {
                const birthdayElement = document.createElement('div');
                birthdayElement.className = 'birthday';
                birthdayElement.textContent = birthdays[birthdayKey];
                dayElement.appendChild(birthdayElement);
            }

            calendarGrid.appendChild(dayElement);
        }

        // Update displayed image
        const monthKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
        document.getElementById('displayedImage').src = monthImages[monthKey] || 'placeholder.jpg';
    }

    // Event listeners for navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    // Image handling
    document.getElementById('imageInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('displayedImage').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('saveButton').addEventListener('click', function() {
        const monthKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
        monthImages[monthKey] = document.getElementById('displayedImage').src;
        alert('Image saved for this month!');
    });

    document.getElementById('deleteButton').addEventListener('click', function() {
        const monthKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
        delete monthImages[monthKey];
        document.getElementById('displayedImage').src = 'placeholder.jpg';
        alert('Image deleted for this month!');
    });

    // Birthday handling
    document.getElementById('addBirthdayButton').addEventListener('click', function() {
        const name = document.getElementById('nameInput').value;
        const date = document.getElementById('dateInput').value;
        if (name && date) {
            birthdays[date] = name;
            alert('Birthday added!');
            updateCalendar();
            
            // Clear input fields
            document.getElementById('nameInput').value = '';
            document.getElementById('dateInput').value = '';
        } else {
            alert('Please enter a name and select a date.');
        }
    });

    // Search functionality
    document.getElementById('searchButton').addEventListener('click', function() {
        const searchName = document.getElementById('searchInput').value.toLowerCase();
        let found = false;
        for (let date in birthdays) {
            if (birthdays[date].toLowerCase() === searchName) {
                const [year, month, day] = date.split('-');
                currentYear = parseInt(year);
                currentMonth = parseInt(month) - 1;
                updateCalendar();
                found = true;
                break;
            }
        }
        if (!found) {
            alert('Name not found in the calendar.');
        }
    });

    // Delete name functionality
    document.getElementById('deleteNameButton').addEventListener('click', function() {
        const deleteName = document.getElementById('searchInput').value.toLowerCase();
        let deleted = false;
        for (let date in birthdays) {
            if (birthdays[date].toLowerCase() === deleteName) {
                delete birthdays[date];
                updateCalendar();
                deleted = true;
                break;
            }
        }
        if (deleted) {
            alert('Name deleted from the calendar.');
            document.getElementById('searchInput').value = '';
        } else {
            alert('Name not found in the calendar.');
        }
    });

    // Initialize calendar
    updateCalendar();
}); 