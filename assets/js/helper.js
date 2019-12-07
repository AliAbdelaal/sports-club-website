var set = new Set();
var elements = document.getElementsByClassName(`sport`);

/**
 * @param {Set} set
 */
function displayitems(set){
    if(set.size == 0){
     for(element of elements){
         element.style.display ='initial';
    }
 }
 else{
     for(element of elements){
         let display = false;
        for (token of set){
         display =  element.classList.contains(`sport-${token}`) ? true:display;
        }
        if(display)
        element.style.display = 'initial';
        else
        element.style.display = 'none';
     }
 }
}

function toggleDisplay(target){
 if(set.has(target.value)){
    set.delete(target.value);
 }
 else{
    set.add(target.value);
 }
 displayitems(set);
}