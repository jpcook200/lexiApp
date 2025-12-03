import { View } from 'react-native'

const ProgressBar = ({ progressPercent }: {progressPercent: number}) => {
  return (
    <View className='flex-1 min-h-3 h-3 sm:h-2 bg-background-light dark:bg-background-dark rounded-full overflow-hidden border border-border-light dark:border-border-dark'>
        <View
            style={{ width: `${progressPercent}%` }}
            className={`h-full bg-primary rounded-full`}
        />
    </View>
  )
}

export default ProgressBar