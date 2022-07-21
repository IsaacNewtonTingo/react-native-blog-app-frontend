import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, View } from "react-native";
import {
  getFeaturedPosts,
  getLatestPosts,
  getSinglePost,
} from "../../api/post";
import PostListItem from "../postListItem";
import Seperator from "../seperator";
import Slider from "../slider";

import Constants from "expo-constants";

let pageNo = 0;
const limit = 5;

export default function Home({ navigation }) {
  const [featuredPosts, seFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchFeaturedPost = async () => {
    const { error, posts } = await getFeaturedPosts();
    if (error) {
      console.log(error);
    } else {
      seFeaturedPosts(posts);
    }
  };

  const fetchLatestPosts = async () => {
    const { error, posts } = await getLatestPosts(limit, pageNo);

    if (error) return console.log(error);

    setLatestPosts(posts);
  };

  const fetchMorePosts = async () => {
    if (reachedEnd || busy) return;

    pageNo += 1;
    setBusy(true);
    const { error, posts, postCount } = await getLatestPosts(limit, pageNo);
    setBusy(false);
    if (error) return console.log(error);

    if (postCount === latestPosts.length) return setReachedEnd(true);

    setLatestPosts([...latestPosts, ...posts]);
  };

  useEffect(() => {
    fetchFeaturedPost();
    fetchLatestPosts();

    return () => {
      pageNo = 0;
      setReachedEnd(false);
    };
  }, []);

  const ListHeaderComponent = useCallback(() => {
    return (
      <View style={{ paddingTop: Constants.statusBarHeight }}>
        {featuredPosts.length ? (
          <Slider
            onSlidePress={fetchSinglePost}
            data={featuredPosts}
            title="Featured posts"
          />
        ) : null}

        <View style={{ marginTop: 15 }}>
          <Seperator />
          <Text
            style={{
              marginTop: 15,
              fontWeight: "700",
              color: "#383838",
              fontSize: 22,
            }}
          >
            Latest post
          </Text>
        </View>
      </View>
    );
  }, [featuredPosts]);

  const renderItem = ({ item }) => {
    return (
      <View style={{ marginTop: 15 }}>
        <PostListItem onPress={() => fetchSinglePost(item.slug)} post={item} />
      </View>
    );
  };

  const ItemSeparatorComponent = () => <Seperator style={{ marginTop: 15 }} />;

  const fetchSinglePost = async (postInfo) => {
    const slug = postInfo.slug || postInfo;
    const { error, post } = await getSinglePost(slug);

    if (error) console.log(error);
    navigation.navigate("PostDetail", { post });
  };

  return (
    <FlatList
      data={latestPosts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      renderItem={renderItem}
      onEndReached={fetchMorePosts}
      onEndReachedThreshold={0}
      ListFooterComponent={() => {
        return reachedEnd ? (
          <Text
            style={{
              fontWeight: "700",
              color: "#d9d9d9",
              textAlign: "center",
              padding: 15,
              marginTop: 100,
            }}
          >
            No more posts
          </Text>
        ) : null;
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    paddingTop: 50,
  },
});
