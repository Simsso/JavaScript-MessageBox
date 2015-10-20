"use strict";

function MessageBox() {
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
      throw new Error('The passed button type doesn\'t exist.');
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

MessageBox.prototype.callback = function(button) { };
MessageBox.prototype.button = MessageBox.buttonTypeToStringArray(MessageBox.ButtonType.Ok);
MessageBox.prototype.title = 'Title';
MessageBox.prototype.content = 'Content.';
MessageBox.prototype.shown = false;
MessageBox.prototype.focusedButton = null;

MessageBox.prototype.refreshHtmlContent = function() {
  var i;
  var children = this.element.children();
  children.eq(0).html(this.title);
  children.eq(1).html(this.content);
  var buttonsHtml = '<ul>';
  for (i = this.button.length - 1; i >= 0; i--) {
    buttonsHtml += '<li><input type="button" value="' + this.button[i] + '" /></li>';
  }
  buttonsHtml += '</ul>';
  children.eq(2).html(buttonsHtml);
  
  // add buttons event listener
  var self = this;
  children.eq(2).find('input[type="button"]').on('click', function(event) {
    self.callback($(event.target).attr('value'));
    self.hide();
  });
};

MessageBox.prototype.hide = function() {
  this.shown = false;
  this.element.hide();
  
  // hide only if no other message boxes are shown
  if (MessageBox.getNumberOfShownMessageBoxes() === 0) {
    $('#message-box-background').hide();
  }
};

MessageBox.prototype.show = function() {
  if (MessageBox.getNumberOfShownMessageBoxes() === 0) {
    $('#message-box-background').show();
  }
  
  this.shown = true;
  this.element.show();
  this.element.find('input[type="button"][value="' + this.focusedButton + '"]').focus();
};

MessageBox.prototype.setCallback = function(callback) {
  if (typeof callback === 'function') {
    this.callback = callback;
  }
  else {
    throw new Error('No function has been passed.')
  }
};

MessageBox.prototype.setButtons = function(button) {
  if (button.length >= 1) {
    this.button = button;
  } 
  else {
    this.button = MessageBox.buttonTypeToStringArray(button);
  }
  
  this.refreshHtmlContent();
};

MessageBox.prototype.setTitle = function(title) {
  this.title = title;
  
  this.refreshHtmlContent();
};

MessageBox.prototype.setContent = function(content) {
  this.content = content;
  
  this.refreshHtmlContent();
};

MessageBox.prototype.setFocusedButton = function(button) {
  this.focusedButton = button;

  this.refreshHtmlContent();
};