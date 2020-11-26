import * as React from 'react';
import { Appbar } from 'react-native-paper';
import colors from '../constants/colors';
import Theme from '../constants/theme';

interface Props {
  color: string;
  title: string;
  subtitle?: string;
  backAction: {
    display: boolean;
    onPressMethod: any;
  };
  action: {
    display: boolean;
    iconName?: string;
    onPressMethod: any;
  };
}

class AppTopNavigation extends React.Component<Props> {
  static defaultProps = {
    action: {
      display: false,
    },
    backAction: {
      display: false,
    },
    color: Theme.colors.primary,
  };

  render() {
    const { action, backAction, color, title, subtitle } = this.props;

    return (
      <Appbar.Header style={{ backgroundColor: color }}>
        {backAction.display ? (
          <Appbar.BackAction onPress={backAction.onPressMethod} />
        ) : null}
        <Appbar.Content
          color={colors.white}
          title={title}
          subtitle={subtitle}
        />
        {action.display ? (
          <Appbar.Action
            color={colors.white}
            icon={action.iconName || 'dots-vertical'}
            onPress={action.onPressMethod}
          />
        ) : null}
      </Appbar.Header>
    );
  }
}

export { AppTopNavigation, Props as IAppTopNavigation };
