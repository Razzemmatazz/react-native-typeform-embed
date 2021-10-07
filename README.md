# React Native Typeform Embed

A React-Native wrapper for [Typeform Embed SDK](https://developer.typeform.com/embed/).
Inspired by [React Typeform Embed](https://github.com/alexgarces/react-typeform-embed)

## Usage

```bash
yarn add react-native-typeform-embed
```

```js
import React from 'react';
import TypeformEmbed from 'react-native-typeform-embed';

class App extends React.Component {
  render() {
    return (
      <TypeformEmbed
        url='https://demo.typeform.com/to/njdbt5'
        onSubmit={() => alert('Submitted!')}
        onClose={() => alert('Closed!')}
      />
    );
  }
}
```

See the source for more examples.

## Props

Most props are based on the official parameters from [Typeform Embed SDK](https://github.com/Typeform/embed/tree/main/packages/embed#options)

| Prop                | Description                                                                                                                                                                                                      | Default |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `id`                | The id of the Typeform form to display                                                                                                                                                                           | `""`    |
| `source`            | The custom domain that you wish to display the typeform from                                                                                                                                                     | null    |
| `style`             | Additional styles for the component                                                                                                                                                                              | `{}`    |
| `hideHeaders`       | `true` if you want to hide the **header** that displays for question groups and long questions that require scrolling. Otherwise, `false`                                                                        | `false` |
| `hideFooter`        | `true` if you want to hide the **footer** that displays a progress bar and navigation buttons. Otherwise, `false`.                                                                                               | `false` |
| `opacity`           | Background opacity. Valid values include any integer between `0` (completely transparent) and `100` (completely opaque). Note that this isn't the same as the CSS opacity scale (0-1).<br />_Widget mode option_ | `100`   |
| `onReady`           | **Paid accounts only**. Callback event that will execute once the Typeform is loaded.                                                                                                                            | N/A     |
| `onQuestionChanged` | **Paid accounts only**. Callback event that will execute immediately after the Typeform question changes.                                                                                                        | N/A     |
| `onSubmit`          | **Paid accounts only**. Callback event that will execute immediately after a respondent successfully submits the Typeform.                                                                                       | N/A     |
| `onClose`           | **Paid accounts only**. Callback event that will execute immediately after a Typeform popup is closed.                                                                                                           | N/A     |
| `webView`           | Props passed to the WebView that displays the form                                                                                                                                                               | `{}`    |

### License

Code released under the [MIT license](LICENSE.txt).
