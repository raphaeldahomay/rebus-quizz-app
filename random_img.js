fetch("assets/img_text.txt")
  .then(res => res.text())
  .then(text => {
    const images = text
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean); // removes empty lines

    const folder = "assets/img/";
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = `${folder}${images[randomIndex]}`;

    document.querySelector(".cover-box").style.backgroundImage = `url('${selectedImage}')`;
  })
  