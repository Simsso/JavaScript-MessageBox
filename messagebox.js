/* global $: false */
 

function MessageBox() {
  // attributes
  this.callback = function(button) { };
  this.button = MessageBox.buttonTypeToStringArray(MessageBox.ButtonType.Ok);
  this.title = 'Title';
  this.content = 'Content.';
  this.shown = false;
  
  // methods
  this.refreshHtmlContent = function() {
    var i;
    var children = this.element.children();
    children.eq(0).html(this.title);
    children.eq(1).html(this.content);
    var buttonsHtml = '<ul>';
    for (i = 0; i < this.button.length; i++) {
      buttonsHtml += '<li>' + this.button[i] + '</li>';
    }
    buttonsHtml += '</ul>';
    children.eq(2).html(buttonsHtml);
    
    // add buttons event listener
    var self = this;
    children.eq(2).children().on('click', function(event) {
      self.callback($(event.target).html());
      self.hide();
    });
  };
  
  this.hide = function() {
    this.shown = false;
    this.element.hide();
    
    // hide only if no other message boxes are shown
    if (MessageBox.getNumberOfShownMessageBoxes() === 0) {
      $('#message-box-background').hide();
    }
  };
  
  this.show = function() {
    if (MessageBox.getNumberOfShownMessageBoxes() === 0) {
      $('#message-box-background').show();
    }
    
    this.shown = true;
    this.element.show();
  };
  
  this.setCallback = function(callback) {
    if (typeof callback === 'function') {
      this.callback = callback;
    }
    else {
      this.callback = function() {};
    }
  };
  
  this.setButtons = function(button) {
    if (button.length >= 1) {
      this.button = button;
    } 
    else {
      this.button = MessageBox.buttonTypeToStringArray(button);
    }
    
    this.refreshHtmlContent();
  };
  
  this.setTitle = function(title) {
    this.title = title;
    
    this.refreshHtmlContent();
  };
  
  this.setContent = function(content) {
    this.content = content;
    
    this.refreshHtmlContent();
  };
  
  
  // constructor
  if (MessageBox.allMessageBoxes.length === 0) {
    // add messagebox background if no messagebox has been created yet
    $('body').append('<div id="message-box-background"></div>');
  }
  
  MessageBox.allMessageBoxes.push(this);
  this.id = MessageBox.allMessageBoxes.indexOf(this);
  
  var messageBoxHtml = '<div id="' + MessageBox.IdPrefix + this.id + '" class="message-box">';
  messageBoxHtml += '<div class="message-box-title"></div>';
  messageBoxHtml += '<div class="message-box-content"></div>';
  messageBoxHtml += '<div class="message-box-buttons"></div>';
  messageBoxHtml += '</div>';
  $('body').append(messageBoxHtml);
  
  this.element = $('#' + MessageBox.IdPrefix + this.id);
  
  this.refreshHtmlContent();
}

MessageBox.IdPrefix = 'message-box-id-';

MessageBox.allMessageBoxes = [];

MessageBox.getNumberOfShownMessageBoxes = function() {
  var count = 0;
  for (var i = 0; i < MessageBox.allMessageBoxes.length; i++) {
    if (MessageBox.allMessageBoxes[i].shown) {
      count++;
    }
  }
  return count;
};

MessageBox.buttonTypeToStringArray = function(buttonType) {
  switch(buttonType) {
    case MessageBox.ButtonType.Ok: 
      return ['Ok'];
    case MessageBox.ButtonType.YesNo:
      return ['Yes', 'No'];
    case MessageBox.ButtonType.YesNoCancel:
      return ['Yes', 'No', 'Cancel'];
    default:
      return undefined;
  }
};

MessageBox.ButtonType = Object.freeze(
  {
    Ok: 0,
    YesNo: 1,
    YesNoCancel: 2,
    Custom: 3
  }
);