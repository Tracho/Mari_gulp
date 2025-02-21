

function Burger_btn() {
  const burger = document.querySelector('.burger');
  const navbar_nav = document.querySelector('.navbar_nav');
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    if (burger.classList.contains('active')) {
      navbar_nav.setAttribute('data-active', 'true');
    } else {
      navbar_nav.setAttribute('data-active', 'false');
    }

  });
} Burger_btn();

function headerAnimation() {
  let _container_dancer_word = document.querySelectorAll('._container_dancer_word');
  let _this_header = document.querySelectorAll('._this_header');
  let anim_style = ['ani1', 'ani2', 'ani3', 'ani4', 'ani5', 'ani6', 'ani7'];
  _this_header.forEach((this_header, index) => {

    this_header.textContent.split(' ').forEach((letter, i) => {

      function split_letter(elem) {
        let item = '';
        elem.split("").forEach((e) => {
          const randomIndex = Math.floor(Math.random() * anim_style.length);
          const RandomDelay = Math.round(Math.random() * 1.5 * 100) / 100;
          let not_s = (e == " " ? true : false);
          // item += `<span class="style_anim_letter" data-not_s="${not_s}">${e}</span>`;
          item += `<span class="style_anim_letter" style="animation-delay:${RandomDelay}s;" data-text_anim="${anim_style[randomIndex]}">${e}</span>`;

        });
        return (item);
      }
      if (letter !== "") {
        _container_dancer_word[index].insertAdjacentHTML("beforeend", `<div>${split_letter(letter)}</div>`);
      }
    });
  });



  // _container_dancer_word.childNodes.forEach((span)=>{
  //   span.childNodes.forEach((e)=>{
  //     e.addEventListener("mouseover",()=>{
  //       console.log(e)
  //     });
  //   });
  // });
} headerAnimation();

const name_animation = "step_by_step";
function Text_Animation_successive(name_animation) {
  let _this_word = document.querySelectorAll('._this_word');
  let split_push = document.querySelectorAll("._split_text_push");

  _this_word.forEach((letter, index) => {
    if (letter !== "") {
      split_push[index].insertAdjacentHTML("beforeend", `<div class="_container_word" data-animation="${name_animation}">${letter_collector(letter.textContent, "mod_delay", "", index)}</div>`);
    }
  });
} Text_Animation_successive(name_animation);
function letter_collector(letter, _style_ = "", _dataset_ = "", _index_ = "") {
  let return_item = '';
  let this_style = _style_;
  letter.split("").forEach((el, id) => {
    if (_style_ == "mod_delay") {
      this_style = `animation-delay:0.${_index_}${id}s`;
    } else {
      this_style;
    }

    return_item += `<span class="_this_letter" ${_style_ ? `style="${this_style}"` : ''} ${_dataset_ ? _dataset_ : ''}>${el}</span>`;
  });
  return (return_item);
}

let _animScroll = Array.from(document.querySelectorAll("._animScroll")); // Преобразуем в массив
window.addEventListener("scroll", elemInViewport);
function elemInViewport() {
  _animScroll = _animScroll.filter((elem) => { // Фильтруем элементы
    if (elem.dataset.anim !== "true") {
      let box = elem.getBoundingClientRect();
      let top = box.top;
      let bottom = box.bottom;
      let height = document.documentElement.clientHeight;

      if ((bottom - 20 <= height) && (top >= 10)) {
        elem.dataset.anim = "true";
      }
      return true; // Оставляем в массиве, если ещё не проиграла анимация
    } else {
      if (elem.dataset.running_numbers) {
        RunningNumbers(elem);
      }
      return false; // Удаляем из массива, если анимация уже была
    }
  });


  // const img = document.querySelector("._parallax_img");
  // const rect = img.getBoundingClientRect(); // Координаты изображения
  // const scrollTop = window.scrollY || document.documentElement.scrollTop;
  // const speed = 0.3; // Чем больше число, тем сильнее эффект

  // // Вычисляем сдвиг, пока картинка в зоне видимости
  // if (rect.top < window.innerHeight && rect.bottom > 0) {
  //   img.style.transform = `translateY(${scrollTop * speed}px)`;
  // }
}

// Вызываем один раз при загрузке
elemInViewport();


async function RunningNumbers(elem) {
  // let numbers = document.querySelectorAll('._running_numbers');
  // numbers.forEach((number)=>{
  if (elem.dataset.running_numbers !== "true") {
    elem.dataset.running_numbers = "true";

    let delay = elem.dataset.delay_ms !== undefined ? elem.dataset.delay_ms : 0;
    let end = parseInt(elem.value); // Итоговое число
    let start = 0; // Начало
    let duration = elem.dataset.time_ms !== undefined ? elem.dataset.time_ms : 1000; // Длительность в мс (1 секунда)
    let fps = elem.dataset.fps !== undefined ? elem.dataset.fps : 60; // Количество кадров в секунду (плавность)
    let totalFrames = duration / (1000 / fps); // Количество кадров за 1с
    // let step_text = elem.dataset.step_text; // данный шаг который идет.
    let step = Math.max(1, end / totalFrames); // Рассчитываем шаг
    let current = start;

    setTimeout(() => {
      let timer = setInterval(() => {
        current += step;

        if (current >= end) {
          elem.textContent = end; // Устанавливаем финальное значение
          // elem.classList.remove('active');

          clearInterval(timer);
        } else {
          elem.textContent = Math.round(current);
          // elem.classList.toggle('active');
        }
      }, duration / fps); // Вызываем 60 раз в секунду
    }, delay);

  }
}


document.addEventListener("scroll", function () {
  const cards = document.querySelectorAll(".card_picture");

  cards.forEach((card) => {
    const img = card.querySelector("._parallax_img");
    if (!img) return;
    const rect = img.getBoundingClientRect(); // Получаем координаты элемента
    const viewportHeight = window.innerHeight; // Высота видимой области

    const imgHeight = img.offsetHeight; // Высота картинки
    const cardHeight = card.offsetHeight; // Высота рамки
    const maxOffset = imgHeight - cardHeight; // Насколько можно двигать картинку
    // Определяем, насколько картинка видна
    const visiblePart = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 200));

    // Вычисляем процент видимости (0 = не видно, 1 = полностью видно)
    const visibilityRatio = visiblePart / rect.height;
    // Интерполяция от -25px до 0px (поднимаем картинку)
    const translateY = -maxOffset + visibilityRatio * maxOffset;

    img.style.transform = `translateY(${translateY}px)`;
  });
});




// let testSVG = document.getElementById("testSVG");
// let child = testSVG.children;
// console.log(testSVG)
// for (let i = 0; i < child.length; i++) {
//   let elem = child[i];
//   if (elem.tagName === "path") {

//     console.dir(i + "---" + Math.round(elem.getTotalLength()));
//     console.log(elem);
//   }
// }








