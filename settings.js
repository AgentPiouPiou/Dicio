let ref;

auth.onAuthStateChanged(async user => {

  if(!user) return;

  ref = db.collection("users").doc(user.email);

  const doc = await ref.get();
  const data = doc.data();

  setValue("pseudoInput", data.pseudo);
  setValue("idInput", data.id);
  setImg("pp", data.photo);

});

/* =========================
   CHANGE PHOTO FIXÉ (STABLE ALL DEVICES)
========================= */

function changePP(){

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {

    const file = input.files[0];
    if(!file || !ref) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result;

      await ref.update({
        photo: base64
      });

      setImg("pp", base64);
    };

    reader.readAsDataURL(file);
  };

  input.click();
}

/* =========================
   SAVE PROFILE
========================= */

async function save(){

  if(!ref) return;

  await ref.update({
    pseudo: getValue("pseudoInput"),
    id: clean(getValue("idInput"))
  });

  alert("Sauvegardé !");
  go("profil.html");
}

/* =========================
   SAFE HELPERS
========================= */

function setValue(id, v){
  const el = document.getElementById(id);
  if(el) el.value = v;
}

function getValue(id){
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function setImg(id, src){
  const el = document.getElementById(id);
  if(el) el.src = src;
}

function clean(str){
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g,"");
}

function go(p){
  window.location.href = "/Dicio/" + p;
}
