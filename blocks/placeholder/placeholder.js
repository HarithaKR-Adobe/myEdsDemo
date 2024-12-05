import { fetchPlaceholders } from '/scripts/aem.js';

export default async function decorate(block) {
    const p = block.children[0].querySelector('p')
    const key = p.innerText;
    const placeholders = await fetchPlaceholders();
    block.children[0].querySelector('p').innerText = placeholders[key];
}