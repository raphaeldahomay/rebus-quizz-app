fetch("assets/quotes_text.txt")
  .then(res => res.text())
  .then(text => {
    const quotes = text
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean); // removes empty lines

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

    document.getElementById("quote-fam").textContent = selectedQuote;
  })