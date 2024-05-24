export default function decorate(fieldDiv, field, htmlForm) {
  // extract a input type number from fieldDiv
  const input = fieldDiv.querySelector('input[type="number"]');
  // convert the input to a rating component
  // the component will have max value of max attribute set in the input element
  // and the value of the input element will be set to the value of the component
  const rating = document.createElement('div');
  rating.classList.add('rating');
  for (let i = 1; i <= input.getAttribute('max'); i += 1) {
    const star = document.createElement('span');
    // add class to the star element
    star.classList.add('star');
    star.textContent = '★';
    star.addEventListener('click', () => {
      input.value = i;
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
      // add selected class to the star elements till index i
      for (let j = 0; j < i; j += 1) {
        rating.children[j].classList.add('selected');
      }
      // remove selected class from star elements after index i
      for (let j = i; j < rating.children.length; j += 1) {
        rating.children[j].classList.remove('selected');
      }
    });
    rating.appendChild(star);
  }
  fieldDiv.appendChild(rating);
  // hide the input element
  input.style.display = 'none';
  return fieldDiv;
}
