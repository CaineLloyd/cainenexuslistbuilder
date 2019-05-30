// INTRO
  
  var list = document.getElementById('pageList');
  var defaultFavicon = 'http://s2.googleusercontent.com/s2/favicons?domain_url=https://caineandrebekah.com'
  var db = firebase.firestore();

  var rawSearches = window.location.search;  
  searches = rawSearches.split("?");
  search = searches[1].split("&");
  searchName1 = search[0].split("=");
  searchName2 = search[2].split("=");

  console.log(searchName1);
  console.log(searchName2);
  

// LOAD LISTS FROM THE DATABASE

  window.onload = function collectData() {
    if (searchName1[0] == "list") {
      collection = db.collection("lists");

      var result = collection.where("namecode", "==", searchName1[1]);
      console.log(result);
      result.get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
    
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          fillList(doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
      
    }
  }
  
// FILL THE LIST WITH LIST ITEMS  
  
  function fillList(data) {
    console.log(data);
    var content = data.lists;
    document.getElementById('pageList').innerHTML = '';
    document.getElementById('pageList').innerHTML += '<li id="list-header-item"><h1>' + data.name + '</h1></li>';
    for(i = 0; i < content.length; i++) {
      if(content[i].type == 'link') {
        var favicon = 'http://s2.googleusercontent.com/s2/favicons?domain_url=' + content[i].link;
        console.log(favicon);
        var listItem = '<li class="list-item" onClick="window.location.href = \'' + content[i].link + '\';"><img src="' + favicon + '"></img><p>' + content[i].text + '</p></li></a>';
        document.getElementById('pageList').innerHTML += listItem;
      } else if(content[i].type == 'action') {
        var actionItem = '<li class="list-item" onClick="fillList(data[' + content[i].action + ']);"><img src="' + defaultFavicon + '"></img><p>' + content[i].text + '</p></li>';
        document.getElementById('pageList').innerHTML += actionItem;
      }
    }
    document.getElementById('pageList').innerHTML += '<li id="create-button-item" onClick="createNewListItem()"><p>+ Add</p></li>';
  }

// MANAGING BUTTONS

function showCancelAndSaveButtonItem() {
  document.getElementById('pageList').innerHTML += '<li id="cancel-and-save-item"><div><span id="cancel" onClick="cancelNewListItem()">Cancel</span><span id="save" onClick="saveNewListItem()">Save</span></div></li>';
}

function hideCancelAndSaveButtonItem() {
  document.getElementById('cancel-and-save-item').outerHTML = "";
}

function showCreateButtonItem() {
  document.getElementById('pageList').innerHTML += '<li id="create-button-item" onClick="createNewListItem()"><p>+ Add</p></li>';
}

function hideCreateButtonItem() {
  document.getElementById("create-button-item").outerHTML = "";
}

function showCreateNewItemItem() {
  document.getElementById('pageList').innerHTML += '<li id="create-new-item-item"><input id="listItemLinkField" type="text" placeholder="https://website.com"></li>';
}

function hideCreateNewItemItem() {
  document.getElementById("create-new-item-item").outerHTML = "";
}

// CREATING NEW LIST ITEMS
  
  function createNewListItem() {
    hideCreateButtonItem();
    showCreateNewItemItem();
    showCancelAndSaveButtonItem();
  }
  
  function cancelNewListItem() {
    hideCreateNewItemItem();
    hideCancelAndSaveButtonItem();
    showCreateButtonItem();
  }
  
  function saveNewListItem() {
    var savedListItem = {};
    savedListItem.type = 'link';
    savedListItem.link = document.getElementById('listItemLinkField').value;
    savedListItem.action = 0;

    var savedList = {};

    savedList.name = '';
    savedList.namecode = '';
    savedList.theme = '';
    savedList.lists = [];
    savedList.lists.push(savedListItem);

    collection = db.collection("lists");

    var result = collection.where("namecode", "==", searchName1[1]);
    console.log(result);
    result.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
  
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        docRef = db.collection('lists').doc(doc.id);


//////////////////////////

      docRef.update({
        "lists": firebase.firestore.FieldValue.arrayUnion("greater_virginia")
      })
      .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
      console.error("Error adding document: ", error);
      });
      }

      )



/////////////////////////////

    hideCreateNewItemItem();
    hideCancelAndSaveButtonItem();
    showCreateButtonItem();
  })};

// CREATING NEW LISTS

  function createNewList() {

  }
  
  function cancelNewList() {

  }

  function saveNewList() {
    var savedListItem = {};
    savedListItem.type = 'link';
    savedListItem.text = document.getElementById('listItemNameField').value;
    savedListItem.link = document.getElementById('listItemLinkField').value;
    savedListItem.action = 0;

    var savedList = {};

    savedList.name = '';
    savedList.namecode = '';
    savedList.theme = '';
    savedList.lists = [];
    savedList.lists.push(savedListItem);

    db.collection("lists").add(savedList)
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    document.getElementById("create-new-item-item").outerHTML = "";
    document.getElementById('pageList').innerHTML += '<li id="create-button-item" onClick="createNewListItem()"><p>+ Add</p></li>';
  }