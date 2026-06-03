const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The regex will match: <img src="..." alt="Maria Lujan Rojas" class="reviewer-avatar">
html = html.replace(/<img src="[^"]+" alt="([^"]+)" class="reviewer-avatar">/g, (match, name) => {
    // Generate a UI-Avatar URL based on the name.
    const urlName = encodeURIComponent(name);
    // UI Avatars mimic Google defaults well.
    return `<img src="https://ui-avatars.com/api/?name=${urlName}&background=random&color=fff&size=150" alt="${name}" class="reviewer-avatar">`;
});

fs.writeFileSync('index.html', html);
console.log('Avatars replaced successfully.');
