import moment from 'moment';
import * as React from 'react';
import { BottomNavigation, Colors } from 'react-native-paper';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import Theme from '../constants/theme';
import ChatUserListScreen from '../screens/chat-user-list';
import NotificationListScreen from '../screens/notification-list';
import PublicationAddScreen from '../screens/publication-add';
import PublicationListScreen from '../screens/publication-list';
import SettingsScreen from '../screens/settings';
import { AppTopNavigation, IAppTopNavigation } from './app-top-navigation';

type State = {
  index: number;
  routes: Array<{
    key: string;
    color: string;
    icon: string;
    topTitle: string;
    title: string;
  }>;
  topNavigation: IAppTopNavigation;
};

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export default class AppBottomNavigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {
          key: 'publicationList',
          title: 'Publicações',
          topTitle: 'Publicações Recentes',
          icon: 'earth',
          color: Theme.colors.primary,
        },
        {
          key: 'messages',
          title: 'Conversas',
          topTitle: 'Conversas',
          icon: 'forum',
          color: Theme.colors.primary,
        },
        {
          key: 'publicationAdd',
          title: 'Publicar',
          topTitle: 'Publicar Conteúdo',
          icon: 'plus-circle-outline',
          color: Theme.colors.primary,
        },
        {
          key: 'notifications',
          title: 'Notificações',
          topTitle: 'Notificações',
          icon: 'bell',
          color: Theme.colors.primary,
        },
        {
          key: 'settings',
          title: 'Conta',
          topTitle: 'Configurações da Conta',
          icon: 'menu',
          color: Theme.colors.primary,
        },
      ],
      topNavigation: {
        action: {
          display: false,
          iconName: null,
          onPressMethod: () => {},
        },
        backAction: {
          display: false,
          onPressMethod: () => {},
        },
        color: Theme.colors.primary,
        title: 'Publicações Recentes',
      },
    };
  }

  setTopNavigationState = (topNavigationState: IAppTopNavigation) => {
    this.setState({
      topNavigation: topNavigationState,
    });
  };

  setTopNavigationStateByIndex = (routeData: any) => {
    const { color, topTitle, key } = routeData;
    const defaultTopNavigationState = {
      action: {
        display: false,
        onPressMethod: null,
      },
      backAction: {
        display: false,
        onPressMethod: null,
      },
      color: color,
      title: topTitle,
    };

    let topNavigationState;

    switch (key) {
      case 'publicationAdd':
        topNavigationState = {
          ...defaultTopNavigationState,
          action: {
            display: false,
            iconName: 'send',
            onPressMethod: () => {},
          },
        };
        break;
      default:
        topNavigationState = defaultTopNavigationState;
        break;
    }
    this.setTopNavigationState(topNavigationState);
  };

  renderPublicationList = ({ route }) => {
    const { navigation } = this.props;
    return (
      <PublicationListScreen
        navigation={navigation}
        lastClickMoment={moment()}
      />
    );
  };

  renderChatUserList = ({ route }) => {
    const { navigation } = this.props;
    return <ChatUserListScreen navigation={navigation} />;
  };

  renderPublicationAdd = ({ route }) => {
    const { navigation } = this.props;
    return <PublicationAddScreen navigation={navigation} />;
  };

  renderNotificationList = ({ route }) => {
    const { navigation } = this.props;
    return (
      <NotificationListScreen navigation={navigation}></NotificationListScreen>
    );
  };

  renderSettings = ({ route }) => {
    const { navigation } = this.props;
    return <SettingsScreen navigation={navigation}></SettingsScreen>;
  };

  render() {
    const { topNavigation } = this.state;
    return (
      <>
        <AppTopNavigation
          action={{
            display: topNavigation.action.display,
            iconName: topNavigation.action.iconName,
            onPressMethod: topNavigation.action.onPressMethod,
          }}
          backAction={{
            display: topNavigation.backAction.display,
            onPressMethod: topNavigation.backAction.onPressMethod,
          }}
          color={topNavigation.color}
          title={topNavigation.title}
        />
        <BottomNavigation
          labeled={true}
          navigationState={this.state}
          onIndexChange={(index) => this.setState({ index })}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'publicationList':
                return this.renderPublicationList({ route });
              case 'messages':
                return this.renderChatUserList({ route });
              case 'publicationAdd':
                return this.renderPublicationAdd({ route });
              case 'notifications':
                return this.renderNotificationList({ route });
              case 'settings':
                return this.renderSettings({ route });
            }
          }}
          onTabPress={(props) => this.setTopNavigationStateByIndex(props.route)}
          activeColor={Colors.white}
          inactiveColor={Colors.white}
        />
      </>
    );
  }
}
