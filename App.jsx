import { StatusBar } from "expo-status-bar";
import Task from "./components/Task";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

export default function App() {
	const [task, setTask] = useState("");
	const [taskItems, setTaskItems] = useState([]);

	const handleAddTask = async () => {
		const newTaskItems = [...taskItems, task];
		console.log("newTaskItems: ", newTaskItems);
		setTaskItems(newTaskItems);
		try {
			await AsyncStorage.setItem(
				"user_data",
				JSON.stringify(newTaskItems)
			);
		} catch (error) {
			console.error(error);
		}
		setTask("");
	};

	const clearAsyncStorage = async () => {
		try {
			await AsyncStorage.clear();
			console.log("AsyncStorage cleared successfully.");
		} catch (error) {
			console.error("Failed to clear AsyncStorage:", error);
		}
	};

	const conpleteTask = async (index) => {
		let itemsCopy = [...taskItems];
		itemsCopy.splice(index, 1);
		setTaskItems(itemsCopy);
		try {
			await AsyncStorage.setItem("user_data", JSON.stringify(itemsCopy));
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const retrieveData = async () => {
			try {
				const value = await AsyncStorage.getItem("user_data");
				console.log("value: ", value);
				console.log("type of value: ", typeof value);
				if (value !== "null" && value !== null) {
					console.log("Not null");
					setTaskItems(JSON.parse(value));
				} else {
					console.log("Null");
					setTaskItems([]);
				}
			} catch (e) {
				console.log("retrieval error: ", e);
			}
		};
		retrieveData();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.tasksWrapper}>
				<Text style={styles.sectionTitle}>Today's tasks</Text>
				<View style={styles.items}>
					{/* <Task task="task 0" />
					<Task task="task 1" /> */}
					{taskItems &&
						taskItems.map((item, index) => {
							return (
								<TouchableOpacity
									key={index}
									onPress={() => conpleteTask(index)}>
									<Task task={item} />
								</TouchableOpacity>
							);
						})}
				</View>
			</View>

			{/* Write a task */}
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.writeTaskWrapper}>
				<TextInput
					style={styles.input}
					placeholder={"Write a task"}
					value={task}
					onChangeText={(text) => setTask(text)}
				/>

				<TouchableOpacity onPress={handleAddTask}>
					<View style={styles.addWrapper}>
						<Text style={styles.addText}>+</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					title="Clear Storage"
					onPress={clearAsyncStorage}>
					<View style={styles.removeWrapper}>
						<Text style={styles.addText}>X</Text>
					</View>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#E8EAED",
	},
	tasksWrapper: {
		padding: 80,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: "bold",
	},
	items: {
		marginTop: 30,
	},
	writeTaskWrapper: {
		position: "absolute",
		bottom: 60,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	input: {
		paddingVertical: 15,
		paddingHorizontal: 15,
		width: 250,
		borderRadius: 60,
		backgroundColor: "#FFF",
		borderColor: "#C0C0C0",
		borderWidth: 1,
	},
	addWrapper: {
		width: 60,
		height: 60,
		backgroundColor: "#FFF",
		borderRadius: 60,
		justifyContent: "center",
		alignItems: "center",
		borderColor: "#C0C0C0",
		borderWidth: 1,
	},
	removeWrapper: {
		width: 60,
		height: 60,
		backgroundColor: "#FFF",
		borderRadius: 60,
		justifyContent: "center",
		alignItems: "center",
		borderColor: "red",
		borderWidth: 1,
	},
	addText: {},
});
