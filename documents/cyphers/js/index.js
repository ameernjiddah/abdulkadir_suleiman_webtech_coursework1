var caesarShift = 5;
var substitutionKey = 'thwobadirfkmqyclezxvsgpujn';

function cypherMessage() {
  var message = document.getElementById("input-to-cypher").value.toLowerCase();
  if (message.length < 1) {
    alert("Please enter message to encrypt");
    return;
  }
  var cypherMethod = document.getElementById('slct-cypher-algo').value;

  var cypheredText = '';
  switch (cypherMethod) {
    case 'caesar':
      cypheredText = cypherWithCaesar(message);
      break;
    case 'substitution':
      cypheredText = cypherWithSimpleSubstitution(message);
      break;

  }
  document.getElementById("txt-cyphered").value = cypheredText;
}

function decipherMessage() {
  var cipheredText = document.getElementById("input-to-decypher").value.toLowerCase();
  if (cipheredText.length < 1) {
    alert("please enter text to decipher.");
    return;
  }
  var cypherMethod = document.getElementById('slct-cypher-algo').value;

  var message = '';
  switch (cypherMethod) {
    case 'caesar':
      message = decipherWithCaesar(cipheredText);
      break;
    case 'substitution':
      message = decipherWithSimpleSubstitution(cipheredText);
      break;

  }
  document.getElementById("txt-deciphered").value = message;
}

function cypherWithCaesar(message) {
  var cyphered = "";
  var exp = /[a-z]/;
  var msgLen = message.length;
  for (i = 0; i < msgLen; i++) {
    if (exp.test(message.charAt(i))) {
      cyphered += String.fromCharCode((message.charCodeAt(i) - 97 + caesarShift) % 26 + 97);
    } else {
      cyphered += message.charAt(i);
    }
  }
  return cyphered;
}

function decipherWithCaesar(cipheredText) {
  var message = "";
  var re = /[a-z]/;
  var cipherLength = cipheredText.length;
  for (i = 0; i < cipherLength; i++) {
    if (re.test(cipheredText.charAt(i))) {
      message += String.fromCharCode((cipheredText.charCodeAt(i) - 97 + 26 - caesarShift) % 26 + 97);
    } else {
      message += cipheredText.charAt(i);
    }
  }
  return message;
}

function cypherWithSimpleSubstitution(message) {
  var cyphered = "";
  var re = /[a-z]/;
  var msgLen = message.length;
  for (i = 0; i < msgLen; i++) {
    if (re.test(message.charAt(i))) {
      cyphered += substitutionKey.charAt(message.charCodeAt(i) - 97);
    } else {
      cyphered += message.charAt(i);
    }
  }
  return cyphered;
}

function decipherWithSimpleSubstitution(cipheredText) {
  var message = "";
  var re = /[a-z]/;
  var cipherLength = cipheredText.length;
  for (i = 0; i < cipherLength; i++) {
    if (re.test(cipheredText.charAt(i))) {
      message += String.fromCharCode(substitutionKey.indexOf(cipheredText.charAt(i)) + 97);
    } else {
      message += cipheredText.charAt(i);
    }
  }
  return message;
}
