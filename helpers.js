const embedTypes = {
  widget: 'embed-widget',
  popup: 'popup-blank',
  slider: 'popup-drawer',
  popover: 'popup-popover',
  'side-tab': 'popup-side-panel',
};

const getEmbedOptions = (props) => {
  const embedOptions = [
    'typeform-medium=embed-sdk',
    'typeform-medium-version=next',
  ];

  const embedType = embedTypes[props.type];
  if (!embedType) return null;
  embedOptions.push(`typeform-embed=${embedType}`);

  if (props.source) {
    embedOptions.push(`typeform-source=${props.source}`);
  }

  if (props.enableSandbox) {
    embedOptions.push(
      'disable-tracking=true&__dangerous-disable-submissions=true'
    );
  }

  embedOptions.push(`embed-hide-headers=${props.hideHeader}`);
  embedOptions.push(`embed-hide-footer=${props.hideFooter}`);

  // TODO: Add embed-opacity, disable-tracking, disable-auto-focus, share-ga-instance, force-touch, add-placeholder-ws

  return embedOptions;
};

export const getTypeformUrl = (props) => {
  const baseUrl = `https://form.typeform.com/to/${props.id}`;
  const embedOptions = getEmbedOptions(props);
  const embedOptionsStr = embedOptions ? `?${embedOptions.join('&')}` : '';
  const hiddenFields = Object.entries(props.hidden).map(
    ([key, value]) => `${key}=${value}`
  );
  const hiddenFieldsStr = hiddenFields.length
    ? `#${hiddenFields.join('&')}`
    : '';
  const url = `${baseUrl}${embedOptionsStr}${hiddenFieldsStr}`;
  return encodeURI(url);
};
