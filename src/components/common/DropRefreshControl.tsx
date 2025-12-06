import { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { Text, useTheme } from 'tamagui'
import { getTimeUntilNextDrop } from '../../lib/dropTime'

interface Props {
    refreshing: boolean
    scrollY: Animated.SharedValue<number>
    topInset?: number
}

const REFRESH_HEIGHT = 80

export default function DropRefreshControl({ refreshing, scrollY, topInset = 0 }: Props) {
    const theme = useTheme()
    const timeString = getTimeUntilNextDrop()

    // Track if we are being pulled down enough to trigger logic visually
    // Note: Actual trigger logic is handled by onRefresh in parent usually, 
    // but we Visualise it here.
    const progress = useDerivedValue(() => {
        // scrollY is typically negative when pulling down on iOS
        // We want 0 to 1 range for 0 to -80
        const offset = Math.abs(Math.min(scrollY.value, 0))
        return Math.min(offset / REFRESH_HEIGHT, 1.5)
    })

    const containerStyle = useAnimatedStyle(() => {
        return {
            height: Math.max(0, -scrollY.value), // Expand as we pull
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.background?.val,
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 20,
            opacity: progress.value, // Fade in
        }
    })

    const textStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: withSpring(progress.value > 1 ? 1.1 : 1) },
                { translateY: withTiming(refreshing ? 0 : 10) }
            ],
            opacity: withTiming(progress.value > 0.5 ? 1 : 0),
        }
    })

    return (
        <Animated.View style={containerStyle}>
            <Animated.View style={textStyle}>
                <Text color={theme.color?.val} fontWeight="bold" fontSize="$3">
                    Next drop in:
                </Text>
                <Text color={theme.color?.val} fontSize="$8" fontWeight="800">
                    {timeString}
                </Text>
            </Animated.View>
        </Animated.View>
    )
}
