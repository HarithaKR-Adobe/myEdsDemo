export default function decorate(block) {
    const h1 = block.querySelector("h1");
    const picture = block.querySelector("picture")
    picture.classList.add("banner-picture");
    h1.classList.add("banner-title");
}