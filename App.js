/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  componentDidMount() {
    this.fetchEvents();
  }

  state = {
    items: [],
  }

  fetchEvents = async () => {
    try {

      const result = await fetch('http://sync.noteable.me:3001/page');
      const items = await result.json();
      this.setState({
        items,
      });
    } catch (error) {
      console.log(error);
    }
  }

  sync = async () => {
    try {
      const result = await fetch('http://sync.noteable.me:3001/add', {
        method: 'POST',
        body: JSON.stringify({
          command: 'sync',
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={{ marginVertical: 10 }}><Text>{JSON.stringify(item)}</Text></View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.sync}>
          <Text>WOW</Text>
        </TouchableHighlight>
        <FlatList
          onContentSizeChange={this.scrollEnd}
          data={this.state.items}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
