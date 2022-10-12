import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
	useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import LinkingConfiguration from './LinkingConfiguration';
import { Ionicons } from '@expo/vector-icons';
import {Icon} from 'native-base'

// screens
import NotFoundScreen from '../screens/NotFound';
import ReadScreen from '../screens/Read';
import ChapterSelectScreen from '../screens/ChapterSelect';
import HomeScreen from '../screens/Originals';
import LibraryScreen from '../screens/Library';
import CreateScreen from '../screens/Create';

export default function Navigation({
	colorScheme,
}: {
	colorScheme: ColorSchemeName;
}) {
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<RootNavigator />
		</NavigationContainer>
	);
}
const Stack = createNativeStackNavigator();
const RootNavigator = () => {
	const navigation = useNavigation();

	const home = (
		<Pressable
			onPress={() => navigation.navigate('Root')}
			style={({ pressed }) => ({
				opacity: pressed ? 0.5 : 1,
			})}>
			<Icon
        as={Ionicons}
				name='home'
				size={25}
				color={'white'}
				style={{ marginRight: 15 }}
			/>
		</Pressable>
	);

	return (
		<Stack.Navigator>
			<Stack.Screen
				name='Root'
				component={BottomTabNavigator}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='NotFound'
				component={NotFoundScreen}
				options={{ title: 'Oops!' }}
			/>

			{/* <Stack.Group> */}
			<Stack.Screen
				name='ChapterSelect'
				component={ChapterSelectScreen}
				options={({ route, params }) => ({
					title: route.params.webTitle,
					headerRight: () => home,
				})}
				getId={({ params }) => params.webTitle}
			/>
			{/* </Stack.Group> */}
			{/* <Stack.Group> */}
			<Stack.Screen
				name='ReadFable'
				component={ReadScreen}
				options={({ route, params }) => ({
					title: route.params.webTitle,
					headerRight: () => home,
				})}
				getId={({ params }) => {
					params.webTitle, params.chapterNum;
				}}
			/>
			{/* </Stack.Group> */}
		</Stack.Navigator>
	);
};
const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
	// const blue = '#4467d8'
	const yellow = '#Ffc402';
	const white = 'white';
	const darkBlue = '#1D477A';

	const search = (
		<Pressable
			onPress={() => console.log('search')}
			style={({ pressed }) => ({
				opacity: pressed ? 0.5 : 1,
			})}>
			<Icon
        as={Ionicons}
				name='search'
				size={'md'}
				color={white}
				style={{ marginRight: 15 }}
			/>
		</Pressable>
	);

	const menu = (
		<Pressable
			onPress={() => console.log('Menu')}
			style={({ pressed }) => ({
				opacity: pressed ? 0.5 : 1,
			})}>
			<Icon
        as={Ionicons}
				name='menu'
				size={'lg'}
				color={white}
				style={{ marginLeft: 15 }}
			/>
		</Pressable>
	);

	return (
		<BottomTab.Navigator
			initialRouteName='Home'
			screenOptions={{
				unmountOnBlur: true,
				lazy: true,
				tabBarActiveTintColor: yellow,
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: darkBlue },
				headerTintColor: 'white',
				tabBarInactiveTintColor: white,
				tabBarInactiveBackgroundColor: darkBlue,
				tabBarActiveBackgroundColor: darkBlue,
				// goback:history
			}}>
			<BottomTab.Screen
				name='Home'
				component={HomeScreen}
				// edit top bar https://reactnavigation.org/docs/headers
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				options={({ navigation }) => ({
					title: 'Fabletoons',
					tabBarIcon: ({ color }) => (
						<TabBarIcon name='book' color={color} />
					),
					// eslint-disable-next-line react/display-name
					headerRight: () => search,
					// eslint-disable-next-line react/display-name
					headerLeft: () => menu,
				})}
			/>
			<BottomTab.Screen
				name='Library'
				component={LibraryScreen}
				options={{
					title: 'Library',
					tabBarIcon: ({ color }) => (
						<TabBarIcon name='bookmark' color={color} />
					),
					headerRight: () => search,
					// eslint-disable-next-line react/display-name
					headerLeft: () => menu,
				}}
			/>
			<BottomTab.Screen
				name='Create'
				component={CreateScreen}
				options={{
					title: 'Create',
					tabBarIcon: ({ color }) => (
						<TabBarIcon name='brush' color={color} />
					),
					headerRight: () => search,
					// eslint-disable-next-line react/display-name
					headerLeft: () => menu,
				}}
			/>
		</BottomTab.Navigator>
	);
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
const TabBarIcon = (props) => {
	return (<Icon as={Ionicons}
  name={props.name}
  color={props.color}
  justifySelf={'center'}
  size={props.size} />);
}
