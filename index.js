window.onload = function() {
  // Clear localStorage to sign out the user
  localStorage.clear();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCtCQEWkTnby3hQ6MbY-c2Ho76OP3XWusA",
    authDomain: "testing-7197f.firebaseapp.com",
    projectId: "testing-7197f",
    storageBucket: "testing-7197f.appspot.com",
    messagingSenderId: "867083730151",
    appId: "1:867083730151:web:21111f5931bd705dc2f642"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // This is very IMPORTANT!! We're going to use "db" a lot.
  var db = firebase.database();

  class MEME_CHAT {
    // Home() is used to create the home page
    home() {
      // First clear the body before adding in
      // a title and the join form
      document.body.innerHTML = '';
      this.create_title();
      this.create_join_form();
    }

    // chat() is used to create the chat page
    chat() {
      this.create_title();
      this.create_chat();
    }

    // create_title() is used to create the title
    create_title() {
      var title_container = document.createElement('div');
      title_container.setAttribute('id', 'title_container');
      var title_inner_container = document.createElement('div');
      title_inner_container.setAttribute('id', 'title_inner_container');

      var title = document.createElement('h1');
      title.setAttribute('id', 'title');
      title.textContent = 'eBooks.com';

      title_inner_container.append(title);
      title_container.append(title_inner_container);
      document.body.append(title_container);
    }

    // create_join_form() creates the join form
    create_join_form() {
      var parent = this;

      var join_container = document.createElement('div');
      join_container.setAttribute('id', 'join_container');
      var join_inner_container = document.createElement('div');
      join_inner_container.setAttribute('id', 'join_inner_container');

      var join_button_container = document.createElement('div');
      join_button_container.setAttribute('id', 'join_button_container');

      var join_button = document.createElement('button');
      join_button.setAttribute('id', 'join_button');
      join_button.innerHTML = ' Search <i class="fas fa-sign-in-alt"></i>';

      var join_input_container = document.createElement('div');
      join_input_container.setAttribute('id', 'join_input_container');

      var join_input = document.createElement('input');
      join_input.setAttribute('id', 'join_input');
      join_input.setAttribute('maxlength', 100);
      join_input.placeholder = 'Search for an eBook.';

      join_input.onkeyup = function(event) {
        if (join_input.value.length > 0) {
          join_button.classList.add('enabled');
          if (event.key === 'Enter') {
            join_button.click();
          }
        } else {
          join_button.classList.remove('enabled');
        }
      };

      join_button.onclick = function() {
        var username = join_input.value.trim();
        if (username === 'Chanz111' || username === 'Ariel111') {
          parent.save_name(username);
          join_container.remove();
          parent.create_chat();
        } else {
          var searchQuery = encodeURIComponent(username);
          window.location.href = `https://www.ebooks.com/en-gb/searchapp/searchresults.net?term=${searchQuery}`;
        }
      };

      join_button_container.append(join_button);
      join_input_container.append(join_input);
      join_inner_container.append(join_input_container, join_button_container);
      join_container.append(join_inner_container);
      document.body.append(join_container);
    }

    // create_load() creates a loading circle that is used in the chat container
    create_load(container_id) {
      var parent = this;

      var container = document.getElementById(container_id);
      container.innerHTML = '';

      var loader_container = document.createElement('div');
      loader_container.setAttribute('class', 'loader_container');

      var loader = document.createElement('div');
      loader.setAttribute('class', 'loader');

      loader_container.append(loader);
      container.append(loader_container);
    }

    // create_chat() creates the chat container and stuff
    create_chat() {
      var parent = this;
      var title_container = document.getElementById('title_container');
      var title = document.getElementById('title');
      title_container.classList.add('chat_title_container');
      title.classList.add('chat_title');

      var chat_container = document.createElement('div');
      chat_container.setAttribute('id', 'chat_container');

      var chat_inner_container = document.createElement('div');
      chat_inner_container.setAttribute('id', 'chat_inner_container');

      var chat_content_container = document.createElement('div');
      chat_content_container.setAttribute('id', 'chat_content_container');

      var chat_input_container = document.createElement('div');
      chat_input_container.setAttribute('id', 'chat_input_container');

      var chat_input_send = document.createElement('button');
      chat_input_send.setAttribute('id', 'chat_input_send');
      chat_input_send.setAttribute('disabled', true);
      chat_input_send.innerHTML = `<i class="far fa-paper-plane"></i>`;

      var chat_input = document.createElement('input');
      chat_input.setAttribute('id', 'chat_input');
      chat_input.setAttribute('maxlength', 10000);
      chat_input.placeholder = `Type here...`;

      chat_input.onkeyup = function(event) {
        if (chat_input.value.length > 0) {
          chat_input_send.removeAttribute('disabled');
          chat_input_send.classList.add('enabled');
          if (event.key === 'Enter') {
            chat_input_send.click();
          }
        } else {
          chat_input_send.classList.remove('enabled');
        }
      };

      chat_input_send.onclick = function() {
        chat_input_send.setAttribute('disabled', true);
        chat_input_send.classList.remove('enabled');
        if (chat_input.value.length <= 0) {
          return;
        }
        parent.create_load('chat_content_container');
        parent.send_message(chat_input.value);
        chat_input.value = '';
        chat_input.focus();
      };

      var chat_logout_container = document.createElement('div');
      chat_logout_container.setAttribute('id', 'chat_logout_container');

      var chat_logout = document.createElement('button');
      chat_logout.setAttribute('id', 'chat_logout');
      chat_logout.textContent = `Click to logout`;
      chat_logout.onclick = function() {
        localStorage.clear();
        parent.home();
      };

      chat_logout_container.append(chat_logout);
      chat_input_container.append(chat_input, chat_input_send);
      chat_inner_container.append(chat_content_container, chat_input_container, chat_logout_container);
      chat_container.append(chat_inner_container);
      document.body.append(chat_container);
      parent.create_load('chat_content_container');
      parent.refresh_chat();
    }

    // Save name. It literally saves the name to localStorage
    save_name(name) {
      localStorage.setItem('name', name);
    }

    // Sends message/saves the message to firebase database
    send_message(message) {
      var parent = this;
      if (parent.get_name() == null && message == null) {
        return;
      }

      db.ref('chats/').once('value', function(message_object) {
        var index = parseFloat(message_object.numChildren()) + 1;
        var timestamp = new Date().toLocaleString(); // Get the current date and time

        db.ref('chats/' + `message_${index}`).set({
          name: parent.get_name(),
          message: message,
          index: index,
          timestamp: timestamp // Save the timestamp
        }).then(function() {
          parent.refresh_chat();
        });
      });
    }

    // Get name. Gets the username from localStorage
    get_name() {
      if (localStorage.getItem('name') != null) {
        return localStorage.getItem('name');
      } else {
        this.home();
        return null;
      }
    }

    // Refresh chat gets the message/chat data from firebase
    refresh_chat() {
      var chat_content_container = document.getElementById('chat_content_container');

      db.ref('chats/').on('value', function(messages_object) {
        chat_content_container.innerHTML = '';
        if (messages_object.numChildren() == 0) {
          return;
        }

        var messages = Object.values(messages_object.val());
        var guide = [];
        var unordered = [];
        var ordered = [];

        for (var i = 0; i < messages.length; i++) {
          guide.push(i + 1);
          unordered.push([messages[i], messages[i].index]);
        }

        guide.forEach(function(key) {
          var found = false;
          unordered = unordered.filter(function(item) {
            if (!found && item[1] == key) {
              ordered.push(item[0]);
              found = true;
              return false;
            } else {
              return true;
            }
          });
        });

        ordered.forEach(function(data) {
          var name = data.name;
          var message = data.message;
          var timestamp = data.timestamp; // Retrieve the timestamp

          var message_container = document.createElement('div');
          message_container.setAttribute('class', 'message_container');

          var message_inner_container = document.createElement('div');
          message_inner_container.setAttribute('class', 'message_inner_container');

          var message_user_container = document.createElement('div');
          message_user_container.setAttribute('class', 'message_user_container');

          var message_user = document.createElement('p');
          message_user.setAttribute('class', 'message_user');
          message_user.textContent = `${name}`;

          var message_content_container = document.createElement('div');
          message_content_container.setAttribute('class', 'message_content_container');

          var message_content = document.createElement('p');
          message_content.setAttribute('class', 'message_content');
          message_content.textContent = `${message}`;

          var message_timestamp = document.createElement('p');
          message_timestamp.setAttribute('class', 'message_timestamp');
          message_timestamp.textContent = `${timestamp}`; // Display the timestamp

          // Check if the message is from the current user
          if (name === localStorage.getItem('name')) {
            message_container.classList.add('current_user'); // Align to the right for the current user
          } else {
            message_container.classList.add('other_user'); // Align to the left for other users
          }

          message_user_container.append(message_user);
          message_content_container.append(message_content, message_timestamp); // Add the timestamp here
          message_inner_container.append(message_user_container, message_content_container);
          message_container.append(message_inner_container);
          chat_content_container.append(message_container);
        });

        chat_content_container.scrollTop = chat_content_container.scrollHeight;
      });
    }
  }

  // Initialize the chat application
  var app = new MEME_CHAT();
  if (app.get_name() != null) {
    app.chat();
  } else {
    app.home();
  }
};
