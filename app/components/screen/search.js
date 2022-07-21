import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import Constants from "expo-constants";
import { getSinglePost, searchPost } from "../../api/post";
import PostListItem from "../postListItem";

const Search = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [result, setResults] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    const { error, posts } = await searchPost(query);
    if (error) return console.log(error);

    if (!posts.length) return setNotFound(true);

    setResults([...posts]);
    setNotFound(false);
  };

  const handlePostPress = async (slug) => {
    const { error, post } = await getSinglePost(slug);

    if (error) return console.log(error);
    navigation.navigate("PostDetail", { post });
  };
  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={(text) => setQuery(text)}
        placeholder="Search"
        style={styles.input}
        onSubmitEditing={handleSubmit}
      />

      <ScrollView contentContainerStyle={{ flex: 1 }}>
        {notFound ? (
          <Text
            style={{
              fontWeight: "700",
              fontSize: 22,
              color: "gray",
              textAlign: "center",
              paddingVertical: 15,
            }}
          >
            Result not found
          </Text>
        ) : (
          result.map((post) => {
            return (
              <View key={post.id} style={{ marginTop: 10 }}>
                <PostListItem
                  post={post}
                  onPress={() => handlePostPress(post.slug)}
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    padding: 10,
    flex: 1,
  },
  input: {
    borderWidth: 2,
    borderColor: "#383838",
    borderRadius: 10,
    padding: 5,
    fontSize: 16,
    paddingLeft: 20,
  },
});
