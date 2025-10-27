document.addEventListener('DOMContentLoaded', function () {

var links = document.getElementsByTagName('a');

for (var i = 0; i < links.length; i++) {

if (links[i].hostname != window.location.hostname) {

links[i].target = '_blank';

}

}

});