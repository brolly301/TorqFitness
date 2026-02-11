import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ProfileTile from "@/components/profile/TileWrapper";
import AchievementTile from "@/components/profile/AchievementTile";
import UserBio from "@/components/profile/UserBioTile.tsx";
import BodyStatsTile from "@/components/profile/BodyStatsTile";
import ProgressTile from "@/components/profile/ProgressTile";

export default function ProfileScreen() {
  return (
    <View>
      <UserBio />
      <BodyStatsTile />
      <ProgressTile />
      <AchievementTile />
    </View>
  );
}

const styles = StyleSheet.create({});
