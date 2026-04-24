/* ========= LOGIN ========= */
window.login = async () => {
  const result = await auth.signInWithPopup(provider);
  const user = result.user;

  const ref = db.collection("users").doc(user.uid);
  const doc = await ref.get();

  if(!doc.exists){
    // créer ID unique
    let baseId = user.displayName.toLowerCase().replace(/\s+/g, "");
    let finalId = baseId;
    let i = 1;

    while(true){
      const check = await db.collection("ids").doc(finalId).get();
      if(!check.exists) break;
      finalId = baseId + i;
      i++;
    }

    // save ID
    await db.collection("ids").doc(finalId).set({
      uid: user.uid
    });

    await ref.set({
      name: user.displayName,
      photo: user.photoURL,
      id: finalId
    });
  }

  location.reload();
};

/* ========= AUTH STATE ========= */
auth.onAuthStateChanged(async user => {

  if(!user){
    document.getElementById("login").style.display = "block";
    return;
  }

  document.getElementById("login").style.display = "none";

  if(document.getElementById("home")){
    document.getElementById("home").style.display = "block";
  }

  // profil page
  if(window.location.pathname.includes("profil.html")){

    const ref = db.collection("users").doc(user.uid);
    const data = (await ref.get()).data();

    document.getElementById("photo").src = data.photo;
    document.getElementById("name").innerText = data.name;
    document.getElementById("uid").innerText = data.id;
  }

});

/* ========= NAV ========= */
window.goProfile = () => {
  const user = auth.currentUser;
  window.location.href = `profil.html?id=${user.uid}`;
};

/* ========= UPDATE PROFILE ========= */
window.updateProfile = async () => {

  const user = auth.currentUser;
  const ref = db.collection("users").doc(user.uid);

  let newName = document.getElementById("newName").value;
  let newId = document.getElementById("newId").value;
  let error = document.getElementById("error");

  const data = (await ref.get()).data();

  let updateData = {};

  // NAME
  if(newName){
    updateData.name = newName;
  }

  // ID
  if(newId){

    newId = newId.toLowerCase().replace(/\s+/g, "");

    const check = await db.collection("ids").doc(newId).get();

    if(check.exists){
      error.innerText = "ID déjà pris";

      // suggestion
      let i = 1;
      let suggestion = newId + i;

      while(true){
        const test = await db.collection("ids").doc(suggestion).get();
        if(!test.exists) break;
        i++;
        suggestion = newId + i;
      }

      error.innerText += " → suggestion : " + suggestion;
      return;
    }

    // supprimer ancien
    await db.collection("ids").doc(data.id).delete();

    // ajouter nouveau
    await db.collection("ids").doc(newId).set({
      uid: user.uid
    });

    updateData.id = newId;
  }

  await ref.update(updateData);

  location.reload();
};
