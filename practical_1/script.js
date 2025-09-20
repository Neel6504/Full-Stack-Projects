// Votes object to track current vote counts
let votes = {
    'JavaScript': 0,
    'Python': 0,
    'Java': 0
};

// Function to cast a vote
function vote(language) {
    votes[language]++;
    updateVotes();
}

// Function to update the displayed vote counts
function updateVotes() {
    for (let lang in votes) {
        document.getElementById(lang).textContent = votes[lang];
    }
}

// Simulate real-time votes from other users every 2 seconds
setInterval(() => {
    const languages = Object.keys(votes);
    const randomLang = languages[Math.floor(Math.random() * languages.length)];
    votes[randomLang]++;
    updateVotes();
}, 2000);

// Initial update
updateVotes();
