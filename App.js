/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PureComponent } from 'react';
import moment from 'moment';
import Swipeable from 'react-native-swipeable';
import * as Animatable from 'react-native-animatable';
import {
  DatePickerAndroid,
  TimePickerAndroid,
  AsyncStorage,
  ToastAndroid,
  TouchableOpacity,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

class Row extends PureComponent {
  setRef = ref => { this.self = ref; };
  animateOut = () => {
    this.self.transitionTo({ opacity: 0.5, height: 0, margin: 0, padding: 0 })
    this.props.onRemove(this.props.id);
  }

  pressed = () => {
    this.props.showContent(this.props);
  }

  render() {
    return (
      <Swipeable
        leftContent={(
          <View style={[styles.leftSwipeItem, { backgroundColor: 'lightskyblue' }]}>
            <Text>Pull action</Text>
          </View>
        )}
        rightButtons={[
          <TouchableHighlight style={[styles.rightSwipeItem, { backgroundColor: 'lightseagreen' }]}>
            <Text>1</Text>
          </TouchableHighlight>,
          <TouchableHighlight style={[styles.rightSwipeItem, { backgroundColor: 'orchid' }]}>
            <Text>2</Text>
          </TouchableHighlight>
        ]}
        leftActionActivationDistance={200}
        onLeftActionRelease={this.animateOut}
      >
        <TouchableHighlight underlayColor="#FFFC31" onPress={this.pressed}>
          <Animatable.View style={rStyles.row} ref={this.setRef} key={this.props.id}>
            <Text style={rStyles.title}>{this.props.description}</Text>
            <Text>{`Due: ${moment(this.props.due).format('dddd, MMMM Do, h:mm a')}`}</Text>
            {this.props.recur && <Text>{`Recurs: ${this.props.recur}`}</Text>}
          </Animatable.View>
        </TouchableHighlight>
      </Swipeable>
    );
  }
}

const rStyles = StyleSheet.create({
  row: {
    marginVertical: 12,
    width: '100%',
    padding: 8,
  },
  title: {
    fontSize: 18,
  }
});

class Create extends Component {
  state = {};

  change = {
    desc: (desc) => this.setState({ desc }),
    tags: (tags) => this.setState({ tags }),
    project: (project) => this.setState({ project }),
    recur: (recur) => this.setState({ recur }),
    due: (due) => this.setState({ due })
  }

  complete = () => {
    const { desc, tags, project, recur, due } = this.state;
    this.props.onDone(`add ${desc} ${tags} project:${project} recur:${recur} due:${due} `);
    this.props.onClose();
  }

  showDatePicker = async () => {
    const { action, year, month, day } = await DatePickerAndroid.open({ date: new Date() });

    if (action !== DatePickerAndroid.dismissedAction) {
      const { action2, hour, minute } = await TimePickerAndroid.open({
        hour: 9,
        minute: 0,
        is24Hour: true, // Will display '2 PM'
      });


      if (action2 !== TimePickerAndroid.dismissedAction) {
        const mom = moment().year(year).month(month).day(day).hour(hour).minute(minute);
        // Selected hour (0-23), minute (0-59)
        this.setState({
          due: mom.format('YYYY-MM-DDThh:mm:00'),
        });
      }
    }
  }

  render() {
    const { item } = this.props;
    const { desc, tags, project, recur, due } = this.state;

    return (
      <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 100 }}>
        <TouchableHighlight onPress={this.props.onClose} style={{ position: 'absolute', top: 20, right: 20 }}><Text style={{ fontSize: 36, color: 'white' }}>X</Text></TouchableHighlight>
        <Animatable.View animation="zoomInUp" style={{ padding: 20, position: 'absolute', top: 100, right: '5%', left: '5%', backgroundColor: 'white', width: '90%' }}>
          <TextInput placeholder="Description" returnKeyLabel="Next" value={desc} onChangeText={this.change.desc} />
          <TextInput placeholder="Tags" returnKeyLabel="Next" value={tags} onChangeText={this.change.tags} />
          <TextInput placeholder="Project" returnKeyLabel="Next" value={project} onChangeText={this.change.project} />
          <TextInput placeholder="Recur" returnKeyLabel="Next" value={recur} onChangeText={this.change.recur} />
          <TextInput placeholder="Due" value={due} onChangeText={this.change.due} />
          <TouchableHighlight underlayColor="white" onPress={this.showDatePicker} style={{ width: 100, height: 40, justifyContent: 'center', alignItems: 'center', marginVertical: 12 }}><Text style={{ fontSize: 18 }}>Date</Text></TouchableHighlight>
          <TouchableHighlight underlayColor="#73BA9B" onPress={this.complete} style={{ width: 100, height: 40, backgroundColor: '#9BC53D', justifyContent: 'center', alignItems: 'center', marginVertical: 12 }}><Text style={{ color: 'white', fontSize: 18 }}>Create</Text></TouchableHighlight>
        </Animatable.View>
      </View>
    );
  }

}

class Details extends Component {
  complete = () => {
    this.props.complete(this.props.item.id);
    this.props.onClose();
  }

  render() {
    const { item } = this.props;

    return (
      <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 100 }}>
        <TouchableHighlight onPress={this.props.onClose} style={{ position: 'absolute', top: 20, right: 20 }}><Text style={{ fontSize: 36, color: 'white' }}>X</Text></TouchableHighlight>
        <Animatable.View animation="zoomInUp" style={{ padding: 20, position: 'absolute', top: 100, right: '5%', left: '5%', backgroundColor: 'white', width: '90%' }}>
          <Text style={{ fontSize: 24, borderBottomWidth: 1, marginBottom: 8 }}>{item.description}<Text style={{ fontSize: 16, color: '#C3423F' }}>{'  '}{item.urgency}</Text></Text>
          <Text style={{ fontSize: 16 }}>Tags: {item.tags && item.tags.join(', ')}</Text>
          <Text style={{ fontSize: 16 }}>Created: {moment(item.entry).format('dddd, MMMM Do, h:mm a')}</Text>
          <Text style={{ fontSize: 16 }}>Project: {item.project}</Text>
          <Text style={{ fontSize: 16 }}>Status: {item.status}</Text>
          <Text style={{ fontSize: 16 }}>Recurring: {item.recur}</Text>
          <Text style={{ fontSize: 16 }}>Id: {item.id}</Text>
          <Text style={{ fontSize: 16, marginTop: 20 }}>Modified: {moment(item.modified).format('dddd, MMMM Do, h:mm a')}</Text>
          <TouchableHighlight underlayColor="#FFFC31" onPress={this.complete} style={{ width: 100, height: 40, backgroundColor: '#9BC53D', justifyContent: 'center', alignItems: 'center', marginVertical: 12 }}><Text style={{ color: 'white', fontSize: 18 }}>Mark Done</Text></TouchableHighlight>
        </Animatable.View>
      </View>
    );
  }
}

export default class App extends Component {
  async componentDidMount() {
    const workCommand = await AsyncStorage.getItem('workCommand');
    const homeCommand = await AsyncStorage.getItem('homeCommand');
    this.setState({
      homeCommand,
      workCommand,
    });
    this.fetchEvents();
  }

  state = {
    isRefreshing: false,
    items: [],
    query: '',
    active: 'custom',
    command: '',
    workCommand: '+work -PARENT',
    homeCommand: '+home -PARENT'
  }

  command = async (command) => {
    try {
      const result = await fetch('http://sync.noteable.me:3001/add', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          command: (typeof command === 'string' ? command : this.state.command),
          sync: true,
        }),
      });
    } catch (error) {
      ToastAndroid.show(error.stack, ToastAndroid.SHORT);
    }
  }

  fetchEvents = async () => {
    try {
      const result = await fetch('http://sync.noteable.me:3001/page', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          command: this.state.query + ' id.not:0',
        })
      });
      const items = await result.json();


      this.setState({
        items: items.sort(x => x.urgency),
      }, () => {
        ToastAndroid.show('Loaded', ToastAndroid.SHORT);
      });
    } catch (error) {
      console.log(error);
    }
  }

  sync = async () => {
    this.setState({
      isRefreshing: true,
    });
    try {
      const result = await fetch('http://sync.noteable.me:3001/add', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          command: 'sync',
        }),
      });

      this.setState({
        isRefreshing: false,
      });
      this.fetchEvents();
    } catch (error) {
      console.log(error);
    }
  }

  changeQuery = (value) => {
    this.setState({
      query: value,
    });
  }

  changeCommand = (value) => {
    this.setState({
      command: value,
    });
  }

  changeWorkCommand = async (value) => {
    this.setState({
      query: value,
      workCommand: value,
    });
    await AsyncStorage.setItem('workCommand', value);
  }

  changeHomeCommand = async (value) => {
    this.setState({
      query: value,
      homeCommand: value,
    });
    await AsyncStorage.setItem('homeCommand', value);
  }

  shortcuts = {
    work: () => {
      this.setState(({ workCommand }) => ({
        active: 'work',
        query: workCommand,
      }), this.fetchEvents);
    },
    home: () => {
      this.setState({
        query: '+home -PARENT',
        active: 'home',
      }, this.fetchEvents);
    },
    custom: () => {
      this.setState({
        active: 'custom',
      });
    },
    command: () => {
      this.setState({
        active: 'command',
      });
    },
    create: () => {
      this.setState({
        newItem: {},
      });
    }
  }

  remove = async (id) => {
    this.setState(({ items }) => ({
      items: items.filter(x => x.id !== id),
    }));

    await this.command(`${id} done`);
    ToastAndroid.show('Deleted task', ToastAndroid.SHORT);
  }

  showContent = item => {
    this.setState({
      windowItem: item,
    });
  }

  onClose = () => {
    this.setState({
      windowItem: null,
    });
  }

  onCancelCreate = () => {
    this.setState({
      newItem: null
    });
  }

  renderItem = ({ item, index }) => {
    return (
      <Row {...item} onRemove={this.remove} showContent={this.showContent} />
    );
  }

  render() {
    const { active } = this.state;

    return (
      <View style={styles.container}>
        {this.state.windowItem && <Details complete={this.remove} onClose={this.onClose} item={this.state.windowItem} />}
        {this.state.newItem && <Create onClose={this.onCancelCreate} onDone={this.command} />}

        <View style={styles.shortcuts}>
          <TouchableHighlight underlayColor="#57696F" style={styles.create} onPress={this.shortcuts.create}><Text style={{ color: '#57696F' }}>Create</Text></TouchableHighlight>
        </View>
        <View style={styles.shortcuts}>
          <TouchableHighlight underlayColor="#335A70" style={[active === 'work' && styles.active, styles.work]} onPress={this.shortcuts.work}><Text style={styles.fontColor}>Work</Text></TouchableHighlight>
          <TouchableHighlight underlayColor="#455B3F" style={[active === 'home' && styles.active, styles.home]} onPress={this.shortcuts.home}><Text style={styles.fontColor}>Home</Text></TouchableHighlight>
          <TouchableHighlight underlayColor="#ECC6C6" style={[active === 'custom' && styles.active, styles.custom]} onPress={this.shortcuts.custom}><Text style={styles.fontColor}>Custom</Text></TouchableHighlight>
          <TouchableHighlight underlayColor="#335A70" style={[active === 'command' && styles.active, styles.work]} onPress={this.shortcuts.command}><Text style={styles.fontColor}>Command</Text></TouchableHighlight>
        </View>
        {
          this.state.active === 'custom' && <View style={styles.searchContainer}>
            <TextInput style={styles.search} value={this.state.query} onChangeText={this.changeQuery} />
            <TouchableHighlight onPress={this.fetchEvents} style={styles.searchButton}><Text>Search</Text></TouchableHighlight>
          </View>
        }{
          this.state.active === 'command' && <View style={styles.searchContainer}>
            <TextInput style={styles.search} value={this.state.command} onChangeText={this.changeCommand} />
            <TouchableHighlight onPress={this.command} style={styles.searchButton}><Text>Command</Text></TouchableHighlight>
          </View>
        }{
          this.state.active === 'work' && <View style={styles.searchContainer}>
            <TextInput style={styles.search} value={this.state.workCommand} onChangeText={this.changeWorkCommand} />
          </View>
        }{
          this.state.active === 'home' && <View style={styles.searchContainer}>
            <TextInput style={styles.search} value={this.state.homeCommand} onChangeText={this.changeHomeCommand} />
          </View>
        }
        <FlatList
          onRefresh={this.sync}
          refreshing={this.state.isRefreshing}
          onContentSizeChange={this.scrollEnd}
          data={this.state.items}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.renderItem}
          ListFooterComponent={<Text>1.1</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  create: {
    backgroundColor: '#D5F2E3',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  active: {
    borderBottomWidth: 4,
    borderBottomColor: '#FFFC31',
  },
  work: {
    backgroundColor: '#5BC0EB',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  home: {
    backgroundColor: '#9BC53D',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  custom: {
    backgroundColor: '#C3423F',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcuts: {
    flexDirection: 'row',
    height: 40,
    marginVertical: 6
  },
  fontColor: {
    color: 'white',
  },
  sync: {
    backgroundColor: '#337CA0',
    width: '100%',
    height: 40,
    fontSize: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  searchButton: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  search: {
    height: 40,
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  container: {
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    height: '100%',
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
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20
  },
});
