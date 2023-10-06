// ui
document.addEventListener('click', (e) => {
  const click_outside_element = document.querySelector('.login-form');
  const overlay = document.querySelector('.overlay');
  const submit = document.getElementById('submit');
  const btn = document.querySelector('.login');
  let target = e.target;
  do {
    if (target == click_outside_element || target == btn || target == submit) return;
  } while (target = target.parentNode);

    if (!click_outside_element.classList.contains("hidden")) {
        click_outside_element.classList.add("hidden")
        overlay.classList.add("hidden")
    }
});
