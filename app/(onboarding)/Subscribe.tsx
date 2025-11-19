import BackButton from '@/components/BackButton';
import MainButton from '@/components/MainButton';
import ThemedIcon from '@/components/ThemedIcon';
import ThemedText from '@/components/ThemedText';
import useDatabase from '@/db/useDatabase';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ErrorCode, useIAP } from 'react-native-iap';
import { SafeAreaView } from 'react-native-safe-area-context';

const { appStoreSharedSecret } = Constants.expoConfig!.extra as { appStoreSharedSecret: string };

type Plan = {
  id: string | undefined;
  name: string;
  price: string | undefined;
  billingCycle: string;
  per: string;
  caption: string;
};


const Subscribe = () => {
  const { setUserAccessLevel } = useDatabase();
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>('lexigramproweekly');
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    getActiveSubscriptions,
    validateReceipt
   } = useIAP({
      onPurchaseError: (error) => {
        switch (error.code) {
          case ErrorCode.UserCancelled:
            break;
          case ErrorCode.NetworkError:
            Alert.alert('Network Error', 'Please check your connection.');
            break;
          case ErrorCode.ItemUnavailable:
            Alert.alert('Item Unavailable', 'This item is not available for purchase.');
            break;
          default:
            Alert.alert('Purchase Failed', error.message);
        }
     },
   });
  
  const [plans, setPlans] = useState<Plan[]>([

  ])

  const subscriptionSkus = Platform.select({
    ios: ['lexigramproweekly', 'lexigramproyearly'],
    android: ['com.yourapp.lexigram.pro.weekly', 'com.yourapp.lexigram.pro.yearly'],
  }) || [];

  const [redirected, setRedirected] = useState(false);

  const initProducts = async () => { 
      if (!connected || redirected) return;
      try {
        const activeSubs = await getActiveSubscriptions();
        if (activeSubs.length > 0) {
          setUserAccessLevel('pro');
          setRedirected(true);
          router.replace('/(tabs)/home');
          return; 
        } else { 
          setUserAccessLevel('free');
        }
        fetchProducts({ skus: subscriptionSkus, type: 'subs' });
      } catch (error) {
        Alert.alert('Error', '');
          console.error('Error fetching products:', error);
      } finally { 
        setLoading(false);
      }
  }

  useEffect(() => {
    initProducts();
  }, [connected, redirected]);

  useEffect(() => {
    if(subscriptions.length == 0) return;
    setPlans([
      { id: subscriptions.find(item => item.id === 'lexigramproweekly')?.id, name: t("weekly_plan"), price: subscriptions.find(item => item.id === 'lexigramproweekly')?.displayPrice, billingCycle: t("weekly"), per: t("per_week"), caption: "per week after 7 day free trial"  },
      { id: subscriptions.find(item => item.id === 'lexigramproyearly')?.id, name: t("yearly_plan"), price: subscriptions.find(item => item.id === 'lexigramproyearly')?.displayPrice, billingCycle: t("yearly"), per: t("per_year"), caption: "per year after 7 day free trial" },
    ]);
   }, [subscriptions]);


  // Move these inside the component
  const features = [
    { icon: 'Zap', title: t("benefit_one_title"), desc: t("benefit_one_desc") },
    { icon: 'BookOpen', title: t("benefit_two_title"), desc: t("benefit_two_desc") },
    { icon: 'Globe', title: t("benefit_three_title"), desc: t("benefit_three_desc") },
  ];

  const buySubscriptionWithOffer = async (subscriptionId: string | undefined) => {
    if (!subscriptionId) {
      Alert.alert('Error', 'Subscription ID is undefined.');
      return;
    }
    try {
      setPurchaseLoading(true);
      console.log('Requesting purchase for subscription ID:', subscriptionId);
      await requestPurchase({
        request: {
          ios: { sku: subscriptionId },
          android: { skus: [subscriptionId] },
        },
        type: 'subs',
      });
      const activeSubs = await getActiveSubscriptions();
      if (activeSubs.length > 0) {
        await setUserAccessLevel('pro');
        router.replace('/(tabs)/home');
      }
      
    } catch (error) {
        console.error('Purchase request failed:', error);
    } finally {
        setPurchaseLoading(false);
    }
  };

  if (loading || subscriptions.length === 0) { 
    return (
      <ActivityIndicator size="small" className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark" />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark bg-item-light dark:bg-item-dark p-6">
      <View className='absolute -top-10 -left-60 h-[100%] aspect-[1/1] rounded-br-full bg-background-light dark:bg-background-dark'></View>
      <View className='flex-row items-center justify-between'>
        <BackButton />
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')} className='flex-row items-center self-start rounded-full border border-border-light dark:border-border-dark bg-item-light dark:bg-item-dark pl-3 pr-4 py-1'>
          <ThemedText className='text-lg ml-2 font-bold'>{t("skip")}</ThemedText>
          <ThemedIcon name='ArrowRight' size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1 h-full w-full py-8'>
        <View className='pb-12'>
          <View className='gap-2'>
            <View>
              <ThemedText className='text-4xl font-medium'>{t("get")}</ThemedText>
              <View className='flex-row'>
                <ThemedText className='text-5xl font-black'>Lexigram</ThemedText>
                <Text className='text-primary font-bold'>PRO</Text>
              </View>
            </View>
            <ThemedText variant='subtext' className='text-lg'>{t("take_your_learning")}</ThemedText>
          </View>

          <View>
            {features.map((feature, index) => (
              <View key={index} className='flex-row items-center gap-4 mt-6'>
                <View className='w-12 h-12 bg-item-light dark:bg-item-dark rounded-full flex items-center justify-center border border-border-light dark:border-border-dark'>
                  <ThemedIcon name={feature.icon} size={16} />
                </View>
                <View className='flex-1'>
                  <ThemedText className='text-lg font-bold'>{feature.title}</ThemedText>
                  <ThemedText variant='subtext' className='text-md'>{feature.desc}</ThemedText>
                </View>
              </View>
            ))}

            <ThemedText className='my-6 font-bold'>{t("try_free")}</ThemedText>
            <ThemedText className='font-bold text-lg'>{t("select_plan")}:</ThemedText>

            <View className='flex-row items-center justify-center gap-6 mt-6'>
              {plans.map((plan, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedPlan(plan.id)}
                  className={`bg-item-light dark:bg-item-dark border w-[40%] aspect-[1/1] rounded-xl p-4 ${selectedPlan === plan.id ? 'border-2 border-primary' : 'border-border-light dark:border-border-dark'} flex justify-between`}
                  
                >
                  {plan.name === t("yearly_plan") && (
                    <View className='absolute top-0 right-4 -translate-y-[50%] bg-primary text-white px-2 py-1 rounded-full'>
                      <ThemedText className='text-xs font-bold text-white'>{t("best_value")}</ThemedText>
                    </View>
                  )}
                  <ThemedText variant='subtext' className='capitalize text-lg'>{plan.billingCycle}</ThemedText>
                  <View className='flex-row items-baseline'>
                    <ThemedText className='text-2xl font-bold'>{plan.price}</ThemedText>
                    <ThemedText variant='subtext' className='text-sm'>{plan.per}</ThemedText>
                  </View>
                  {selectedPlan === plan.id ? (
                    <Text className='mt-auto bg-primary self-start p-2 text-white font-bold rounded-md'>{t("selected")}</Text>
                  ) : (
                    <View className='mt-auto h-8' />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View className='h-20 items-center justify-center'>
        {purchaseLoading ?(
          <ActivityIndicator size="small" />
        ) : (
            <MainButton
              text={(t("subscribe_now"))}
              onPress={() => buySubscriptionWithOffer(selectedPlan)}
              accessibilityLabel='Proceed to Homepage'
              accessibilityHint='Navigates to the homepage'
            />
        )}
      </View>
      
    </SafeAreaView>
  );
};

export default Subscribe;
