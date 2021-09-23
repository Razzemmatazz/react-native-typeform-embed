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
    // console.log('onLoad');
    const { id, type } = this.props;
    // console.log(this.props);

    if (this.typeformEl) {
      const stringifedOptions = JSON.stringify(JSON.stringify(this.props));
      const embedCode = `
        const onReady = () => window.ReactNativeWebView.postMessage("onReady");
        const onSubmit = () => window.ReactNativeWebView.postMessage("onSubmit");
        const onQuestionChanged = () => window.ReactNativeWebView.postMessage("onQuestionChanged");
        const onClose = () => window.ReactNativeWebView.postMessage("onClose");
        
        const defaultObj = ${
          type === 'widget'
        } ? { container: document.getElementById("typeform-embed") } : {};
        const options = Object.assign(defaultObj, JSON.parse(${stringifedOptions}), {onReady, onSubmit, onQuestionChanged, onClose});
        const tfRef = window.tf.${embedTypes[type]}("${id}", options);
        true;`;
      this.typeformEl.injectJavaScript(embedCode);
    }
  };

  onMessage = (event) => {
    const { onReady, onSubmit, onQuestionChanged, onClose } = this.props;
    const { data } = event.nativeEvent;
    console.log('onMessage: ', data);
    if (data === 'onReady') return onReady();
    if (data === 'onSubmit') return onSubmit();
    if (data === 'onQuestionChanged') return onQuestionChanged();
    if (data === 'onClose') return onClose();
  };

  render() {
    const { id, type } = this.props;
    return (
      <WebView
        originWhitelist={['*']}
        ref={(el) => (this.typeformEl = el)}
        scalesPageToFit
        automaticallyAdjustContentInsets
        source={{
          html: `<html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://embed.typeform.com/next/embed.js"></script>
            <link rel="stylesheet" href="https://embed.typeform.com/next/css/${type}.css" />
          </head>
          <body>
            <div id='typeform-embed'></div>
          </body>
        </html>`,
        }}
        // source={{
        //   html: `<html>
        //   <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        //   <body><div id="typeform-embed" data-tf-widget="M3t8MGk7"></div><script src="https://embed.typeform.com/next/embed.js"></script></body>
        // </html>`,
        // }}
        // source={{
        //   html: `<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1" /> <title>Test 1</title> <style>*{margin:0;padding:0;} html,body,#wrapper{width:100%;height:100%;} iframe{border-radius:0 !important;}</style> </head> <body> <div id="wrapper" data-tf-widget="M3t8MGk7" data-tf-inline-on-mobile></div> <script src="https://embed.typeform.com/next/embed.js"></script> </body> </html>`,
        // }}
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
  style: {},
  webView: {},

  // Widget options
  id: 'M3t8MGk7',
  hideHeaders: false,
  hideFooter: false,
  opacity: 100,
  type: 'widget',
  onSubmit: () => {},
  onReady: () => {},
  onClose: () => {},
  onQuestionChanged: () => {},
};

export default TypeformEmbed;
