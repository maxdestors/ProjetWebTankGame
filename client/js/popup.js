/**
 * Created by Romain on 17/03/2015.
 */

function visibility(eltId) {
    var elt = document.getElementById(eltId);
    if(elt.style.display === 'none') {
        elt.style.display = 'block';
    }
    else {
        elt.style.display = 'none';
    }
}

function getUserName() {
    var pseudo = document.getElementById("pseudo").value;
    console.log(pseudo);
    return pseudo;
}

