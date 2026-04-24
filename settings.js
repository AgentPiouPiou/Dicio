let ref;

auth.onAuthStateChanged(async user => {

  if(!user) return;

  ref = db.collection("users").doc(user.email);

  const doc = await ref.get();
  const data = doc.data();

  document.getElementById("pseudoInput").value = data.pseudo;
  document.getElementById("idInput").value = data.id;
  document.getElementById("pp").src = data.photo;

});

function changePP(){

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      await ref.update({ photo: reader.result });
      document.getElementById("pp").src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  input.click();
}

async function save(){

  await ref.update({
    pseudo: document.getElementById("pseudoInput").value,
    id: document.getElementById("idInput").value
  });

  alert("Sauvegardé !");
  go("profil.html");
}

function go(p){
  window.location.href = "/Dicio/" + p;
}
