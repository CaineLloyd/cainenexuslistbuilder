var data = [
    {
      name: 'Nexus',
      theme: 'light',  
      lists: [ // 0
        {type: 'action', text: 'Quick Access', link: '', action: 1},
        {type: 'action', text: 'Test', link: '', action: 2},
        {type: 'action', text: 'Google', link: '', action: 3},
        {type: 'action', text: 'Software Development', link: '', action: 4}        
      ]
    },
    {
      name: 'Quick Access',
      theme: 'light',  
      lists: [ // 1
        {type: 'action', text: '<i class="fas fa-angle-double-left"></i> Back', link: '', action: 0},
        {type: 'link', text: 'Firebase Console',link: 'https://google.com'},
        {type: 'link', text: 'Github',link: 'https://github.com/'},
        {type: 'link', text: 'CodePen',link: 'https://codepen.io/dashboard/'}
      ]
    },
    {
      name: 'Test',
      theme: 'light',  
      lists: [ // 2
        {type: 'action', text: '<i class="fas fa-angle-double-left"></i> Back', link: '', action: 0},
        {type: 'link', text: 'Google',link: 'https://google.com'},
        {type: 'link', text: 'Google',link: 'https://google.com'},
        {type: 'link', text: 'Google',link: 'https://google.com'}
      ]
    },
    {
      name: 'Google',
      theme: 'light',  
      lists: [ // 3
      {type: 'action', text: '<i class="fas fa-angle-double-left"></i> Back', link: '', action: 0},
        {type: 'link', text: 'Google Drive',link: 'https://drive.google.com'},
        {type: 'link', text: 'Google Docs',link: 'https://docs.google.com'},
        {type: 'link', text: 'Google Sheets',link: 'https://sheets.google.com'},
        {type: 'link', text: 'Google Slides',link: 'https://slides.google.com'}
      ]
    },
    {
      name: 'Software Development',
      theme: 'light',  
      lists: [ // 4
        {type: 'action', text: '<i class="fas fa-angle-double-left"></i> Back', link: '', action: 0},
        {type: 'link', text: 'caineandrebekah.com',link: 'https://caineandrebekah.com'},
        {type: 'link', text: 'docs.caineandrebekah.com',link: 'https://docs.caineandrebekah.com'},
        {type: 'link', text: 'Google Firebase Console',link: 'https://console.firebase.google.com'},
        {type: 'link', text: 'Google Cloud Console',link: 'https://console.cloud.google.com/home/dashboard'},
        {type: 'link', text: 'Github',link: 'https://google.com'},
        {type: 'link', text: 'CodePen',link: 'https://google.com'}
      ]
    }
  ];
  
  var list = document.getElementById('pageList');
  var defaultFavicon = 'http://s2.googleusercontent.com/s2/favicons?domain_url=https://caineandrebekah.com'
  var db = firebase.firestore();
  var presentedCode = window.location.query;
  console.log(presentedCode);

  db.collection("lists").where("statecode", "==", presentedCode).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      console.log(doc.data());
    });
  });
  
  function fillList(data) {
    var content = data.lists;
    document.getElementById('pageList').innerHTML = '';
    document.getElementById('pageList').innerHTML += '<li id="list-header"><h1>' + data.name + '</h1></li>';
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
    document.getElementById('pageList').innerHTML += '<li id="create-button" onClick="createNew()"><p>+ Add</p></li>';
  }
  
  function createNew() {
    document.getElementById("create-button").outerHTML = "";
    document.getElementById('pageList').innerHTML += '<li id="create-menu"><div><input id="listItemLinkField" type="text" placeholder="https://website.com"></div><div><input id="listItemNameField" type="text" placeholder="Favorite Website"></div><div><span id="cancel" onClick="cancelNew()">Cancel</span><span id="save" onClick="saveNew()">Save</span></div></li>';
  }
  
  function cancelNew() {
    document.getElementById("create-menu").outerHTML = "";
    document.getElementById('pageList').innerHTML += '<li id="create-button" onClick="createNew()"><p>+ Add</p></li>';
  }
  
  function saveNew() {

    var savedListItem = {};
    savedListItem.type = '';
    savedListItem.text = document.getElementById('listItemNameField').value;
    savedListItem.link = document.getElementById('listItemLinkField').value;
    savedListItem.action = 0;

    var savedList = {};

    savedList.name = '';
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

    document.getElementById("create-menu").outerHTML = "";
    document.getElementById('pageList').innerHTML += '<li id="create-button" onClick="createNew()"><p>+ Add</p></li>';
  }
  
  fillList(data[0]);