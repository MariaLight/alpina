const regions = document.querySelectorAll(".interactive-map__map svg > path");
const regionsMarker = document.querySelectorAll(
    ".interactive-map__map svg path[data-marker]"
);
const infoBox = document.querySelector(".interactive-info");
const infoBoxInner = document.querySelector(".interactive-info__inner");
const infoName = infoBox.querySelector(".interactive-info__name");
const infoTel = infoBox.querySelector(".interactive-info__link--tel");
const infoEmail = infoBox.querySelector(".interactive-info__link--email");
const btnsMap = document.querySelectorAll("button[data-region]");
const interactiveInfoBtn = document.querySelector(".interactive-info__btn");
const mapAdditional = document.querySelector(".interactive-map-additional");
const colorRegion = "#0073B9";
const isMobile = window.matchMedia("(max-width: 768px)").matches;
let lastHighlightedRegion = null;

infoBox.style.display = "none";

const resetRegionColor = (region) => {
    if (region) region.style.fill = "#D7D7D7";
};

const highlightRegion = (region) => {
    resetRegionColor(lastHighlightedRegion);
    region.style.fill = colorRegion;
    lastHighlightedRegion = region;
};

const toggleMapAdditional = (region) => {
    mapAdditional.style.display =
        region.dataset.region === "Абакан" ? "flex" : "none";
};

const showInfoBlock = (infoText) => {
    infoBox.style.display = "block";
    infoName.innerText = infoText.name;
    infoTel.innerText = infoText.tel;
    infoEmail.innerText = infoText.email;
};

const moveInfoBlock = (regionMarker) => {
    const rect = regionMarker.getBoundingClientRect();
    console.log(rect);
    infoBox.style.left = `${rect.left + rect.width / 2}px`;
    infoBox.style.top = `${rect.top + rect.height / 2}px`;
};

regions.forEach((region) => {
    region.style.fill = "#D7D7D7";

    if (isMobile) {
        region.addEventListener("click", (event) => {
            event.stopPropagation();
            highlightRegion(region);
            toggleMapAdditional(region);
        });

        document.addEventListener("click", (event) => {
            if (
                lastHighlightedRegion &&
                !lastHighlightedRegion.contains(event.target)
            ) {
                resetRegionColor(lastHighlightedRegion);
                lastHighlightedRegion = null;
                mapAdditional.style.display = "none";
            }
        });
    } else {
        region.addEventListener("mouseover", () => highlightRegion(region));
        region.addEventListener("mouseout", (event) => {
            if (
                !infoBox.contains(event.relatedTarget) &&
                lastHighlightedRegion === region
            ) {
                resetRegionColor(region);
                lastHighlightedRegion = null;
            }
        });
    }
});

regionsMarker.forEach((regionMarker) => {
    const infoText = {
        name: regionMarker.getAttribute("data-name") || "имя не задано",
        tel: regionMarker.getAttribute("data-tel") || "телефон не задан",
        email: regionMarker.getAttribute("data-email") || "email не задан",
    };

    if (!isMobile) {
        regionMarker.addEventListener("mouseover", () => {
            showInfoBlock(infoText);
            moveInfoBlock(regionMarker);
            if (regionMarker.dataset.region === "Абакан") {
                interactiveInfoBtn.classList.add("interactive-info__btn--active");
                infoBoxInner.style.display = "none";
                infoName.style.display = "none";
            }
        });

        regionMarker.addEventListener("mouseout", (event) => {
            if (!infoBox.contains(event.relatedTarget)) {
                infoBox.style.display = "none";
                interactiveInfoBtn.classList.remove("interactive-info__btn--active");
                infoBoxInner.style.display = "block";
                infoName.style.display = "block";
            }
        });

        infoBox.addEventListener(
            "mouseover",
            () => (infoBox.style.display = "block")
        );
        infoBox.addEventListener("mouseout", (event) => {
            if (!infoBox.contains(event.relatedTarget)) {
                infoBox.style.display = "none";
                resetRegionColor(lastHighlightedRegion);
                lastHighlightedRegion = null;
            }
        });
    }
});

btnsMap.forEach((button) => {
    button.addEventListener("click", () => {
        const regionId = button.getAttribute("data-region");
        const region = document.querySelector(`[data-region='${regionId}']`);

        highlightRegion(region);

        if (regionId === "Абакан") {
            button.setAttribute("data-modal", "modal-interactive-info");
            const body = document.querySelector("body");
            const modal = document.getElementById(button.getAttribute("data-modal"));
            if (modal) {
                modal.classList.toggle("modal--active");
                body.style.overflowY = modal.classList.contains("modal--active")
                    ? "hidden"
                    : "";
            }
            return;
        }

        document
            .querySelectorAll(".interactive-info--static")
            .forEach((block) => block.remove());

        const infoBlock = document.createElement("div");
        infoBlock.classList.add("interactive-info", "interactive-info--static");
        infoBlock.innerHTML = `
      <p class="interactive-info__name">${region.getAttribute("data-name") || "имя не задано"
            }</p>
      <div class="interactive-info__inner">
        <span class="interactive-info__caption"> Телефон: </span>
        <a class="interactive-info__link interactive-info__link--tel" href="tel:${region.getAttribute(
                "data-tel"
            )}">${region.getAttribute("data-tel") || "телефон не задан"}</a>
        <span class="interactive-info__caption"> Email:  </span>
        <a class="interactive-info__link interactive-info__link--email" href="mailto:${region.getAttribute(
                "data-email"
            )}">${region.getAttribute("data-email") || "email не задан"}</a>
      </div>
    `;
        button.parentElement.appendChild(infoBlock);

        document.addEventListener("click", function handleClickOutside(event) {
            if (!infoBlock.contains(event.target) && !button.contains(event.target)) {
                infoBlock.remove();
                document.removeEventListener("click", handleClickOutside);
            }
        });
    });
});

interactiveInfoBtn.addEventListener("click", () => {
    mapAdditional.classList.toggle("interactive-map-additional--active");
});
