import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import React from 'react';
import { Provider } from 'react-redux';
import NavigationContainer from './src/containers/navigation';
import ThemeContainer from './src/containers/theme.container';
import { store, persistor } from './src/store/index';
import { PersistGate } from 'redux-persist/lib/integration/react';
interface Props {}

interface State {
  isReady: boolean;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  render() {
    const { isReady } = this.state;

    if (!isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeContainer>
            <NavigationContainer />
          </ThemeContainer>
        </PersistGate>
      </Provider>
    );
  }

  async _cacheResourcesAsync() {
    const images = [require('./src/assets/images/icon.png')];
    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    await Promise.all(cacheImages);
  }
}
