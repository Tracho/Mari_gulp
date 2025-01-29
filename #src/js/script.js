

function Burger_btn(){
  const burger = document.querySelector('.burger'); 
  const navbar_nav = document.querySelector('.navbar_nav');
  burger.addEventListener('click', () => { 
    burger.classList.toggle('active'); 
    if(burger.classList.contains('active')){
      navbar_nav.setAttribute('data-active','true'); 
    }else{
      navbar_nav.setAttribute('data-active','false');
    }
     
  });
}Burger_btn();

function headerAnimation(){
  let h1_animation_text = document.querySelector('.h1_animation_text');
  let h1 = document.querySelector('.header h1');
  let anim_style = ['ani1', 'ani2', 'ani3', 'ani4', 'ani5', 'ani6', 'ani7'];
  h1.textContent.split(' ').forEach((letter, i) => {  
 
    function split_letter(elem){  
      let item = '';
      elem.split("").forEach((e)=>{
        const randomIndex = Math.floor(Math.random() * anim_style.length);
        const RandomDelay = Math.round(Math.random() * 1.5 * 100) / 100;
        let not_s = (e == " " ? true : false); 
        // item += `<span class="h1AminText" data-not_s="${not_s}">${e}</span>`;
        item += `<span class="h1AminText" style="animation-delay:${RandomDelay}s;" data-text_anim="${anim_style[randomIndex]}">${e}</span>`;
         
      });
      return (item);
    }
    if(letter !== ""){
      h1_animation_text.insertAdjacentHTML("beforeend",`<div>${split_letter(letter)}</div>`);
    } 
  });

   
  // h1_animation_text.childNodes.forEach((span)=>{
  //   span.childNodes.forEach((e)=>{
  //     e.addEventListener("mouseover",()=>{
  //       console.log(e)
  //     });
  //   });
  // });
}headerAnimation();

const name_animation = "step_by_step"; 
function Text_Animation_successive(name_animation){
  let _this_word = document.querySelectorAll('._this_word');
  let split_push = document.querySelectorAll("._split_text_push");

  _this_word.forEach((letter, index)=>{   
    if(letter !== ""){
      split_push[index].insertAdjacentHTML("beforeend",`<div class="_container_word" data-animation="${name_animation}">${letter_collector(letter.textContent , "mod_delay", "", index)}</div>`);
    } 
  });
}Text_Animation_successive(name_animation);
function letter_collector(letter, _style_="", _dataset_="", _index_="" ){
  let return_item = ''; 
  let this_style = _style_;
  letter.split("").forEach((el, id)=>{
    if(_style_ == "mod_delay"){
      this_style = `animation-delay:0.${_index_}${id}s`;
    }else{
      this_style;
    }
 
    return_item += `<span class="_this_letter" ${_style_ ? `style="${this_style}"` : ''} ${_dataset_ ? _dataset_ : ''}>${el}</span>`; 
  }); 
  return(return_item);
}


let _animScroll = document.querySelectorAll("._animScroll");
window.addEventListener("scroll", ()=>{elemInViewport()});
function elemInViewport() { 
  _animScroll.forEach((elem) => {
    let box = elem.getBoundingClientRect();
    let top = box.top; 
    let bottom = box.bottom;  
    let height = document.documentElement.clientHeight;
 
    if ((bottom - 20 <= height) && (top >= 10)) {
      elem.dataset.anim = true; 
    } else { 
    }

  }); 
} elemInViewport();



// let testSVG = document.getElementById("testSVG");
// let child = testSVG.children;
//  console.log(testSVG)
// for(let i = 0; i < child.length; i++){
//   let elem = child[i];
//   if(elem.tagName === "path"){
    
//     console.dir(i+ "---" +  Math.round(elem.getTotalLength()));
//     console.log(elem);
//   }
// }








 