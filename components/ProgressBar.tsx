import { View } from 'react-native'

const ProgressBar = ({ progressPercent }: {progressPercent: number}) => {
  return (
    <View className='w-full h-3 sm:h-2 bg-background-light dark:bg-background-dark rounded-full mt-2 overflow-hidden border border-border-light dark:border-border-dark'>
        <View
            style={{ width: `${progressPercent}%` }}
            className={`h-full bg-primary`}
        />
    </View>
  )
}

export default ProgressBar