document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("carousel");
    const breedBtns = document.getElementById("breed-btns");
    const breedInfo = document.getElementById("breed-info");

    //10 random dog images
    fetch("https://dog.ceo/api/breeds/image/random/10")
    .then((res) => res.json())
    .then((data) => {
        const sliderWrap = document.createElement("div");
        sliderWrap.classList.add("slider-wrap");

        data.message.forEach((url) => {
            const slide = document.createElement("div");
            slide.classList.add("slider-item");

            const img = document.createElement("img");
            img.src = url;

            slide.appendChild(img);
            sliderWrap.appendChild(slide);
        });

        carousel.appendChild(sliderWrap);

        impleSlider(carousel, {
            autoPlay: false,
            infinite: true,
            transitionTime: 15,
            slidesPerPage: 1,
        });
    });


    //dog breed butons
    fetch("https://dogapi.dog/api/v2/breeds")
    .then((res) => res.json())
    .then((data) => {
      data.data.forEach((breed) => {
        const btn = document.createElement("button");
        btn.className = "breed-btns";
        btn.textContent = breed.attributes.name;
        btn.setAttribute("data-breed-id", breed.id);
        breedBtns.appendChild(btn);
      });
    })
    .catch((err) => console.error("Failed to load breeds:", err));

    //breed info
    breedBtns.addEventListener("click", (e) => {
        if (e.target && e.target.matches("button.breed-btns")) {
          const breedId = e.target.getAttribute("data-breed-id");
    
          fetch(`https://dogapi.dog/api/v2/breeds/${breedId}`)
            .then((res) => res.json())
            .then((data) => {
              const breed = data.data.attributes;
              breedInfo.innerHTML = `
                <h3>${breed.name}</h3>
                <p><strong>Description:</strong> ${breed.description}</p>
                <p><strong>Min Life:</strong> ${breed.life?.min}</p>
                <p><strong>Max Life:</strong> ${breed.life?.max}</p>
              `;
              breedInfo.classList.remove("hidden");
            })
            .catch((err) => console.error("Failed to load breed info:", err));
        }
      });
});