document.getElementById('generateEvent').addEventListener('click', function() {
    const organizerName = document.getElementById('organizerName').value;
    const organizerEmail = document.getElementById('organizerEmail').value;
    const eventName = document.getElementById('eventName').value;
    const eventDescription = document.getElementById('eventDescription').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventStart = document.getElementById('eventStart').value;
    const eventEnd = document.getElementById('eventEnd').value || eventStart;

    const icsContent = `
BEGIN:VCALENDAR
PRODID:-//apgyorfi.dev//v1.0-beta-240605//HU
VERSION:2.0
METHOD:REQUEST
BEGIN:VEVENT
ORGANIZER;CN=${organizerName}:MAILTO:${organizerEmail}
ATTENDEE;CN=${organizerName}:MAILTO:${organizerEmail}
SUMMARY:${eventName}
DESCRIPTION:${eventDescription}
LOCATION:${eventLocation}
DTSTART:${formatDateTime(eventStart)}
DTEND:${formatDateTime(eventEnd)}
END:VEVENT
END:VCALENDAR`.trim();

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const fileName = normalizeString(eventName)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') 
        .replace(/\s+/g, '-');  
    
    document.getElementById('downloadICS').onclick = function() {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.ics`;
        link.click();
    };
    
    const gCalLink = generateGCalLink({
        organizerName,
        organizerEmail,
        eventName,
        eventDescription,
        eventLocation,
        eventStart,
        eventEnd
    });

    document.getElementById('generateGCalLink').onclick = function() {
        document.getElementById('gCalLink').value = gCalLink;
        document.getElementById('gCalLinkSection').style.display = 'block';
    };

    document.getElementById('generatedSection').style.display = 'block';
});

document.getElementById('copyGCalLink').addEventListener('click', function() {
    const gCalLink = document.getElementById('gCalLink');
    gCalLink.select();
    gCalLink.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    alert(userLang.startsWith('hu') ? 'A Google Calendar link másolva a vágólapra.' : 'Google Calendar link copied to clipboard.');
});

function formatDateTime(dateTime) {
    const dt = new Date(dateTime);
    return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function generateGCalLink(event) {
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const text = encodeURIComponent(event.eventName);
    const dates = `${formatDateTime(event.eventStart)}/${formatDateTime(event.eventEnd)}`;
    const details = encodeURIComponent(event.eventDescription);
    const location = encodeURIComponent(event.eventLocation);
    const timeZone = 'Europe/Budapest';
    
    return `${baseUrl}&dates=${dates}&ctz=${timeZone}&text=${text}&location=${location}&details=${details}`;
}

// Localization based on browser language
const userLang = navigator.language || navigator.userLanguage;
if (userLang.startsWith('hu')) {
    document.getElementById('title').textContent = 'Esemény hozzáadása';
    document.getElementById('labelOrganizerName').textContent = 'Szervező neve';
    document.getElementById('labelOrganizerEmail').textContent = 'Szervező e-mail címe';
    document.getElementById('labelEventName').textContent = 'Esemény neve';
    document.getElementById('labelEventDescription').textContent = 'Leírás';
    document.getElementById('labelEventLocation').textContent = 'Helyszín';
    document.getElementById('labelEventStart').textContent = 'Kezdés időpontja';
    document.getElementById('labelEventEnd').textContent = 'Befejezés időpontja';
    document.getElementById('generateEvent').textContent = 'Generálás';
    document.getElementById('downloadICS').textContent = 'Letöltés .ics formátumban';
    document.getElementById('generateGCalLink').textContent = 'Google Calendar link generálása';
    document.getElementById('labelGCalLink').textContent = 'Google Calendar link';
    document.getElementById('copyGCalLink').textContent = 'Másolás';
}
