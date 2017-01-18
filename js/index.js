document.addEventListener('DOMContentLoaded', function(e){
    let consoleInput = document.getElementById('console-input');
    let consoleElement = document.getElementById('console');

    var overpass = new FontFaceObserver('Overpass Mono');
    overpass.load().then(function () { 
        let profession = document.getElementById('profession');
        profession.className += ' fonts-loaded';
        consoleElement.className += ' fonts-loaded';
        consoleInput.className += ' fonts-loaded';
    });

    var firasans = new FontFaceObserver('Fira Sans Extra Condensed');
    firasans.load().then(function () {
        let container = document.getElementById('container');
        container.className += ' fonts-loaded';
    });

    var cormorant = new FontFaceObserver('Cormorant SC');
    cormorant.load().then(function () {
        let name = document.getElementById('name');
        name.className += ' fonts-loaded';
    });

    let con = new Console(consoleElement);
    con.print('# Come on! type \'help\'');

    let commands = new Map();
    commands.set('help', cmdHelp);
    commands.set('portfolio', cmdPortfolio);
    commands.set('about', cmdAbout);
    commands.set('skills', cmdSkills);
    commands.set('experience', cmdExperience);
    commands.set('contact', cmdContact);
    commands.set('clear', cmdClear);

    consoleInput.addEventListener('keydown', function (e) {
        if (e.which == 13 || e.keyCode == 13) {
            let cmd = commands.get(consoleInput.value);

            consoleInput.value = '';
            if (cmd != undefined) {
                cmd(con);
            } else {
                con.print("Error: Unknown command.");
            }

            return false;
        }
        
        return true;
    });
});

function cmdHelp(con) {
    con.clear();
    con.print('>help')
    con.print('Here are some basic commands fellow:');
    con.print('portfolio: Opens the portfolio.');
    con.print('about: My story.');
    con.print('skills: What i\'m good at.')
    con.print('experience: Where i worked.');
    con.print('contact: Where you can find me.');
    con.print('clear: Cleanup console.');
}

function cmdPortfolio(con) {
    con.clear();
    con.print('>portfolio');

    let portfolio = document.getElementById('portfolio');
    portfolio.style.display = 'block';
    window.location.hash = '#portfolio';
}

function cmdAbout(con) {
    con.clear();
    con.print('>about');

    let about = document.getElementById('about');
    about.style.display = 'block';
    window.location.hash = '#about';
}

function cmdSkills(con) {
    con.clear();
    con.print('>skills');
}

function cmdExperience(con) {
    con.clear();
    con.print('>experience');
}

function cmdContact(con) {
    con.clear();
    con.print('>contact');
}

function cmdClear(con) {
    con.clear();
    con.print('>clear');
}
