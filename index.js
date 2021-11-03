import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { getTypeformUrl } from './helpers';

class TypeformEmbed extends Component {
  injectedJavaScript = `
    window.activeObserver = null;

    window.addEventListener('message', (event) => {
      window.ReactNativeWebView.postMessage(event.data);
    });

    window.addEventListener('load', () => {
      window.ReactNativeWebView.postMessage('form-ready');      
      setObserver(document.querySelector('div[data-qa-focused="true"]')); 
    });

    function checkSubmit() {
      const submitButton = document.querySelector('button[data-qa*="submit-button"]');
      if (submitButton) {
        submitButton.addEventListener('click', () => {
          window.ReactNativeWebView.postMessage('form-submit');
        });
      }
    }

    function onScreenChange() {
      window.ReactNativeWebView.postMessage('form-screen-changed');
      activeObserver.disconnect();
      setObserver(document.querySelector('div[data-qa-focused="true"]'));
      checkSubmit();
    }

    function setObserver(element) {
      activeObserver = new MutationObserver(onScreenChange);
      const config = { attributes: true };
      activeObserver.observe(element, config);
    }
    
    true;
  `;

  onMessage = (event) => {
    const { onReady, onSubmit, onQuestionChanged, onClose } = this.props;
    const { data } = event.nativeEvent;

    switch (data) {
      case 'form-ready':
        return onReady();
      case 'form-submit':
        return onSubmit();
      case 'form-screen-changed':
        return onQuestionChanged();
      case 'onClose':
        return onClose();
    }
  };

  render() {
    return (
      <WebView
        source={{ uri: getTypeformUrl(this.props) }}
        injectedJavaScript={this.injectedJavaScript}
        onMessage={this.onMessage}
        {...this.props.webView}
      />
    );
  }
}

// https://github.com/Typeform/embed/blob/main/packages/embed/README.md#options
// 09/20/2021
TypeformEmbed.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  chat: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  hidden: PropTypes.object,
  tracking: PropTypes.object,
  source: PropTypes.string,
  medium: PropTypes.string,
  mediumVersion: PropTypes.string,
  transitiveSearchParams: PropTypes.arrayOf(PropTypes.string),
  opacity: PropTypes.number,
  disableAutoFocus: PropTypes.bool,
  open: PropTypes.string,
  openValue: PropTypes.number,
  enableSandbox: PropTypes.bool,
  tooltip: PropTypes.string,
  autoClose: PropTypes.number,
  shareGaInstance: PropTypes.bool,
  inlineOnMobile: PropTypes.bool,

  // Callbacks
  onReady: PropTypes.func,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  onQuestionChanged: PropTypes.func,

  // Popover options
  notificationDays: PropTypes.number,

  // Popup options
  size: PropTypes.number,

  // Slider options
  position: PropTypes.string,

  // Widget options
  hideHeaders: PropTypes.bool,
  hideFooter: PropTypes.bool,
};

// Default values taken from official Typeform docs
// https://developer.typeform.com/embed/modes/
TypeformEmbed.defaultProps = {
  style: { margin: 0, padding: 0 },
  webView: {},

  // Widget options
  hideHeaders: false,
  hideFooter: false,
  opacity: 100,
  onSubmit: () => {},
  onReady: () => {},
  onClose: () => {},
  onQuestionChanged: () => {},
};

export default TypeformEmbed;
