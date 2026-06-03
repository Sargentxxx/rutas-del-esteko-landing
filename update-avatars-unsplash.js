const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const avatars = {
    "Maria Lujan Rojas": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    "Gabriela Roldán": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    "Carolina Yeck": "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80",
    "Esteban Gimenez": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    "Andrea Apesteguia": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80",
    "Patricia Sanchez": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    "Lautaro Veron": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
    "Santiago Coronel": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    "Mar Marquez": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    "Julieta Mansilla": "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=150&q=80",
    "anahi salvatierra": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    "Ramon Juarez": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
};

// Replace UI-Avatars or any avatar matching the pattern.
html = html.replace(/<img src="[^"]+" alt="([^"]+)" class="reviewer-avatar">/g, (match, name) => {
    const url = avatars[name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;
    return `<img src="${url}" alt="${name}" class="reviewer-avatar">`;
});

fs.writeFileSync('index.html', html);
console.log('Avatars replaced with 12 distinct realistic images successfully.');
