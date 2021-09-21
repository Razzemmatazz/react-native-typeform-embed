import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

const embedTypes = {
  popup: 'createPopup',
  slider: 'createSlider',
  sidetab: 'createSidetab',
  popover: 'createPopover',
  widget: 'createWidget',
};

class TypeformEmbed extends Component {
  onLoad = () => {
    const { type, hideHeaders, hideFooter, opacity } = this.props;

    const options = {
      mode: type,
      hideHeaders,
      hideFooter,
      opacity,
      buttonText,
    };

    if (this.typeformElm) {
      const stringifedOptions = JSON.stringify(JSON.stringify(options));
      const embedCode = `
      {
        const onReady = () => window.ReactNativeWebView.postMessage("onReady")
        const onSubmit = () => window.ReactNativeWebView.postMessage("onSubmit")
        const onQuestionChanged = () => window.ReactNativeWebView.postMessage("onQuestionChanged")
        const onClose = () => window.ReactNativeWebView.postMessage("onClose")
        const options = Object.assign({}, JSON.parse(${stringifedOptions}), {onReady,onSubmit,onQuestionChanged,onClose})
        const ref = window.tf.${embedTypes[type]}('${url}', options)
        ref.open()
      }
      true
      `;
      this.typeformElm.injectJavaScript(embedCode);
    }
  };

  onMessage = (event) => {
    const { data } = event.nativeEvent;
    if (data === 'onReady') return this.props.onReady();
    if (data === 'onSubmit') return this.props.onSubmit();
    if (data === 'onQuestionChanged') return this.props.onQuestionChanged();
    if (data === 'onClose') return this.props.onClose();
  };

  render() {
    return (
      <WebView
        originWhitelist={['*']}
        ref={(el) => (this.typeformElm = el)}
        source={{
          html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://embed.typeform.com/next/embed.js"></script></head><div id="typeform-embed">Loading...</div></html>',
        }}
        onLoadEnd={this.onLoad}
        onMessage={this.onMessage}
        {...this.props.webView}
      />
    );
  }
}
// https://github.com/Typeform/embed/blob/main/packages/embed/README.md#options
// 09/20/2021
TypeformEmbed.propTypes = {
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
  style: {},
  webView: {},

  // Widget options
  hideHeaders: false,
  hideFooter: false,
  opacity: 100,
  type: 'widget',
  onSubmit: () => {},
};

export default TypeformEmbed;
