//variable globales
let statuDetail = "";

// utiliraies
function getelem(id) {
    return document.getElementById(id);
}

function getelems(classname) {
    return document.getElementsByClassName(classname);
}

function setelem(id, value) {
    getelem(id).innerHTML = value;
}

function setelems(classname, value) {
    let elems = getelems(classname);
    for (let i = 0; i < elems.length; i++) {
        elems[i].innerHTML = value;
    }
}

//charger le json
function init() {
    fetch("data/data.json")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            remplirTableau(data);
        })
        .catch(error => console.error("Erreur lors du chargement du JSON:", error));
}

// remplissage du tableau
function remplirTableau(data) {
    let table = "";
    let categories = Object.keys(data);
    let totalCompta = 0;
    let totalTotal = 0;
    for (let i of categories) {
        Compta = compterHeures(i, data, true);
        totalCompta += Compta;
        Total = compterHeures(i, data, false);
        totalTotal += Total;
        table += "<tr class='catg'><td>" + i + "</td><td></td><td>" + Compta + "</td><td>" + Total + "</td></tr>";
        for (j of data[i]) {
            table += "<tr id=" + j.nom + " onClick='details(\"" + j.nom + "\")'><td>" + j.date + "</td><td>" + j.nom + "</td><td>" + heureValide(j.heurs, false) + "</td><td>" + j.heurs + "</td></tr>";
        }
    };
    setelem("tableActivities", table);
    setelem("HTC", totalCompta);
    setelem("HTT", totalTotal);

}

function heureValide (heure, categorie) {
    if (categorie == "Challenge") {
        if (heure > 30) {
            return 30;
        }
        return heure;
    }
    if (heure > 10) {
        return 10;
    }
    return heure;

}

function compterHeures(categ, data, diminuer) {
    let categories = Object.keys(data);
    let total = 0;
    for (let i of categories) {
        for (j of data[i]) {

            if (i == categ) {
                
                total += j.heurs;
            }
        }
    }if (diminuer) {
        return heureValide(total, categ);
    }
    return total;
}

// div details
function details(nom) {
    console.log(nom);
    console.log(statuDetail);

    if (statuDetail == nom) {
        getelem("infoActi").style.display = "none";
        statuDetail = "";
        return;
    }
    let contenu = "";
    getelem("infoActi").style.display = "block";
    statuDetail = nom;
    fetch("data/data.json")
        .then(response => response.json())
        .then(data => {
            let categories = Object.keys(data);
            for (let i of categories) {
                for (j of data[i]) {
                    if (j.nom == nom) {
                        contenu += "<h2>" + j.nom + "</h2>";
                        contenu += "<p>Heures: " + j.heurs + "<br>";
                        contenu += "Date: " + j.date + "<br>";
                        contenu += "Année: " + j.annee + "</p>";
                        contenu += "<img src='" + j.img + "' alt='image de " + j.nom + "'>";
                        contenu += "<p>Description: " + j.description + "</p>";
                        getelem("infoActi").innerHTML = contenu;
                    }
                }
            }
        })
        .catch(error => console.error("Erreur lors du chargement du JSON:", error));
}