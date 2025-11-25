import { FiltersType } from '@/types/types';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { Modal, Switch, TouchableOpacity, View } from 'react-native';
import MainButton from './MainButton';
import ThemedText from './ThemedText';



type FiltersModalProps = {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    filters: FiltersType;
    setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
    applyFilters: () => void;
};

const FiltersModal = ({ modalVisible, setModalVisible, filters, setFilters, applyFilters }: FiltersModalProps) => {
    const { t } = useTranslation();
    
    return (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View className="flex-1 justify-end">
                <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="absolute inset-0"
                />

                <View className="w-full bg-background-light dark:bg-background-dark p-4 rounded-t-3xl shadow-md">
                <ThemedText className="text-2xl font-bold mb-4">{t("filters")}</ThemedText>

                <View className="flex-row justify-between items-center mb-4">
                    <ThemedText className="text-lg font-medium">{t("show_faves_only")}</ThemedText>
                    <Switch
                    value={filters.favouritesOnly}
                    onChange={() =>
                        setFilters((prev) => ({ ...prev, favouritesOnly: !prev.favouritesOnly }))
                    }
                    accessibilityLabel="Toggle show favourites only"
                    />
                </View>

                <View className="flex-col mb-4">
                    <ThemedText className="text-lg font-medium mb-2">{t("sort_by")}</ThemedText>
                    <View className="border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
                    <Picker
                        selectedValue={filters.sortBy}
                        onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, sortBy: value }))
                        }
                        dropdownIconColor="#888"
                        accessibilityLabel="Choose Sort by Option"
                    >
                        <Picker.Item label={t("alphabetical")} value="alphabetical" />
                        <Picker.Item label={t("date_added")} value="dateAdded" />
                        <Picker.Item label={t("difficulty")} value="difficulty" />
                    </Picker>
                    </View>
                </View>

                <MainButton
                    text={t("apply")}
                    onPress={applyFilters}
                    accessibilityLabel="Apply filters"
                    className="mt-2 mb-8"
                />
                </View>
            </View>
            </Modal>

    )
}

export default FiltersModal;
