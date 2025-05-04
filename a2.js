document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const page = link.getAttribute("href");
            window.location.href = page;
        });
    });

    //button page navigation
    document.querySelector(".stock-btn")?.addEventListener("click", () => {
        window.location.href = "stocks.html";
    });
    document.querySelector(".dog-btn")?.addEventListener("click", () => {
        window.location.href = "dogs.html";
    });


    //voice listening
    if(annyang) {
        const commands = {
            "hello": () => alert("Hello World!"),            
            "change the color to *color": (color) => {
                const colors = {
                    red: "red",
                    blue: "blue",
                    green: "green",
                    yellow: "yellow",
                    purple: "purple",
                    orange: "orange"
                };
                const selected = colors[color.toLowerCase()];
                if(selected){
                    document.body.style.backgroundColor = selected;
                }
            },
            "navigate to *page": (page) => window.location.href = `${page.toLowerCase()}.html`,
            "lookup *ticker": (ticker) => {
                document.getElementById('ticker').value = ticker.toUpperCase();
                document.getElementById('days').value = '30';
                document.getElementById('stocksearch').click();
            },
            "load dog breed *breed": (breed) => {
                const buttons = document.querySelectorAll('.breed-btns');
                buttons.forEach(btn => {
                    if(btn.textContent.toLowerCase() === breed.toLowerCase()) {
                        btn.click();
                    }
                });
            }
        };
        annyang.addCommands(commands);
        annyang.start();
    }

    //voice listening buttons
    document.getElementById("start-audio")?.addEventListener("click", () => {
        annyang?.start();
    });
    document.getElementById("stop-audio")?.addEventListener("click", () => {
        annyang?.abort();
    });


    //quote
    fetch("https://zenquotes.io/api/random")
        .then((response) => response.json())
        .then((data) => {
            const quoteText = data[0].q;
            const author = data[0].a;
            document.getElementById("quote").textContent = `"${quoteText}" - ${author}`;  
        })
        .catch((error) => {
            document.getElementById("quote").textContent = "Quote could not be loaded.";
            console.error("Quote error:", error);
        })
});