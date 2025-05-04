document.addEventListener("DOMContentLoaded", () => {
    const stockInput = document.getElementById("ticker");
    const numDays = document.getElementById("days");
    const lookUp = document.getElementById("stocksearch");
    const redditTable = document.querySelector("#reddit-table tbody");
    const chartCanvas = document.getElementById("stockchart");
    let stockchart;

    //reddit stocks table

    fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03")
    .then(res => res.json())
    .then(data => {
        const top5 = data.slice(0,5);
        top5.forEach(stock => {
            const tr = document.createElement("tr");

            const ticker = document.createElement("td");
            const link = document.createElement("a");
            link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
            link.textContent = stock.ticker;
            link.target = "_blank";
            ticker.appendChild(link);

            const comments = document.createElement("td");
            comments.textContent = stock.no_of_comments;

            const sentiment = document.createElement("td");
            sentiment.innerHTML = stock.sentiment === "Bullish" 
            ? '<span class = "emoji-large">&#128002;</span>' 
            : '<span class = "emoji-large">&#128059;</span>';

            tr.append(ticker, comments, sentiment);
            redditTable.appendChild(tr);
        });
    });


    //stock chart
    lookUp.addEventListener("click", () => {
        const ticker = stockInput.value.toUpperCase();

        if(ticker.length === 0 || ticker.length > 5) {
            alert("Valid ticker is max 5 characters");
            return;
        }

        const days = parseInt(numDays.value);
        const now = new Date();
        const to = Math.floor(now.getTime()/1000);
        const from = to - days * 86400;

        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=IXtYZc1Ke0e4mZOb6J_uOUD5pK6qtJ4F`;

        fetch(url)
        .then(res => res.json())
        .then(data => {
            if(!data.results || data.results.length === 0){
                throw new Error("No data returned from API.");
            }
            const labels = data.results.map(item => new Date(item.t).toLocaleDateString());
            const values = data.results.map(item => item.c);

            if(stockchart) stockchart.destroy();

            chartCanvas.style.display = "block";

            stockchart = new Chart(chartCanvas, {
                type: "line",
                data: {
                    labels,
                    datasets: [{
                        label: `${ticker} Closing Prices`,
                        data: values,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        })
        .catch(err => {
            alert("Error loading chart data: "+  err.message);
            console.error(err);
        });
    });
});