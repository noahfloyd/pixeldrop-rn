import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'
import { getStoryCarousel } from 'src/lib/api'
import { Text, useTheme } from 'tamagui'
import StorySkeletonLoader from './StorySkeletonLoader'
import UserAvatar from './UserAvatar'

interface StoryCarouselProps {
    onStoryViewed?: (userId: string, storyId: string) => void
}

export default function StoryCarousel({ onStoryViewed }: StoryCarouselProps) {
    const theme = useTheme()
    const { data, isLoading, error } = useQuery({
        queryKey: ['getStoryCarousel'],
        queryFn: getStoryCarousel,
    })

    if (isLoading) {
        return <StorySkeletonLoader />
    }

    if (error || !data || !Array.isArray(data) || data.length === 0) {
        return null
    }

    const renderItem = ({ item }: { item: any }) => {
        return (
            <Pressable
                style={styles.itemContainer}
                onPress={() => {
                    // TODO: Handle story press
                    console.log('Story pressed', item)
                }}
            >
                <View style={[styles.avatarContainer, { borderColor: theme.color?.val?.default?.val }]}>
                    <UserAvatar url={item.avatar} size="$5" width={60} height={60} />
                </View>
                <Text
                    numberOfLines={1}
                    style={[styles.username, { color: theme.color?.val?.default?.val }]}
                >
                    {item.username}
                </Text>
            </Pressable>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    listContainer: {
        paddingHorizontal: 10,
    },
    itemContainer: {
        alignItems: 'center',
        marginRight: 15,
        width: 70,
    },
    avatarContainer: {
        borderWidth: 2,
        borderRadius: 40,
        padding: 2,
        marginBottom: 5,
    },
    username: {
        fontSize: 12,
        textAlign: 'center',
    },
})
